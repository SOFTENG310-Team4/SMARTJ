import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

// Fetch questions from the specified endpoint based on question type
const fetchQuestions = async (type) => {
  // Construct the URL for fetching questions based on type
  const response = await fetch(`/question-bank-${type}.json`);
  // Parse the JSON response
  const questions = await response.json();
  return questions;
};

const QuestionComponent = ({ questionType, onQuestionFetched }) => {
  // State to hold the current question
  const [question, setQuestion] = useState("");

  useEffect(() => {
    // Function to get a random question from the fetched questions
    const getRandomQuestion = async () => {
      // Fetch questions based on the current question type
      const questions = await fetchQuestions(questionType);
      // Check if there are questions available
      if (questions.length > 0) {
        // Select a random question from the list
        const randomIndex = Math.floor(Math.random() * questions.length);
        // Update the state with the selected question
        const selectedQuestion = questions[randomIndex].question;
        setQuestion(selectedQuestion);
        onQuestionFetched(selectedQuestion); // Pass the question to the parent
      }
    };

    // Call the function to get a random question
    getRandomQuestion();
  }, [questionType, onQuestionFetched]); // Re-run the effect if the questionType changes

  return (
    <div className="question-container">
      <div className="question">
        <h2>{question}</h2> {/* Display the current question */}
      </div>
      <div className="answer">
        {/* Render the answer part based on settings */}
        {/* Placeholder for the answer component */}
      </div>
    </div>
  );
};

// Define propTypes to validate props
QuestionComponent.propTypes = {
  questionType: PropTypes.string.isRequired,   // questionType must be a string and is required
  onQuestionFetched: PropTypes.func.isRequired // onQuestionFetched must be a function and is required
};

export default QuestionComponent;
