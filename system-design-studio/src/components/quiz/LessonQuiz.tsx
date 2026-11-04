import React, { useState } from "react";
import { QuizQuestion } from "../../types/lesson";
import { CheckCircle2, XCircle, Award, ArrowRight, RotateCcw } from "lucide-react";

interface LessonQuizProps {
  questions: QuizQuestion[];
  lessonId: string;
  onComplete?: (score: number) => void;
}

export function LessonQuiz({ questions, lessonId, onComplete }: LessonQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelect = (qId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = () => {
    let score = 0;
    for (const q of questions) {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    }
    setIsSubmitted(true);
    onComplete?.(score);

    // Save progress to localStorage
    try {
      const stored = localStorage.getItem("studio_quiz_progress") || "{}";
      const parsed = JSON.parse(stored);
      parsed[lessonId] = {
        score,
        total: questions.length,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem("studio_quiz_progress", JSON.stringify(parsed));
    } catch {
      // fallback
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const answeredAll = questions.every((q) => selectedAnswers[q.id] !== undefined);
  const correctCount = questions.filter((q) => selectedAnswers[q.id] === q.correctIndex).length;

  return (
    <div className="p-6 rounded-3xl bg-studio-900 border border-studio-700/80 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-studio-750">
        <div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-500 border border-brand-500/30">
            KNOWLEDGE CHECK
          </span>
          <h3 className="text-base font-bold text-white mt-1">Short Lesson Quiz</h3>
          <p className="text-xs text-slate-400">Verify your understanding before sharing educational content.</p>
        </div>
        {isSubmitted && (
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];

          return (
            <div key={q.id} className="p-4 rounded-2xl bg-studio-950/70 border border-studio-800 space-y-3">
              <h4 className="text-sm font-semibold text-slate-100 flex items-start gap-2">
                <span className="text-accent-cyan font-mono">Q{idx + 1}.</span>
                <span>{q.question}</span>
              </h4>

              <div className="space-y-2">
                {q.options.map((option, optIdx) => {
                  const isChosen = userChoice === optIdx;
                  const isCorrect = q.correctIndex === optIdx;

                  let btnStyle = "bg-studio-900 border-studio-750 text-slate-300 hover:border-studio-600";
                  if (isSubmitted) {
                    if (isCorrect) {
                      btnStyle = "bg-brand-500/15 border-brand-500 text-brand-500 font-medium";
                    } else if (isChosen && !isCorrect) {
                      btnStyle = "bg-accent-rose/15 border-accent-rose text-accent-rose";
                    }
                  } else if (isChosen) {
                    btnStyle = "bg-accent-cyan/15 border-accent-cyan text-accent-cyan font-medium";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-brand-500 flex-shrink-0" />}
                      {isSubmitted && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-accent-rose flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Explanation */}
              {isSubmitted && (
                <div className="p-3 rounded-xl bg-studio-900 border border-studio-800 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-accent-cyan uppercase tracking-wider text-[10px] block">
                    Why this matters:
                  </span>
                  <p className="leading-relaxed text-slate-400">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="pt-4 border-t border-studio-750 flex flex-col sm:flex-row items-center justify-between gap-4">
        {isSubmitted ? (
          <div className="flex items-center space-x-2 text-sm font-bold text-white">
            <Award className="w-5 h-5 text-accent-amber" />
            <span>Score: {correctCount} / {questions.length} correct</span>
          </div>
        ) : (
          <div className="text-xs text-slate-400">
            {answeredAll ? "All questions answered. Ready to check!" : "Select an answer for each question above."}
          </div>
        )}

        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            disabled={!answeredAll}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-studio-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition"
          >
            <span>Submit Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

