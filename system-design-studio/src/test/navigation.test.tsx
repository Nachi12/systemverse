import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { App } from "../App";

describe("System Design Studio Navigation", () => {
  it("renders the studio header and default lesson", () => {
    render(<App />);
    expect(screen.getByText("System Design Learning Studio")).toBeInTheDocument();
    expect(screen.getAllByText("CPU vs RAM vs SSD: Where Does Your Code Actually Run?").length).toBeGreaterThan(0);
  });

  it("switches to the database scaling lesson when clicked", () => {
    render(<App />);
    const dbLessonBtns = screen.getAllByText("How to Scale a Database (The Step-by-Step Order)");
    fireEvent.click(dbLessonBtns[0]);

    expect(screen.getAllByText("How to Scale a Database (The Step-by-Step Order)").length).toBeGreaterThan(0);
    expect(screen.getByText("The Busy Library Desk Analogy")).toBeInTheDocument();
  });

  it("switches tabs between concept, visual demo, quiz, and instagram studio", () => {
    render(<App />);
    
    // Switch to Visual Demo
    const demoTab = screen.getByText("2. Visual Demo");
    fireEvent.click(demoTab);
    expect(screen.getByText("CPU, RAM & SSD Bottleneck Visualizer")).toBeInTheDocument();

    // Switch to Quiz
    const quizTab = screen.getByText("3. Lesson Quiz");
    fireEvent.click(quizTab);
    expect(screen.getByText("Short Lesson Quiz")).toBeInTheDocument();

    // Switch to Instagram
    const instaTab = screen.getByText("4. Instagram Studio");
    fireEvent.click(instaTab);
    expect(screen.getByText("Instagram Creator Studio")).toBeInTheDocument();
  });

  it("opens and closes the Glossary drawer", () => {
    render(<App />);
    const glossaryBtn = screen.getByText("Glossary");
    fireEvent.click(glossaryBtn);

    expect(screen.getByText("System Design Glossary")).toBeInTheDocument();
    expect(screen.getByText("Plain English definitions for complex jargon")).toBeInTheDocument();
  });
});
