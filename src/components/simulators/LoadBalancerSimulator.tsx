"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  GitFork, 
  Server, 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  Terminal
} from "lucide-react";

interface BackendServer {
  id: string;
  name: string;
  isAlive: boolean;
  activeConnections: number;
  totalServed: number;
  healthCheckFails: number;
}

export function LoadBalancerSimulator() {
  const [algorithm, setAlgorithm] = useState<"round_robin" | "least_conn" | "random" | "ip_hash">("round_robin");
  const [trafficRate, setTrafficRate] = useState<"low" | "medium" | "high">("medium");
  const [isPaused, setIsPaused] = useState(false);

  const [servers, setServers] = useState<BackendServer[]>([
    { id: "srv-a", name: "Backend Cluster A", isAlive: true, activeConnections: 0, totalServed: 0, healthCheckFails: 0 },
    { id: "srv-b", name: "Backend Cluster B", isAlive: true, activeConnections: 0, totalServed: 0, healthCheckFails: 0 },
    { id: "srv-c", name: "Backend Cluster C", isAlive: true, activeConnections: 0, totalServed: 0, healthCheckFails: 0 },
  ]);

  const [lastRoutedServerId, setLastRoutedServerId] = useState<string | null>(null);
  const [healthLog, setHealthLog] = useState<string[]>([
    "Health checker active. Probing /healthz every 1500ms on all backends."
  ]);

  const rrIndex = useRef(0);
  const clientIps = useRef(["192.168.1.10", "10.0.4.82", "172.16.2.14", "192.168.1.99"]);
  const ipIndex = useRef(0);

  // Health Check Heartbeat loop
  useEffect(() => {
    const healthTimer = setInterval(() => {
      setServers(prev => prev.map(srv => {
        if (!srv.isAlive) {
          const nextFails = srv.healthCheckFails + 1;
          if (nextFails === 2) {
            setHealthLog(log => [
              `[ALERT] Health check failed for ${srv.name}. EVICTED from cluster rotation.`,
              ...log.slice(0, 4)
            ]);
          }
          return { ...srv, healthCheckFails: nextFails };
        } else {
          if (srv.healthCheckFails > 0) {
            setHealthLog(log => [
              `[RECOVER] Health check passed for ${srv.name}. RESTORED to pool.`,
              ...log.slice(0, 4)
            ]);
          }
          return { ...srv, healthCheckFails: 0 };
        }
      }));
    }, 1800);

    return () => clearInterval(healthTimer);
  }, []);

  // Request Traffic Dispatcher
  useEffect(() => {
    if (isPaused) return;

    const intervalMap = { low: 1200, medium: 600, high: 250 };
    const intervalMs = intervalMap[trafficRate];

    const trafficTimer = setInterval(() => {
      setServers(currentServers => {
        const healthyServers = currentServers.filter(s => s.isAlive && s.healthCheckFails < 2);

        if (healthyServers.length === 0) {
          setHealthLog(log => ["[FATAL] All backend nodes down! HTTP 502 Bad Gateway.", ...log.slice(0, 4)]);
          return currentServers;
        }

        let target: BackendServer;

        if (algorithm === "round_robin") {
          target = healthyServers[rrIndex.current % healthyServers.length];
          rrIndex.current++;
        } else if (algorithm === "least_conn") {
          const sorted = [...healthyServers].sort((a, b) => a.activeConnections - b.activeConnections);
          target = sorted[0];
        } else if (algorithm === "ip_hash") {
          const ip = clientIps.current[ipIndex.current % clientIps.current.length];
          ipIndex.current++;
          const hash = ip.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
          target = healthyServers[hash % healthyServers.length];
        } else {
          const randIdx = Math.floor(Math.random() * healthyServers.length);
          target = healthyServers[randIdx];
        }

        setLastRoutedServerId(target.id);

        return currentServers.map(s => {
          if (s.id === target.id) {
            const nextActive = s.activeConnections + 1;
            setTimeout(() => {
              setServers(srvs => srvs.map(item => item.id === target.id ? { ...item, activeConnections: Math.max(0, item.activeConnections - 1) } : item));
            }, 350);

            return {
              ...s,
              activeConnections: nextActive,
              totalServed: s.totalServed + 1,
            };
          }
          return s;
        });
      });
    }, intervalMs);

    return () => clearInterval(trafficTimer);
  }, [algorithm, trafficRate, isPaused]);

  const toggleServerHealth = (id: string) => {
    setServers(prev => prev.map(s => {
      if (s.id === id) {
        const nextAlive = !s.isAlive;
        if (!nextAlive) {
          setHealthLog(l => [`[CHAOS] Simulated failure injected into ${s.name}`, ...l.slice(0, 4)]);
        }
        return { ...s, isAlive: nextAlive, healthCheckFails: nextAlive ? 0 : s.healthCheckFails };
      }
      return s;
    }));
  };

  const handleReset = () => {
    setServers(prev => prev.map(s => ({ ...s, isAlive: true, activeConnections: 0, totalServed: 0, healthCheckFails: 0 })));
    setHealthLog(["Cluster reset to initial baseline."]);
  };

  const totalAllServed = servers.reduce((acc, s) => acc + s.totalServed, 0);

  return (
    <div className="border border-theme-border bg-theme-card text-theme-text font-sans">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-theme-border flex flex-wrap items-center justify-between gap-3 bg-theme-bg">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border border-theme-border bg-theme-card flex items-center justify-center text-theme-primary">
            <GitFork className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold tracking-tight text-theme-text flex items-center gap-2">
              Load Balancer & Failover Simulation
              <span className="text-[9px] font-mono uppercase bg-theme-cardElevated border border-theme-border text-theme-primary px-1.5 py-0.5">
                LAB // 06
              </span>
            </h3>
          </div>
        </div>

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
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Strategy Selector & Traffic Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="text-theme-muted block mb-2 font-bold uppercase text-[10px]">
              ROUTING ALGORITHM
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "round_robin", label: "Round Robin", desc: "Even sequential rotation" },
                { id: "least_conn", label: "Least Connections", desc: "Routes to idle server" },
                { id: "ip_hash", label: "IP Sticky Hash", desc: "Same client -> same server" },
                { id: "random", label: "Random", desc: "Uniform pseudo-random" },
              ].map(algo => (
                <button
                  key={algo.id}
                  onClick={() => setAlgorithm(algo.id as any)}
                  className={`p-2.5 border text-left transition ${
                    algorithm === algo.id
                      ? "border-theme-primary bg-theme-primary/10 text-theme-text"
                      : "border-theme-border bg-theme-bg text-theme-muted hover:border-theme-borderLight"
                  }`}
                >
                  <div className="font-bold">{algo.label}</div>
                  <div className="text-[10px] text-theme-muted font-sans mt-0.5">{algo.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-theme-muted block mb-2 font-bold uppercase text-[10px]">
              INGRESS TRAFFIC VOLUME
            </label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map(rate => (
                <button
                  key={rate}
                  onClick={() => setTrafficRate(rate)}
                  className={`flex-1 py-2 text-xs font-bold uppercase transition border ${
                    trafficRate === rate
                      ? "border-theme-primary bg-theme-primary/10 text-theme-primary"
                      : "border-theme-border bg-theme-bg text-theme-muted hover:border-theme-borderLight"
                  }`}
                >
                  {rate}
                </button>
              ))}
            </div>

            <div className="mt-3 p-3 border border-theme-border bg-theme-bg text-xs text-theme-muted space-y-1">
              <div className="flex justify-between">
                <span>TOTAL HANDLED:</span>
                <span className="font-bold text-theme-text">{totalAllServed} REQS</span>
              </div>
              <div className="flex justify-between">
                <span>HEALTHY NODES:</span>
                <span className="font-bold text-theme-primary">
                  {servers.filter(s => s.isAlive && s.healthCheckFails < 2).length} / {servers.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Architecture Routing Topology */}
        <div className="p-4 border border-theme-border bg-theme-bg font-mono text-xs space-y-3">
          <div className="text-[10px] text-theme-muted uppercase font-bold flex items-center gap-1.5 pb-2 border-b border-theme-border">
            <Terminal className="w-3.5 h-3.5 text-theme-primary" />
            BACKEND CLUSTER TOPOLOGY
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {servers.map((srv) => {
              const isHealthy = srv.isAlive && srv.healthCheckFails < 2;
              const isJustRouted = lastRoutedServerId === srv.id;
              const sharePct = totalAllServed > 0 ? Math.round((srv.totalServed / totalAllServed) * 100) : 33;

              return (
                <div
                  key={srv.id}
                  className={`p-4 border transition ${
                    !isHealthy
                      ? "border-theme-error/50 bg-theme-card opacity-50"
                      : isJustRouted
                      ? "border-theme-primary bg-theme-primary/10 text-theme-text"
                      : "border-theme-border bg-theme-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Server className="w-3.5 h-3.5 text-theme-primary" />
                      <span className="font-bold text-theme-text">{srv.name}</span>
                    </div>
                    <span className={`text-[10px] ${isHealthy ? "text-theme-primary" : "text-theme-error"}`}>
                      [{isHealthy ? "HEALTHY" : "OFFLINE"}]
                    </span>
                  </div>

                  <div className="space-y-1.5 mt-3 text-xs">
                    <div className="flex justify-between text-theme-muted">
                      <span>Active Conns:</span>
                      <span className="text-theme-text font-bold">{srv.activeConnections}</span>
                    </div>
                    <div className="flex justify-between text-theme-muted">
                      <span>Total Requests:</span>
                      <span className="text-theme-text font-bold">{srv.totalServed}</span>
                    </div>
                    <div className="flex justify-between text-theme-muted">
                      <span>Traffic Share:</span>
                      <span className="text-theme-accent font-bold">{sharePct}%</span>
                    </div>

                    <div className="w-full bg-theme-border h-1 mt-1">
                      <div
                        className="bg-theme-primary h-full transition-all duration-300"
                        style={{ width: `${sharePct}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => toggleServerHealth(srv.id)}
                    className="w-full mt-4 py-1 border border-theme-border hover:border-theme-primary text-theme-muted hover:text-theme-text text-xs uppercase tracking-wider transition"
                  >
                    {srv.isAlive ? "Crash Node" : "Revive Node"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Heartbeat Log */}
        <div className="p-3 border border-theme-border bg-theme-bg font-mono text-[11px] text-theme-muted space-y-1">
          <div className="text-theme-muted text-[10px] uppercase font-bold mb-1">
            HEARTBEAT TELEMETRY
          </div>
          {healthLog.map((log, idx) => (
            <div key={idx} className="truncate text-theme-secondary">
              {log}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
