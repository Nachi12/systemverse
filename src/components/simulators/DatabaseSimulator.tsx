"use client";

import React, { useState } from "react";
import { 
  Database, 
  Key, 
  Play, 
  ShieldCheck, 
  Terminal,
  Activity
} from "lucide-react";

interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended" | "pending";
}

const INITIAL_ROWS: UserRecord[] = [
  { id: 1, name: "Alice Zhang", email: "alice@tech.io", role: "Staff Architect", status: "active" },
  { id: 2, name: "Devon Reed", email: "devon@systems.net", role: "DevOps Lead", status: "active" },
  { id: 3, name: "Chloe Martin", email: "chloe@data.org", role: "DBA Specialist", status: "pending" },
  { id: 4, name: "Marcus Vance", email: "marcus@cloud.dev", role: "Backend Eng", status: "active" },
  { id: 5, name: "Elena Rostova", email: "elena@kernel.ai", role: "Site Rel Eng", status: "suspended" },
  { id: 6, name: "Tariq Mansour", email: "tariq@network.io", role: "Security Eng", status: "active" },
  { id: 7, name: "Sophie Dupont", email: "sophie@web.co", role: "Frontend Dev", status: "active" },
  { id: 8, name: "Kenji Sato", email: "kenji@micro.dev", role: "Systems Eng", status: "pending" },
];

export function DatabaseSimulator() {
  const [rows, setRows] = useState<UserRecord[]>(INITIAL_ROWS);
  const [hasEmailIndex, setHasEmailIndex] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("email_lookup");
  const [customFilterValue] = useState("marcus@cloud.dev");
  const [scanningRowId, setScanningRowId] = useState<number | null>(null);
  const [matchedRowIds, setMatchedRowIds] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Execution Plan Metrics
  const [executionPlan, setExecutionPlan] = useState<{
    planType: "INDEX SEEK" | "FULL TABLE SCAN" | null;
    rowsExamined: number;
    rowsReturned: number;
    simulatedLatencyMs: number;
    timeComplexity: string;
    explanation: string;
  } | null>(null);

  // Transaction state
  const [txState, setTxState] = useState<"IDLE" | "ACTIVE" | "COMMITTED" | "ROLLEDBACK">("IDLE");
  const [txBackup, setTxBackup] = useState<UserRecord[] | null>(null);
  const [txLog, setTxLog] = useState<string[]>([]);

  const runQuery = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setMatchedRowIds([]);
    setScanningRowId(null);
    setExecutionPlan(null);

    const isEmailSearch = selectedPreset === "email_lookup";
    const isIdSearch = selectedPreset === "id_lookup";
    const isStatusSearch = selectedPreset === "status_lookup";

    const usesIndex = (isEmailSearch && hasEmailIndex) || isIdSearch;

    if (usesIndex) {
      const targetId = isIdSearch ? 4 : rows.find(r => r.email.toLowerCase() === customFilterValue.toLowerCase())?.id;
      await new Promise(res => setTimeout(res, 250));
      
      if (targetId) {
        setScanningRowId(targetId);
        setMatchedRowIds([targetId]);
        setExecutionPlan({
          planType: "INDEX SEEK",
          rowsExamined: 1,
          rowsReturned: 1,
          simulatedLatencyMs: 1.8,
          timeComplexity: "O(log N)",
          explanation: isIdSearch 
            ? "Traversed Primary B+ Tree Index directly by Clustered Key." 
            : "Traversed Secondary B-Tree index on `email` to locate target row pointer directly."
        });
      } else {
        setExecutionPlan({
          planType: "INDEX SEEK",
          rowsExamined: 0,
          rowsReturned: 0,
          simulatedLatencyMs: 1.2,
          timeComplexity: "O(log N)",
          explanation: "Index lookup completed: key not present in index."
        });
      }
      setIsRunning(false);
      return;
    }

    // Full Table Scan: O(N) sequential check of every row
    let examinedCount = 0;
    const matches: number[] = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      setScanningRowId(r.id);
      examinedCount++;
      await new Promise(res => setTimeout(res, 160));

      let matched = false;
      if (isEmailSearch && r.email.toLowerCase() === customFilterValue.toLowerCase()) matched = true;
      if (isStatusSearch && r.status === "active") matched = true;
      if (isIdSearch && r.id === 4) matched = true;

      if (matched) {
        matches.push(r.id);
        setMatchedRowIds([...matches]);
      }
    }

    setScanningRowId(null);
    setExecutionPlan({
      planType: "FULL TABLE SCAN",
      rowsExamined: examinedCount,
      rowsReturned: matches.length,
      simulatedLatencyMs: Math.round(examinedCount * 14.8),
      timeComplexity: "O(N)",
      explanation: "No index covered this query. Storage engine had to load and inspect every single disk page."
    });
    setIsRunning(false);
  };

  // Transaction controls
  const handleBeginTx = () => {
    setTxBackup([...rows]);
    setTxState("ACTIVE");
    setTxLog(["[TX-101] BEGIN TRANSACTION", "Acquired Row Locks on affected records"]);
  };

  const handleTxUpdate = () => {
    if (txState !== "ACTIVE") return;
    setRows(prev => prev.map(r => r.id === 1 ? { ...r, status: "suspended" } : r));
    setTxLog(l => [...l, "[TX-101] UPDATE users SET status = 'suspended' WHERE id = 1 (Uncommitted in WAL buffer)"]);
  };

  const handleCommit = () => {
    if (txState !== "ACTIVE") return;
    setTxState("COMMITTED");
    setTxBackup(null);
    setTxLog(l => [...l, "[TX-101] COMMIT: Flushed WAL log to persistent disk. Locks released."]);
  };

  const handleRollback = () => {
    if (txState !== "ACTIVE" || !txBackup) return;
    setRows(txBackup);
    setTxBackup(null);
    setTxState("ROLLEDBACK");
    setTxLog(l => [...l, "[TX-101] ROLLBACK: Reverted uncommitted modifications. State restored."]);
  };

  return (
    <div className="border border-theme-border bg-theme-card text-theme-text font-sans">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-theme-border flex flex-wrap items-center justify-between gap-3 bg-theme-bg">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border border-theme-border bg-theme-card flex items-center justify-center text-theme-primary">
            <Database className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold tracking-tight text-theme-text flex items-center gap-2">
              Relational Storage & Indexing Engine
              <span className="text-[9px] font-mono uppercase bg-theme-cardElevated border border-theme-border text-theme-primary px-1.5 py-0.5">
                LAB // 04
              </span>
            </h3>
          </div>
        </div>

        {/* Index Toggle */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <Key className="w-3.5 h-3.5 text-theme-muted" />
          <span className="text-theme-muted">B-Tree Index (`email`):</span>
          <button
            onClick={() => setHasEmailIndex(!hasEmailIndex)}
            className={`px-2 py-0.5 text-xs font-semibold transition border ${
              hasEmailIndex 
                ? "bg-theme-primary/10 border-theme-primary text-theme-primary" 
                : "border-theme-border text-theme-muted hover:text-theme-text"
            }`}
          >
            {hasEmailIndex ? "ENABLED [O(LOG N)]" : "DISABLED [O(N)]"}
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Query Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <button
            onClick={() => setSelectedPreset("email_lookup")}
            className={`p-3 border text-left transition ${
              selectedPreset === "email_lookup"
                ? "border-theme-primary bg-theme-primary/10 text-theme-text"
                : "border-theme-border bg-theme-bg text-theme-muted hover:border-theme-borderLight"
            }`}
          >
            <div className="font-bold">1. Search by Email</div>
            <div className="text-[11px] text-theme-muted mt-1 truncate">WHERE email = &apos;marcus@cloud.dev&apos;</div>
            <div className="text-[10px] text-theme-primary mt-1">
              {hasEmailIndex ? "✓ B-Tree Index Seek" : "⚠️ Table Scan O(N)"}
            </div>
          </button>

          <button
            onClick={() => setSelectedPreset("id_lookup")}
            className={`p-3 border text-left transition ${
              selectedPreset === "id_lookup"
                ? "border-theme-primary bg-theme-primary/10 text-theme-text"
                : "border-theme-border bg-theme-bg text-theme-muted hover:border-theme-borderLight"
            }`}
          >
            <div className="font-bold">2. Search by Primary Key</div>
            <div className="text-[11px] text-theme-muted mt-1">WHERE id = 4</div>
            <div className="text-[10px] text-theme-primary mt-1">
              ✓ Clustered PK Index Seek
            </div>
          </button>

          <button
            onClick={() => setSelectedPreset("status_lookup")}
            className={`p-3 border text-left transition ${
              selectedPreset === "status_lookup"
                ? "border-theme-primary bg-theme-primary/10 text-theme-text"
                : "border-theme-border bg-theme-bg text-theme-muted hover:border-theme-borderLight"
            }`}
          >
            <div className="font-bold">3. Unindexed Low Cardinality</div>
            <div className="text-[11px] text-theme-muted mt-1">WHERE status = &apos;active&apos;</div>
            <div className="text-[10px] text-theme-muted mt-1">
              ⚠️ Sequential Table Scan
            </div>
          </button>
        </div>

        {/* SQL Command Bar */}
        <div className="flex items-center space-x-3 bg-theme-bg p-2 border border-theme-border font-mono text-xs">
          <div className="text-theme-primary px-2 font-bold">SQL &gt;</div>
          <div className="text-theme-text flex-1 truncate">
            {selectedPreset === "email_lookup" && `SELECT * FROM users WHERE email = '${customFilterValue}';`}
            {selectedPreset === "id_lookup" && `SELECT * FROM users WHERE id = 4;`}
            {selectedPreset === "status_lookup" && `SELECT * FROM users WHERE status = 'active';`}
          </div>
          <button
            onClick={runQuery}
            disabled={isRunning}
            className="px-4 py-1.5 bg-theme-primary hover:brightness-110 text-theme-bg font-bold uppercase tracking-wider transition disabled:opacity-40 flex items-center space-x-1.5"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isRunning ? "Executing..." : "Execute"}</span>
          </button>
        </div>

        {/* Database Rows Table */}
        <div className="border border-theme-border overflow-x-auto bg-theme-bg">
          <div className="bg-theme-cardElevated px-4 py-2 font-mono text-[11px] text-theme-muted grid grid-cols-12 border-b border-theme-border min-w-[500px]">
            <span className="col-span-1">ID</span>
            <span className="col-span-3">NAME</span>
            <span className="col-span-4 flex items-center gap-1">
              EMAIL {hasEmailIndex && <span className="text-[9px] text-theme-primary">[INDEX]</span>}
            </span>
            <span className="col-span-2">ROLE</span>
            <span className="col-span-2 text-right">STATUS</span>
          </div>

          <div className="divide-y divide-theme-border min-w-[500px]">
            {rows.map((row) => {
              const isScanning = scanningRowId === row.id;
              const isMatched = matchedRowIds.includes(row.id);

              return (
                <div
                  key={row.id}
                  className={`px-4 py-2 text-xs font-mono grid grid-cols-12 items-center transition-colors ${
                    isScanning
                      ? "bg-theme-cardElevated border-l-2 border-theme-accent text-theme-text"
                      : isMatched
                      ? "bg-theme-primary/10 border-l-2 border-theme-primary text-theme-primary font-bold"
                      : "text-theme-muted hover:bg-theme-cardElevated"
                  }`}
                >
                  <span className="col-span-1 font-bold text-theme-muted">#{row.id}</span>
                  <span className="col-span-3 text-theme-text">{row.name}</span>
                  <span className="col-span-4 text-theme-secondary truncate">{row.email}</span>
                  <span className="col-span-2 text-theme-muted">{row.role}</span>
                  <span className="col-span-2 text-right">
                    <span className="text-[10px] font-mono uppercase text-theme-muted">
                      [{row.status}]
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Execution Plan Metrics Panel */}
        {executionPlan && (
          <div className="p-4 border border-theme-border bg-theme-bg space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-theme-border pb-2">
              <span className="text-theme-text font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-theme-primary" />
                EXECUTION PLAN
              </span>
              <span className="text-theme-primary border border-theme-border px-2 py-0.5">
                {executionPlan.planType} ({executionPlan.timeComplexity})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 border border-theme-border bg-theme-card">
                <div className="text-[10px] text-theme-muted">EXAMINED</div>
                <div className="text-sm font-bold text-theme-text mt-0.5">{executionPlan.rowsExamined} Rows</div>
              </div>
              <div className="p-2.5 border border-theme-border bg-theme-card">
                <div className="text-[10px] text-theme-muted">RETURNED</div>
                <div className="text-sm font-bold text-theme-primary mt-0.5">{executionPlan.rowsReturned} Rows</div>
              </div>
              <div className="p-2.5 border border-theme-border bg-theme-card">
                <div className="text-[10px] text-theme-muted">SIMULATED LATENCY</div>
                <div className="text-sm font-bold text-theme-accent mt-0.5">{executionPlan.simulatedLatencyMs} ms</div>
              </div>
              <div className="p-2.5 border border-theme-border bg-theme-card">
                <div className="text-[10px] text-theme-muted">DISK I/O</div>
                <div className="text-sm font-bold text-theme-text mt-0.5">
                  {executionPlan.planType === "INDEX SEEK" ? "1-2 Pages" : `${rows.length} Blocks`}
                </div>
              </div>
            </div>

            <p className="text-xs text-theme-secondary font-sans leading-relaxed pt-1">
              <strong className="text-theme-text">Architectural Note:</strong> {executionPlan.explanation}
            </p>
          </div>
        )}

        {/* ACID Transactions Simulator Box */}
        <div className="pt-4 border-t border-theme-border space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-theme-primary" />
              <span className="font-bold text-theme-text">ACID Transaction Isolation & Rollback Engine</span>
            </div>
            <span className="text-theme-muted">
              STATUS: [{txState}]
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={handleBeginTx}
              disabled={txState === "ACTIVE"}
              className="px-3 py-1.5 border border-theme-border bg-theme-card hover:bg-theme-cardElevated text-theme-text disabled:opacity-40 transition"
            >
              1. BEGIN
            </button>
            <button
              onClick={handleTxUpdate}
              disabled={txState !== "ACTIVE"}
              className="px-3 py-1.5 border border-theme-border bg-theme-card hover:bg-theme-cardElevated text-theme-primary disabled:opacity-40 transition"
            >
              2. UPDATE Alice status = &apos;suspended&apos;
            </button>
            <button
              onClick={handleCommit}
              disabled={txState !== "ACTIVE"}
              className="px-3 py-1.5 border border-theme-border bg-theme-primary text-theme-bg disabled:opacity-40 transition font-bold"
            >
              3. COMMIT
            </button>
            <button
              onClick={handleRollback}
              disabled={txState !== "ACTIVE"}
              className="px-3 py-1.5 border border-theme-border bg-theme-card hover:bg-theme-cardElevated text-theme-muted hover:text-theme-text disabled:opacity-40 transition"
            >
              4. ROLLBACK
            </button>
          </div>

          {txLog.length > 0 && (
            <div className="p-3 bg-theme-bg border border-theme-border font-mono text-[11px] text-theme-secondary space-y-1">
              {txLog.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
