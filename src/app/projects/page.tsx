"use client";

import React from "react";
import Link from "next/link";
import { REAL_WORLD_PROJECTS } from "@/lib/projects/projectData";
import { useProgressStore } from "@/lib/store/useProgressStore";
import { 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  Layers 
} from "lucide-react";

export default function ProjectsIndexPage() {
  const { completedProjects } = useProgressStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> PRODUCTION BLUEPRINTS
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Real-World System Design Blueprints
        </h1>
        <p className="text-sm text-slate-400">
          Deconstruct high-scale architectures like TinyURL, WhatsApp, and Netflix. Includes capacity math, API design, data models, and bottleneck mitigation.
        </p>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REAL_WORLD_PROJECTS.map((project) => {
          const isDone = mounted && completedProjects.includes(project.id);

          return (
            <div
              key={project.id}
              className="p-6 rounded-3xl bg-space-900/70 border border-space-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between space-y-5 shadow-xl group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{project.icon}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-800 text-slate-300 border border-space-700">
                      {project.difficulty}
                    </span>
                    {isDone && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Mastered
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {project.tagline}
                  </p>
                </div>

                <div className="pt-2 flex items-center space-x-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {project.estimatedMinutes} min
                  </span>
                  <span>{project.category}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-space-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">+350 XP</span>
                <Link
                  href={`/projects/${project.id}`}
                  className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <span>Explore Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

