import React, { useState, useRef, useEffect } from "react";
import Countdown from "react-countdown";

const VideoRecordingComponent = ({
  readingTime,
  timeLimit,
  setRecordedChunks,
  recordedChunks,
  goToSummary,
}) => {
  // State variables for controlling UI and recording
  const [color, setTimerTextColor] = useState("black"); // Color of the timer text
  const [isRecording, setIsRecording] = useState(false); // Recording state
  const [isReplay, setIsReplay] = useState(false); // Replay state
  const [isCountdownActive, setIsCountdownActive] = useState(false); // Countdown state
  const [videoURL, setVideoURL] = useState(null); // URL for the recorded video
  const [remainingTime, setRemainingTime] = useState(timeLimit); // Time remaining for recording
  const countdownStartTime = useRef(Date.now() + readingTime * 1000); // Countdown start time
  const [areCameraAndMicAvailable, setAreCameraAndMicAvailable] =
    useState(false); // Camera and mic availability state
  const [timerText, setTimerText] = useState(timeLimit); // Timer text display

  const mediaRecorderRef = useRef(null); // Ref to the media recorder
  const videoRef = useRef(null); // Ref to the video element
  const streamRef = useRef(null); // Ref to the media stream
  const recordingTimer = useRef(null); // Ref to the recording timer

  useEffect(() => {
    // Request access to the user's webcam and microphone
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        setAreCameraAndMicAvailable(true);
      })
      .catch((error) => {
        alert(
          "Your webcam and microphone must be accessible to continue.\nReload the application once they are both accessible and ensure they remain accessible while recording."
        );
        console.error("Error accessing webcam or microphone", error);
        setAreCameraAndMicAvailable(false);
      });

    // Clean up the stream when the component unmounts
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Set up recording timer when recording starts
    if (isRecording) {
      recordingTimer.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1;
          updateTimer(newTime);

          try {
            // Ensure microphone and camera are accessible during recording
            navigator.mediaDevices
              .getUserMedia({ video: true, audio: true })
              .then(() => {
                console.log("Microphone and camera are accessible.");
              })
              .catch((error) => {
                console.error("Microphone or camera not accessible:", error);
                alert(
                  "Recording failed.\nPlease ensure both the microphone and camera are working and reload the application."
                );
                clearInterval(recordingTimer.current);
                stopRecording();
                setAreCameraAndMicAvailable(false);
              });
          } catch { }

          return newTime;
        });
      }, 1000);
    } else if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
    }

    return () => clearInterval(recordingTimer.current);
  }, [isRecording]);

  useEffect(() => {
    // Activate countdown when readingTime changes
    setIsCountdownActive(true);
  }, [readingTime]);

  const updateTimer = (count) => {
    // Update timer text color and display based on remaining time
    setTimerTextColor(count < 11 ? "red" : "black");
    setTimerText(count > 0 ? count : "Time's Up");

    if (count <= 0) {
      setTimeout(() => {
        stopRecording();
      }, 100);
    }
  };

  function startRecording() {
    // Start recording and initialize state
    setIsReplay(false);
    setIsCountdownActive(false); // Hide reading time once recording starts
    setRemainingTime(timeLimit);
    setTimerText(timeLimit);

    setIsRecording(true);
    setRecordedChunks([]);

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = handleDataAvailable;
          mediaRecorderRef.current.start();
        })
        .catch((error) => {
          alert(`Failed to access microphone or webcam.`);
        });
    } catch (error) {
      alert(
        "Failed to start recording.\nCould not access either the microphone, webcam or both.\nPlease ensure both are working and accessible, then reload the application."
      );
      setIsRecording(false);
    }
  }

  function stopRecording() {
    // Stop the recording
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
  }

  function handleDataAvailable(event) {
    // Handle available data and update recorded chunks
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  }

  function replayRecording() {
    // Create a blob URL for replaying the recording
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    setVideoURL(URL.createObjectURL(blob));
    setIsReplay(true);
  }

  async function saveRecording() {
    if (recordedChunks.length > 0) {
      // Create a blob URL for saving the recording
      const blob = new Blob(recordedChunks, { type: "video/webm" });

      // Generate a default name for the recording using the date
      const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const defaultName = `recording-${date}.webm`;

      try {
        // Use the File System Access API to ask the user where they want the recording saved
        const options = {
          suggestedName: defaultName,
          types: [{
            description: 'WebM Video',
            accept: {
              'video/webm': ['.webm'],
            },
          }],
        };

        const fileHandle = await window.showSaveFilePicker(options);
        const writableStream = await fileHandle.createWritable();

        // Write the recording blob to the file
        await writableStream.write(blob);
        await writableStream.close();
      } catch (error) {
        console.error('Error saving file:', error);
        alert('Recording failed to save. Please try again.');
      }
    }
  }

  // Renderer for the countdown
  const countdownTimer = ({ minutes, seconds, completed }) => {
    if (completed) {
      startRecording();
      return <span>Start Answering!</span>;
    } else {
      // Display minutes and seconds properly
      return (
        <span
          style={{
            fontSize: "20px",
            color: "red",
            backgroundColor: "#555",
            padding: "6px",
            borderRadius: "8px",
            display: "inline-block",
            width: "40px",
            textAlign: "center",
          }}
        >
          {minutes > 0
            ? `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
            : seconds}
        </span>
      );
    }
  };

  return (
    <div>
      {!isRecording &&
        isCountdownActive && ( // Show countdown only if recording is not active
          <div className="reading-time-container" style={{ fontSize: "18px" }}>
            {isCountdownActive && (
              <Countdown
                date={Date.now() + readingTime * 1000}
                renderer={countdownTimer}
              />
            )}
            {isCountdownActive && (
              <button
                onClick={() => {
                  setIsCountdownActive(false);
                  startRecording();
                }}
                className="btn btn-primary"
                style={{
                  backgroundColor: "#ffcccc", // Light red color
                  borderColor: "black",
                  color: "black",
                }}
              >
                Skip Reading Time
              </button>
            )}
          </div>
        )}

      <div className="timer-text">
        <h5 style={{ color, display: isReplay ? "none" : "inline" }}>
          Answer Time: {timerText}
        </h5>
      </div>

      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{ display: isReplay ? "none" : "inline" }}
        />
        {videoURL && isReplay && <video src={videoURL} controls />}
      </div>

      <div className="button-container">
        <button
          onClick={stopRecording}
          style={{
            display: isRecording && !isCountdownActive ? "inline" : "none",
            borderColor: "black",
          }}
          className="btn btn-primary"
        >
          Stop Recording
        </button>
        

        {recordedChunks.length > 0 &&
          !isRecording &&
          !isCountdownActive && (
            <>
              {!isReplay && (
                <button
                  style={{ borderColor: "black" }}
                  onClick={replayRecording}
                  className="btn btn-primary me-2"
                >
                  Replay Recording
                </button>
              )}
              <button
                style={{ borderColor: "black" }}
                onClick={saveRecording}
                className="btn btn-primary me-2"
              >
                Save Recording
              </button>
            </>
          )}
      </div>
    </div>
  );
};

export default VideoRecordingComponent;
