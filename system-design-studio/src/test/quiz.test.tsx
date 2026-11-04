import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { LessonQuiz } from "../components/quiz/LessonQuiz";
import { QuizQuestion } from "../types/lesson";

const mockQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Is RAM volatile memory?",
    options: ["No, it stores data forever", "Yes, power loss wipes data"],
    correctIndex: 1,
    explanation: "RAM loses all data upon reboot.",
  },
];

describe("LessonQuiz Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders quiz questions and allows selection", () => {
    render(<LessonQuiz questions={mockQuestions} lessonId="test-lesson" />);
    expect(screen.getByText("Is RAM volatile memory?")).toBeInTheDocument();

    const option = screen.getByText("Yes, power loss wipes data");
    fireEvent.click(option);

    const submitBtn = screen.getByText("Submit Quiz");
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    expect(screen.getByText("Score: 1 / 1 correct")).toBeInTheDocument();
    expect(screen.getByText("RAM loses all data upon reboot.")).toBeInTheDocument();
  });

  it("persists progress in localStorage", () => {
    render(<LessonQuiz questions={mockQuestions} lessonId="test-lesson" />);
    const option = screen.getByText("Yes, power loss wipes data");
    fireEvent.click(option);
    fireEvent.click(screen.getByText("Submit Quiz"));

    const stored = localStorage.getItem("studio_quiz_progress");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed["test-lesson"].score).toBe(1);
  });
});

