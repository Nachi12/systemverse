"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Server, 
  Database, 
  GitBranch, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  Terminal,
  ShieldAlert
} from "lucide-react";

interface PracticeScenario {
  id: string;
  title: string;
  category: "Troubleshooting" | "Sizing" | "Failure Recovery" | "Trade-offs";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: any;
  symptom: string;
  metrics: { label: string; value: string; isAnomaly?: boolean }[];
  question: string;
  options: { text: string; isCorrect: boolean; explanation: string }[];
  labLink: string;
  labLabel: string;
}

const SCENARIOS: PracticeScenario[] = [
  {
    id: "sc-1",
    title: "Cascading 504 Gateway Timeouts During Traffic Surge",
    category: "Troubleshooting",
    difficulty: "Beginner",
    icon: Server,
    symptom: "During a midday flash sale, incoming RPS doubled. Within 45 seconds, all API endpoints returned HTTP 504 Gateway Timeout. Restarting app servers temporarily cleared errors, but they reappeared within 30 seconds.",
    metrics: [
      { label: "Incoming Traffic", value: "850 req/s", isAnomaly: true },
      { label: "Worker Thread Pool", value: "4 Threads / node" },
      { label: "Queue Buffer Depth", value: "24 / 24 (Saturated)", isAnomaly: true },
      { label: "App Server CPU", value: "98%", isAnomaly: true },
    ],
    question: "What is the primary architectural root cause of the cascading timeouts?",
    options: [
      {
        text: "The DNS server stopped broadcasting Anycast IP addresses.",
        isCorrect: false,
        explanation: "DNS failure would result in DNS_PROBE_FINISHED_NXDOMAIN, not HTTP 504 from the load balancer."
      },
      {
        text: "Worker thread exhaustion: request intake rate exceeded worker throughput, filling the FIFO queue buffer and dropping requests.",
        isCorrect: true,
        explanation: "Correct! When service time is 120ms and concurrency is 4 threads, max capacity is ~33 req/s per server. 850 req/s quickly filled the buffer, triggering gateway timeouts."
      },
      {
        text: "The browser cache expired prematurely.",
        isCorrect: false,
        explanation: "Browser cache does not cause server-side 504 timeouts."
      }
    ],
    labLink: "/learn/client-and-server-architecture",
    labLabel: "Test in Server Simulator"
  },
  {
    id: "sc-2",
    title: "Database Disk I/O Spikes to 100% on Single Column Query",
    category: "Troubleshooting",
    difficulty: "Intermediate",
    icon: Database,
    symptom: "A new feature queries users by email address. The database CPU jumped from 15% to 99%, read latency rose from 3ms to 420ms, and disk read IOPS hit provisioned thresholds.",
    metrics: [
      { label: "Execution Plan", value: "FULL TABLE SCAN", isAnomaly: true },
      { label: "Rows Examined / Query", value: "1,200,000 tuples", isAnomaly: true },
      { label: "Query Latency", value: "420 ms", isAnomaly: true },
      { label: "Index Status", value: "PRIMARY KEY (id) only" },
    ],
    question: "How should you immediately resolve this performance regression?",
    options: [
      {
        text: "Create a secondary B-Tree index on the `email` column to enable O(log N) index seeks.",
        isCorrect: true,
        explanation: "Correct! Without an index on `email`, the engine must read every page from disk (Table Scan O(N)). A B-Tree index enables direct tree seek in <2ms."
      },
      {
        text: "Migrate the entire PostgreSQL database to MongoDB.",
        isCorrect: false,
        explanation: "Unindexed queries will scan all documents in MongoDB just like in PostgreSQL."
      },
      {
        text: "Increase server RAM from 16GB to 128GB.",
        isCorrect: false,
        explanation: "Vertical scaling masks the missing index at immense cost without fixing the O(N) algorithmic bottleneck."
      }
    ],
    labLink: "/learn/database-indexes-and-scans",
    labLabel: "Test in Database Index Simulator"
  },
  {
    id: "sc-3",
    title: "Customers Report Account Balance Reverted Right After Checkout",
    category: "Failure Recovery",
    difficulty: "Intermediate",
    icon: GitBranch,
    symptom: "A customer deposited $100. The success screen displayed balance $200. When they refreshed their account page 1 second later, the balance displayed the old $100 value. Refreshing again 3 seconds later displayed $200.",
    metrics: [
      { label: "Primary Write Latency", value: "12 ms (Async ACK)" },
      { label: "Replication Lag", value: "1,850 ms", isAnomaly: true },
      { label: "Read Routed To", value: "Read Replica 02", isAnomaly: true },
    ],
    question: "Which consistency mechanism eliminates this temporal anomaly?",
    options: [
      {
        text: "Turn off all database backups.",
        isCorrect: false,
        explanation: "Backups are vital for disaster recovery and unrelated to replica lag."
      },
      {
        text: "Implement 'Read-Your-Own-Writes' consistency by routing immediate user reads to the Primary or pinning to a replica that has caught up with the WAL write timestamp.",
        isCorrect: true,
        explanation: "Correct! When users modify their own data, routing subsequent reads to the primary for 5 seconds guarantees they never see stale reads caused by asynchronous replication lag."
      },
      {
        text: "Switch HTTP from HTTPS to plain HTTP.",
        isCorrect: false,
        explanation: "Encryption has nothing to do with database replication lag."
      }
    ],
    labLink: "/learn/primary-replica-replication",
    labLabel: "Test in Replication Simulator"
  },
  {
    id: "sc-4",
    title: "Cache Stampede (Thundering Herd) Drops Database During Flash Event",
    category: "Trade-offs",
    difficulty: "Advanced",
    icon: Zap,
    symptom: "A hot cache key holding the homepage product catalog had a 10-minute TTL. The moment the key expired, 50,000 concurrent requests all missed the cache simultaneously and queried the database, crashing it.",
    metrics: [
      { label: "Cache Hit Ratio", value: "0% for 5 seconds", isAnomaly: true },
      { label: "DB Connections", value: "5,000 (Exhausted)", isAnomaly: true },
      { label: "Cache Key Status", value: "EXPIRED (TTL 0s)", isAnomaly: true },
    ],
    question: "What pattern prevents this Thundering Herd stampede when a hot key expires?",
    options: [
      {
        text: "Distributed Mutex Lock (Mutex on Cache Miss) or Probabilistic Early Expiration (XFetch), allowing only 1 worker to rebuild the cache while others serve slightly stale data.",
        isCorrect: true,
        explanation: "Correct! Mutex locking ensures only a single thread hits the database to re-warm the cache, while other requests either wait or read the previous cached value."
      },
      {
        text: "Delete Redis and query PostgreSQL directly for all requests.",
        isCorrect: false,
        explanation: "Removing the cache completely would instantly melt down the database under 50k RPS."
      },
      {
        text: "Set the TTL to 0 so the key never caches.",
        isCorrect: false,
        explanation: "Setting TTL to 0 disables caching entirely."
      }
    ],
    labLink: "/learn/cache-aside-and-redis",
    labLabel: "Test in Cache Simulator"
  }
];

export default function PracticePage() {
  const { addXp } = useProgressStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedScenarioId, setExpandedScenarioId] = useState<string | null>("sc-1");
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [solvedScenarios, setSolvedScenarios] = useState<string[]>([]);

  const filteredScenarios = selectedCategory === "All"
    ? SCENARIOS
    : SCENARIOS.filter((s) => s.category === selectedCategory);

  const handleSelectOption = (scenarioId: string, optionIdx: number, isCorrect: boolean) => {
    setUserAnswers((prev) => ({ ...prev, [scenarioId]: optionIdx }));
    if (isCorrect && !solvedScenarios.includes(scenarioId)) {
      setSolvedScenarios((prev) => [...prev, scenarioId]);
      addXp(150);
    }
  };

  return (
    <div className="w-full bg-theme-bg text-theme-text min-h-screen py-10 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="border-b border-theme-border pb-6 space-y-3">
          <div className="flex items-center space-x-3 text-xs font-mono text-theme-muted uppercase tracking-widest">
            <span>PRACTICE</span>
            <span>/</span>
            <span className="text-theme-primary">INCIDENT POST-MORTEMS</span>
            <span>/</span>
            <span>DEBUGGING</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-theme-text">
            Troubleshooting & Failure Scenarios
          </h1>

          <p className="text-sm sm:text-base text-theme-secondary max-w-2xl font-sans leading-relaxed">
            Investigate production anomalies, analyze telemetry indicators, and choose the correct architectural remediation.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 font-mono text-xs border-b border-theme-border pb-4">
          {["All", "Troubleshooting", "Failure Recovery", "Trade-offs"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 uppercase tracking-wider transition border ${
                selectedCategory === cat
                  ? "border-theme-primary bg-theme-primary/10 text-theme-primary font-bold"
                  : "border-theme-border bg-theme-card text-theme-muted hover:text-theme-text hover:border-theme-borderLight"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Scenarios Accordion List */}
        <div className="space-y-4">
          {filteredScenarios.map((scenario) => {
            const isExpanded = expandedScenarioId === scenario.id;
            const answeredIdx = userAnswers[scenario.id];
            const isSolved = solvedScenarios.includes(scenario.id);

            return (
              <div
                key={scenario.id}
                className={`border transition duration-150 ${
                  isSolved
                    ? "border-theme-primary/50 bg-theme-card"
                    : isExpanded
                    ? "border-theme-borderLight bg-theme-card"
                    : "border-theme-border bg-theme-card hover:border-theme-borderLight"
                }`}
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedScenarioId(isExpanded ? null : scenario.id)}
                  className="p-5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-3 text-xs font-mono">
                      <span className="text-theme-primary font-bold">{scenario.category}</span>
                      <span className="text-theme-border">•</span>
                      <span className="text-theme-muted uppercase">[{scenario.difficulty}]</span>
                      {isSolved && (
                        <span className="text-theme-primary border border-theme-primary px-1 text-[10px]">
                          SOLVED (+150 XP)
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-bold text-theme-text">
                      {scenario.title}
                    </h3>
                  </div>

                  <div className="p-1 border border-theme-border text-theme-text font-mono shrink-0 bg-theme-cardElevated">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Incident Report */}
                {isExpanded && (
                  <div className="px-5 pb-6 pt-2 border-t border-theme-border bg-theme-bg space-y-5">
                    {/* Incident Report Box */}
                    <div className="p-4 border border-theme-border bg-theme-card space-y-2 font-mono text-xs">
                      <div className="text-theme-muted uppercase font-bold flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-theme-primary" />
                        <span>INCIDENT SYMPTOM & FIELD TELEMETRY</span>
                      </div>
                      <p className="text-theme-secondary font-sans text-xs sm:text-sm leading-relaxed">
                        {scenario.symptom}
                      </p>
                    </div>

                    {/* Telemetry Snapshot Grid */}
                    <div>
                      <div className="text-[10px] font-mono uppercase text-theme-muted mb-2 font-bold">
                        TELEMETRY METRICS
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                        {scenario.metrics.map((m, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 border ${
                              m.isAnomaly
                                ? "border-theme-accent bg-theme-accent/10 text-theme-text"
                                : "border-theme-border bg-theme-card text-theme-muted"
                            }`}
                          >
                            <div className="text-[10px] text-theme-muted uppercase">{m.label}</div>
                            <div className="font-bold mt-0.5">{m.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Diagnostic Question */}
                    <div className="space-y-3 pt-2">
                      <h4 className="font-display text-sm font-bold text-theme-text">
                        {scenario.question}
                      </h4>

                      <div className="space-y-2 font-mono text-xs">
                        {scenario.options.map((opt, optIdx) => {
                          const isSelected = answeredIdx === optIdx;

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(scenario.id, optIdx, opt.isCorrect)}
                              className={`w-full p-3.5 border text-left transition ${
                                isSelected
                                  ? opt.isCorrect
                                    ? "border-theme-primary bg-theme-primary/15 text-theme-text"
                                    : "border-theme-error/50 bg-theme-card text-theme-error/80"
                                  : "border-theme-border bg-theme-card text-theme-secondary hover:border-theme-primary/50"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span>{opt.text}</span>
                                {isSelected && (
                                  <span className={`text-[10px] font-bold border px-1.5 py-0.5 ${opt.isCorrect ? "border-theme-primary text-theme-primary" : "border-theme-error text-theme-error"}`}>
                                    {opt.isCorrect ? "CORRECT" : "INCORRECT"}
                                  </span>
                                )}
                              </div>

                              {isSelected && (
                                <p className="mt-2 pt-2 border-t border-theme-border text-xs text-theme-secondary font-sans leading-relaxed">
                                  {opt.explanation}
                                </p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Launch Lab Sandbox */}
                    <div className="pt-2 flex justify-between items-center font-mono text-xs">
                      <span className="text-theme-muted">Want to test this scenario interactively?</span>
                      <Link
                        href={scenario.labLink}
                        className="text-theme-primary hover:underline uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <span>{scenario.labLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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
