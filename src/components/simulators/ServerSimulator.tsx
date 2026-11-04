"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Server, 
  Cpu, 
  Layers, 
  Play, 
  Pause, 
  RotateCcw, 
  Activity,
  Terminal
} from "lucide-react";

interface RequestItem {
  id: number;
  status: "queued" | "processing" | "completed" | "dropped";
  workerId?: number;
  enteredAt: number;
}

export function ServerSimulator() {
  const [trafficRps, setTrafficRps] = useState(25);
  const [workerCount, setWorkerCount] = useState(4);
  const [maxQueueSize, setMaxQueueSize] = useState(12);
  const [serviceTimeMs, setServiceTimeMs] = useState(120);
  const [isServerAlive, setIsServerAlive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Live state
  const [queue, setQueue] = useState<RequestItem[]>([]);
  const [workers, setWorkers] = useState<{ id: number; activeRequest: RequestItem | null }[]>([
    { id: 1, activeRequest: null },
    { id: 2, activeRequest: null },
    { id: 3, activeRequest: null },
    { id: 4, activeRequest: null },
  ]);

  // Telemetry metrics
  const [completedCount, setCompletedCount] = useState(0);
  const [droppedCount, setDroppedCount] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(15);
  const [memoryUsage, setMemoryUsage] = useState(30);

  const reqIdCounter = useRef(1);

  // Sync worker array length with workerCount
  useEffect(() => {
    setWorkers(prev => {
      const next = [];
      for (let i = 1; i <= workerCount; i++) {
        const existing = prev.find(w => w.id === i);
        next.push(existing || { id: i, activeRequest: null });
      }
      return next;
    });
  }, [workerCount]);

  // Traffic Generator Tick
  useEffect(() => {
    if (!isServerAlive || isPaused) return;

    const intervalMs = Math.max(50, Math.floor(1000 / trafficRps));
    const timer = setInterval(() => {
      const newReq: RequestItem = {
        id: reqIdCounter.current++,
        status: "queued",
        enteredAt: Date.now(),
      };

      setQueue(prevQueue => {
        if (prevQueue.length >= maxQueueSize) {
          setDroppedCount(c => c + 1);
          return prevQueue;
        }
        return [...prevQueue, newReq];
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [trafficRps, maxQueueSize, isServerAlive, isPaused]);

  // Worker Dispatcher Tick
  useEffect(() => {
    if (!isServerAlive || isPaused) return;

    const dispatchTimer = setInterval(() => {
      setWorkers(currentWorkers => {
        let queueCopy = [...queue];
        const nextWorkers = currentWorkers.map(w => {
          if (!w.activeRequest && queueCopy.length > 0) {
            const req = queueCopy.shift()!;
            req.status = "processing";
            req.workerId = w.id;

            setTimeout(() => {
              setWorkers(ws => ws.map(item => item.id === w.id ? { ...item, activeRequest: null } : item));
              setCompletedCount(c => c + 1);
            }, serviceTimeMs);

            return { ...w, activeRequest: req };
          }
          return w;
        });

        if (queueCopy.length !== queue.length) {
          setQueue(queueCopy);
        }

        const activeCount = nextWorkers.filter(w => w.activeRequest !== null).length;
        const targetCpu = Math.min(100, Math.round((activeCount / workerCount) * 85 + (queueCopy.length > 0 ? 15 : 5)));
        const targetMem = Math.min(100, Math.round(25 + (queueCopy.length / maxQueueSize) * 45 + activeCount * 7));
        
        setCpuUsage(targetCpu);
        setMemoryUsage(targetMem);

        return nextWorkers;
      });
    }, 40);

    return () => clearInterval(dispatchTimer);
  }, [queue, workerCount, serviceTimeMs, maxQueueSize, isServerAlive, isPaused]);

  const handleReset = () => {
    setQueue([]);
    setWorkers(workers.map(w => ({ ...w, activeRequest: null })));
    setCompletedCount(0);
    setDroppedCount(0);
    setCpuUsage(10);
    setMemoryUsage(25);
  };

  const maxThroughput = Math.round((workerCount * 1000) / serviceTimeMs);
  const isOverloaded = trafficRps > maxThroughput;

  return (
    <div className="border border-theme-border bg-theme-card text-theme-text font-sans">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-theme-border flex flex-wrap items-center justify-between gap-3 bg-theme-bg">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border border-theme-border bg-theme-card flex items-center justify-center text-theme-primary">
            <Server className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold tracking-tight text-theme-text flex items-center gap-2">
              Application Server & Concurrency Engine
              <span className="text-[9px] font-mono uppercase bg-theme-cardElevated border border-theme-border text-theme-primary px-1.5 py-0.5">
                LAB // 03
              </span>
            </h3>
          </div>
        </div>

        {/* Server Controls */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-2.5 py-1 border border-theme-border hover:border-theme-primary bg-theme-card text-theme-text transition flex items-center gap-1.5"
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span>{isPaused ? "RESUME" : "PAUSE"}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1 border border-theme-border hover:border-theme-muted bg-theme-card text-theme-muted hover:text-theme-text transition"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsServerAlive(!isServerAlive)}
            className={`px-3 py-1 font-semibold uppercase tracking-wider transition border ${
              isServerAlive
                ? "border-theme-border text-theme-muted hover:text-theme-text bg-theme-card"
                : "border-theme-error text-theme-error bg-theme-cardElevated"
            }`}
          >
            {isServerAlive ? "CHAOS: CRASH" : "REBOOT"}
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Sliders Configuration Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-theme-border bg-theme-bg font-mono text-xs">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-theme-muted">TRAFFIC INGRESS</span>
              <span className="text-theme-primary font-bold">{trafficRps} RPS</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={trafficRps}
              onChange={(e) => setTrafficRps(Number(e.target.value))}
              className="w-full h-1 bg-theme-border appearance-none cursor-pointer accent-theme-primary"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-theme-muted">WORKER THREADS</span>
              <span className="text-theme-text font-bold">{workerCount} THREADS</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={workerCount}
              onChange={(e) => setWorkerCount(Number(e.target.value))}
              className="w-full h-1 bg-theme-border appearance-none cursor-pointer accent-theme-primary"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-theme-muted">SERVICE TIME</span>
              <span className="text-theme-text font-bold">{serviceTimeMs} MS</span>
            </div>
            <input
              type="range"
              min="40"
              max="400"
              step="20"
              value={serviceTimeMs}
              onChange={(e) => setServiceTimeMs(Number(e.target.value))}
              className="w-full h-1 bg-theme-border appearance-none cursor-pointer accent-theme-primary"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-theme-muted">BUFFER DEPTH</span>
              <span className="text-theme-text font-bold">{maxQueueSize} REQS</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="2"
              value={maxQueueSize}
              onChange={(e) => setMaxQueueSize(Number(e.target.value))}
              className="w-full h-1 bg-theme-border appearance-none cursor-pointer accent-theme-primary"
            />
          </div>
        </div>

        {/* Telemetry Metric Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3.5 border border-theme-border bg-theme-bg text-center">
            <div className="text-[10px] text-theme-muted uppercase">CPU UTILIZATION</div>
            <div className="text-xl font-bold mt-1 text-theme-text">
              {isServerAlive ? `${cpuUsage}%` : "OFFLINE"}
            </div>
            <div className="w-full bg-theme-border h-1 mt-2">
              <div 
                className="h-full bg-theme-primary transition-all duration-200"
                style={{ width: `${isServerAlive ? cpuUsage : 0}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 border border-theme-border bg-theme-bg text-center">
            <div className="text-[10px] text-theme-muted uppercase">QUEUE BUFFER</div>
            <div className="text-xl font-bold mt-1 text-theme-accent">
              {queue.length} / {maxQueueSize}
            </div>
            <div className="w-full bg-theme-border h-1 mt-2">
              <div 
                className="h-full bg-theme-accent transition-all duration-200"
                style={{ width: `${(queue.length / maxQueueSize) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 border border-theme-border bg-theme-bg text-center">
            <div className="text-[10px] text-theme-muted uppercase">200 OK HANDLED</div>
            <div className="text-xl font-bold mt-1 text-theme-text">
              {completedCount}
            </div>
            <div className="text-[10px] text-theme-muted mt-1">Successfully Served</div>
          </div>

          <div className="p-3.5 border border-theme-border bg-theme-bg text-center">
            <div className="text-[10px] text-theme-muted uppercase">504 / 429 DROPS</div>
            <div className={`text-xl font-bold mt-1 ${droppedCount > 0 ? "text-theme-error" : "text-theme-muted"}`}>
              {droppedCount}
            </div>
            <div className="text-[10px] text-theme-muted mt-1">
              {droppedCount > 0 ? "Buffer Saturated" : "Zero Drops"}
            </div>
          </div>
        </div>

        {/* Process Architecture Layout */}
        <div className="p-4 border border-theme-border bg-theme-bg space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-theme-border pb-2">
            <span className="font-bold text-theme-text flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-theme-primary" />
              PROCESS TOPOLOGY & THREAD POOL
            </span>
            <div className="text-theme-muted">
              MAX CAPACITY: <strong className="text-theme-text">{maxThroughput} RPS</strong>
              {isOverloaded && <span className="text-theme-warning ml-2 font-bold">[OVERLOAD HAZARD]</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* FIFO Buffer */}
            <div className="md:col-span-5 p-3 border border-theme-border bg-theme-card space-y-2">
              <div className="text-[10px] uppercase text-theme-muted flex justify-between">
                <span>FIFO INTAKE BUFFER</span>
                <span>{queue.length} WAITING</span>
              </div>
              <div className="flex flex-wrap gap-1 min-h-[44px] items-center p-2 bg-theme-bg border border-theme-border">
                {queue.length === 0 ? (
                  <span className="text-[10px] text-theme-muted">Buffer empty</span>
                ) : (
                  queue.map((req) => (
                    <div
                      key={req.id}
                      className="px-1.5 py-0.5 bg-theme-cardElevated border border-theme-border text-theme-primary text-[10px]"
                    >
                      #{req.id}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="md:col-span-1 flex justify-center text-theme-muted">
              &rarr;
            </div>

            {/* Worker Pool */}
            <div className="md:col-span-6 p-3 border border-theme-border bg-theme-card space-y-2">
              <div className="text-[10px] uppercase text-theme-muted">
                CONCURRENT WORKERS ({workers.length})
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {workers.map((w) => {
                  const isBusy = w.activeRequest !== null;
                  return (
                    <div
                      key={w.id}
                      className={`p-2 border text-center transition ${
                        !isServerAlive
                          ? "border-theme-border bg-theme-bg opacity-40 text-theme-muted"
                          : isBusy
                          ? "border-theme-primary bg-theme-primary/10 text-theme-text"
                          : "border-theme-border bg-theme-bg text-theme-muted"
                      }`}
                    >
                      <div className="font-bold text-[10px]">W#{w.id}</div>
                      <div className="text-[9px] mt-0.5 truncate">
                        {isBusy ? (
                          <span className="text-theme-primary font-bold">REQ #{w.activeRequest?.id}</span>
                        ) : (
                          "IDLE"
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
