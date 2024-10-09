import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/InterviewSettings.css";

function InterviewSettings() {
  // State for number of questions, defaulting to 3
  const [numQuestions, setNumQuestions] = useState(3);
  // State for question type, defaulting to "Behavioural"
  const [questionType, setQuestionType] = useState("Behavioural");
  // State for reading time in seconds, defaulting to 40 seconds
  const [readingTime, setReadingTime] = useState(40);
  // State for answer time in seconds, defaulting to 120 seconds
  const [answerTime, setAnswerTime] = useState(120);
  // State for answer type, defaulting to "Text"
  const [answerType, setAnswerType] = useState("Text");

  // Arrays for question and answer types
  const questionTypes = ["Technical", "Behavioural"];
  const answerTypes = ["Text", "Video"];

  const handleSliderChange = (setter, value, event) => {
    const newValue = Number(event.target.value);
    setter(newValue);

    const percentage = (newValue - event.target.min) / (event.target.max - event.target.min) * 100;
    event.target.style.setProperty('--progress', `${percentage}%`);
  };

  useEffect(() => {
    document.querySelectorAll('input[type="range"]').forEach(input => {
      const percentage = (input.value - input.min) / (input.max - input.min) * 100;
      input.style.setProperty('--progress', `${percentage}%`);
    });
  })

  return (
    <div className="container text-center mt-5">
      <h1 className="interview-heading">Interview Settings</h1>

      <div className="settings mt-3 mb-3">
        {/* Section for setting number of questions */}
        <div className="setting">
          <h4>Number of Questions: <span className="setting-value">{numQuestions}</span></h4>
          <input
              type="range"
              min="1"
              max="10"
              value={numQuestions}
              onChange={(e) => handleSliderChange(setNumQuestions, numQuestions, e)}
          />
        </div>

        {/* Section for setting reading time */}
        <div className="setting">
          <h4>Reading Time: <span className="setting-value">{readingTime} seconds</span></h4>
          <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={readingTime}
              onChange={(e) => handleSliderChange(setReadingTime, readingTime, e)}
          />
        </div>

        {/* Section for setting answer time */}
        <div className="setting">
          <h4>Answer Time: <span className="setting-value">{answerTime} seconds</span></h4>
          <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={answerTime}
              onChange={(e) => handleSliderChange(setAnswerTime, answerTime, e)}
          />
        </div>

        {/* Section for setting answer type */}
        <div className="setting">
          <h4>Answer Type:</h4>
          <select
              value={answerType}
              onChange={(e) => setAnswerType(e.target.value)}
          >
            {answerTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
            ))}
          </select>
        </div>

        {/* Section for setting question type */}
        <div className="setting">
          <h4>Question Type:</h4>
          <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
          >
            {questionTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
            ))}
          </select>
        </div>


        {/* Button to start the interview with the selected settings */}
          <Link
            to={`/interview-practice?questionType=${encodeURIComponent(
              questionType
            )}&numQuestions=${numQuestions}&readingTime=${readingTime}&answerTime=${answerTime}&answerType=${encodeURIComponent(
              answerType
            )}`}
          >
            <button className="interview-button">Start interview</button>
          </Link>
      </div>
    </div>
  );
}

export default InterviewSettings;
