import React from "react";
import { useLocation } from "react-router-dom";
import { LikertWithValue } from "../components/LikertScaleComponent";
import "../../styles/pages/ProfileSession.css";

function ProfileSession() {
  const location = useLocation();
  const { session } = location.state || {};

  const likertQuestions = [
    "My answer directly addressed the question asked.",
    "My answer was concise and to the point.",
    "I demonstrated my skills and experience in my answer.",
  ];

  if (!session) {
    return <div>No session data available.</div>;
  }

  console.log(session.questions[0].likert);
  return (
    <div className="container mt-5">
      <h1 className="session-header">Session Details</h1>
      <h5>Date: {new Date(session.date).toLocaleString()}</h5>
      <h5>Duration: {session.duration} seconds</h5>
      {session.medianScore !== undefined ? (
        <div>
          <h5>Median Score: {session.medianScore}</h5>
          <h5>Feedback: {session.gptFeedback}</h5>

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
      ) : (
        <div className="session-table-container">
          <h3>Likert Questions and Ratings</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Question</th>
                <th>Likert Rating</th>
              </tr>
            </thead>
            <tbody>
              {session.questions.map((qa, index) => (
                <tr key={index}>
                  <td>{qa.question}</td>
                  <td>
                    {likertQuestions.map((question, likertIndex) => (
                      <LikertWithValue
                        key={likertIndex}
                        question={question}
                        answer={qa.likert[likertIndex]}
                        groupName={`likert-${index}-${likertIndex}`}
                      />
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProfileSession;
