import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //Summary page uses stored state from the previous page to display the interview data
  const interviewData = location.state || {
    question: "No question available",
    duration: 0,
    date: new Date().toLocaleDateString()
  };

  const startNewInterview = () => {
    navigate('/interview-settings');
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-5">Interview Summary</h1>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <img
          src="images/thumbsup.png"
          width="400"
          height="400"
          className="mb-4"
          alt="Thumbs Up"
          style={{ objectFit: 'contain' }}
        />
        <p className="lead text-center mb-3">
          Great job on your practice session! Keep practicing to improve your interview skills.
        </p>
        <div className="mt-2">
          <button className="btn btn-primary me-3" onClick={startNewInterview}>
            Start New Practice
          </button>
          <button className="btn btn-info" onClick={goHome}>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;