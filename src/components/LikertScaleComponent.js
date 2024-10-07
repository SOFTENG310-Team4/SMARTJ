import React from 'react';

const LikertScaleComponent = ({ question, setAnswer }) => {
  const likertOptions = [
    { value: 1, text: "Strongly Disagree" },
    { value: 2, text: "Disagree" },
    { value: 3, text: "Neutral" },
    { value: 4, text: "Agree" },
    { value: 5, text: "Strongly Agree" },
  ];

  return (
    <div className="container mt-5">
      <h2>{question}</h2>
      <div className="row mt-4">
        {likertOptions.map((option) => (
          <div key={option.value} className="col-2">
            <button
              className="btn btn-primary btn-block"
              onClick={() => setAnswer(option.value)}
            >
              {option.text}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LikertScaleComponent;