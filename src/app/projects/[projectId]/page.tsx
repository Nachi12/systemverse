"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { REAL_WORLD_PROJECTS, ProjectBlueprint } from "@/lib/projects/projectData";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { triggerConfetti } from "@/lib/confetti";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Calculator, 
  Database, 
  Server, 
  AlertTriangle, 
  Sparkles, 
  Flame, 
  Award,
  Layers,
  Code2
} from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || "url-shortener";
  const { completedProjects, completeProject, unlockAchievement } = useProgressStore();

  const project: ProjectBlueprint =
    REAL_WORLD_PROJECTS.find((p) => p.id === projectId) || REAL_WORLD_PROJECTS[0];

  // Dynamic capacity estimator controls
  const [activeUsersM, setActiveUsersM] = useState<number>(50); // 50M DAU
  const isCompleted = completedProjects.includes(project.id);

  // Dynamic math derived from slider
  const dynamicWriteRps = Math.round((activeUsersM * 1_000_000 * 0.1) / 86400);
  const dynamicReadRps = dynamicWriteRps * 100;
  const dynamicStorage5YrTb = ((activeUsersM * 30 * 12 * 5 * 500) / 1e12).toFixed(1);
  const dynamicRamGb = Math.round((dynamicReadRps * 86400 * 0.2 * 200) / 1e9);

  const handleMarkComplete = () => {
    completeProject(project.id, 350);
    unlockAchievement("system_architect");
    triggerConfetti({ particleCount: 100, spread: 80 });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="text-xs text-slate-400 hover:text-cyan-400 flex items-center space-x-1.5 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Blueprints</span>
        </Link>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-space-850 text-cyan-300 border border-space-700">
          {project.difficulty} &bull; {project.category}
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">{project.icon}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{project.title}</h1>
            <p className="text-sm text-cyan-300 font-medium mt-1">{project.tagline}</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl pt-2">
          {project.summary}
        </p>
      </div>

      {/* Section 1: Interactive Capacity Estimator Calculator */}
      <div className="p-6 rounded-3xl bg-space-900/90 border border-cyan-500/30 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-space-700/60">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Dynamic Capacity Estimation Model</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Drag to recalculate hardware scale</span>
        </div>

        {/* User Scale Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 font-semibold">Daily Active Users (DAU)</span>
            <span className="text-cyan-400 font-bold">{activeUsersM} Million Users</span>
          </div>
          <input
            type="range"
            min="5"
            max="250"
            step="5"
            value={activeUsersM}
            onChange={(e) => setActiveUsersM(Number(e.target.value))}
            className="w-full accent-cyan-400 h-2 bg-space-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Dynamic Calculated Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-space-850/80 border border-space-750">
            <span className="text-[10px] font-mono uppercase text-slate-400">Peak Write QPS</span>
            <div className="text-base font-bold font-mono text-cyan-300">{dynamicWriteRps.toLocaleString()} QPS</div>
          </div>
          <div className="p-3 rounded-xl bg-space-850/80 border border-space-750">
            <span className="text-[10px] font-mono uppercase text-slate-400">Peak Read QPS (100:1)</span>
            <div className="text-base font-bold font-mono text-emerald-400">{dynamicReadRps.toLocaleString()} QPS</div>
          </div>
          <div className="p-3 rounded-xl bg-space-850/80 border border-space-750">
            <span className="text-[10px] font-mono uppercase text-slate-400">5-Year Raw Storage</span>
            <div className="text-base font-bold font-mono text-amber-400">{dynamicStorage5YrTb} TB</div>
          </div>
          <div className="p-3 rounded-xl bg-space-850/80 border border-space-750">
            <span className="text-[10px] font-mono uppercase text-slate-400">Hot Cache RAM (20%)</span>
            <div className="text-base font-bold font-mono text-purple-400">{dynamicRamGb} GB</div>
          </div>
        </div>
      </div>

      {/* Section 2: Requirements Specification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Functional */}
        <div className="p-6 rounded-3xl bg-space-900/60 border border-space-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Functional Requirements
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {project.functionalRequirements.map((req, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">&bull;</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Non-Functional */}
        <div className="p-6 rounded-3xl bg-space-900/60 border border-space-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Non-Functional Requirements
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {project.nonFunctionalRequirements.map((req, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">&bull;</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section 3: API Endpoints Design */}
      <div className="p-6 rounded-3xl bg-space-900/60 border border-space-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" /> API Interface Contracts
        </h3>
        <div className="space-y-2.5">
          {project.apiEndpoints.map((ep, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-space-950/80 border border-space-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
            >
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ep.method === "GET"
                      ? "bg-blue-500/20 text-blue-400"
                      : ep.method === "POST"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  {ep.method}
                </span>
                <span className="text-slate-200">{ep.path}</span>
              </div>
              <span className="text-slate-400 text-[11px] font-sans">{ep.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Database Modeling */}
      <div className="p-6 rounded-3xl bg-space-900/60 border border-space-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" /> Database & Storage Schema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.databaseDesign.map((db, i) => (
            <div key={i} className="p-4 rounded-2xl bg-space-950/80 border border-space-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 font-mono">{db.table}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-space-800 text-cyan-300 font-mono">
                  {db.type}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                <span className="text-slate-500 block">Fields:</span>
                {db.fields.join(", ")}
              </div>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-space-850">
                {db.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Architectural Trade-Offs Matrix */}
      <div className="p-6 rounded-3xl bg-space-900/60 border border-purple-500/20 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" /> Key Architectural Trade-Off Decisions
        </h3>
        <div className="space-y-3">
          {project.tradeoffs.map((to, i) => (
            <div key={i} className="p-4 rounded-2xl bg-space-950/80 border border-space-800 space-y-2 text-xs">
              <div className="font-bold text-slate-200">{to.decision}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-emerald-950/20 border border-emerald-500/30 text-emerald-300">
                  <span className="font-bold block">Selected Approach:</span>
                  {to.chosen}
                </div>
                <div className="p-2 rounded bg-space-900 border border-space-800 text-slate-400">
                  <span className="font-bold block">Rejected Alternative:</span>
                  {to.alternative}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                <span className="font-bold text-cyan-400">Why: </span>
                {to.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Bottlenecks & Failure Modes */}
      <div className="p-6 rounded-3xl bg-space-900/60 border border-rose-500/20 space-y-4">
        <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" /> Bottleneck Analysis & Production Mitigations
        </h3>
        <div className="space-y-3">
          {project.bottlenecksAndSolutions.map((b, i) => (
            <div key={i} className="p-4 rounded-2xl bg-space-950/80 border border-space-800 space-y-1.5 text-xs">
              <div className="font-bold text-rose-300 flex items-center gap-1.5">
                <span>&bull;</span>
                <span>{b.bottleneck}</span>
              </div>
              <p className="text-slate-300 text-xs pl-3.5 leading-relaxed">
                <span className="font-semibold text-emerald-400">Solution: </span>
                {b.solution}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Completion CTA */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-space-900 via-space-850 to-space-900 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Mastered this Blueprint?</span>
          </div>
          <p className="text-xs text-slate-400">
            Earn +350 XP and unlock the Grand System Architect badge.
          </p>
        </div>

        <button
          onClick={handleMarkComplete}
          disabled={isCompleted}
          className={`px-6 py-3 rounded-2xl text-xs font-extrabold flex items-center space-x-2 transition ${
            isCompleted
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-space-950 shadow-lg shadow-cyan-500/20"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isCompleted ? "Blueprint Mastered" : "Mark Blueprint Completed"}</span>
        </button>
      </div>
    </div>
  );
}

