import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SummaryPage = () => {
  // Hook to access the current location object, which contains state from the previous page
  const location = useLocation();

  // Hook to programmatically navigate to different routes
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  // Retrieve interview data from location state or use default values if none is provided
  const interviewData = location.state || {
    answers: "No answers available",
    questions: "No questions available",
    duration: 0,
    date: new Date().toLocaleDateString(),
  };

  useEffect(() => {
    // Call getFeedback to fetch feedback immediately
    getFeedback(interviewData.answers);
  }, [interviewData.answers]); // Dependency array ensures this runs only when answers change

  const startNewInterview = () => {
    
    navigate('/interview-settings');
  
  };

  // Navigate to the home page
  const goHome = () => {
    navigate("/");
  };

  const getFeedback = async (answer) => {
    setLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "user", 
              content: "Give feedback and a letter grade to the user about these answers: " + interviewData.answers + ", to these job interview questions respectively: " + interviewData.questions + ". If the user doesn't input any answers give F letter grade." 
            }
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors and output error code
        setFeedback(`Error ${response.status}: ${data.error?.message || "An unknown error occurred."}`);
        console.error("API Error:", response.status, data.error);
        return; // Exit the function if there's an error
      }

      setFeedback(data.choices[0].message.content.trim());
    } catch (error) {
      // Handle network errors and log them
      console.error("Network Error:", error);
      setFeedback("Unable to provide feedback at the moment. Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-5">Interview Summary</h1>

      {loading ? (
          <div className="alert alert-info mt-3" role="alert">
            <strong>Loading feedback...</strong>
          </div>
        ) : feedback && (
          <div className="alert alert-info mt-3" role="alert">
            <strong>Feedback:</strong> {feedback}
          </div>
        )}

      <div className="d-flex flex-column justify-content-center align-items-center">
        <h5 className="mb-4">Questions:</h5>
        <pre>{interviewData.questions}</pre>
        <h5 className="mb-4">Answers:</h5>
        <pre>{interviewData.answers}</pre>
        <h5 className="mb-4">Duration: {interviewData.duration} seconds</h5>
        <h5 className="mb-4">Date: {interviewData.date}</h5>

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
