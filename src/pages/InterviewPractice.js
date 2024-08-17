import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QuestionComponent from "../components/QuestionComponent";
import VideoRecordingComponent from "../components/VideoRecordingComponent";
import "../InterviewPractice.css";

function InterviewPractice() {
  const navigate = useNavigate();
  const location = useLocation();
  const timeLimit = 20;

  const [recordedChunks, setRecordedChunks] = useState([]);

  // Extract questionType from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const questionType = queryParams.get("questionType") || "Behavioural";

  function goToSummary() {
    const duration = timeLimit - recordedChunks.length;
    navigate("/summary", {
      state: {
        duration: duration,
        date: new Date().toLocaleDateString(),
        question: "Tell me about a challenging project you've worked on.",
      },
    });
  }

  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">Interview Practice</h1>
      <QuestionComponent questionType={questionType} />
      <p className="lead">
        Prepare for your interviews with our customizable practice questions and
        recording features.
      </p>

      <VideoRecordingComponent
        timeLimit={timeLimit}
        setRecordedChunks={setRecordedChunks}
        recordedChunks={recordedChunks}
        goToSummary={goToSummary}
      />
    </div>
  );
}

export default InterviewPractice;
