"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Server, 
  Trash2, 
  Terminal
} from "lucide-react";

interface EdgeLocation {
  id: string;
  city: string;
  region: string;
  distanceMilesToOrigin: number;
  originLatencyMs: number;
  edgeLatencyMs: number;
  isCacheWarm: boolean;
}

const EDGE_POPS: EdgeLocation[] = [
  { id: "tyo", city: "Tokyo, Japan", region: "Asia Pacific", distanceMilesToOrigin: 5100, originLatencyMs: 165, edgeLatencyMs: 8, isCacheWarm: true },
  { id: "lon", city: "London, UK", region: "Europe", distanceMilesToOrigin: 4900, originLatencyMs: 145, edgeLatencyMs: 6, isCacheWarm: true },
  { id: "nyc", city: "New York, USA", region: "North America East", distanceMilesToOrigin: 2450, originLatencyMs: 78, edgeLatencyMs: 5, isCacheWarm: true },
  { id: "syd", city: "Sydney, Australia", region: "Oceania", distanceMilesToOrigin: 7600, originLatencyMs: 220, edgeLatencyMs: 12, isCacheWarm: false },
];

export function CDNSimulator() {
  const [selectedEdgeId, setSelectedEdgeId] = useState("tyo");
  const [isCdnEnabled, setIsCdnEnabled] = useState(true);
  const [edgePops, setEdgePops] = useState<EdgeLocation[]>(EDGE_POPS);
  const [lastRequestLog, setLastRequestLog] = useState<{
    city: string;
    servedBy: string;
    latencyMs: number;
    status: "CACHE_HIT" | "CACHE_MISS" | "NO_CDN";
  } | null>(null);

  const selectedEdge = edgePops.find(e => e.id === selectedEdgeId) || edgePops[0];

  const handleRequestAsset = (edgeId: string) => {
    const pop = edgePops.find(e => e.id === edgeId)!;

    if (!isCdnEnabled) {
      setLastRequestLog({
        city: pop.city,
        servedBy: "Origin Server (Oregon, US-West)",
        latencyMs: pop.originLatencyMs,
        status: "NO_CDN"
      });
      return;
    }

    if (pop.isCacheWarm) {
      setLastRequestLog({
        city: pop.city,
        servedBy: `Edge PoP (${pop.city})`,
        latencyMs: pop.edgeLatencyMs,
        status: "CACHE_HIT"
      });
    } else {
      setLastRequestLog({
        city: pop.city,
        servedBy: `Origin (via ${pop.city} PoP)`,
        latencyMs: pop.originLatencyMs + 5,
        status: "CACHE_MISS"
      });
      setEdgePops(prev => prev.map(e => e.id === edgeId ? { ...e, isCacheWarm: true } : e));
    }
  };

  const handlePurgeAll = () => {
    setEdgePops(prev => prev.map(e => ({ ...e, isCacheWarm: false })));
    setLastRequestLog(null);
  };

  const handleWarmAll = () => {
    setEdgePops(prev => prev.map(e => ({ ...e, isCacheWarm: true })));
  };

  return (
    <div className="border border-theme-border bg-theme-card text-theme-text font-sans">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-theme-border flex flex-wrap items-center justify-between gap-3 bg-theme-bg">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border border-theme-border bg-theme-card flex items-center justify-center text-theme-primary">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold tracking-tight text-theme-text flex items-center gap-2">
              Global CDN & Edge Caching Architecture
              <span className="text-[9px] font-mono uppercase bg-theme-card border border-theme-border text-theme-primary px-1.5 py-0.5">
                LAB // 08
              </span>
            </h3>
          </div>
        </div>

        {/* CDN Toggle & Purge */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => setIsCdnEnabled(!isCdnEnabled)}
            className={`px-3 py-1 font-semibold uppercase tracking-wider transition border ${
              isCdnEnabled
                ? "border-theme-primary text-theme-primary bg-theme-cardElevated"
                : "border-theme-border text-theme-muted hover:text-theme-text bg-theme-card"
            }`}
          >
            CDN: {isCdnEnabled ? "ENABLED" : "BYPASSED"}
          </button>

          <button
            onClick={handlePurgeAll}
            className="p-1 border border-theme-border hover:border-theme-borderLight bg-theme-card text-theme-muted hover:text-theme-text transition"
            title="Purge PoPs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Origin Server Banner */}
        <div className="p-3.5 border border-theme-border bg-theme-bg flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-2.5">
            <Server className="w-4 h-4 text-theme-primary" />
            <div>
              <span className="font-bold text-theme-text">CENTRAL ORIGIN SERVER</span>
              <span className="text-[10px] text-theme-muted block">AWS us-west-2 (Oregon, USA)</span>
            </div>
          </div>
          <button
            onClick={handleWarmAll}
            className="text-theme-primary hover:underline text-xs"
          >
            Warm All PoPs
          </button>
        </div>

        {/* Edge Locations Selector */}
        <div>
          <label className="text-[10px] font-mono uppercase text-theme-muted block mb-2 font-bold">
            USER LOCATION & ASSET TRANSFER [4MB BANNER]
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            {edgePops.map((pop) => {
              const isSelected = pop.id === selectedEdgeId;

              return (
                <div
                  key={pop.id}
                  onClick={() => {
                    setSelectedEdgeId(pop.id);
                    handleRequestAsset(pop.id);
                  }}
                  className={`p-3.5 border cursor-pointer transition ${
                    isSelected
                      ? "border-theme-primary bg-theme-cardElevated text-theme-text"
                      : "border-theme-border bg-theme-bg text-theme-muted hover:border-theme-borderLight"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-theme-text">{pop.city}</span>
                    <span className="text-[9px] text-theme-muted">
                      [{!isCdnEnabled ? "BYPASSED" : pop.isCacheWarm ? "WARM" : "COLD"}]
                    </span>
                  </div>

                  <div className="text-[11px] text-theme-muted">
                    {pop.distanceMilesToOrigin.toLocaleString()} miles to origin
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-[10px] text-theme-muted">LATENCY:</span>
                    <span className="font-bold text-theme-primary">
                      {!isCdnEnabled || !pop.isCacheWarm ? `${pop.originLatencyMs}ms` : `${pop.edgeLatencyMs}ms`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Simulation Result Inspector */}
        {lastRequestLog && (
          <div className="p-4 border border-theme-border bg-theme-bg space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-theme-border pb-2">
              <span className="text-theme-text font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-theme-primary" />
                EDGE TRANSFER TELEMETRY: {lastRequestLog.city}
              </span>
              <span className="text-theme-primary border border-theme-border px-2 py-0.5">
                {lastRequestLog.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-2.5 border border-theme-border bg-theme-card">
                <div className="text-[10px] text-theme-muted uppercase">SERVICED BY</div>
                <div className="font-bold text-theme-text mt-1 truncate">{lastRequestLog.servedBy}</div>
              </div>
              <div className="p-2.5 border border-theme-border bg-theme-card">
                <div className="text-[10px] text-theme-muted uppercase">OBSERVED RTT</div>
                <div className="font-bold text-theme-primary mt-0.5 text-base">
                  {lastRequestLog.latencyMs} ms
                </div>
              </div>
              <div className="p-2.5 border border-theme-border bg-theme-card">
                <div className="text-[10px] text-theme-muted uppercase">SPEEDUP</div>
                <div className="font-bold text-theme-text mt-0.5 text-base">
                  {lastRequestLog.status === "CACHE_HIT" 
                    ? `${Math.round(selectedEdge.originLatencyMs / selectedEdge.edgeLatencyMs)}x Faster`
                    : "1x Baseline"}
                </div>
              </div>
            </div>

            <p className="text-xs text-theme-secondary font-sans leading-relaxed pt-1">
              <strong className="text-theme-text font-mono uppercase text-[11px]">Architectural Analysis:</strong> {lastRequestLog.status === "CACHE_HIT" 
                ? "The content was delivered from an edge server in the user's metro area, completely skipping transatlantic fiber hops."
                : "The request had to cross ocean fiber cables to the central Oregon origin, incurring high speed-of-light propagation delay."}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
