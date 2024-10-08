import React, { useState, useEffect, useRef } from "react";
import "../../styles/components/AnswerComponent.css";

const TextAnswerComponent = ({
  readingTime,
  timeLimit,
  onSubmit,
                                 goNextPage,
}) => {


  const [answer, setAnswer] = useState("");
  const [isInputEnabled, setInputEnabled] = useState(false);
  const [countdown, setCountdown] = useState(readingTime); // Set initial countdown time

  const handleConfirm = () => {
    setInputEnabled(true);
    setCountdown(timeLimit);
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
        timer = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000);
    } else {
        clearInterval(timer);
        if (!isInputEnabled) {
            handleConfirm();
        } else {
            handleSubmission();
        }
    }

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [countdown, isInputEnabled]);

  const formatCountdown = (countdown) => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // Format MM:SS
  };

  const handleSubmission = () => {
      setInputEnabled(false);
      onSubmit(answer, timeLimit - countdown);
      goNextPage();
  };

  return (
      <>
        {/* Textarea for typing the answer */}
        <div className="text-input-container">
          <textarea
              className="form-control"
              rows="10"
              value={answer}
              disabled={!isInputEnabled}
              onChange={e => setAnswer(e.target.value)}
              placeholder={isInputEnabled ? ("Start typing your answer here...") : ("")}/>
            {!isInputEnabled && (
                <button onClick={handleConfirm} className="answer-skip-button">Finish reading</button>
            )}
        </div>
          {/* Submit button for the answer */}
          <div className="button-container mt-4">
              <button onClick={handleSubmission} className="answer-button" disabled={!isInputEnabled}>
                  Submit answer
              </button>
              <div className="countdown">
                  {formatCountdown(countdown)}
              </div>
          </div>


      </>
  );
};

export default TextAnswerComponent;
