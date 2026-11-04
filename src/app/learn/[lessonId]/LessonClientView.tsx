"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LessonData } from "@/lib/curriculum/curriculumData";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { InteractiveQuiz } from "@/components/lesson/InteractiveQuiz";

// 8 Dedicated Interactive Simulators
import { DatabaseSimulator } from "@/components/simulators/DatabaseSimulator";
import { ServerSimulator } from "@/components/simulators/ServerSimulator";
import { LoadBalancerSimulator } from "@/components/simulators/LoadBalancerSimulator";
import { CacheSimulator } from "@/components/simulators/CacheSimulator";
import { QueueSimulator } from "@/components/simulators/QueueSimulator";
import { NetworkSimulator } from "@/components/simulators/NetworkSimulator";
import { CDNSimulator } from "@/components/simulators/CDNSimulator";
import { ReplicationSimulator } from "@/components/simulators/ReplicationSimulator";

import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Eye, 
  FlaskConical, 
  Sliders, 
  Wrench, 
  Building2, 
  AlertTriangle,
  Terminal,
  Sparkles
} from "lucide-react";

interface LessonClientViewProps {
  lesson: LessonData;
  prevLessonId: string | null;
  nextLessonId: string | null;
}

export function LessonClientView({
  lesson,
  prevLessonId,
  nextLessonId,
}: LessonClientViewProps) {
  const { completedLessons, completeLesson, setCurrentLesson } = useProgressStore();
  const [activeMode, setActiveMode] = useState<"experiment" | "explore" | "watch" | "build">("experiment");
  const [isCompletedLocally, setIsCompletedLocally] = useState(false);

  useEffect(() => {
    setCurrentLesson(lesson.id);
  }, [lesson.id, setCurrentLesson]);

  const isAlreadyCompleted = completedLessons.includes(lesson.id) || isCompletedLocally;

  const handleMarkComplete = () => {
    completeLesson(lesson.id, 100);
    setIsCompletedLocally(true);
  };

  // Render the appropriate dedicated interactive simulator
  const renderSimulator = () => {
    switch (lesson.simulatorType) {
      case "database": return <DatabaseSimulator />;
      case "server": return <ServerSimulator />;
      case "load_balancer": return <LoadBalancerSimulator />;
      case "cache": return <CacheSimulator />;
      case "queue": return <QueueSimulator />;
      case "network": return <NetworkSimulator />;
      case "cdn": return <CDNSimulator />;
      case "replication": return <ReplicationSimulator />;
      default: return <ServerSimulator />;
    }
  };

  return (
    <div className="w-full bg-theme-bg text-theme-text min-h-screen py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Masthead & Stage Metadata Bar */}
        <div className="border-b border-theme-border pb-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center space-x-3">
            <Link
              href="/learn"
              className="text-theme-muted hover:text-theme-text flex items-center space-x-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ROADMAP</span>
            </Link>
            <span className="text-theme-border">/</span>
            <span className="text-theme-primary">STAGE {String(lesson.stageId).padStart(2, "0")}</span>
            <span className="text-theme-border">/</span>
            <span className="text-theme-muted uppercase truncate max-w-[200px] sm:max-w-none">{lesson.id}</span>
          </div>

          <div className="flex items-center space-x-3">
            {isAlreadyCompleted ? (
              <span className="text-theme-primary border border-theme-primary px-2 py-0.5 uppercase tracking-wider">
                COMPLETED (+100 XP)
              </span>
            ) : (
              <button
                onClick={handleMarkComplete}
                className="px-2.5 py-0.5 bg-theme-primary hover:brightness-110 text-theme-bg font-bold uppercase tracking-wider transition"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>

        {/* Lesson Header Title */}
        <div className="space-y-3">
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-theme-text">
            {lesson.title}
          </h1>
          <p className="text-sm sm:text-base text-theme-secondary max-w-3xl font-sans leading-relaxed">
            {lesson.shortSummary}
          </p>
        </div>

        {/* 4 Interactive Modes Tabs */}
        <div className="flex border-b border-theme-border font-mono text-xs overflow-x-auto scrollbar-none">
          {[
            { id: "experiment", label: "01. LAB SANDBOX", icon: FlaskConical },
            { id: "explore", label: "02. CONCEPTS & ANALOGY", icon: Eye },
            { id: "watch", label: "03. PACKET FLOW", icon: Sliders },
            { id: "build", label: "04. CHALLENGE & QUIZ", icon: Wrench },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id as any)}
                className={`py-3 px-4 font-semibold tracking-wider uppercase transition whitespace-nowrap flex items-center space-x-2 border-b-2 ${
                  isActive
                    ? "border-theme-primary text-theme-text bg-theme-card"
                    : "border-transparent text-theme-muted hover:text-theme-text hover:bg-theme-cardElevated"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-theme-primary" : "text-theme-muted"}`} />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            TAB CONTENT 1: LAB SANDBOX (Core Interactive Experience)
           ========================================================================= */}
        {activeMode === "experiment" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Center: Simulator Stage (8 cols on desktop) */}
            <div className="lg:col-span-8 space-y-6">
              {renderSimulator()}

              {/* What Happened / Technical Deep Dive */}
              <div className="p-6 border border-theme-border bg-theme-card space-y-3">
                <div className="flex items-center space-x-2 font-mono text-xs text-theme-primary font-bold uppercase tracking-wider">
                  <Terminal className="w-4 h-4" />
                  <span>What Just Happened? (Under The Hood)</span>
                </div>
                <p className="text-xs sm:text-sm text-theme-secondary font-sans leading-relaxed">
                  {lesson.whatHappened.technicalDeepDive}
                </p>
                <div className="pt-2 space-y-1.5 border-t border-theme-border font-mono text-xs text-theme-muted">
                  {lesson.whatHappened.keyInsights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-theme-primary font-bold">&bull;</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Architectural Inspector & Quick Reference (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Architecture Mental Model */}
              <div className="p-5 border border-theme-border bg-theme-card space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-theme-muted">
                  PHYSICAL ANALOGY
                </span>
                <div className="flex items-center space-x-2.5">
                  <span className="text-2xl">{lesson.analogy.icon}</span>
                  <h3 className="font-display text-sm font-bold text-theme-text">
                    {lesson.analogy.headline}
                  </h3>
                </div>
                <p className="text-xs text-theme-secondary font-sans leading-relaxed">
                  {lesson.analogy.text}
                </p>
              </div>

              {/* Architecture Layer Latency Breakdown */}
              <div className="p-5 border border-theme-border bg-theme-card space-y-3 font-mono text-xs">
                <span className="text-[10px] uppercase tracking-widest text-theme-muted">
                  LATENCY BUDGET MATRIX
                </span>
                <div className="divide-y divide-theme-border">
                  {lesson.visualExplanation.layers.map((layer, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-theme-text">{layer.name}</div>
                        <div className="text-[10px] text-theme-muted">{layer.role}</div>
                      </div>
                      <span className="text-theme-accent font-bold">{layer.latency}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Challenge Link */}
              <button
                onClick={() => setActiveMode("build")}
                className="w-full p-4 border border-theme-border hover:border-theme-primary bg-theme-cardElevated text-left font-mono text-xs space-y-1 transition group"
              >
                <div className="flex justify-between items-center text-theme-muted">
                  <span>STEP 04: SOLVE</span>
                  <span className="text-theme-primary group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
                <div className="font-display text-sm font-bold text-theme-text">
                  Test Knowledge with Challenge & Quiz
                </div>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB CONTENT 2: CONCEPTS & ANALOGY (Understand)
           ========================================================================= */}
        {activeMode === "explore" && (
          <div className="max-w-4xl space-y-8">
            {/* Real World Analogy Card */}
            <div className="p-8 border border-theme-border bg-theme-card space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{lesson.analogy.icon}</span>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-theme-muted">
                    INTUITIVE MENTAL MODEL
                  </span>
                  <h2 className="font-display text-xl font-bold text-theme-text">
                    {lesson.analogy.headline}
                  </h2>
                </div>
              </div>
              <p className="text-sm text-theme-secondary font-sans leading-relaxed pl-12">
                {lesson.analogy.text}
              </p>
            </div>

            {/* Technical Concept Breakdown */}
            <div className="p-8 border border-theme-border bg-theme-card space-y-4">
              <h3 className="font-display text-lg font-bold text-theme-text">
                {lesson.concept.heading}
              </h3>
              <p className="text-sm text-theme-secondary font-sans leading-relaxed">
                {lesson.concept.body}
              </p>
              <div className="grid grid-cols-1 gap-2 pt-2 font-mono text-xs">
                {lesson.concept.bulletPoints.map((point, idx) => (
                  <div key={idx} className="p-3 border border-theme-border bg-theme-bg text-theme-text flex items-start gap-2.5">
                    <span className="text-theme-primary font-bold">&bull;</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Production Case Study */}
            <div className="p-6 border border-theme-border bg-theme-card space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-theme-muted">
                <Building2 className="w-3.5 h-3.5 text-theme-accent" />
                <span>CASE STUDY // {lesson.realWorldExample.company}</span>
              </div>
              <h4 className="font-display text-base font-bold text-theme-text">
                {lesson.realWorldExample.headline}
              </h4>
              <p className="text-xs sm:text-sm text-theme-secondary font-sans leading-relaxed">
                {lesson.realWorldExample.detail}
              </p>
            </div>

            {/* Common Pitfalls */}
            <div className="p-6 border border-theme-border bg-theme-card space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-theme-muted">
                <AlertTriangle className="w-3.5 h-3.5 text-theme-warning" />
                <span>COMMON PITFALLS & MISCONCEPTIONS</span>
              </div>
              <ul className="space-y-2 text-xs text-theme-secondary font-sans">
                {lesson.commonMistakes.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-theme-warning font-bold">&times;</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB CONTENT 3: PACKET FLOW (See It)
           ========================================================================= */}
        {activeMode === "watch" && (
          <div className="max-w-4xl space-y-6">
            <div className="border-b border-theme-border pb-3">
              <h2 className="font-display text-xl font-bold text-theme-text">
                Hop-by-Hop Execution Sequence
              </h2>
              <p className="text-xs text-theme-muted font-mono mt-1">
                Sequential packet events across distributed physical boundaries.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {lesson.steps.map((step, idx) => (
                <div key={step.id} className="p-5 border border-theme-border bg-theme-card space-y-2">
                  <div className="flex items-center justify-between text-theme-muted">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 border border-theme-border bg-theme-bg flex items-center justify-center font-bold text-theme-primary">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-theme-text">{step.title}</span>
                    </div>
                    <span className="text-theme-accent">{step.actor} &rarr; {step.target}</span>
                  </div>
                  <p className="text-xs text-theme-secondary font-sans pl-7 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB CONTENT 4: CHALLENGE & QUIZ (Solve & Review)
           ========================================================================= */}
        {activeMode === "build" && (
          <div className="max-w-4xl space-y-8">
            {/* Architectural Incident Challenge */}
            <div className="p-6 border border-theme-border bg-theme-card space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-theme-primary">
                PRACTICAL ARCHITECTURE CHALLENGE
              </span>
              <h3 className="font-display text-lg font-bold text-theme-text">
                {lesson.challenge.scenario}
              </h3>
              <p className="text-xs sm:text-sm text-theme-secondary font-sans leading-relaxed">
                <strong>Objective:</strong> {lesson.challenge.goal}
              </p>
              <div className="pt-2 space-y-1 font-mono text-xs text-theme-muted">
                <span className="text-[10px] text-theme-muted uppercase">Design Hints:</span>
                {lesson.challenge.hints.map((hint, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-theme-primary">&bull;</span>
                    <span>{hint}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Quiz */}
            <div className="space-y-4">
              <div className="border-b border-theme-border pb-2">
                <h3 className="font-display text-lg font-bold text-theme-text">
                  Knowledge Verification Quiz
                </h3>
              </div>
              <InteractiveQuiz questions={lesson.quiz} lessonId={lesson.id} />
            </div>

            {/* Key Takeaways */}
            <div className="p-6 border border-theme-border bg-theme-card space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-theme-primary font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Key Architectural Takeaways</span>
              </div>
              <ul className="space-y-1.5 font-mono text-xs text-theme-secondary">
                {lesson.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-theme-primary font-bold">&bull;</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Bottom Navigation Rulers: Prev / Next Lesson */}
        <div className="border-t border-theme-border pt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div>
            {prevLessonId ? (
              <Link
                href={`/learn/${prevLessonId}`}
                className="px-4 py-2 border border-theme-border hover:border-theme-primary text-theme-text uppercase tracking-wider transition flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Lesson</span>
              </Link>
            ) : (
              <span className="text-theme-muted">FIRST LESSON</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {!isAlreadyCompleted ? (
              <button
                onClick={handleMarkComplete}
                className="px-4 py-2 bg-theme-primary hover:brightness-110 text-theme-bg font-bold uppercase tracking-wider transition flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Mark Lesson Complete (+100 XP)</span>
              </button>
            ) : (
              <span className="text-theme-primary uppercase tracking-wider">
                ✓ COMPLETED
              </span>
            )}

            {nextLessonId && (
              <Link
                href={`/learn/${nextLessonId}`}
                className="px-4 py-2 bg-theme-cardElevated hover:border-theme-primary border border-theme-border text-theme-text uppercase tracking-wider transition flex items-center gap-2"
              >
                <span>Next Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

