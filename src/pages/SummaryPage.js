import React from 'react';

const SummaryPage = () => {
  // This would typically come from props or a global state
  const mockInterviewData = {
    question: "Tell me about a challenging project you've worked on.",
    duration: 120, // seconds
    date: new Date().toLocaleDateString()
  };

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-5">Interview Summary</h1>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="h4 mb-0">Recent Interview Practice</h2>
        </div>
        <div className="card-body">
          <p><strong>Date:</strong> {mockInterviewData.date}</p>
          <p><strong>Question:</strong> {mockInterviewData.question}</p>
          <p><strong>Duration:</strong> {mockInterviewData.duration} seconds</p>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="h4 mb-0">Practice Statistics</h2>
        </div>
        <div className="card-body">
          <p>Total Practice Sessions: 1</p>
          <p>Average Duration: {mockInterviewData.duration} seconds</p>
          <p>Most Recent Practice: {mockInterviewData.date}</p>
        </div>
      </div>
      
      <div className="text-center mt-5">
        <p className="lead">
          Great job on your practice session! Keep practicing to improve your interview skills.
        </p>
        <button className="btn btn-primary mt-3">
          Start New Practice
        </button>
      </div>
    </div>
  );
};

export default SummaryPage;