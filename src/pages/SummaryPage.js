import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveFeedback, saveLikert } from "../services/ProfileService";
import LikertScaleComponent from "../components/LikertScaleComponent";
import { set } from "mongoose";

const SummaryPage = () => {
  // Hook to access the current location object, which contains state from the previous page
  const location = useLocation();

  // Hook to programmatically navigate to different routes
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const answerType = location.state.answerType || "Text";
  const allBlobs = location.state.allBlobs || [];

  // Retrieve interview data from location state or use default values if none is provided
  const interviewData = location.state || {
    answers: "",
    questions: "No questions available",
    duration: 0,
    date: new Date().toLocaleDateString(),
  };

  const questionsArray = interviewData.questions.split("\n");
  const answersArray = interviewData.answers.split("\n");

  useEffect(() => {
    const feedbackFeched = localStorage.getItem("feedbackFetched");
    // Call getFeedback to fetch feedback immediately
    if (!feedbackFeched) {
      getFeedback();
      localStorage.setItem("feedbackFetched", true);
    }

    return () => {
      localStorage.removeItem("feedbackFetched");
    };
  }, [interviewData.answers]); // Dependency array ensures this runs only when answers change

  console.log(interviewData);

  const startNewInterview = () => {
    navigate("/interview-settings");
    localStorage.removeItem("feedbackFetched");
  };

  // Navigate to the home page
  const goHome = () => {
    navigate("/");
    localStorage.removeItem("feedbackFetched");
  };

  const getFeedback = async () => {
    setLoading(true);
    if (interviewData.answers === "") {
      setFeedback("No answers provided. Unable to provide feedback.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
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
                content: `Give feedback and a number grade out of 10 to the user about these answers: ${answersArray
                  .map((answer, index) => `Answer ${index + 1}: ${answer}`)
                  .join(
                    ", "
                  )} to these job interview questions respectively: ${questionsArray
                  .map(
                    (question, index) => `Question ${index + 1}: ${question}`
                  )
                  .join(
                    ", "
                  )}. If the user doesn't input any answers give a 0 number grade. Give only one grade for all the answers.`,
              },
            ],
            temperature: 0.7,
            max_tokens: 150,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors and output error code
        setFeedback(
          `Error ${response.status}: ${
            data.error?.message || "An unknown error occurred."
          }`
        );
        console.error("API Error:", response.status, data.error);
        return; // Exit the function if there's an error
      }

      setFeedback(data.choices[0].message.content.trim());
      console.log(data.choices[0].message.content.trim());
      await saveFeedback(data.choices[0].message.content.trim(), interviewData);
    } catch (error) {
      // Handle network errors and log them
      console.error("Network Error:", error);
      setFeedback(
        "Unable to provide feedback at the moment. Error: " + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Making array to set likert scale questions
  const likertQuestions = [
    "My answer directly addressed the question asked.",
    "My answer was concise and to the point.",
    "I demonstrated my skills and experience in my answer.",
  ];

  const changeLikert = (videoIndex, questionIndex, value) => {
    const newLikertValues = [...likertValues];
    newLikertValues[videoIndex][questionIndex] = value;
    setLikertValues(newLikertValues);
  };

  const [likertValues, setLikertValues] = useState(
    allBlobs.map(() => Array(likertQuestions.length).fill(0))
  );

  const allLikertFilled = () => {
    return likertValues.every((video) => video.every((value) => value !== 0));
  };

  const handleLikertSubmit = () => {
    if (allLikertFilled() && localStorage.getItem("token")) {
      saveLikert(likertValues, interviewData);
      console.log(likertValues);
    } else {
      alert("Please fill out all the likert scale questions.");
    }
  };

  const setContent = () => {
    if (answerType === "Text") {
      return loading ? (
        <div className="alert alert-info mt-3" role="alert">
          <strong>Loading feedback...</strong>
        </div>
      ) : (
        feedback && (
          <div className="alert alert-info mt-3" role="alert">
            <strong>Feedback:</strong> {feedback}
          </div>
        )
      );
    } else {
      return (
        <div className="video-replays">
          {allBlobs &&
            allBlobs.map((blob, videoIndex) => (
              <div key={videoIndex} className="video-container">
                <h5>Question {videoIndex + 1}</h5>
                <video src={URL.createObjectURL(blob)} controls />
                {likertQuestions.map((question, questionIndex) => (
                  <LikertScaleComponent
                    key={questionIndex}
                    question={question}
                    groupName={`likert-${videoIndex}-${questionIndex}`}
                    setAnswer={(value) =>
                      changeLikert(videoIndex, questionIndex, value)
                    }
                  />
                ))}
              </div>
            ))}
          <button className="btn btn-primary mt-3" onClick={handleLikertSubmit}>
            Submit Likert Values
          </button>
        </div>
      );
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="display-4 text-center mb-5">Interview Summary</h1>

      {setContent()}

      <div className="d-flex flex-column justify-content-center align-items-center">
        <h5 className="mb-4">Questions and Answers:</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Question</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {questionsArray.map((question, index) => (
              <tr key={index}>
                <td>{question}</td>
                <td>{answersArray[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
