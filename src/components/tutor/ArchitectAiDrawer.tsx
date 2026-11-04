"use client";

import React, { useState } from "react";
import { X, Sparkles, HelpCircle, AlertTriangle, Lightbulb, GraduationCap, Key, Send, Terminal } from "lucide-react";
import { getTutorAdvice } from "@/lib/tutor/tutorKnowledge";

interface ArchitectAiDrawerProps {
  currentTopic?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ArchitectAiDrawer({
  currentTopic = "what-happens-when-website-loads",
  isOpen,
  onClose,
}: ArchitectAiDrawerProps) {
  const [activeMode, setActiveMode] = useState<"eli5" | "deepdive" | "failure" | "hint" | "interview">("eli5");
  const [customQuestion, setCustomQuestion] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  if (!isOpen) return null;

  const currentAdvice = getTutorAdvice(currentTopic, activeMode);

  const handleAskCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    if (!geminiApiKey.trim()) {
      setCustomAnswer(
        `[Offline Rule Engine]: Based on current architecture principles for "${customQuestion}", focus on decoupling read/write paths, implementing bounded queues with backpressure, and ensuring idempotent retry semantics with deduplication tokens.`
      );
      return;
    }

    setIsLoadingAi(true);
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are Architect AI, a world-class principal system designer in the SYSTEMVERSE application. Provide a concise, highly visual, practical technical answer to the following developer question:\n\nTopic: ${currentTopic}\nQuestion: ${customQuestion}`,
                },
              ],
            },
          ],
        }),
      });
      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to retrieve response from Gemini API.";
      setCustomAnswer(reply);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setCustomAnswer(`Error querying Gemini: ${errorMessage}. Falling back to offline architecture knowledge base.`);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-theme-card border-l border-theme-border shadow-2xl flex flex-col font-sans">
      {/* Header */}
      <div className="p-4 border-b border-theme-border flex items-center justify-between bg-theme-bg">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 border border-theme-border bg-theme-card flex items-center justify-center text-theme-primary">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xs text-theme-text flex items-center gap-1.5 uppercase tracking-wider">
              ARCHITECT AI <span className="text-[9px] px-1 bg-theme-cardElevated border border-theme-border text-theme-primary font-mono">TUTOR</span>
            </h3>
            <p className="text-[10px] font-mono text-theme-muted">CONTEXT: {currentTopic}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            title="Configure Gemini API Key"
            className="p-1.5 border border-theme-border hover:border-theme-primary bg-theme-card text-theme-muted hover:text-theme-text transition"
          >
            <Key className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 border border-theme-border hover:border-theme-muted bg-theme-card text-theme-muted hover:text-theme-text transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Optional Gemini API Key Drawer */}
      {showKeyInput && (
        <div className="p-3 bg-theme-bg border-b border-theme-border text-xs font-mono">
          <p className="text-theme-text mb-1 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-theme-primary" /> OPTIONAL GEMINI API KEY
          </p>
          <p className="text-[10px] text-theme-muted mb-2 font-sans">
            Leave blank to use pre-built offline responses, or paste your API key for live generative reasoning.
          </p>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-theme-card border border-theme-border text-theme-text text-xs focus:outline-none focus:border-theme-primary font-mono"
          />
        </div>
      )}

      {/* Modes Navigation */}
      <div className="grid grid-cols-5 p-2 bg-theme-bg border-b border-theme-border gap-1 font-mono text-[10px]">
        <button
          onClick={() => { setActiveMode("eli5"); setCustomAnswer(null); }}
          className={`py-1.5 px-1 border flex flex-col items-center gap-0.5 transition uppercase tracking-wider ${
            activeMode === "eli5"
              ? "border-theme-primary bg-theme-primary/10 text-theme-primary font-bold"
              : "border-theme-border bg-theme-card text-theme-muted hover:text-theme-text"
          }`}
        >
          <Sparkles className="w-3 h-3 text-theme-primary" />
          <span>ELI5</span>
        </button>
        <button
          onClick={() => { setActiveMode("deepdive"); setCustomAnswer(null); }}
          className={`py-1.5 px-1 border flex flex-col items-center gap-0.5 transition uppercase tracking-wider ${
            activeMode === "deepdive"
              ? "border-theme-primary bg-theme-primary/10 text-theme-primary font-bold"
              : "border-theme-border bg-theme-card text-theme-muted hover:text-theme-text"
          }`}
        >
          <GraduationCap className="w-3 h-3 text-theme-primary" />
          <span>Deep Dive</span>
        </button>
        <button
          onClick={() => { setActiveMode("failure"); setCustomAnswer(null); }}
          className={`py-1.5 px-1 border flex flex-col items-center gap-0.5 transition uppercase tracking-wider ${
            activeMode === "failure"
              ? "border-theme-primary bg-theme-primary/10 text-theme-primary font-bold"
              : "border-theme-border bg-theme-card text-theme-muted hover:text-theme-text"
          }`}
        >
          <AlertTriangle className="w-3 h-3 text-theme-primary" />
          <span>Failure</span>
        </button>
        <button
          onClick={() => { setActiveMode("hint"); setCustomAnswer(null); }}
          className={`py-1.5 px-1 border flex flex-col items-center gap-0.5 transition uppercase tracking-wider ${
            activeMode === "hint"
              ? "border-theme-primary bg-theme-primary/10 text-theme-primary font-bold"
              : "border-theme-border bg-theme-card text-theme-muted hover:text-theme-text"
          }`}
        >
          <Lightbulb className="w-3 h-3 text-theme-primary" />
          <span>Hint</span>
        </button>
        <button
          onClick={() => { setActiveMode("interview"); setCustomAnswer(null); }}
          className={`py-1.5 px-1 border flex flex-col items-center gap-0.5 transition uppercase tracking-wider ${
            activeMode === "interview"
              ? "border-theme-primary bg-theme-primary/10 text-theme-primary font-bold"
              : "border-theme-border bg-theme-card text-theme-muted hover:text-theme-text"
          }`}
        >
          <HelpCircle className="w-3 h-3 text-theme-primary" />
          <span>Mock Q</span>
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {customAnswer ? (
          <div className="p-3.5 border border-theme-primary bg-theme-bg text-theme-text space-y-2 font-mono text-xs">
            <h4 className="text-theme-primary flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3 h-3" /> QUERY RESPONSE:
            </h4>
            <p className="text-theme-secondary whitespace-pre-wrap leading-relaxed">{customAnswer}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border border-theme-border bg-theme-bg space-y-2">
              <h4 className="font-display text-sm font-bold text-theme-text">
                {currentAdvice.title}
              </h4>
              <p className="text-xs text-theme-secondary font-sans leading-relaxed">{currentAdvice.content}</p>
            </div>

            <div className="p-3 border border-theme-border bg-theme-cardElevated">
              <p className="text-[11px] font-mono text-theme-text">
                <span className="font-bold uppercase tracking-wider text-theme-primary">Architectural Axiom:</span>{" "}
                <span className="text-theme-secondary">{currentAdvice.takeawayBullet}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Query Box */}
      <form onSubmit={handleAskCustom} className="p-3 border-t border-theme-border bg-theme-bg">
        <div className="flex items-center space-x-2 font-mono text-xs">
          <input
            type="text"
            placeholder="Ask Architect AI any system design question..."
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            disabled={isLoadingAi}
            className="flex-1 px-3 py-2 bg-theme-card border border-theme-border text-theme-text placeholder-theme-muted focus:outline-none focus:border-theme-primary text-xs"
          />
          <button
            type="submit"
            disabled={isLoadingAi || !customQuestion.trim()}
            className="p-2 border border-theme-border bg-theme-primary text-theme-bg font-bold hover:brightness-110 transition disabled:opacity-40"
          >
            {isLoadingAi ? <Sparkles className="w-4 h-4 animate-spin text-theme-bg" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  );
}
