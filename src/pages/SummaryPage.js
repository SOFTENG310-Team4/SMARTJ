import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SummaryPage = () => {
  // Hook to access the current location object, which contains state from the previous page
  const location = useLocation();

  // Hook to programmatically navigate to different routes
  const navigate = useNavigate();
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  // Retrieve interview data from location state or use default values if none is provided
  const interviewData = location.state || {
    question: "No question available",
    duration: 0,
    date: new Date().toLocaleDateString(),
  };

  // Navigate to the interview practice page
  const startNewInterview = () => {

    navigate('/interview-settings');

  };

  // Navigate to the home page
  const goHome = () => {
    navigate("/");
  };

  const getFeedback = async (userAnswer) => {
    setLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // Use a model available to free-tier accounts
          messages: [
            { role: "user", content: userAnswer }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(""); // Reset feedback before submitting
    await getFeedback(userAnswer);
  };

  return (
    <div className="container mt-5">
      {/* Main title for the summary page */}
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
        <h5 className="mb-4">Question: {interviewData.question}</h5>
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="form-control mb-3"
            rows="5"
            placeholder="Type your answer here..."
            required
          ></textarea>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Get Feedback"}
          </button>
        </form>
        {feedback && (
          <div className="alert alert-info mt-3" role="alert">
            <strong>Feedback:</strong> {feedback}
          </div>
        )}
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
