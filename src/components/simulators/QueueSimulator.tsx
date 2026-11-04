"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Layers, 
  Send, 
  Cpu, 
  RotateCcw, 
  Zap, 
  Terminal,
  ShieldAlert
} from "lucide-react";

interface QueueMessage {
  id: number;
  type: "email" | "payment" | "thumbnail" | "webhook";
  title: string;
  retries: number;
  status: "queued" | "processing" | "completed" | "failed";
  createdAt: number;
}

export function QueueSimulator() {
  const [messages, setMessages] = useState<QueueMessage[]>([
    { id: 1, type: "email", title: "Send Welcome Email", retries: 0, status: "queued", createdAt: Date.now() },
    { id: 2, type: "thumbnail", title: "Generate 1080p Image", retries: 0, status: "queued", createdAt: Date.now() },
  ]);

  const [workerCount, setWorkerCount] = useState(2);
  const [workerSpeedMs, setWorkerSpeedMs] = useState(600);
  const [errorRatePercent, setErrorRatePercent] = useState(0);

  const [workers, setWorkers] = useState<{ id: number; currentMsg: QueueMessage | null }[]>([
    { id: 1, currentMsg: null },
    { id: 2, currentMsg: null },
  ]);

  const [dlq, setDlq] = useState<QueueMessage[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const msgIdCounter = useRef(3);

  useEffect(() => {
    setWorkers(prev => {
      const next = [];
      for (let i = 1; i <= workerCount; i++) {
        const existing = prev.find(w => w.id === i);
        next.push(existing || { id: i, currentMsg: null });
      }
      return next;
    });
  }, [workerCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setWorkers(currentWorkers => {
        let queueCopy = [...messages];
        const nextWorkers = currentWorkers.map(w => {
          if (!w.currentMsg && queueCopy.length > 0) {
            const nextMsg = queueCopy.shift()!;
            nextMsg.status = "processing";

            setTimeout(() => {
              const shouldFail = Math.random() * 100 < errorRatePercent;

              if (shouldFail) {
                setRetryCount(r => r + 1);
                if (nextMsg.retries >= 2) {
                  nextMsg.status = "failed";
                  setDlq(prevDlq => [nextMsg, ...prevDlq.slice(0, 9)]);
                } else {
                  nextMsg.retries += 1;
                  nextMsg.status = "queued";
                  setMessages(qm => [...qm, nextMsg]);
                }
              } else {
                nextMsg.status = "completed";
                setCompletedCount(c => c + 1);
              }

              setWorkers(ws => ws.map(item => item.id === w.id ? { ...item, currentMsg: null } : item));
            }, workerSpeedMs);

            return { ...w, currentMsg: nextMsg };
          }
          return w;
        });

        if (queueCopy.length !== messages.length) {
          setMessages(queueCopy);
        }

        return nextWorkers;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [messages, errorRatePercent, workerSpeedMs]);

  const produceMessage = (type: QueueMessage["type"], title: string) => {
    const newMsg: QueueMessage = {
      id: msgIdCounter.current++,
      type,
      title,
      retries: 0,
      status: "queued",
      createdAt: Date.now(),
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleReset = () => {
    setMessages([]);
    setDlq([]);
    setWorkers(workers.map(w => ({ ...w, currentMsg: null })));
    setCompletedCount(0);
    setRetryCount(0);
  };

  const backlogHealth = messages.length > 10 ? "CRITICAL" : messages.length > 5 ? "WARNING" : "HEALTHY";

  return (
    <div className="border border-theme-border bg-theme-card text-theme-text font-sans">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-theme-border flex flex-wrap items-center justify-between gap-3 bg-theme-bg">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border border-theme-border bg-theme-card flex items-center justify-center text-theme-primary">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold tracking-tight text-theme-text flex items-center gap-2">
              Asynchronous Message Queue & DLQ
              <span className="text-[9px] font-mono uppercase bg-theme-cardElevated border border-theme-border text-theme-primary px-1.5 py-0.5">
                LAB // 07
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-1 border border-theme-border hover:border-theme-muted bg-theme-card text-theme-muted hover:text-theme-text transition"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Producer Buttons */}
        <div>
          <label className="text-[10px] font-mono uppercase text-theme-muted block mb-2 font-bold">
            PRODUCER: PUBLISH ASYNC JOBS TO BROKER
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            <button
              onClick={() => produceMessage("email", "Send Welcome Email")}
              className="p-3 border border-theme-border bg-theme-bg hover:border-theme-primary text-left transition"
            >
              <div className="font-bold text-theme-text flex items-center gap-1.5">
                <Send className="w-3 h-3 text-theme-primary" /> Email Task
              </div>
              <div className="text-[10px] text-theme-muted mt-1">+1 Job</div>
            </button>

            <button
              onClick={() => produceMessage("payment", "Charge Stripe API")}
              className="p-3 border border-theme-border bg-theme-bg hover:border-theme-primary text-left transition"
            >
              <div className="font-bold text-theme-text flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-theme-primary" /> Payment Task
              </div>
              <div className="text-[10px] text-theme-muted mt-1">+1 Job</div>
            </button>

            <button
              onClick={() => produceMessage("thumbnail", "Resize Avatar (1080p)")}
              className="p-3 border border-theme-border bg-theme-bg hover:border-theme-primary text-left transition"
            >
              <div className="font-bold text-theme-text flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-theme-primary" /> Heavy CPU Task
              </div>
              <div className="text-[10px] text-theme-muted mt-1">+1 Job</div>
            </button>

            <button
              onClick={() => {
                for (let i = 0; i < 5; i++) {
                  produceMessage("webhook", `Dispatch Webhook #${i + 1}`);
                }
              }}
              className="p-3 border border-theme-primary bg-theme-primary/10 hover:bg-theme-primary hover:text-theme-bg text-left transition"
            >
              <div className="font-bold text-theme-text group-hover:text-theme-bg">
                ⚡ Burst 5 Jobs
              </div>
              <div className="text-[10px] text-theme-muted mt-1">Stress Queue</div>
            </button>
          </div>
        </div>

        {/* Sliders Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-theme-border bg-theme-bg font-mono text-xs">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-theme-muted">CONSUMER WORKERS</span>
              <span className="text-theme-primary font-bold">{workerCount} INSTANCES</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={workerCount}
              onChange={(e) => setWorkerCount(Number(e.target.value))}
              className="w-full h-1 bg-theme-border appearance-none cursor-pointer accent-theme-primary"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-theme-muted">WORKER SPEED</span>
              <span className="text-theme-text font-bold">{workerSpeedMs} MS/JOB</span>
            </div>
            <input
              type="range"
              min="200"
              max="1500"
              step="100"
              value={workerSpeedMs}
              onChange={(e) => setWorkerSpeedMs(Number(e.target.value))}
              className="w-full h-1 bg-theme-border appearance-none cursor-pointer accent-theme-primary"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-theme-muted">WORKER CHAOS RATE</span>
              <span className="text-theme-text font-bold">{errorRatePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="10"
              value={errorRatePercent}
              onChange={(e) => setErrorRatePercent(Number(e.target.value))}
              className="w-full h-1 bg-theme-border appearance-none cursor-pointer accent-theme-primary"
            />
          </div>
        </div>

        {/* Queue Buffer & Worker Pool */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 font-mono text-xs">
          {/* Buffer Pane */}
          <div className="lg:col-span-7 p-4 border border-theme-border bg-theme-bg space-y-3">
            <div className="flex items-center justify-between border-b border-theme-border pb-2">
              <span className="font-bold text-theme-text flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-theme-primary" />
                BROKER QUEUE BUFFER
              </span>
              <span className="text-theme-primary">
                {messages.length} WAITING [{backlogHealth}]
              </span>
            </div>

            <div className="p-3 bg-theme-card border border-theme-border min-h-[120px] max-h-[160px] overflow-y-auto space-y-1.5">
              {messages.length === 0 ? (
                <div className="h-20 flex items-center justify-center text-xs text-theme-muted">
                  Buffer drained. Publish jobs above.
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-2 border border-theme-border bg-theme-bg flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-theme-primary font-bold">#{msg.id}</span>
                      <span className="text-theme-text">{msg.title}</span>
                    </div>
                    {msg.retries > 0 && (
                      <span className="text-[10px] text-theme-warning border border-theme-warning/40 px-1">
                        Retry #{msg.retries}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Workers Pane */}
          <div className="lg:col-span-5 p-4 border border-theme-border bg-theme-bg space-y-3">
            <div className="font-bold text-theme-text flex items-center gap-1.5 border-b border-theme-border pb-2">
              <Cpu className="w-3.5 h-3.5 text-theme-accent" />
              <span>CONSUMER WORKERS ({workers.length})</span>
            </div>

            <div className="space-y-2">
              {workers.map((w) => {
                const isBusy = w.currentMsg !== null;
                return (
                  <div
                    key={w.id}
                    className={`p-3 border transition ${
                      isBusy
                        ? "border-theme-primary bg-theme-primary/10 text-theme-text"
                        : "border-theme-border bg-theme-card text-theme-muted"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-theme-text">Worker #{w.id}</span>
                      <span className={`text-[10px] uppercase ${isBusy ? "text-theme-primary font-bold" : "text-theme-muted"}`}>
                        [{isBusy ? "PROCESSING" : "IDLE"}]
                      </span>
                    </div>
                    <div className="text-[11px] truncate text-theme-secondary">
                      {isBusy ? (
                        <span>Executing: {w.currentMsg?.title} (#{w.currentMsg?.id})</span>
                      ) : (
                        "Awaiting next job"
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dead Letter Queue */}
        <div className="p-4 border border-theme-border bg-theme-bg space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-theme-text">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-theme-warning" />
              DEAD LETTER QUEUE (DLQ) — QUARANTINED POISON PILLS
            </span>
            <span className="text-theme-muted">{dlq.length} IN DLQ</span>
          </div>

          {dlq.length === 0 ? (
            <div className="text-xs text-theme-muted py-1">
              Zero dead letters. Increase Worker Chaos Rate above to simulate repeated crashes.
            </div>
          ) : (
            <div className="space-y-1">
              {dlq.map((msg) => (
                <div
                  key={msg.id}
                  className="p-2 border border-theme-error/40 bg-theme-card flex items-center justify-between"
                >
                  <span className="text-theme-text">Msg #{msg.id}: {msg.title}</span>
                  <span className="text-[10px] text-theme-error">
                    Exceeded 3 retries &rarr; Quarantined
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Telemetry Footer */}
        <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
          <div className="p-2.5 border border-theme-border bg-theme-bg">
            <div className="text-[10px] text-theme-muted uppercase">PROCESSED</div>
            <div className="text-base font-bold text-theme-text mt-0.5">{completedCount}</div>
          </div>
          <div className="p-2.5 border border-theme-border bg-theme-bg">
            <div className="text-[10px] text-theme-muted uppercase">RETRIES</div>
            <div className="text-base font-bold text-theme-warning mt-0.5">{retryCount}</div>
          </div>
          <div className="p-2.5 border border-theme-border bg-theme-bg">
            <div className="text-[10px] text-theme-muted uppercase">DEAD LETTERS</div>
            <div className="text-base font-bold text-theme-error mt-0.5">{dlq.length}</div>
          </div>
        </div>

      </div>
    </div>
  );
}
