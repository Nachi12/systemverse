"use client";

import React, { useState } from "react";
import { QuizQuestion } from "@/lib/curriculum/curriculumData";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { triggerConfetti } from "@/lib/confetti";
import { CheckCircle2, XCircle, Award, ArrowRight, Terminal } from "lucide-react";

interface InteractiveQuizProps {
  questions: QuizQuestion[];
  lessonId: string;
}

export function InteractiveQuiz({ questions, lessonId }: InteractiveQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addXp, completeLesson, unlockAchievement, updateDailyMission } = useProgressStore();

  const handleSelect = (qId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    for (const q of questions) {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    }

    setIsSubmitted(true);
    const earnedXp = correctCount * 50;
    addXp(earnedXp);
    completeLesson(lessonId, 100);
    unlockAchievement("first_request");

    if (correctCount === questions.length) {
      updateDailyMission("quiz_champ", 1);
      triggerConfetti({ particleCount: 60, spread: 60 });
    }
  };

  const answeredAll = questions.every((q) => selectedAnswers[q.id] !== undefined);
  const correctCount = questions.filter((q) => selectedAnswers[q.id] === q.correctIndex).length;

  return (
    <div className="p-6 border border-theme-border bg-theme-card space-y-6 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-theme-border font-mono text-xs">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-theme-primary border border-theme-border px-1.5 py-0.5">
            VERIFICATION QUIZ
          </span>
          <h3 className="font-display text-lg font-bold text-theme-text mt-1">
            Protocol Knowledge Check
          </h3>
        </div>
        <div className="text-right text-theme-muted">
          MAX: <span className="text-theme-primary font-bold">+{questions.length * 50} XP</span>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, qIndex) => {
          const userChoice = selectedAnswers[q.id];
          return (
            <div key={q.id} className="p-4 border border-theme-border bg-theme-bg space-y-3">
              <h4 className="font-display text-sm font-bold text-theme-text flex items-start gap-2">
                <span className="text-theme-primary font-mono">Q{qIndex + 1}.</span>
                <span>{q.question}</span>
              </h4>

              <div className="space-y-2 font-mono text-xs">
                {q.options.map((opt, optIdx) => {
                  const isChosen = userChoice === optIdx;
                  const isCorrect = q.correctIndex === optIdx;

                  let style = "border-theme-border bg-theme-card text-theme-secondary hover:border-theme-primary/50";
                  if (isSubmitted) {
                    if (isCorrect) {
                      style = "border-theme-primary bg-theme-primary/20 text-theme-text font-bold";
                    } else if (isChosen && !isCorrect) {
                      style = "border-theme-error/50 bg-theme-card text-theme-error/70 line-through";
                    }
                  } else if (isChosen) {
                    style = "border-theme-primary bg-theme-primary/10 text-theme-text font-bold";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-3 border transition flex items-center justify-between ${style}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrect && <span className="text-[10px] text-theme-primary ml-2 font-bold">[CORRECT]</span>}
                      {isSubmitted && isChosen && !isCorrect && <span className="text-[10px] text-theme-error ml-2">[INCORRECT]</span>}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {isSubmitted && (
                <div className="p-3 border border-theme-border bg-theme-card font-mono text-xs space-y-1">
                  <span className="text-[10px] text-theme-primary uppercase font-bold">Explanation:</span>
                  <p className="text-theme-secondary font-sans">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit / Score Bar */}
      <div className="pt-4 border-t border-theme-border flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        {isSubmitted ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border border-theme-border bg-theme-card flex items-center justify-center font-bold text-theme-primary">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-theme-text">
                Score: {correctCount} / {questions.length} Correct
              </div>
              <div className="text-[11px] text-theme-primary">+{correctCount * 50 + 100} XP Awarded</div>
            </div>
          </div>
        ) : (
          <div className="text-theme-muted">
            {answeredAll ? "All questions answered. Ready to verify." : "Select an option for each question."}
          </div>
        )}

        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            disabled={!answeredAll}
            className="w-full sm:w-auto px-6 py-2.5 bg-theme-primary hover:brightness-110 disabled:opacity-30 text-theme-bg font-bold uppercase tracking-wider transition flex items-center justify-center space-x-1.5"
          >
            <span>Verify Answers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
