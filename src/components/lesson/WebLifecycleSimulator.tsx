"use client";

import React, { useState, useEffect } from "react";
import { LessonData, LessonStep } from "@/lib/curriculum/curriculumData";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Layers, 
  Zap, 
  Globe, 
  Server, 
  Database, 
  Lock 
} from "lucide-react";

interface WebLifecycleSimulatorProps {
  lesson: LessonData;
  onStepChange?: (stepIndex: number) => void;
}

export function WebLifecycleSimulator({ lesson, onStepChange }: WebLifecycleSimulatorProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1);
  const [injectDnsFailure, setInjectDnsFailure] = useState(false);
  const [injectSlowServer, setInjectSlowServer] = useState(false);
  const { updateDailyMission } = useProgressStore();

  const totalSteps = lesson.steps.length;
  const currentStep: LessonStep = lesson.steps[currentStepIdx];

  // Auto-advance loop when playing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const stepDuration = (currentStep.durationMs * 18 + (injectSlowServer && currentStepIdx >= 4 ? 1200 : 0)) / playbackSpeed;
      timer = setTimeout(() => {
        if (injectDnsFailure && currentStepIdx === 1) {
          // Stopped by DNS failure
          setIsPlaying(false);
          return;
        }

        if (currentStepIdx < totalSteps - 1) {
          const next = currentStepIdx + 1;
          setCurrentStepIdx(next);
          onStepChange?.(next);
          updateDailyMission("inspect_dns", 1);
        } else {
          setIsPlaying(false);
        }
      }, stepDuration);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, totalSteps, currentStep, playbackSpeed, injectDnsFailure, injectSlowServer, onStepChange, updateDailyMission]);

  const handleNext = () => {
    if (currentStepIdx < totalSteps - 1) {
      const next = currentStepIdx + 1;
      setCurrentStepIdx(next);
      onStepChange?.(next);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prev = currentStepIdx - 1;
      setCurrentStepIdx(prev);
      onStepChange?.(prev);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
    onStepChange?.(0);
  };

  // Node architecture components in pipeline
  const pipelineComponents = [
    { id: "user", label: "User / Browser", icon: Globe, stepTriggers: [0, 6] },
    { id: "dns", label: "DNS Resolver", icon: Activity, stepTriggers: [1] },
    { id: "tcp", label: "TCP/IP Network", icon: Zap, stepTriggers: [2] },
    { id: "tls", label: "TLS Encryption", icon: Lock, stepTriggers: [3] },
    { id: "proxy", label: "Reverse Proxy", icon: Layers, stepTriggers: [4] },
    { id: "app", label: "App Server", icon: Server, stepTriggers: [5] },
    { id: "db", label: "Database / Cache", icon: Database, stepTriggers: [5] },
  ];

  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-space-900/90 backdrop-blur-xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* Top Controller Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-space-700/60">
        <div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            SIMULATION STEP {currentStepIdx + 1} OF {totalSteps}
          </span>
          <h3 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
            <span>{currentStep.title}</span>
            {injectDnsFailure && currentStepIdx === 1 && (
              <span className="text-xs px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 border border-rose-500/50">
                BLOCKED: DNS TIMEOUT
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentStep.actor} &rarr; {currentStep.target}
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="p-2 rounded-xl bg-space-800 text-slate-300 hover:text-white disabled:opacity-30 transition border border-space-700"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-space-950" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-space-950" />
                <span>Play Simulation</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIdx === totalSteps - 1}
            className="p-2 rounded-xl bg-space-800 text-slate-300 hover:text-white disabled:opacity-30 transition border border-space-700"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-space-800 text-slate-400 hover:text-white transition border border-space-700"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
            className="px-2.5 py-1.5 rounded-xl bg-space-850 text-slate-300 text-xs font-mono border border-space-700 hover:text-cyan-300 transition"
            title="Toggle playback speed"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Visual Component Pipeline with Animated Active State */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 py-2">
        {pipelineComponents.map((comp) => {
          const Icon = comp.icon;
          const isActive = comp.stepTriggers.includes(currentStepIdx);
          const isError = injectDnsFailure && comp.id === "dns" && currentStepIdx === 1;

          return (
            <div
              key={comp.id}
              className={`p-3 rounded-2xl border flex flex-col items-center text-center space-y-1.5 transition-all duration-300 ${
                isError
                  ? "bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-500/30"
                  : isActive
                  ? "bg-cyan-500/10 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105"
                  : "bg-space-850/60 border-space-800/80 text-slate-400"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  isError
                    ? "bg-rose-500/20 text-rose-400"
                    : isActive
                    ? "bg-cyan-500 text-space-950 font-bold"
                    : "bg-space-800 text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-semibold ${isActive ? "text-cyan-300 font-bold" : "text-slate-400"}`}>
                {comp.label}
              </span>
              <span className="text-[9px] font-mono text-slate-500">
                {isActive ? "ACTIVE" : "IDLE"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Packet Inspector & Narrative Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Step Narrative */}
        <div className="p-5 rounded-2xl bg-space-850/70 border border-space-750 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Operational Description
            </h4>
            <span className="text-xs font-mono text-cyan-400">
              Est. Latency: {injectSlowServer && currentStepIdx >= 4 ? "5,200ms (SLOW)" : `${currentStep.durationMs}ms`}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="pt-2 flex items-center space-x-2 text-xs text-slate-400">
            <span className="px-2 py-0.5 rounded bg-space-800 border border-space-700 font-mono text-[10px]">
              Protocol: {currentStep.packetInfo.protocol}
            </span>
            <span className="px-2 py-0.5 rounded bg-space-800 border border-space-700 font-mono text-[10px]">
              Type: {currentStep.packetInfo.type}
            </span>
          </div>
        </div>

        {/* Live Packet Header / Payload Inspector */}
        <div className="p-5 rounded-2xl bg-space-950/80 border border-space-800 space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" /> Packet Payload Inspector
            </h4>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Wire Inspection
            </span>
          </div>

          <div className="p-3 rounded-xl bg-space-900 border border-space-800 text-[11px] space-y-1.5 text-slate-300">
            {Object.entries(currentStep.packetInfo.payload).map(([k, v]) => (
              <div key={k} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-space-800/60 pb-1">
                <span className="text-cyan-400 font-medium">{k}:</span>
                <span className="text-slate-200 text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chaos Engineering & Experiment Toggles */}
      <div className="p-4 rounded-2xl bg-space-950/50 border border-space-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Toggle 1: DNS Failure */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-space-850/60 border border-space-750">
          <div>
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> Inject DNS Failure (NXDOMAIN)
            </div>
            <div className="text-[10px] text-slate-400">Simulate nameserver unreachable</div>
          </div>
          <button
            onClick={() => setInjectDnsFailure(!injectDnsFailure)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              injectDnsFailure
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                : "bg-space-800 text-slate-400 hover:text-white"
            }`}
          >
            {injectDnsFailure ? "ACTIVE" : "DISABLED"}
          </button>
        </div>

        {/* Toggle 2: Slow Server Query */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-space-850/60 border border-space-750">
          <div>
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" /> Simulate Slow DB Query (5s delay)
            </div>
            <div className="text-[10px] text-slate-400">Simulate unindexed database scan</div>
          </div>
          <button
            onClick={() => setInjectSlowServer(!injectSlowServer)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              injectSlowServer
                ? "bg-amber-500 text-space-950 font-extrabold shadow-md shadow-amber-500/30"
                : "bg-space-800 text-slate-400 hover:text-white"
            }`}
          >
            {injectSlowServer ? "ACTIVE" : "DISABLED"}
          </button>
        </div>
      </div>
    </div>
  );
}

