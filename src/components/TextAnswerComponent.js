import React, { useState, useEffect, useRef } from "react";
import Countdown from "react-countdown";

const TextAnswerComponent = ({ timeLimit, onSubmit, goToSummary }) => {
  const [color, setTimerTextColor] = useState("black");
  const [isCountdownActive, setIsCountdownActive] = useState(true); // Start countdown on mount
  const [remainingTime, setRemainingTime] = useState(timeLimit);
  const [answer, setAnswer] = useState("");
  const [timerText, setTimerText] = useState(timeLimit);
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track if the answer is submitted
  const recordingTimer = useRef(null);

  // Timer for typing (main answer timer)
  useEffect(() => {
    if (isTyping) {
      recordingTimer.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1;
          updateTimer(newTime);
          return newTime;
        });
      }, 1000);
    } else if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
    }

    return () => clearInterval(recordingTimer.current);
  }, [isTyping]);

  // Update the timer text and color
  const updateTimer = (count) => {
    setTimerTextColor(count < 11 ? "red" : "black");
    setTimerText(count > 0 ? count : "Time's Up");

    if (count <= 0) {
      submitAnswer();
    }
  };

  // Automatically start typing after the initial countdown
  const startAnswering = () => {
    setIsCountdownActive(false);
    setRemainingTime(timeLimit);
    setTimerText(timeLimit);
    setIsTyping(true);
    setIsSubmitted(false); // Reset submission state
  };

  // Automatically start the countdown when the component mounts
  useEffect(() => {
    setIsCountdownActive(true); // Start countdown on mount
    setTimeout(() => {
      setIsCountdownActive(false);
      setIsTyping(true);
    }, 3000); // 3-second countdown
  }, []);

  const submitAnswer = () => {
    setIsTyping(false); // Disable typing after submission
    setIsSubmitted(true); // Mark as submitted
    onSubmit(answer, timeLimit - remainingTime);
  };

  const resetAnswer = () => {
    setAnswer("");
    setTimerText(timeLimit);
    setIsTyping(false);
    setIsSubmitted(false); // Reset submission state
    startAnswering();
  };

  // Renderer for the countdown
  function countdownTimer({ seconds, completed }) {
    if (completed) {
      return <span>Start Answering!</span>;
    } else {
      return <span>{seconds}</span>;
    }
  }

  return (
    <div>
      <div className="timer-text">
        <h2 style={{ color }}>{timerText}</h2>
      </div>

      <div className="text-input-container">
        {isCountdownActive && (
          <div className="overlay-text">
            <Countdown date={Date.now() + 3000} renderer={countdownTimer} />
          </div>
        )}

        {!isCountdownActive && (
          <textarea
            className="form-control"
            rows="10"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={!isTyping || remainingTime <= 0 || isCountdownActive || isSubmitted} // Disable textarea after submission or time is up
            placeholder="Start typing your answer here..."
          />
        )}
      </div>

      <div className="button-container mt-4">
        {!isCountdownActive && (
          <>
            {!isSubmitted && remainingTime > 0 && (
              <button onClick={submitAnswer} className="btn btn-success me-2">
                Submit Answer
              </button>
            )}
            <button onClick={resetAnswer} className="btn btn-primary me-2">
              Start New Answer
            </button>
            <button onClick={goToSummary} className="btn btn-success">
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TextAnswerComponent;
