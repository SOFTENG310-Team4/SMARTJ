import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProfileSession from "../js/pages/ProfileSession";

const mockSession = {
  id: "1",
  date: "2023-10-01T12:00:00Z",
  medianScore: 8,
  gptFeedback: "Great job!",
  duration: 120,
  questions: [
    {
      question: "What is your greatest strength?",
      answer: "My greatest strength is my adaptability.",
    },
    {
      question: "Why do you want to work here?",
      answer: "I want to work here because of the company's values.",
    },
  ],
};

const setup = (session) => {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: "/session/1", state: { session } }]}
    >
      <Routes>
        <Route path="/session/:id" element={<ProfileSession />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("ProfileSession", () => {
  test("renders session details correctly", () => {
    setup(mockSession);

    expect(screen.getByText("Session Details")).toBeInTheDocument();
    expect(screen.getByText("Duration: 120 seconds")).toBeInTheDocument();
    expect(screen.getByText("Median Score: 8")).toBeInTheDocument();
    expect(screen.getByText("Feedback: Great job!")).toBeInTheDocument();
  });

  test("renders questions and answers correctly", () => {
    setup(mockSession);

    mockSession.questions.forEach((qa) => {
      expect(screen.getByText(qa.question)).toBeInTheDocument();
      expect(screen.getByText(qa.answer)).toBeInTheDocument();
    });
  });

  test("renders no session data message when session is not provided", () => {
    setup(null);

    expect(screen.getByText("No session data available.")).toBeInTheDocument();
  });
});
