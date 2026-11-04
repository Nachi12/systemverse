import React, { useState } from "react";
import { 
  Database, 
  Server, 
  Zap, 
  Copy, 
  Split, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw,
  Layers
} from "lucide-react";

interface ScalingStage {
  stepNumber: number;
  title: string;
  architectureDescription: string;
  bottleneckSolved: string;
  newComplexityIntroduced: string;
  estimatedLatencyMs: number;
  maxThroughputQps: number;
  activeComponents: {
    appNodes: number;
    hasIndex: boolean;
    hasCache: boolean;
    readReplicas: number;
    shardCount: number;
  };
}

const STAGES: ScalingStage[] = [
  {
    stepNumber: 1,
    title: "Stage 1: Single App + Single Database (No Indexes)",
    architectureDescription: "One backend server queries a single PostgreSQL database with unindexed full table scans.",
    bottleneckSolved: "Baseline setup for early prototype.",
    newComplexityIntroduced: "Every SELECT scans millions of rows sequentially from disk. Response time degrades under modest load.",
    estimatedLatencyMs: 480,
    maxThroughputQps: 150,
    activeComponents: { appNodes: 1, hasIndex: false, hasCache: false, readReplicas: 0, shardCount: 1 },
  },
  {
    stepNumber: 2,
    title: "Stage 2: Query Tuning & B-Tree Indexes",
    architectureDescription: "Added B-Tree index on frequently searched columns (e.g. user_id, email, created_at).",
    bottleneckSolved: "Eliminates O(N) full disk scans with O(log N) tree lookups. Latency drops from 480ms to 15ms!",
    newComplexityIntroduced: "Indexes require disk space and add write overhead: every INSERT, UPDATE, and DELETE must update the index tree.",
    estimatedLatencyMs: 15,
    maxThroughputQps: 1200,
    activeComponents: { appNodes: 1, hasIndex: true, hasCache: false, readReplicas: 0, shardCount: 1 },
  },
  {
    stepNumber: 3,
    title: "Stage 3: Redis Cache-Aside Layer",
    architectureDescription: "Inserted an in-memory Redis cache between application server and database.",
    bottleneckSolved: "85% of read queries hit Redis in ~1ms without touching the database disk at all.",
    newComplexityIntroduced: "Cache invalidation challenges: When a profile updates, stale cache must be purged or updated. Cache stampede risk.",
    estimatedLatencyMs: 2,
    maxThroughputQps: 8000,
    activeComponents: { appNodes: 2, hasIndex: true, hasCache: true, readReplicas: 0, shardCount: 1 },
  },
  {
    stepNumber: 4,
    title: "Stage 4: Primary-Replica Read Scaling",
    architectureDescription: "Primary DB handles writes; two Read Replicas handle read queries via asynchronous replication.",
    bottleneckSolved: "Offloads heavy read traffic from the primary DB, tripling overall read query capacity.",
    newComplexityIntroduced: "Replication Lag: Updates take 10–50ms to reach replicas. Critical rule: Replicas do NOT scale writes!",
    estimatedLatencyMs: 8,
    maxThroughputQps: 22000,
    activeComponents: { appNodes: 3, hasIndex: true, hasCache: true, readReplicas: 2, shardCount: 1 },
  },
  {
    stepNumber: 5,
    title: "Stage 5: Horizontal Database Sharding (Last Resort)",
    architectureDescription: "Partitioned tables across 3 independent database shards using hash(user_id) % 3.",
    bottleneckSolved: "Bypasses the single-machine disk storage limit and distributes write volume across 3 primary nodes.",
    newComplexityIntroduced: "Cross-shard joins are impossible or very slow; distributed transactions require two-phase commit (2PC) or Sagas; re-sharding is dangerous.",
    estimatedLatencyMs: 12,
    maxThroughputQps: 65000,
    activeComponents: { appNodes: 4, hasIndex: true, hasCache: true, readReplicas: 2, shardCount: 3 },
  },
];

export function DatabaseScalingDemo() {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const currentStage = STAGES[currentStageIdx];

  const handleNext = () => {
    if (currentStageIdx < STAGES.length - 1) {
      setCurrentStageIdx(currentStageIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStageIdx > 0) {
      setCurrentStageIdx(currentStageIdx - 1);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-studio-900 border border-studio-700/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-studio-700/60 gap-3">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-500 border border-brand-500/30 font-bold">
            STEP-BY-STEP SCALING ARCHITECTURE
          </span>
          <h3 className="text-base font-bold text-white mt-1">{currentStage.title}</h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentStageIdx === 0}
            className="px-3 py-1.5 rounded-lg bg-studio-850 hover:bg-studio-800 disabled:opacity-30 text-xs text-slate-300 font-medium flex items-center gap-1 border border-studio-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
          <span className="text-xs font-mono text-slate-400">
            {currentStageIdx + 1} / {STAGES.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentStageIdx === STAGES.length - 1}
            className="px-3 py-1.5 rounded-lg bg-accent-cyan hover:bg-accent-cyan/90 disabled:opacity-30 text-xs text-studio-950 font-bold flex items-center gap-1"
          >
            <span>Next Stage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Illustrative Disclaimer */}
      <div className="p-2.5 rounded-xl bg-studio-850 border border-studio-750 text-[11px] text-slate-400 font-mono">
        <span className="text-accent-amber font-semibold">Note:</span> Latency and QPS numbers are illustrative educational models showing comparative optimization gains, not actual production benchmarks.
      </div>

      {/* Visual Component Architecture Layout */}
      <div className="p-6 rounded-2xl bg-studio-950/80 border border-studio-800 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
          {/* App Servers */}
          <div className="p-3.5 rounded-xl bg-studio-900 border border-accent-purple/40 text-center space-y-1 min-w-[130px]">
            <Server className="w-5 h-5 mx-auto text-accent-purple" />
            <div className="font-bold text-slate-200">App Tier</div>
            <div className="text-[10px] text-slate-400">{currentStage.activeComponents.appNodes} Server Node(s)</div>
          </div>

          <div className="text-slate-500 font-bold">&rarr;</div>

          {/* Redis Cache (Conditional) */}
          {currentStage.activeComponents.hasCache ? (
            <div className="p-3.5 rounded-xl bg-accent-amber/10 border border-accent-amber text-center space-y-1 min-w-[130px] animate-fadeIn">
              <Zap className="w-5 h-5 mx-auto text-accent-amber" />
              <div className="font-bold text-amber-300">Redis Cache</div>
              <div className="text-[10px] text-slate-400">85% Cache Hits</div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-dashed border-studio-700 text-center space-y-1 min-w-[130px] opacity-40">
              <div className="text-[10px] text-slate-500 font-mono">No Cache Layer</div>
            </div>
          )}

          <div className="text-slate-500 font-bold">&rarr;</div>

          {/* Database Layer (Single, Replicas, or Shards) */}
          <div className="space-y-2">
            {/* Primary DB */}
            <div className={`p-3.5 rounded-xl border text-center space-y-1 min-w-[150px] ${
              currentStage.activeComponents.hasIndex
                ? "bg-brand-500/10 border-brand-500 text-brand-500"
                : "bg-studio-900 border-accent-rose text-accent-rose"
            }`}>
              <Database className="w-5 h-5 mx-auto" />
              <div className="font-bold text-slate-200">
                {currentStage.activeComponents.shardCount > 1
                  ? `Shards (1..${currentStage.activeComponents.shardCount})`
                  : "Primary Database"}
              </div>
              <div className="text-[10px] text-slate-400">
                {currentStage.activeComponents.hasIndex ? "✅ B-Tree Indexed" : "❌ No Index (Table Scan)"}
              </div>
            </div>

            {/* Read Replicas (Conditional) */}
            {currentStage.activeComponents.readReplicas > 0 && (
              <div className="p-2.5 rounded-xl bg-accent-cyan/10 border border-accent-cyan/40 text-center space-y-0.5 animate-fadeIn">
                <Copy className="w-4 h-4 mx-auto text-accent-cyan" />
                <div className="text-[11px] font-bold text-accent-cyan">
                  {currentStage.activeComponents.readReplicas}x Read Replicas
                </div>
                <div className="text-[9px] text-slate-400">Async Replication Lag</div>
              </div>
            )}
          </div>
        </div>

        {/* Live Calculated Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-studio-800 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-studio-900 border border-studio-750">
            <span className="text-[10px] text-slate-400 block uppercase">Est. Latency</span>
            <span className={`text-base font-bold ${
              currentStage.estimatedLatencyMs > 100 ? "text-accent-rose" : "text-brand-500"
            }`}>
              ~{currentStage.estimatedLatencyMs} ms
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-studio-900 border border-studio-750">
            <span className="text-[10px] text-slate-400 block uppercase">Max Safe QPS</span>
            <span className="text-base font-bold text-accent-cyan">
              {currentStage.maxThroughputQps.toLocaleString()} QPS
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-studio-900 border border-studio-750">
            <span className="text-[10px] text-slate-400 block uppercase">Write Scalability</span>
            <span className="text-xs font-bold text-slate-200">
              {currentStage.activeComponents.shardCount > 1 ? "Distributed Writes" : "Single Primary Node"}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-studio-900 border border-studio-750">
            <span className="text-[10px] text-slate-400 block uppercase">Complexity Level</span>
            <span className={`text-xs font-bold ${
              currentStage.stepNumber >= 4 ? "text-accent-amber" : "text-slate-300"
            }`}>
              {currentStage.stepNumber === 1 ? "Minimal" : currentStage.stepNumber <= 3 ? "Moderate" : "High Distributed"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottleneck Solved vs New Complexity Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bottleneck Solved */}
        <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/30 space-y-1.5">
          <div className="text-xs font-bold text-brand-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Bottleneck Solved in this Step
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {currentStage.bottleneckSolved}
          </p>
        </div>

        {/* New Complexity Introduced */}
        <div className="p-4 rounded-xl bg-accent-amber/10 border border-accent-amber/30 space-y-1.5">
          <div className="text-xs font-bold text-accent-amber flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> New Complexity &amp; Trade-off
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {currentStage.newComplexityIntroduced}
          </p>
        </div>
      </div>
    </div>
  );
}

