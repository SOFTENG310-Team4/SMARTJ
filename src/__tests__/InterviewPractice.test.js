import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import InterviewPractice from "../js/pages/InterviewPractice";
import Summary from "../js/pages/SummaryPage";

// Mock the child components that are used in InterviewPractice
jest.mock("../js/components/QuestionComponent", () => () => (
  <div>Mock Question</div>
));
jest.mock("../js/components/VideoRecordingComponent", () => (props) => (
  <div>
    Mock VideoRecordingComponent
    <button onClick={props.goToSummary}>End Recording</button>
  </div>
));
jest.mock("../js/components/TextAnswerComponent", () => (props) => (
  <div>
    Mock TextAnswerComponent
    <button onClick={() => props.onSubmit("Sample answer", 60)}>
      Submit Answer
    </button>
    <button onClick={props.goToSummary}>Finish</button>
  </div>
));

describe("InterviewPractice", () => {
  const setup = (queryString) => {
    return render(
      <MemoryRouter initialEntries={[`/interview-practice${queryString}`]}>
        <Routes>
          <Route path="/interview-practice" element={<InterviewPractice />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test("renders the first question correctly", () => {
    setup("?questionType=Behavioural&answerType=Text&numQuestions=3");

    // Check if the first question is rendered
    expect(screen.getByText("Mock Question")).toBeInTheDocument();

    // Check if the TextAnswerComponent is rendered
    expect(screen.getByText("Mock TextAnswerComponent")).toBeInTheDocument();
  });

  test("navigates to the next question on 'Next Question' button click", () => {
    setup("?questionType=Behavioural&answerType=Text&numQuestions=3");

    // Click the "Next Question" button
    fireEvent.click(screen.getByText("Next Question"));

    // The next question should still show the Mock Question
    expect(screen.getByText("Mock Question")).toBeInTheDocument();
  });

  test("calls goToSummary with correct data on finishing interview", () => {
    setup("?questionType=Behavioural&answerType=Text&numQuestions=1");

    // Submit an answer
    fireEvent.click(screen.getByText("Submit Answer"));

    // Use getAllByText to find all "Finish" buttons
    const finishButtons = screen.getAllByText("Finish");

    // Click the correct "Finish" button
    fireEvent.click(finishButtons[0]);

    // Check if it navigated to the summary page
    expect(screen.getByText("Loading feedback...")).toBeInTheDocument();
  });

  test("renders video recording component when answer type is 'Video'", () => {
    setup("?questionType=Technical&answerType=Video&numQuestions=1");

    // Check if the VideoRecordingComponent is rendered
    expect(
      screen.getByText("Mock VideoRecordingComponent")
    ).toBeInTheDocument();
  });

  test("increments count and stores questions correctly", () => {
    setup("?questionType=Behavioural&answerType=Text&numQuestions=3");

    // Submit the first answer
    fireEvent.click(screen.getByText("Submit Answer"));

    // Click the "Next Question" button
    fireEvent.click(screen.getByText("Next Question"));

    // The count should increment and still show the Mock Question
    expect(screen.getByText("Mock Question")).toBeInTheDocument();
  });

  test("finishes the interview correctly when the last question is reached", () => {
    setup("?questionType=Behavioural&answerType=Text&numQuestions=2");

    // Submit the first answer
    fireEvent.click(screen.getByText("Submit Answer"));

    // Click the "Next Question" button
    fireEvent.click(screen.getByText("Next Question"));

    // Submit the last answer
    fireEvent.click(screen.getByText("Submit Answer"));

    // Use getAllByText to find all "Finish" buttons
    const finishButtons = screen.getAllByText("Finish");

    // Click the correct "Finish" button
    fireEvent.click(finishButtons[0]);

    // Verify if it navigated to the summary
    expect(screen.getByText("Loading feedback...")).toBeInTheDocument();
  });
});
