import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QuestionComponent from "../components/QuestionComponent";
import VideoRecordingComponent from "../components/VideoRecordingComponent";
import TextAnswerComponent from "../components/TextAnswerComponent";
import "../../styles/pages/InterviewPractice.css";

function InterviewPractice() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const questionType = queryParams.get("questionType") || "Behavioural";
  const answerType = queryParams.get("answerType") || "Text";
  const [count, setCount] = useState(0);
  const numQuestions = parseInt(queryParams.get("numQuestions"), 10) || 3;
  const timeLimit = parseInt(queryParams.get("answerTime"), 10) || 120;
  const readingTime = parseInt(queryParams.get("readingTime"), 10) || 40;

  // State to manage recorded video chunks and text answers
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [textAnswers, setTextAnswers] = useState([]); // Array for text answers
  const [questions, setQuestions] = useState([]); // Array for questions
  const [textAnswerDuration, setTextAnswerDuration] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(""); // State for the current question
  const [allBlobs, setAllBlobs] = useState([]); // State to store all video blobs

  // State to store the start time of the interview
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  // listener for changes to recordedChunks and making blobs
  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      setAllBlobs((prevBlobs) => [...prevBlobs, blob]);
    }
  }, [recordedChunks]);

  // Calculate the total duration of the interview, including reading time and answer time
  const totalDuration = Math.floor((Date.now() - startTime) / 1000);

  // Function to navigate to the summary page with collected data
  function goToSummary(updatedQuestions) {
    // Concatenate answers and questions
    const concatenatedAnswers = textAnswers.join("\n");
    const concatenatedQuestions = updatedQuestions.join("\n");

    navigate("/summary", {
      state: {
        questions: concatenatedQuestions,
        answers: concatenatedAnswers,
        duration: totalDuration,
        date: new Date().toLocaleDateString(),
        answerType: answerType,
        allBlobs: allBlobs,
      },
    });
  }

  // Handler for submitting text answers
  const handleTextSubmit = (answer, duration) => {
    setTextAnswers((prevAnswers) => [...prevAnswers, answer]); // Append new answer
    setTextAnswerDuration(duration);
  };

  // Increment question count, store current question, and handle navigation to summary
  const increment = () => {
    setQuestions((prevQuestions) => [...prevQuestions, currentQuestion]); // Store the current question
    if (count < numQuestions - 1) {
      setCount(count + 1);
    } else {
      finishInterview();
    }
  };

  // Function to handle the finish action
  const finishInterview = () => {
    const updatedQuestions = [...questions, currentQuestion];
    goToSummary(updatedQuestions);
  };

  return (
      <div className="container mt-5">
        <div className="interview-container">
          {/* Left side: Display the interview question */}
          <div
              className="interview-questions"
          >
            <div>
              {/* Display the current question */}
              <QuestionComponent
                  key={`${questionType}-${count}`} // Unique key to force re-render
                  questionType={questionType}
                  onQuestionFetched={setCurrentQuestion} // Pass the function to set the current question
              />
            </div>
          </div>

          {/* Right side: Display the answer component based on answer type */}
          <div
              className="answer-section"
          >
            {answerType === "Text" ? (
                <TextAnswerComponent
                    key={`text-${count}`} // Unique key to force re-render
                    readingTime={readingTime}
                    timeLimit={timeLimit}
                    onSubmit={handleTextSubmit}
                    goNextPage={increment}
                    goToSummary={goToSummary}
                />
            ) : (
                <VideoRecordingComponent
                    key={`video-${count}`} // Unique key to force re-render
                    readingTime={readingTime}
                    timeLimit={timeLimit}
                    setRecordedChunks={setRecordedChunks}
                    recordedChunks={recordedChunks}
                    goNextPage={increment}
                    goToSummary={goToSummary}
                />
            )}
          </div>
        </div>
        <div className="interview-skip-container">
          {/* Button to move to the next question or finish */}
          {count < numQuestions - 1 ? (
              <button
                  onClick={increment}
                  className="question-nav-btn"
              >
                Skip Question
              </button>
          ) : (
              <button
                  onClick={finishInterview}
                  className="question-nav-btn"
              >
                Finish
              </button>
          )}
        </div>
      </div>
  );
}

export default InterviewPractice;
