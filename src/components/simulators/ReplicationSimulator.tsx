"use client";

import React, { useState } from "react";
import { 
  Database, 
  GitBranch, 
  RotateCcw, 
  Zap, 
  Terminal
} from "lucide-react";

export function ReplicationSimulator() {
  const [replicationMode, setReplicationMode] = useState<"async" | "sync">("async");
  const [replicationLagMs, setReplicationLagMs] = useState(1200);

  // Database State
  const [primaryBalance, setPrimaryBalance] = useState(100);
  const [replica1Balance, setReplica1Balance] = useState(100);
  const [replica2Balance, setReplica2Balance] = useState(100);

  const [lastReadReport, setLastReadReport] = useState<{
    replicaName: string;
    valueRead: number;
    isStale: boolean;
    timestamp: number;
  } | null>(null);

  const [replicationEvents, setReplicationEvents] = useState<string[]>([
    "Primary node active. Read replicas in sync."
  ]);

  const handleWritePrimary = () => {
    const nextVal = primaryBalance + 100;
    setPrimaryBalance(nextVal);
    setLastReadReport(null);

    setReplicationEvents(l => [
      `[PRIMARY WRITE] balance updated to $${nextVal}. WAL record generated.`,
      ...l.slice(0, 3)
    ]);

    if (replicationMode === "async") {
      setTimeout(() => {
        setReplica1Balance(nextVal);
        setReplica2Balance(nextVal);
        setReplicationEvents(l => [
          `[REPLICAS SYNCED] WAL applied to Followers. State consistent.`,
          ...l.slice(0, 3)
        ]);
      }, replicationLagMs);
    } else {
      setTimeout(() => {
        setReplica1Balance(nextVal);
        setReplica2Balance(nextVal);
        setReplicationEvents(l => [
          `[SYNC COMMIT] Replica 1 acknowledged WAL before primary acknowledged client.`,
          ...l.slice(0, 3)
        ]);
      }, 300);
    }
  };

  const handleReadReplica = (replicaIndex: 1 | 2) => {
    const val = replicaIndex === 1 ? replica1Balance : replica2Balance;
    const isStale = val !== primaryBalance;

    setLastReadReport({
      replicaName: `Read Replica 0${replicaIndex}`,
      valueRead: val,
      isStale,
      timestamp: Date.now()
    });
  };

  const handleReset = () => {
    setPrimaryBalance(100);
    setReplica1Balance(100);
    setReplica2Balance(100);
    setLastReadReport(null);
    setReplicationEvents(["Cluster reset to consistent state."]);
  };

  return (
    <div className="border border-theme-border bg-theme-card text-theme-text font-sans">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-theme-border flex flex-wrap items-center justify-between gap-3 bg-theme-bg">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border border-theme-border bg-theme-card flex items-center justify-center text-theme-primary">
            <GitBranch className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold tracking-tight text-theme-text flex items-center gap-2">
              Primary-Replica Replication & Stale Reads
              <span className="text-[9px] font-mono uppercase bg-theme-card border border-theme-border text-theme-primary px-1.5 py-0.5">
                LAB // 09
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-1 border border-theme-border hover:border-theme-borderLight bg-theme-card text-theme-muted hover:text-theme-text transition"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Replication Mode Selector & Lag Slider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-theme-border bg-theme-bg font-mono text-xs">
          <div>
            <label className="text-[10px] uppercase text-theme-muted block mb-2 font-bold">
              REPLICATION TOPOLOGY
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setReplicationMode("async")}
                className={`flex-1 p-2.5 border text-left transition ${
                  replicationMode === "async"
                    ? "border-theme-primary bg-theme-cardElevated text-theme-text"
                    : "border-theme-border bg-theme-card text-theme-muted hover:border-theme-borderLight"
                }`}
              >
                <div className="font-bold">Asynchronous</div>
                <div className="text-[10px] text-theme-muted font-sans mt-0.5">Fast writes, risk of lag</div>
              </button>

              <button
                onClick={() => setReplicationMode("sync")}
                className={`flex-1 p-2.5 border text-left transition ${
                  replicationMode === "sync"
                    ? "border-theme-primary bg-theme-cardElevated text-theme-text"
                    : "border-theme-border bg-theme-card text-theme-muted hover:border-theme-borderLight"
                }`}
              >
                <div className="font-bold">Semi-Synchronous</div>
                <div className="text-[10px] text-theme-muted font-sans mt-0.5">Zero stale reads, higher latency</div>
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-[10px] uppercase text-theme-muted font-bold">REPLICATION LAG</span>
              <span className="text-theme-primary font-bold">
                {replicationMode === "async" ? `${replicationLagMs} ms` : "0 ms (Locked)"}
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="2500"
              step="100"
              disabled={replicationMode === "sync"}
              value={replicationLagMs}
              onChange={(e) => setReplicationLagMs(Number(e.target.value))}
              className="w-full h-1 bg-theme-cardElevated appearance-none cursor-pointer accent-theme-primary disabled:opacity-40"
            />
            <div className="text-[10px] text-theme-muted mt-1">
              {replicationMode === "async" 
                ? "Simulates network transit delay or heavy WAL replay backlog." 
                : "Synchronous mode guarantees replicas are consistent before acknowledging."}
            </div>
          </div>
        </div>

        {/* Primary and Follower Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Primary */}
          <div className="p-4 border border-theme-primary bg-theme-bg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-3.5 h-3.5 text-theme-primary" />
                <span className="font-bold text-theme-text">PRIMARY (LEADER)</span>
              </div>
              <span className="text-[9px] text-theme-primary border border-theme-border px-1">
                READ / WRITE
              </span>
            </div>

            <div className="p-3 border border-theme-border bg-theme-card text-center">
              <div className="text-[10px] text-theme-muted uppercase">ACCOUNT BALANCE</div>
              <div className="text-2xl font-bold text-theme-text mt-0.5">${primaryBalance}</div>
            </div>

            <button
              onClick={handleWritePrimary}
              className="w-full py-2 bg-theme-primary hover:brightness-110 text-theme-bg font-bold font-semibold uppercase tracking-wider transition flex items-center justify-center space-x-1.5"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Deposit +$100 to Primary</span>
            </button>
          </div>

          {/* Follower 1 */}
          <div className="p-4 border border-theme-border bg-theme-bg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-3.5 h-3.5 text-theme-muted" />
                <span className="font-bold text-theme-text">READ REPLICA 01</span>
              </div>
              <span className="text-[9px] text-theme-muted border border-theme-border px-1">
                READ-ONLY
              </span>
            </div>

            <div className={`p-3 border text-center transition ${
              replica1Balance !== primaryBalance 
                ? "border-theme-primary bg-theme-cardElevated text-theme-primary"
                : "border-theme-border bg-theme-card text-theme-text"
            }`}>
              <div className="text-[10px] text-theme-muted uppercase">ACCOUNT BALANCE</div>
              <div className="text-2xl font-bold mt-0.5">${replica1Balance}</div>
            </div>

            <button
              onClick={() => handleReadReplica(1)}
              className="w-full py-2 border border-theme-border hover:border-theme-primary bg-theme-card text-theme-text uppercase tracking-wider transition"
            >
              Read from Replica 01
            </button>
          </div>

          {/* Follower 2 */}
          <div className="p-4 border border-theme-border bg-theme-bg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-3.5 h-3.5 text-theme-muted" />
                <span className="font-bold text-theme-text">READ REPLICA 02</span>
              </div>
              <span className="text-[9px] text-theme-muted border border-theme-border px-1">
                READ-ONLY
              </span>
            </div>

            <div className={`p-3 border text-center transition ${
              replica2Balance !== primaryBalance 
                ? "border-theme-primary bg-theme-cardElevated text-theme-primary"
                : "border-theme-border bg-theme-card text-theme-text"
            }`}>
              <div className="text-[10px] text-theme-muted uppercase">ACCOUNT BALANCE</div>
              <div className="text-2xl font-bold mt-0.5">${replica2Balance}</div>
            </div>

            <button
              onClick={() => handleReadReplica(2)}
              className="w-full py-2 border border-theme-border hover:border-theme-primary bg-theme-card text-theme-text uppercase tracking-wider transition"
            >
              Read from Replica 02
            </button>
          </div>
        </div>

        {/* Read Result Report */}
        {lastReadReport && (
          <div className="p-4 border border-theme-border bg-theme-bg space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-theme-text">{lastReadReport.replicaName} Output:</span>
              <span className={`px-2 py-0.5 text-[10px] border ${
                lastReadReport.isStale 
                  ? "border-theme-primary text-theme-primary bg-theme-cardElevated" 
                  : "border-theme-border text-theme-text"
              }`}>
                {lastReadReport.isStale ? "⚠️ STALE READ DETECTED" : "✓ CONSISTENT READ"}
              </span>
            </div>

            <div className="text-sm">
              Read Value: <strong className="text-theme-primary">${lastReadReport.valueRead}</strong> vs Primary Value: <strong className="text-theme-text">${primaryBalance}</strong>
            </div>

            <p className="text-xs text-theme-secondary font-sans leading-relaxed pt-1">
              {lastReadReport.isStale ? (
                <span>
                  <strong>Consistency Hazard:</strong> The client just wrote ${primaryBalance} to Primary, but when reading from this replica, they see the old balance (${lastReadReport.valueRead}). In e-commerce, this causes users to panic that their payment disappeared.
                </span>
              ) : (
                <span>
                  <strong>Consistent Read:</strong> The read replica has caught up with all Write-Ahead Logs. Data matches the primary perfectly.
                </span>
              )}
            </p>
          </div>
        )}

        {/* WAL Stream Event Log */}
        <div className="p-3 border border-theme-border bg-theme-bg font-mono text-[11px] text-theme-muted space-y-1">
          <div className="text-theme-muted text-[10px] uppercase font-bold flex items-center gap-1.5 mb-1">
            <Terminal className="w-3 h-3 text-theme-primary" />
            REPLICATION WAL STREAM
          </div>
          {replicationEvents.map((evt, idx) => (
            <div key={idx} className="truncate text-theme-secondary">{evt}</div>
          ))}
        </div>

      </div>
    </div>
  );
}
