import React, { useState, useRef, useEffect } from "react";
import Countdown from "react-countdown";

const VideoRecordingComponent = ({
  readingTime,
  timeLimit,
  setRecordedChunks,
  recordedChunks,
  goToSummary,
    goNextPage
}) => {
  const [isInputEnabled, setInputEnabled] = useState(false);
  const [countdown, setCountdown] = useState(readingTime);
  const [isSubmitted, setSubmissionComplete] = useState(false);

  const mediaRecorderRef = useRef(null); // Ref to the media recorder
  const videoRef = useRef(null); // Ref to the video element
  const streamRef = useRef(null); // Ref to the media stream

  useEffect(() => {
    // Request access to the user's webcam and microphone
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        alert(
          "Your webcam and microphone must be accessible to continue.\nReload the application once they are both accessible and ensure they remain accessible while recording."
        );
        console.error("Error accessing webcam or microphone", error);
      });

    // Clean up the stream when the component unmounts
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  function startRecording() {
    // Start recording and initialize state
    setCountdown(timeLimit);
    setSubmissionComplete(false);
    setInputEnabled(true)
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
    }
  }

  function stopRecording() {
    setInputEnabled(false);
    setSubmissionComplete(true);
    // Stop the recording
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  }

  function handleDataAvailable(event) {
    // Handle available data and update recorded chunks
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  }

  async function saveRecording() {
    if (recordedChunks.length > 0) {
      // Create a blob URL for saving the recording
      const blob = new Blob(recordedChunks, { type: "video/webm" });

      // Generate a default name for the recording using the date
      const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const defaultName = `recording-${date}.webm`;

      if (window.showSaveFilePicker) {
        try {
          // Use the File System Access API to ask the user where they want the recording saved
          const options = {
            suggestedName: defaultName,
            types: [
              {
                description: "WebM Video",
                accept: {
                  "video/webm": [".webm"],
                },
              },
            ],
          };

          const fileHandle = await window.showSaveFilePicker(options);
          const writableStream = await fileHandle.createWritable();

          // Write the recording blob to the file
          await writableStream.write(blob);
          await writableStream.close();
        } catch (error) {
          console.error("Error saving file:", error);
          alert("Recording failed to save. Please try again.");
        }
      } else {
        // Fallback for browsers that do not support showSaveFilePicker
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = defaultName;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    }
  }

  useEffect(() => {
    let timer;
    if (countdown > 0 && !isSubmitted) {
      timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
        console.log(isSubmitted + " " + isInputEnabled)
      }, 1000);
    } else {
      clearInterval(timer);
      if (!isInputEnabled && !isSubmitted) {
        startRecording();
      } else if (isInputEnabled && !isSubmitted) {
        stopRecording();
      }
    }

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [countdown, isInputEnabled]);

  const formatCountdown = (countdown) => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // Format MM:SS
  };

  const handleNextPage = () => {
    setInputEnabled(false);
    setSubmissionComplete(false);
    goNextPage();
  }


  return (
      <div>
        <div className="video-container">
          <video
              ref={videoRef}
              autoPlay
              muted
              className={isInputEnabled ? "" : "video-blur"}
          />
          {!isInputEnabled && !isSubmitted && (
              <button onClick={startRecording} className="answer-skip-button-video">Start recording early</button>
          )}
        </div>

        <div className="button-container">
        </div>
        <div className="button-container mt-4">
          <button onClick={isSubmitted ? saveRecording : stopRecording} className="answer-button" disabled={!isInputEnabled && !isSubmitted}>
            {!isSubmitted && ("Submit Recording")}
            {isSubmitted && ("Save Recording")}
          </button>
          {isSubmitted && (
              <button className={"answer-button"} onClick={handleNextPage}>
                Next Section
              </button>
          )}
          <div className="countdown">
            {formatCountdown(countdown)}
          </div>
        </div>
      </div>
  );
};

export default VideoRecordingComponent;
