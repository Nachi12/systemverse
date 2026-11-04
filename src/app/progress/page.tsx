"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useProgressStore, calculateLevel } from "@/lib/store/useProgressStore";
import { CURRICULUM_STAGES } from "@/lib/curriculum/curriculumData";
import { 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Terminal,
  Award,
  Zap,
  Target
} from "lucide-react";

export default function ProgressPage() {
  const { xp, streak, completedLessons, initFromStorage } = useProgressStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initFromStorage();
    setMounted(true);
  }, [initFromStorage]);

  const levelInfo = calculateLevel(mounted ? xp : 150);
  const totalLessons = CURRICULUM_STAGES.reduce((acc, s) => acc + s.lessons.length, 0);
  const completedCount = mounted ? completedLessons.length : 0;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const CORE_CONCEPTS = [
    { title: "Browser URL Parsing & Recursive DNS Resolution", stage: 1, completed: completedLessons.includes("what-happens-when-website-loads") },
    { title: "TCP 3-Way Handshake & TLS 1.3 Key Exchange", stage: 1, completed: completedLessons.includes("what-happens-when-website-loads") },
    { title: "Stateless Application Servers & Worker Threads", stage: 1, completed: completedLessons.includes("client-and-server-architecture") },
    { title: "Propagation Latency vs Network Bandwidth", stage: 1, completed: completedLessons.includes("latency-vs-bandwidth") },
    { title: "B-Tree Indexes vs Sequential Full Table Scans", stage: 4, completed: completedLessons.includes("database-indexes-and-scans") },
    { title: "ACID Transactions & Row Lock Isolation", stage: 4, completed: completedLessons.includes("acid-transactions-and-isolation") },
    { title: "Asynchronous Replication Lag & Stale Reads", stage: 4, completed: completedLessons.includes("primary-replica-replication") },
    { title: "Redis Cache-Aside Pattern & Sub-2ms Latency", stage: 5, completed: completedLessons.includes("cache-aside-and-redis") },
    { title: "Least Connections & Round Robin Load Balancing", stage: 6, completed: completedLessons.includes("load-balancing-algorithms") },
    { title: "Automatic Cluster Health Checks & Failover", stage: 6, completed: completedLessons.includes("health-checks-and-failover") },
    { title: "Message Brokers & Worker Thread Decoupling", stage: 7, completed: completedLessons.includes("message-queues-and-decoupling") },
    { title: "Dead Letter Queues (DLQ) & Exponential Retries", stage: 7, completed: completedLessons.includes("retries-and-dead-letter-queues") },
    { title: "Global CDN Edge Caching & Anycast PoPs", stage: 8, completed: completedLessons.includes("global-cdn-edge-caching") },
  ];

  return (
    <div className="w-full bg-theme-bg text-theme-text min-h-screen py-10 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="border-b border-theme-border pb-6 space-y-3">
          <div className="flex items-center space-x-3 text-xs font-mono text-theme-muted uppercase tracking-widest">
            <span>PROGRESS</span>
            <span>/</span>
            <span className="text-theme-primary">COMPETENCY MATRIX</span>
            <span>/</span>
            <span>ANALYTICS</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-theme-text">
            Architectural Competency & Mastery
          </h1>

          <p className="text-sm sm:text-base text-theme-secondary max-w-2xl font-sans leading-relaxed">
            Verified mastery across the 12 stages of distributed systems engineering.
          </p>
        </div>

        {/* Telemetry Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-5 border border-theme-border bg-theme-card space-y-2">
            <div className="flex items-center justify-between text-theme-muted">
              <span>EXPERIENCE POINTS</span>
              <Zap className="w-3.5 h-3.5 text-theme-primary" />
            </div>
            <div className="text-2xl font-bold text-theme-text">{mounted ? xp : 150} XP</div>
            <div className="text-theme-muted text-[11px]">
              LVL {levelInfo.level} &bull; <strong className="text-theme-text">{levelInfo.title}</strong>
            </div>
          </div>

          <div className="p-5 border border-theme-border bg-theme-card space-y-2">
            <div className="flex items-center justify-between text-theme-muted">
              <span>CURRICULUM COMPLETION</span>
              <Terminal className="w-3.5 h-3.5 text-theme-accent" />
            </div>
            <div className="text-2xl font-bold text-theme-primary">{progressPercent}%</div>
            <div className="text-theme-muted text-[11px]">
              {completedCount} / {totalLessons} Lessons Finished
            </div>
          </div>

          <div className="p-5 border border-theme-border bg-theme-card space-y-2">
            <div className="flex items-center justify-between text-theme-muted">
              <span>DAILY STREAK</span>
              <Award className="w-3.5 h-3.5 text-theme-accent" />
            </div>
            <div className="text-2xl font-bold text-theme-text">{mounted ? streak : 1} DAYS</div>
            <div className="text-theme-muted text-[11px]">
              Learning Cadence Active
            </div>
          </div>
        </div>

        {/* Verified Architectural Competencies Grid */}
        <div className="p-6 border border-theme-border bg-theme-card space-y-4">
          <div className="flex items-center justify-between border-b border-theme-border pb-3">
            <div>
              <h3 className="font-display text-base font-bold text-theme-text flex items-center gap-2">
                <Award className="w-4 h-4 text-theme-primary" />
                Verified Architectural Competencies
              </h3>
              <p className="text-xs text-theme-muted font-sans mt-0.5">
                Validated through interactive laboratory simulations and diagnostic assessments.
              </p>
            </div>
            <span className="font-mono text-xs text-theme-primary">
              {CORE_CONCEPTS.filter((c) => c.completed).length} / {CORE_CONCEPTS.length} VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs">
            {CORE_CONCEPTS.map((concept, idx) => (
              <div
                key={idx}
                className={`p-3 border flex items-center justify-between transition ${
                  concept.completed
                    ? "border-theme-primary/40 bg-theme-primary/10 text-theme-text"
                    : "border-theme-border bg-theme-bg text-theme-muted"
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate pr-2">
                  {concept.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-theme-primary shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 border border-theme-border shrink-0" />
                  )}
                  <span className="truncate">{concept.title}</span>
                </div>
                <span className="text-[10px] text-theme-muted shrink-0">
                  STAGE 0{concept.stage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Recommended Step */}
        <div className="p-6 border border-theme-border bg-theme-card space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-theme-primary">
            RECOMMENDED NEXT STEP
          </span>
          <h3 className="font-display text-base sm:text-lg font-bold text-theme-text">
            Continue Your Architectural Progression
          </h3>
          <p className="text-xs sm:text-sm text-theme-secondary font-sans leading-relaxed">
            Deepen your understanding of system failure modes with practical incident post-mortems or construct a distributed topology from scratch in the Playground.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 font-mono text-xs">
            <Link
              href="/practice"
              className="px-4 py-2 bg-theme-primary hover:brightness-110 text-theme-bg font-bold uppercase tracking-wider transition flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Practice Incident Scenarios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/playground"
              className="px-4 py-2 border border-theme-border hover:border-theme-primary text-theme-text uppercase tracking-wider transition flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-theme-accent" />
              <span>Open Architecture Canvas</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
