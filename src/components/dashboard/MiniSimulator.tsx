"use client";

import React, { useState, useMemo, useEffect } from "react";
import { runSystemSimulation, SimulationNode, SimulationEdge } from "@/lib/simulation/simulationEngine";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { Play, RotateCcw, AlertTriangle, CheckCircle2, Flame, Server, Database, Zap, ShieldAlert } from "lucide-react";

export function MiniSimulator() {
  const [trafficRps, setTrafficRps] = useState(2500);
  const [failServer1, setFailServer1] = useState(false);
  const [bypassCache, setBypassCache] = useState(false);
  const { updateDailyMission, unlockAchievement } = useProgressStore();

  const baseNodes: SimulationNode[] = useMemo(
    () => [
      { id: "c1", name: "Global Ingress", type: "client", capacityRps: 50000, baseLatencyMs: 5, isFailing: false },
      { id: "lb1", name: "L7 Load Balancer", type: "load_balancer", capacityRps: 20000, baseLatencyMs: 3, isFailing: false },
      { id: "ws1", name: "App Server 01", type: "app_server", capacityRps: 2000, baseLatencyMs: 15, isFailing: failServer1 },
      { id: "ws2", name: "App Server 02", type: "app_server", capacityRps: 2000, baseLatencyMs: 15, isFailing: false },
      {
        id: "cache1",
        name: "Redis Cache Cluster",
        type: "cache",
        capacityRps: 15000,
        baseLatencyMs: 1.5,
        isFailing: false,
        cacheHitRate: bypassCache ? 0.0 : 0.85,
      },
      { id: "db1", name: "PostgreSQL Primary", type: "database", capacityRps: 1200, baseLatencyMs: 25, isFailing: false },
    ],
    [failServer1, bypassCache]
  );

  const edges: SimulationEdge[] = useMemo(
    () => [
      { id: "e1", source: "c1", target: "lb1" },
      { id: "e2", source: "lb1", target: "ws1" },
      { id: "e3", source: "lb1", target: "ws2" },
      { id: "e4", source: "ws1", target: "cache1" },
      { id: "e5", source: "ws2", target: "cache1" },
      { id: "e6", source: "cache1", target: "db1" },
    ],
    []
  );

  const simResult = useMemo(() => {
    return runSystemSimulation(baseNodes, edges, trafficRps);
  }, [baseNodes, edges, trafficRps]);

  useEffect(() => {
    if (trafficRps >= 5000) {
      updateDailyMission("stress_test", 1);
    }
    if (failServer1 && simResult.droppedRps === 0) {
      unlockAchievement("failure_survivor");
    }
  }, [trafficRps, failServer1, simResult.droppedRps, updateDailyMission, unlockAchievement]);

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-space-900/60 backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-space-700/50 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              LIVE SYSTEM LAB
            </span>
            <span className="flex items-center text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5" />
              Engine Online
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-1">Stress Test a Live 3-Tier Architecture</h3>
        </div>

        {/* Action badges */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setTrafficRps(2500);
              setFailServer1(false);
              setBypassCache(false);
            }}
            className="px-2.5 py-1 text-xs rounded-lg bg-space-800 text-slate-400 hover:text-white flex items-center space-x-1 border border-space-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* System Interactive Diagram Grid */}
      <div className="py-6 grid grid-cols-2 sm:grid-cols-5 gap-3 relative">
        {/* Client Ingress */}
        <div className="p-3 rounded-xl bg-space-850/80 border border-space-700/70 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">INGRESS</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="my-2 text-center">
            <div className="text-sm font-bold text-slate-200">User Traffic</div>
            <div className="text-xs font-mono text-cyan-400 font-bold">{trafficRps.toLocaleString()} RPS</div>
          </div>
          <div className="text-[10px] text-center text-slate-400">Public Internet</div>
        </div>

        {/* Load Balancer */}
        <div className="p-3 rounded-xl bg-space-850/80 border border-cyan-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-cyan-400">L7 LB</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="my-2 text-center">
            <div className="text-sm font-bold text-slate-200">Load Balancer</div>
            <div className="text-xs font-mono text-slate-300">
              {simResult.nodeMetrics["lb1"]?.saturationPercent ?? 0}% Saturation
            </div>
          </div>
          <div className="text-[10px] text-center text-slate-400">Round Robin</div>
        </div>

        {/* App Servers Cluster */}
        <div className="p-3 rounded-xl bg-space-850/80 border border-purple-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-purple-400">COMPUTE</span>
            <Server className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="my-2 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className={failServer1 ? "line-through text-rose-400" : "text-slate-300"}>Node 01</span>
              <span className="font-mono text-[10px] text-purple-300">
                {failServer1 ? "CRASHED" : `${simResult.nodeMetrics["ws1"]?.saturationPercent ?? 0}%`}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Node 02</span>
              <span className="font-mono text-[10px] text-purple-300">
                {simResult.nodeMetrics["ws2"]?.saturationPercent ?? 0}%
              </span>
            </div>
          </div>
          <div className="text-[10px] text-center text-slate-400">Max 4K RPS Total</div>
        </div>

        {/* Redis Cache */}
        <div className="p-3 rounded-xl bg-space-850/80 border border-amber-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-amber-400">IN-MEMORY</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="my-2 text-center">
            <div className="text-sm font-bold text-slate-200">Redis Cache</div>
            <div className="text-xs font-mono text-amber-300 font-semibold">
              {bypassCache ? "0% Hit (PURGED)" : "85% Cache Hit"}
            </div>
          </div>
          <div className="text-[10px] text-center text-slate-400">Sub-2ms Latency</div>
        </div>

        {/* Database Primary */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
            (simResult.nodeMetrics["db1"]?.saturationPercent ?? 0) >= 90
              ? "bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-500/20"
              : "bg-space-850/80 border-blue-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-blue-400">DATA TIER</span>
            <Database className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="my-2 text-center">
            <div className="text-sm font-bold text-slate-200">PostgreSQL</div>
            <div
              className={`text-xs font-mono font-bold ${
                (simResult.nodeMetrics["db1"]?.saturationPercent ?? 0) >= 90
                  ? "text-rose-400 animate-pulse"
                  : "text-slate-300"
              }`}
            >
              {simResult.nodeMetrics["db1"]?.saturationPercent ?? 0}% Load
            </div>
          </div>
          <div className="text-[10px] text-center text-slate-400">Max 1.2K RPS</div>
        </div>
      </div>

      {/* Bottleneck Warning Alert */}
      {simResult.bottleneckReason && (
        <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 flex items-start space-x-3 text-rose-200 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-rose-300">Bottleneck Detected: </span>
            {simResult.bottleneckReason}
          </div>
        </div>
      )}

      {/* Live Metrics Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-xl bg-space-950/60 border border-space-800">
        <div>
          <span className="text-[10px] uppercase font-mono text-slate-400">Successful Throughput</span>
          <div className="text-base font-bold font-mono text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{simResult.successfulRps.toLocaleString()} RPS</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono text-slate-400">Dropped Packets (504s)</span>
          <div
            className={`text-base font-bold font-mono ${
              simResult.droppedRps > 0 ? "text-rose-400 animate-pulse" : "text-slate-400"
            }`}
          >
            {simResult.droppedRps.toLocaleString()} RPS
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono text-slate-400">P50 Latency (Median)</span>
          <div className="text-base font-bold font-mono text-cyan-300">{simResult.p50LatencyMs} ms</div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono text-slate-400">P99 Tail Latency</span>
          <div
            className={`text-base font-bold font-mono ${
              simResult.p99LatencyMs > 250 ? "text-amber-400" : "text-slate-200"
            }`}
          >
            {simResult.p99LatencyMs} ms
          </div>
        </div>
      </div>

      {/* Interactive Chaos Controls */}
      <div className="mt-5 pt-4 border-t border-space-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Traffic Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Incoming Traffic
            </span>
            <span className="font-mono text-cyan-400 font-bold">{trafficRps.toLocaleString()} RPS</span>
          </div>
          <input
            type="range"
            min="200"
            max="12000"
            step="200"
            value={trafficRps}
            onChange={(e) => setTrafficRps(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-space-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>200 RPS</span>
            <span>6,000 RPS</span>
            <span>12,000 RPS</span>
          </div>
        </div>

        {/* Chaos Toggle 1: Crash App Server */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-space-850 border border-space-700/60">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Crash App Node 01
            </div>
            <div className="text-[10px] text-slate-400">Simulate hardware failure</div>
          </div>
          <button
            onClick={() => setFailServer1(!failServer1)}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              failServer1
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                : "bg-space-800 text-slate-300 hover:bg-space-750"
            }`}
          >
            {failServer1 ? "OFFLINE" : "HEALTHY"}
          </button>
        </div>

        {/* Chaos Toggle 2: Purge Cache */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-space-850 border border-space-700/60">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Purge Redis Cache
            </div>
            <div className="text-[10px] text-slate-400">Trigger database stampede</div>
          </div>
          <button
            onClick={() => setBypassCache(!bypassCache)}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              bypassCache
                ? "bg-amber-500 text-space-950 font-extrabold shadow-md shadow-amber-500/30"
                : "bg-space-800 text-slate-300 hover:bg-space-750"
            }`}
          >
            {bypassCache ? "PURGED (0%)" : "ACTIVE (85%)"}
          </button>
        </div>
      </div>
    </div>
  );
}

