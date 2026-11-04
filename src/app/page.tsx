"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useProgressStore, calculateLevel } from "@/lib/store/useProgressStore";
import { CURRICULUM_STAGES } from "@/lib/curriculum/curriculumData";
import { 
  ArrowRight, 
  Terminal, 
  Activity, 
  Server, 
  Database, 
  Zap, 
  Play, 
  Layers, 
  CheckCircle2, 
  Globe, 
  GitBranch, 
  Sliders
} from "lucide-react";

export default function HomePage() {
  const { xp, streak, completedLessons, currentLessonId, initFromStorage } = useProgressStore();
  const [mounted, setMounted] = useState(false);

  // Hero Blueprint interactive simulation state
  const [packetStep, setPacketStep] = useState<number>(0);
  const [isPacketMoving, setIsPacketMoving] = useState<boolean>(false);
  const [telemetryLatency, setTelemetryLatency] = useState<number>(14.2);

  useEffect(() => {
    initFromStorage();
    setMounted(true);
  }, [initFromStorage]);

  const levelInfo = calculateLevel(mounted ? xp : 150);
  const totalLessons = CURRICULUM_STAGES.reduce((acc, stage) => acc + stage.lessons.length, 0);
  const completedCount = mounted ? completedLessons.length : 0;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const dispatchHeroRequest = async () => {
    if (isPacketMoving) return;
    setIsPacketMoving(true);

    for (let i = 1; i <= 4; i++) {
      setPacketStep(i);
      setTelemetryLatency(prev => +(prev + 3.4).toFixed(1));
      await new Promise(r => setTimeout(r, 450));
    }

    await new Promise(r => setTimeout(r, 200));
    setPacketStep(0);
    setTelemetryLatency(14.2);
    setIsPacketMoving(false);
  };

  return (
    <div className="w-full bg-theme-bg text-theme-text">
      {/* =========================================================================
          HERO SECTION — EDITORIAL ASYMMETRIC GRID
         ========================================================================= */}
      <section className="border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Bold Headline & Editorial Copy (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8 pr-0 lg:pr-6">
              <div className="space-y-6">
                {/* Technical Metadata Header */}
                <div className="flex items-center space-x-3 text-xs font-mono text-theme-muted tracking-widest uppercase">
                  <span>SYS // VOL. 01</span>
                  <span>/</span>
                  <span className="text-theme-accent">DISTRIBUTED COMPUTING</span>
                  <span>/</span>
                  <span>STANDARDS 2026</span>
                </div>

                {/* Massive Architectural Display Headline */}
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-theme-text leading-[1.02]">
                  UNDERSTAND <br />
                  HOW SYSTEMS <br />
                  <span className="text-theme-primary">WORK.</span>
                </h1>

                <p className="text-base sm:text-lg text-theme-secondary max-w-xl font-sans leading-relaxed font-normal">
                  Learn System Design from the ground up through interactive diagrams, real-time experiments, and practical architecture challenges.
                </p>
              </div>

              {/* Action Buttons & Quick Stats */}
              <div className="space-y-6 pt-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/learn/${currentLessonId || "what-happens-when-website-loads"}`}
                    className="px-6 py-3.5 bg-theme-primary hover:brightness-110 text-theme-bg font-mono font-bold text-xs tracking-wider uppercase transition flex items-center space-x-2"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/learn"
                    className="px-6 py-3.5 border border-theme-border hover:border-theme-primary text-theme-text font-mono font-semibold text-xs tracking-wider uppercase transition"
                  >
                    Explore the Roadmap
                  </Link>

                  <Link
                    href="/playground"
                    className="px-6 py-3.5 border border-theme-border hover:border-theme-accent text-theme-muted hover:text-theme-text font-mono text-xs tracking-wider uppercase transition"
                  >
                    Open Playground
                  </Link>
                </div>

                {/* Architectural Blueprint Bar */}
                <div className="grid grid-cols-3 border-t border-theme-border pt-4 text-xs font-mono text-theme-muted">
                  <div>
                    <span className="text-[10px] text-theme-muted uppercase block">METHOD</span>
                    <span className="text-theme-text font-medium">VISUAL FIRST</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-theme-muted uppercase block">SIMULATORS</span>
                    <span className="text-theme-text font-medium">8 REAL-TIME LABS</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-theme-muted uppercase block">STAGES</span>
                    <span className="text-theme-text font-medium">12 PROGRESSIVE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Architectural Blueprint (5 cols) */}
            <div className="lg:col-span-5 border border-theme-border bg-theme-card p-6 flex flex-col justify-between relative">
              {/* Technical Blueprint Header */}
              <div className="flex items-center justify-between border-b border-theme-border pb-3 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-theme-primary animate-pulse" />
                  <span className="text-theme-text uppercase font-bold tracking-wider">
                    Interactive Blueprint
                  </span>
                </div>
                <span className="text-theme-muted">TOPOLOGY // L7</span>
              </div>

              {/* Connected Blueprint Stages Visual */}
              <div className="my-6 space-y-3 font-mono text-xs">
                {/* Node 1: Client */}
                <div className={`p-3 border transition duration-150 flex items-center justify-between ${
                  packetStep === 1 
                    ? "border-theme-primary bg-theme-primary/10 text-theme-text" 
                    : "border-theme-border bg-theme-bg text-theme-muted"
                }`}>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-theme-accent" />
                    <span className="font-bold">01. BROWSER CLIENT</span>
                  </div>
                  <span className="text-[10px] text-theme-muted">HTTP/2 GET</span>
                </div>

                {/* Connector Line */}
                <div className="h-3 border-l border-dashed border-theme-border ml-5" />

                {/* Node 2: Load Balancer */}
                <div className={`p-3 border transition duration-150 flex items-center justify-between ${
                  packetStep === 2 
                    ? "border-theme-primary bg-theme-primary/10 text-theme-text" 
                    : "border-theme-border bg-theme-bg text-theme-muted"
                }`}>
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-4 h-4 text-theme-secondary" />
                    <span className="font-bold">02. LOAD BALANCER</span>
                  </div>
                  <span className="text-[10px] text-theme-muted">LEAST CONNECTIONS</span>
                </div>

                {/* Connector Line */}
                <div className="h-3 border-l border-dashed border-theme-border ml-5" />

                {/* Node 3: Application Server */}
                <div className={`p-3 border transition duration-150 flex items-center justify-between ${
                  packetStep === 3 
                    ? "border-theme-primary bg-theme-primary/10 text-theme-text" 
                    : "border-theme-border bg-theme-bg text-theme-muted"
                }`}>
                  <div className="flex items-center space-x-2">
                    <Server className="w-4 h-4 text-theme-secondary" />
                    <span className="font-bold">03. APP SERVER [NODE/GO]</span>
                  </div>
                  <span className="text-[10px] text-theme-muted">WORKER #2</span>
                </div>

                {/* Connector Line */}
                <div className="h-3 border-l border-dashed border-theme-border ml-5" />

                {/* Node 4: Database / Cache */}
                <div className={`p-3 border transition duration-150 flex items-center justify-between ${
                  packetStep === 4 
                    ? "border-theme-primary bg-theme-primary/10 text-theme-text" 
                    : "border-theme-border bg-theme-bg text-theme-muted"
                }`}>
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-theme-accent" />
                    <span className="font-bold">04. DATABASE & REDIS</span>
                  </div>
                  <span className="text-[10px] text-theme-muted">B-TREE INDEX SEEK</span>
                </div>
              </div>

              {/* Action Button & Live Telemetry Footer */}
              <div className="border-t border-theme-border pt-4 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-theme-muted">
                  <span>TELEMETRY RTT:</span>
                  <span className="text-theme-accent font-bold">{telemetryLatency} MS</span>
                </div>

                <button
                  onClick={dispatchHeroRequest}
                  disabled={isPacketMoving}
                  className="w-full py-2.5 bg-theme-primary text-theme-bg font-mono font-bold tracking-wider uppercase transition hover:brightness-110 disabled:opacity-50 flex items-center justify-center space-x-2 text-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isPacketMoving ? "Tracing Ingress Packet..." : "Dispatch Test Packet"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1 — HOW LEARNING WORKS (Watch -> Explore -> Experiment -> Build)
         ========================================================================= */}
      <section className="border-b border-theme-border py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-theme-border pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-theme-muted">
                LEARNING METHODOLOGY
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-theme-text mt-1">
                How Learning Works
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-theme-secondary max-w-md font-sans">
              Passive reading creates false confidence. We combine architectural theory with interactive sandboxes so you internalize why systems fail.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                label: "WATCH",
                title: "Hop-by-Hop Flow",
                description: "Observe data packets move across clients, recursive DNS, edge PoPs, and database engines in slow motion."
              },
              {
                step: "02",
                label: "EXPLORE",
                title: "Mental Models",
                description: "Grasp complex concepts through physical real-world analogies before diving into protocol specifications."
              },
              {
                step: "03",
                label: "EXPERIMENT",
                title: "Live Sandboxes",
                description: "Manipulate traffic volume, toggle B-Tree indexes, crash server nodes, and witness queue saturation in real time."
              },
              {
                step: "04",
                label: "BUILD",
                title: "System Challenges",
                description: "Solve practical architectural dilemmas, diagnose incident symptoms, and test your readiness for Senior design interviews."
              }
            ].map((item) => (
              <div
                key={item.step}
                className="p-5 border border-theme-border bg-theme-card hover:border-theme-primary/50 transition space-y-3"
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="text-sm font-bold text-theme-primary">{item.step}</span>
                  <span className="text-[10px] tracking-widest uppercase text-theme-muted">{item.label}</span>
                </div>
                <h3 className="font-display text-base font-bold text-theme-text">{item.title}</h3>
                <p className="text-xs text-theme-secondary font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — YOUR LEARNING JOURNEY (12 Stages)
         ========================================================================= */}
      <section className="border-b border-theme-border py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-theme-border pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-theme-muted">
                STRUCTURED PROGRESSION
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-theme-text mt-1">
                The 12-Stage Curriculum
              </h2>
            </div>
            <Link
              href="/learn"
              className="text-xs font-mono text-theme-primary hover:underline uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>View Full Interactive Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
            {CURRICULUM_STAGES.map((stage) => {
              return (
                <Link
                  key={stage.id}
                  href={`/learn/${stage.lessons[0]?.id || "what-happens-when-website-loads"}`}
                  className="p-4 border border-theme-border bg-theme-card hover:border-theme-primary transition space-y-2 block group"
                >
                  <div className="flex items-center justify-between text-theme-muted">
                    <span>STAGE {String(stage.id).padStart(2, "0")}</span>
                    <span className="text-theme-text group-hover:text-theme-primary transition">&rarr;</span>
                  </div>
                  <h3 className="font-display text-sm font-bold text-theme-text group-hover:text-theme-primary transition">
                    {stage.title.replace(/^Stage \d+:\s*/, "")}
                  </h3>
                  <p className="text-[11px] text-theme-secondary font-sans line-clamp-2 leading-relaxed">
                    {stage.subtitle}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — INTERACTIVE SYSTEM LAB (8 Dedicated Simulators)
         ========================================================================= */}
      <section className="border-b border-theme-border py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-theme-border pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-theme-muted">
                AUTONOMOUS ENGINEERING LABS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-theme-text mt-1">
                8 Dedicated Simulators
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-theme-secondary max-w-md font-sans">
              Each core architectural mechanism has its own interactive laboratory. Test your intuition against mathematical models.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            {[
              {
                id: "database",
                title: "Database Indexing & ACID",
                desc: "Compare O(N) Table Scans against O(log N) B-Tree seeks and run ACID transaction rollbacks.",
                link: "/learn/database-indexes-and-scans",
                tag: "B-TREE / ACID"
              },
              {
                id: "server",
                title: "Concurrency & Saturation",
                desc: "Observe Little's Law, request queue backlogs, and worker thread exhaustion drops.",
                link: "/learn/client-and-server-architecture",
                tag: "THREADS / QUEUE"
              },
              {
                id: "load_balancer",
                title: "Load Balancer & Failover",
                desc: "Test Round-Robin and Least Connections routing; trigger node chaos and health check recovery.",
                link: "/learn/load-balancing-algorithms",
                tag: "L4 / L7 FAILOVER"
              },
              {
                id: "cache",
                title: "Cache-Aside & Redis",
                desc: "Observe sub-2ms RAM lookups, TTL countdowns, and LRU memory eviction algorithms.",
                link: "/learn/cache-aside-and-redis",
                tag: "TTL / LRU CACHE"
              },
              {
                id: "queue",
                title: "Message Queue & DLQ",
                desc: "Decouple asynchronous workloads, handle burst buffers, and quarantine poisoned messages.",
                link: "/learn/message-queues-and-decoupling",
                tag: "KAFKA / DLQ"
              },
              {
                id: "network",
                title: "Packet Journey Inspector",
                desc: "Trace HTTP handshakes, recursive DNS lookups, TLS 1.3 encryption, and proxy hops.",
                link: "/learn/what-happens-when-website-loads",
                tag: "DNS / TCP / TLS"
              },
              {
                id: "cdn",
                title: "Global CDN & Anycast",
                desc: "Understand speed-of-light propagation latency from Tokyo to London and edge cache offloading.",
                link: "/learn/latency-vs-bandwidth",
                tag: "EDGE CACHING"
              },
              {
                id: "replication",
                title: "Replication Lag & Stale Reads",
                desc: "Simulate primary-follower replication lag, WAL streaming, and eventual consistency hazards.",
                link: "/learn/primary-replica-replication",
                tag: "CAP / STALE READS"
              }
            ].map((sim) => (
              <Link
                key={sim.id}
                href={sim.link}
                className="p-4 border border-theme-border bg-theme-card hover:border-theme-primary transition space-y-2 block group"
              >
                <div className="flex justify-between items-center text-[10px] text-theme-muted">
                  <span>{sim.tag}</span>
                  <span className="text-theme-primary group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
                <h3 className="font-display text-sm font-bold text-theme-text group-hover:text-theme-primary transition">
                  {sim.title}
                </h3>
                <p className="text-[11px] text-theme-secondary font-sans leading-relaxed">
                  {sim.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — START WITH THE FUNDAMENTALS (Call to Action)
         ========================================================================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 border border-theme-border bg-theme-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-theme-primary">
                BEGINNER ORIENTATION
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-theme-text">
                Start with Lesson 1.1: What Happens When You Open a Website?
              </h2>
              <p className="text-xs sm:text-sm text-theme-secondary font-sans leading-relaxed">
                Take the premier 8-minute interactive walkthrough tracing an HTTP packet across 6 physical network hops. No prior distributed systems experience required.
              </p>
            </div>

            <Link
              href="/learn/what-happens-when-website-loads"
              className="px-6 py-3.5 bg-theme-primary hover:brightness-110 text-theme-bg font-mono font-bold text-xs tracking-wider uppercase transition whitespace-nowrap flex items-center space-x-2 shrink-0"
            >
              <span>Launch Lesson 1.1</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
