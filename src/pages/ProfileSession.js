import React from "react";
import { useLocation } from "react-router-dom";

function ProfileSession() {
  const location = useLocation();
  const { session } = location.state || {};

  if (!session) {
    return <div>No session data available.</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-5">Session Details</h1>
      <h5>Date: {new Date(session.date).toLocaleString()}</h5>
      <h5>Duration: {session.duration} seconds</h5>
      <h5>Median Score: {session.medianScore}</h5>
      <h5>Feedback: {session.gptFeedback}</h5>

      <div className="mt-4">
        <h3>Questions and Answers</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {session.questions.map((qa, index) => (
              <tr key={index}>
                <td>{qa.question}</td>
                <td>{qa.answer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProfileSession;
