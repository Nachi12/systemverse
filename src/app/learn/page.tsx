"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CURRICULUM_STAGES } from "@/lib/curriculum/curriculumData";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Terminal,
  Database,
  Server,
  Zap,
  Globe,
  Layers,
  GitBranch,
  Sliders
} from "lucide-react";

export default function LearnPage() {
  const { completedLessons, initFromStorage } = useProgressStore();
  const [mounted, setMounted] = useState(false);
  // Default first 2 stages expanded
  const [expandedStages, setExpandedStages] = useState<number[]>([1, 2]);

  useEffect(() => {
    initFromStorage();
    setMounted(true);
  }, [initFromStorage]);

  const completedSet = new Set(mounted ? completedLessons : []);

  const toggleStage = (stageId: number) => {
    setExpandedStages((prev) =>
      prev.includes(stageId) ? prev.filter((id) => id !== stageId) : [...prev, stageId]
    );
  };

  const getSimBadge = (type?: string) => {
    switch (type) {
      case "database": return <span className="inline-flex items-center gap-1 text-[10px] font-mono text-theme-accent bg-theme-accent/10 border border-theme-accent/30 px-1.5 py-0.5"><Database className="w-3 h-3" /> DB LAB</span>;
      case "server": return <span className="inline-flex items-center gap-1 text-[10px] font-mono text-theme-accent bg-theme-accent/10 border border-theme-accent/30 px-1.5 py-0.5"><Server className="w-3 h-3" /> SERVER LAB</span>;
      case "cache": return <span className="inline-flex items-center gap-1 text-[10px] font-mono text-theme-accent bg-theme-accent/10 border border-theme-accent/30 px-1.5 py-0.5"><Zap className="w-3 h-3" /> CACHE LAB</span>;
      case "queue": return <span className="inline-flex items-center gap-1 text-[10px] font-mono text-theme-accent bg-theme-accent/10 border border-theme-accent/30 px-1.5 py-0.5"><Layers className="w-3 h-3" /> QUEUE LAB</span>;
      case "network": return <span className="inline-flex items-center gap-1 text-[10px] font-mono text-theme-accent bg-theme-accent/10 border border-theme-accent/30 px-1.5 py-0.5"><Globe className="w-3 h-3" /> PACKET LAB</span>;
      case "cdn": return <span className="inline-flex items-center gap-1 text-[10px] font-mono text-theme-accent bg-theme-accent/10 border border-theme-accent/30 px-1.5 py-0.5"><Globe className="w-3 h-3" /> CDN LAB</span>;
      case "replication": return <span className="inline-flex items-center gap-1 text-[10px] font-mono text-theme-accent bg-theme-accent/10 border border-theme-accent/30 px-1.5 py-0.5"><GitBranch className="w-3 h-3" /> REPLICA LAB</span>;
      case "load_balancer": return <span className="inline-flex items-center gap-1 text-[10px] font-mono text-theme-accent bg-theme-accent/10 border border-theme-accent/30 px-1.5 py-0.5"><Sliders className="w-3 h-3" /> BALANCER LAB</span>;
      default: return null;
    }
  };

  return (
    <div className="w-full bg-theme-bg text-theme-text min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Editorial Header */}
        <div className="border-b border-theme-border pb-8 space-y-4">
          <div className="flex items-center space-x-3 text-xs font-mono text-theme-muted uppercase tracking-widest">
            <span>CURRICULUM</span>
            <span>/</span>
            <span className="text-theme-primary">12 STAGES</span>
            <span>/</span>
            <span>PROGRESSIVE MASTERY</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-theme-text">
            System Design Learning Roadmap
          </h1>

          <p className="text-sm sm:text-base text-theme-secondary max-w-2xl font-sans leading-relaxed">
            Follow a structured architectural progression from single-machine fundamentals to high-throughput globally distributed systems.
          </p>

          <div className="flex items-center space-x-4 pt-2 text-xs font-mono text-theme-muted">
            <div>
              TOTAL COMPLETED: <span className="text-theme-primary font-bold">{completedLessons.length}</span> / {CURRICULUM_STAGES.reduce((a, s) => a + s.lessons.length, 0)}
            </div>
            <span>•</span>
            <button
              onClick={() => {
                if (expandedStages.length === CURRICULUM_STAGES.length) {
                  setExpandedStages([]);
                } else {
                  setExpandedStages(CURRICULUM_STAGES.map((s) => s.id));
                }
              }}
              className="text-theme-muted hover:text-theme-text underline transition"
            >
              {expandedStages.length === CURRICULUM_STAGES.length ? "Collapse All Stages" : "Expand All Stages"}
            </button>
          </div>
        </div>

        {/* Vertical Timeline of 12 Stages */}
        <div className="space-y-4">
          {CURRICULUM_STAGES.map((stage) => {
            const isExpanded = expandedStages.includes(stage.id);
            const stageCompletedCount = stage.lessons.filter((l) => completedSet.has(l.id)).length;
            const isAllCompleted = stageCompletedCount === stage.lessons.length && stage.lessons.length > 0;
            const stageNumberStr = String(stage.id).padStart(2, "0");

            return (
              <div
                key={stage.id}
                className={`border transition duration-150 ${
                  isAllCompleted
                    ? "border-theme-primary/50 bg-theme-card"
                    : "border-theme-border bg-theme-card hover:border-theme-borderLight"
                }`}
              >
                {/* Stage Header Banner */}
                <div
                  onClick={() => toggleStage(stage.id)}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-3 text-xs font-mono">
                      <span className="font-bold text-theme-primary">
                        STAGE {stageNumberStr}
                      </span>
                      {stage.prerequisites.length > 0 && (
                        <>
                          <span className="text-theme-border">•</span>
                          <span className="text-theme-muted">
                            PREREQ: STAGE {stage.prerequisites.map((p) => String(p).padStart(2, "0")).join(", ")}
                          </span>
                        </>
                      )}
                      {isAllCompleted && (
                        <span className="text-[10px] text-theme-primary border border-theme-primary px-1.5 py-0.2">
                          MASTERED
                        </span>
                      )}
                    </div>

                    <h2 className="font-display text-lg sm:text-xl font-bold text-theme-text tracking-tight">
                      {stage.title.replace(/^Stage \d+:\s*/, "")}
                    </h2>

                    <p className="text-xs text-theme-secondary font-sans max-w-2xl">
                      {stage.subtitle}
                    </p>
                  </div>

                  {/* Stage Metrics & Expand/Collapse Toggle */}
                  <div className="flex items-center space-x-4 font-mono text-xs text-theme-muted shrink-0 self-end sm:self-center">
                    <span>
                      {stageCompletedCount} / {stage.lessons.length} DONE
                    </span>
                    <div className="p-1 border border-theme-border text-theme-text bg-theme-cardElevated">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Lesson List */}
                {isExpanded && (
                  <div className="border-t border-theme-border bg-theme-bg divide-y divide-theme-border">
                    {stage.lessons.map((lesson) => {
                      const isDone = completedSet.has(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-theme-cardElevated transition group"
                        >
                          <div className="space-y-1.5 max-w-2xl">
                            <div className="flex items-center space-x-2.5">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-theme-primary shrink-0" />
                              ) : (
                                <div className="w-3.5 h-3.5 border border-theme-border shrink-0" />
                              )}

                              <h3 className="font-display text-sm font-bold text-theme-text group-hover:text-theme-primary transition">
                                {lesson.title}
                              </h3>

                              {getSimBadge(lesson.simulatorType)}
                            </div>

                            <p className="text-xs text-theme-secondary font-sans pl-6 leading-relaxed">
                              {lesson.description}
                            </p>
                          </div>

                          <div className="flex items-center space-x-3 pl-6 sm:pl-0 shrink-0 font-mono text-xs">
                            <span className="text-[11px] text-theme-muted flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {lesson.estimatedMinutes}M
                            </span>

                            <Link
                              href={`/learn/${lesson.id}`}
                              className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition ${
                                isDone
                                  ? "border border-theme-border text-theme-muted hover:text-theme-text"
                                  : "bg-theme-primary hover:brightness-110 text-theme-bg font-bold"
                              }`}
                            >
                              <span>{isDone ? "Review" : "Launch"}</span>
                              <span className="ml-1">&rarr;</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
