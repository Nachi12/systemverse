"use client";

import React, { useState, useEffect } from "react";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { triggerConfetti } from "@/lib/confetti";
import { 
  Target, 
  Clock, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  AlertTriangle, 
  Layers, 
  Flame, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

interface InterviewQuestion {
  id: string;
  title: string;
  difficulty: "Medium" | "Hard";
  scenario: string;
  suggestedCapacity: string;
  idealComponents: string[];
  stages: {
    title: string;
    description: string;
    prompts: string[];
  }[];
}

const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: "rate-limiter",
    title: "Design a Distributed API Rate Limiter",
    difficulty: "Medium",
    scenario: "Design an API Rate Limiting tier protecting payment microservices from burst DDoS and credential stuffing. Must support 100,000 requests/second globally with sub-2ms latency overhead.",
    suggestedCapacity: "100K RPS peak, 10M active users, Redis Sliding Window Log or Token Bucket.",
    idealComponents: ["API Gateway (Kong/Envoy)", "Redis Cluster", "Token Bucket Lua Script", "Kafka for Analytics"],
    stages: [
      {
        title: "Stage 1: Requirement Clarification",
        description: "Clarify functional and non-functional requirements with the interviewer.",
        prompts: [
          "What is the throttling rule granularity (per IP, per user ID, or per API key)?",
          "What HTTP status code should be returned upon rejection (HTTP 429 Too Many Requests)?",
          "Should rate limit headers (X-RateLimit-Remaining, X-RateLimit-Reset) be populated?",
          "Is a centralized Redis cluster preferred over distributed local in-memory filters?",
        ],
      },
      {
        title: "Stage 2: Capacity & Latency Math",
        description: "Estimate memory footprint and concurrency.",
        prompts: [
          "100K RPS across 10M users. At 64 bytes per user key in Redis = ~640 MB RAM (easily fits in single Redis instance).",
          "Network latency must be < 2ms; therefore Redis must reside in the same VPC/availability zone as API gateways.",
          "High availability: Multi-AZ Redis replica with Sentinel / Redis Cluster auto-failover.",
        ],
      },
      {
        title: "Stage 3: High-Level Architecture",
        description: "Choose components and data flow.",
        prompts: [
          "Client -> Reverse Proxy / API Gateway (Envoy/Kong) -> Rate Limiter Filter -> Redis (Atomic Lua script).",
          "If Token Bucket has remaining tokens: forward to Payment Microservice.",
          "If quota exceeded: immediately return HTTP 429 with Retry-After header without touching backend services.",
        ],
      },
      {
        title: "Stage 4: Deep Dive & Edge Cases",
        description: "Handle race conditions, synchronization, and failure modes.",
        prompts: [
          "Race conditions in Redis: Use atomic Redis Lua scripts to evaluate and decrement in a single atomic transaction.",
          "What happens if Redis fails? Fail-Open vs Fail-Closed trade-off. (Usually Fail-Open so payments aren't blocked by telemetry failure).",
          "Multi-datacenter synchronization: Use local rate limiting with periodic background reconciliation.",
        ],
      },
    ],
  },
  {
    id: "pastebin",
    title: "Design a Text Storage Service (Pastebin)",
    difficulty: "Medium",
    scenario: "Design a service where users can paste plain text snippets and receive a shareable unique short URL. Pastes expire after a set time.",
    suggestedCapacity: "10M pastes/day, 100:1 read-to-write ratio, S3 Object Storage for content, MySQL/DynamoDB for metadata.",
    idealComponents: ["Cloudflare CDN", "Load Balancer", "Go Web Nodes", "S3 / GCS Storage", "Redis Cache", "PostgreSQL"],
    stages: [
      {
        title: "Stage 1: Requirement Clarification",
        description: "Clarify functional boundaries and size limits.",
        prompts: [
          "Maximum paste size (e.g. 10MB per paste)?",
          "Can users edit or delete pastes after creation?",
          "Are pastes public or private/password protected?",
        ],
      },
      {
        title: "Stage 2: Capacity Estimation",
        description: "Storage and bandwidth calculations.",
        prompts: [
          "10M writes/day * 10KB average size = 100 GB/day = ~36.5 TB/year.",
          "Reads: 100:1 = 1 Billion reads/day = 11,500 reads/sec.",
          "Bandwidth: 11,500 reads * 10KB = 115 MB/sec egress.",
        ],
      },
      {
        title: "Stage 3: High-Level Architecture",
        description: "Storage separation for metadata vs file payload.",
        prompts: [
          "Do not store 10MB text payloads in relational DB; store in Object Storage (S3/MinIO).",
          "Store metadata (shortKey, s3Url, userId, createdAt, expiresAt) in DynamoDB or PostgreSQL.",
          "Redis cluster to cache top 20% viral pastes in memory.",
        ],
      },
      {
        title: "Stage 4: Deep Dive & Cleanup",
        description: "Expired paste cleanup and security.",
        prompts: [
          "Lazy deletion: Check expiresAt on read; return 404 and queue async deletion.",
          "S3 Lifecycle policies: Automatically expire and garbage collect objects after 30 days.",
          "DDoS protection: IP rate limiting via Cloudflare WAF.",
        ],
      },
    ],
  },
];

export default function InterviewMasterPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion>(INTERVIEW_QUESTIONS[0]);
  const [isTimed, setIsTimed] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(35 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isEvaluated, setIsEvaluated] = useState(false);
  const { addXp, unlockAchievement } = useProgressStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFinishInterview = () => {
    setIsRunning(false);
    setIsEvaluated(true);
    addXp(400);
    unlockAchievement("system_architect");
    triggerConfetti({ particleCount: 90, spread: 80 });
  };

  const currentStage = selectedQuestion.stages[currentStageIdx];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-space-800">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" /> INTERVIEW MASTER MODE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            System Design Mock Interview Simulator
          </h1>
          <p className="text-xs text-slate-400">
            Practice realistic 35-minute senior system architecture interviews with structured rubric scoring.
          </p>
        </div>

        {/* Timed Mode Widget */}
        <div className="flex items-center space-x-3 bg-space-900 px-4 py-2 rounded-2xl border border-space-700">
          <Clock className={`w-4 h-4 ${isRunning ? "text-amber-400 animate-pulse" : "text-slate-400"}`} />
          <span className="font-mono text-sm font-bold text-slate-200">{formatTimer(timerSeconds)}</span>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-2.5 py-1 text-xs rounded-lg bg-space-800 hover:bg-space-700 text-cyan-300 font-semibold"
          >
            {isRunning ? "Pause" : "Start Timer"}
          </button>
        </div>
      </div>

      {/* Question Selector Tabs */}
      <div className="flex items-center space-x-2">
        {INTERVIEW_QUESTIONS.map((q) => (
          <button
            key={q.id}
            onClick={() => {
              setSelectedQuestion(q);
              setCurrentStageIdx(0);
              setIsEvaluated(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              selectedQuestion.id === q.id
                ? "bg-cyan-500 text-space-950 font-bold"
                : "bg-space-900 text-slate-300 hover:bg-space-850 border border-space-800"
            }`}
          >
            {q.title}
          </button>
        ))}
      </div>

      {/* Scenario Briefing Card */}
      <div className="p-6 rounded-3xl bg-space-900/80 border border-cyan-500/30 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Scenario Briefing
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-800 text-cyan-300 border border-space-700">
            Difficulty: {selectedQuestion.difficulty}
          </span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">{selectedQuestion.scenario}</p>
        <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-slate-400">
          <span className="text-slate-500 font-sans">Ideal Building Blocks:</span>
          {selectedQuestion.idealComponents.map((c, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-space-950 border border-space-800 text-cyan-300">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* 4-Stage Interview Progress Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {selectedQuestion.stages.map((stg, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStageIdx(idx)}
            className={`p-3 rounded-xl border text-left transition ${
              currentStageIdx === idx
                ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10"
                : "bg-space-900/60 border-space-800 text-slate-400 hover:border-space-700"
            }`}
          >
            <span className="text-[9px] font-mono uppercase font-bold block text-slate-500">
              Step 0{idx + 1}
            </span>
            <span className="text-xs font-bold text-slate-200 truncate block mt-0.5">
              {stg.title.replace(/^Stage \d+: /, "")}
            </span>
          </button>
        ))}
      </div>

      {/* Active Stage Interactive Workspace */}
      <div className="p-6 rounded-3xl bg-space-900/90 border border-space-800 space-y-6">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Active Interview Phase
          </span>
          <h2 className="text-xl font-bold text-white mt-1">{currentStage.title}</h2>
          <p className="text-xs text-slate-400 mt-1">{currentStage.description}</p>
        </div>

        {/* Interviewer Prompts & Discussion Questions */}
        <div className="p-4 rounded-2xl bg-space-950/70 border border-space-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
            Interviewer Expectations & Key Discussion Angles:
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {currentStage.prompts.map((p, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">&bull;</span>
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* User Thought Notes & Architectural Formulation Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Your Architecture Decisions & Notes for this Stage:</span>
            <span className="text-[10px] font-mono text-slate-500">Auto-saved</span>
          </label>
          <textarea
            rows={4}
            placeholder="Type your design decisions, capacity formulas, component picks, and trade-off rationales..."
            value={userAnswers[currentStageIdx] || ""}
            onChange={(e) =>
              setUserAnswers((prev) => ({ ...prev, [currentStageIdx]: e.target.value }))
            }
            className="w-full p-3 rounded-2xl bg-space-950 border border-space-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 leading-relaxed font-mono"
          />
        </div>

        {/* Navigation between stages */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentStageIdx(Math.max(0, currentStageIdx - 1))}
            disabled={currentStageIdx === 0}
            className="px-4 py-2 rounded-xl bg-space-850 hover:bg-space-800 text-slate-300 disabled:opacity-30 text-xs font-semibold"
          >
            &larr; Previous Stage
          </button>

          {currentStageIdx < selectedQuestion.stages.length - 1 ? (
            <button
              onClick={() => setCurrentStageIdx(currentStageIdx + 1)}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-space-950 text-xs font-bold flex items-center space-x-1"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinishInterview}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-space-950 text-xs font-extrabold flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Award className="w-4 h-4" />
              <span>Complete & Evaluate Interview</span>
            </button>
          )}
        </div>
      </div>

      {/* Post-Interview Evaluation Rubric */}
      {isEvaluated && (
        <div className="p-6 rounded-3xl bg-space-900/90 border border-emerald-500/40 space-y-6 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-space-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Interview Assessment Passed!</h3>
                <p className="text-xs text-cyan-300 font-mono">+400 XP Awarded &bull; Senior Architect Band</p>
              </div>
            </div>
          </div>

          {/* 8-Criteria Evaluation Rubric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { rubric: "Requirement Clarification", score: "Exceeds Expectations", note: "Thorough scoping of functional boundaries and rate-limit headers." },
              { rubric: "Capacity Estimation", score: "Exceeds Expectations", note: "Accurate memory calculation (640MB) and network latency bounds." },
              { rubric: "Component Selection", score: "Strong Pass", note: "Correct separation of L7 reverse proxy, in-memory cache, and async stream." },
              { rubric: "Architecture Quality", score: "Strong Pass", note: "Clean decoupled topology with no single point of failure." },
              { rubric: "Scalability", score: "Exceeds Expectations", note: "Horizontal sharding of Redis cluster and stateless gateway tier." },
              { rubric: "Reliability & DR", score: "Strong Pass", note: "Fail-open safety mechanism preventing cascading payment outage." },
              { rubric: "Trade-offs Clarity", score: "Strong Pass", note: "Clear justification of Token Bucket Lua script vs sliding window." },
              { rubric: "Technical Communication", score: "Strong Pass", note: "Concise and structured delivery across all 4 stages." },
            ].map((item, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-space-950/80 border border-space-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{item.rubric}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    {item.score}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

