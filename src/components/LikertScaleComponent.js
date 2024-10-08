import React from 'react';
import '../LikertScaleComponent.css';

const LikertScaleComponent = ({ question, setAnswer }) => {
  const likertOptions = [
    { value: 1, text: "Strongly Disagree" },
    { value: 2, text: "Disagree" },
    { value: 3, text: "Neutral" },
    { value: 4, text: "Agree" },
    { value: 5, text: "Strongly Agree" },
  ];

  return (
    <div className="likert-container mt-5">
      <h2 className='likert-question'>{question}</h2>
      <div className="likert-options mt-4">
        {likertOptions.map((option) => (
          <label key={option.value} className="likert-label">
            <span className="likert-label-text">{option.text}</span>
            <input
              type="radio"
              name={`likert-${question}`}
              value={option.value}
              onChange={() => setAnswer(option.value)}
              className="likert-radio"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default LikertScaleComponent;