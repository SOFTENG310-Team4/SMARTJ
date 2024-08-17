import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QuestionComponent from "../components/QuestionComponent";
import VideoRecordingComponent from "../components/VideoRecordingComponent";
import TextAnswerComponent from "../components/TextAnswerComponent"; // Import the TextAnswerComponent
import "../InterviewPractice.css";

function InterviewPractice() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const questionType = queryParams.get("questionType") || "Behavioural";
  const answerType = queryParams.get("answerType") || "Text"; // Get the answerType (Text/Video)
  const timeLimit = parseInt(queryParams.get("answerTime"), 10) || 120; // Get answer time

  const [recordedChunks, setRecordedChunks] = useState([]);
  const [textAnswer, setTextAnswer] = useState(""); // New state to hold the text answer
  const [textAnswerDuration, setTextAnswerDuration] = useState(0); // State to hold duration

  // Navigate to the summary page
  function goToSummary() {
    const duration = answerType === "Text" ? textAnswerDuration : timeLimit - recordedChunks.length;
    navigate("/summary", {
      state: {
        answer: textAnswer, // For text answer
        duration: duration,
        date: new Date().toLocaleDateString(),
        question: "Tell me about a challenging project you've worked on.",
      },
    });
  }

  // Handle submission for text answers
  const handleTextSubmit = (answer, duration) => {
    setTextAnswer(answer); // Store the submitted answer in state
    setTextAnswerDuration(duration); // Store the duration in state
    // No navigation here; just store the answer and freeze the text input.
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">Interview Practice</h1>
      <QuestionComponent questionType={questionType} />
      <p className="lead">
        Prepare for your interviews with our customizable practice questions and
        recording features.
      </p>

      {/* Conditionally render the TextAnswerComponent or VideoRecordingComponent */}
      {answerType === "Text" ? (
        <TextAnswerComponent
          timeLimit={timeLimit}
          onSubmit={handleTextSubmit}
          goToSummary={goToSummary} // Pass goToSummary to the component for the "Next" button
        />
      ) : (
        <VideoRecordingComponent
          timeLimit={timeLimit}
          setRecordedChunks={setRecordedChunks}
          recordedChunks={recordedChunks}
          goToSummary={goToSummary}
        />
      )}
    </div>
  );
}

export default InterviewPractice;
