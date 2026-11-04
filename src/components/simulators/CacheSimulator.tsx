"use client";

import React, { useState, useEffect } from "react";
import { 
  Zap, 
  Database, 
  Clock, 
  Trash2, 
  Terminal
} from "lucide-react";

interface CacheItem {
  key: string;
  value: string;
  ttlSeconds: number;
  initialTtl: number;
  lastAccessed: number;
}

const DB_MOCK_STORE: Record<string, string> = {
  "user:101": '{"id": 101, "name": "Elena Rostova", "tier": "Enterprise"}',
  "user:102": '{"id": 102, "name": "Marcus Vance", "tier": "Pro"}',
  "user:103": '{"id": 103, "name": "Chloe Martin", "tier": "Free"}',
  "product:42": '{"id": 42, "sku": "GEO-CACHE-01", "stock": 1420}',
};

export function CacheSimulator() {
  const [cacheItems, setCacheItems] = useState<CacheItem[]>([
    { key: "user:101", value: DB_MOCK_STORE["user:101"], ttlSeconds: 12, initialTtl: 15, lastAccessed: Date.now() },
  ]);

  const [activeQueryKey, setActiveQueryKey] = useState<string | null>(null);
  const [lastQueryStatus, setLastQueryStatus] = useState<"HIT" | "MISS" | null>(null);
  const [lastQueryLatency, setLastQueryLatency] = useState<number | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const [hitCount, setHitCount] = useState(1);
  const [missCount, setMissCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCacheItems(prev => 
        prev
          .map(item => ({ ...item, ttlSeconds: item.ttlSeconds - 1 }))
          .filter(item => item.ttlSeconds > 0)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleQuery = async (key: string) => {
    if (isQuerying) return;
    setIsQuerying(true);
    setActiveQueryKey(key);
    setLastQueryStatus(null);
    setLastQueryLatency(null);

    const existingIndex = cacheItems.findIndex(i => i.key === key);

    if (existingIndex !== -1) {
      await new Promise(r => setTimeout(r, 180));
      setHitCount(h => h + 1);
      setLastQueryStatus("HIT");
      setLastQueryLatency(1.4);

      setCacheItems(prev => {
        const copy = [...prev];
        copy[existingIndex].lastAccessed = Date.now();
        return copy;
      });
      setIsQuerying(false);
      return;
    }

    await new Promise(r => setTimeout(r, 650));
    setMissCount(m => m + 1);
    setLastQueryStatus("MISS");
    setLastQueryLatency(94);

    const dbVal = DB_MOCK_STORE[key] || '{"error": "not found"}';

    setCacheItems(prev => {
      let nextItems = [...prev];
      if (nextItems.length >= 3) {
        nextItems.sort((a, b) => a.lastAccessed - b.lastAccessed);
        nextItems.shift();
      }

      nextItems.push({
        key,
        value: dbVal,
        ttlSeconds: 15,
        initialTtl: 15,
        lastAccessed: Date.now(),
      });
      return nextItems;
    });

    setIsQuerying(false);
  };

  const handleInvalidate = (key: string) => {
    setCacheItems(prev => prev.filter(i => i.key !== key));
  };

  const handleFlush = () => {
    setCacheItems([]);
  };

  const totalQueries = hitCount + missCount;
  const hitRatio = totalQueries > 0 ? Math.round((hitCount / totalQueries) * 100) : 0;

  return (
    <div className="border border-theme-border bg-theme-card text-theme-text font-sans">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-theme-border flex flex-wrap items-center justify-between gap-3 bg-theme-bg">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border border-theme-border bg-theme-card flex items-center justify-center text-theme-primary">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold tracking-tight text-theme-text flex items-center gap-2">
              In-Memory Cache & Cache-Aside Simulator
              <span className="text-[9px] font-mono uppercase bg-theme-cardElevated border border-theme-border text-theme-primary px-1.5 py-0.5">
                LAB // 05
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={handleFlush}
          className="px-2.5 py-1 border border-theme-border hover:border-theme-primary bg-theme-card text-theme-muted hover:text-theme-text transition text-xs font-mono uppercase flex items-center gap-1.5"
        >
          <Trash2 className="w-3 h-3" />
          <span>Flush Cache</span>
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Keys Query Bar */}
        <div>
          <label className="text-[10px] font-mono uppercase text-theme-muted block mb-2 font-bold">
            CLIENT KEY REQUESTS [CACHE-ASIDE PATTERN]
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            {Object.keys(DB_MOCK_STORE).map((k) => (
              <button
                key={k}
                onClick={() => handleQuery(k)}
                disabled={isQuerying}
                className="p-3 border border-theme-border bg-theme-bg hover:border-theme-primary text-left transition disabled:opacity-40"
              >
                <div className="font-bold text-theme-text">
                  GET {k}
                </div>
                <div className="text-[10px] text-theme-muted mt-1">
                  {cacheItems.some(i => i.key === k) ? "🟢 In RAM" : "⚪ Cold (Needs DB)"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3.5 border border-theme-border bg-theme-bg text-center">
            <div className="text-[10px] text-theme-muted uppercase">CACHE HIT RATIO</div>
            <div className="text-xl font-bold mt-1 text-theme-primary">
              {hitRatio}%
            </div>
            <div className="text-[10px] text-theme-muted mt-0.5">{hitCount} Hits / {missCount} Misses</div>
          </div>

          <div className="p-3.5 border border-theme-border bg-theme-bg text-center">
            <div className="text-[10px] text-theme-muted uppercase">LAST STATUS</div>
            <div className="text-xl font-bold mt-1 text-theme-text">
              {lastQueryStatus || "IDLE"}
            </div>
            <div className="text-[10px] text-theme-muted mt-0.5">
              {lastQueryStatus === "HIT" ? "Served from RAM" : lastQueryStatus === "MISS" ? "Fetched from Disk" : "Waiting"}
            </div>
          </div>

          <div className="p-3.5 border border-theme-border bg-theme-bg text-center">
            <div className="text-[10px] text-theme-muted uppercase">OBSERVED LATENCY</div>
            <div className="text-xl font-bold mt-1 text-theme-accent">
              {lastQueryLatency ? `${lastQueryLatency} ms` : "—"}
            </div>
            <div className="text-[10px] text-theme-muted mt-0.5">
              {lastQueryStatus === "HIT" ? "98% Faster" : "Standard DB Seek"}
            </div>
          </div>

          <div className="p-3.5 border border-theme-border bg-theme-bg text-center">
            <div className="text-[10px] text-theme-muted uppercase">SLOTS OCCUPIED</div>
            <div className="text-xl font-bold mt-1 text-theme-text">
              {cacheItems.length} / 3
            </div>
            <div className="text-[10px] text-theme-muted mt-0.5">LRU Policy Active</div>
          </div>
        </div>

        {/* In-Memory Cache Visual Storage */}
        <div className="p-4 border border-theme-border bg-theme-bg space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-theme-border pb-2">
            <span className="text-theme-text font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-theme-primary" />
              IN-MEMORY RAM ENTRIES (MAX 3)
            </span>
            <span className="text-theme-muted">{cacheItems.length} ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {cacheItems.length === 0 ? (
              <div className="col-span-3 py-6 text-center text-xs text-theme-muted">
                Cache is empty. Execute a GET query above to populate RAM.
              </div>
            ) : (
              cacheItems.map((item) => {
                const ttlPct = Math.round((item.ttlSeconds / item.initialTtl) * 100);

                return (
                  <div
                    key={item.key}
                    className="p-3 border border-theme-border bg-theme-card space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-theme-primary">{item.key}</span>
                      <button
                        onClick={() => handleInvalidate(item.key)}
                        className="text-[10px] text-theme-muted hover:text-theme-text underline"
                      >
                        Bust Key
                      </button>
                    </div>

                    <div className="p-2 bg-theme-bg border border-theme-border text-[10px] text-theme-secondary truncate">
                      {item.value}
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-theme-muted mb-1">
                        <span>TTL REMAINING:</span>
                        <span className="text-theme-primary font-bold">{item.ttlSeconds}s</span>
                      </div>
                      <div className="w-full bg-theme-border h-1">
                        <div
                          className="bg-theme-primary h-full transition-all duration-1000"
                          style={{ width: `${ttlPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Database Origin Note */}
        <div className="p-3 border border-theme-border bg-theme-bg flex items-center justify-between font-mono text-xs">
          <div className="flex items-center space-x-2 text-theme-text">
            <Database className="w-3.5 h-3.5 text-theme-accent" />
            <span>PERSISTENT DATABASE (DISK / NVMe SSD)</span>
          </div>
          <span className="text-theme-muted text-[11px]">
            Disk Latency: ~80-120ms vs RAM Latency: &lt; 2ms
          </span>
        </div>

      </div>
    </div>
  );
}
