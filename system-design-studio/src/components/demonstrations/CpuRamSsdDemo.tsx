import React, { useState } from "react";
import { Cpu, Layers, HardDrive, AlertTriangle, CheckCircle2, RotateCcw, Activity } from "lucide-react";

export function CpuRamSsdDemo() {
  const [ramSizeGb, setRamSizeGb] = useState<number>(4);
  const [datasetSizeGb, setDatasetSizeGb] = useState<number>(3);
  const [workloadType, setWorkloadType] = useState<"standard" | "cpu-heavy" | "io-heavy">("standard");

  const isSwapping = datasetSizeGb > ramSizeGb;
  const memoryUtilization = Math.min(100, Math.round((datasetSizeGb / ramSizeGb) * 100));

  // Illustrative calculated metrics
  const estimatedLatencyMs = isSwapping
    ? 2400
    : workloadType === "cpu-heavy"
    ? 45
    : workloadType === "io-heavy"
    ? 120
    : 8;

  const cpuLoadPercent = workloadType === "cpu-heavy" ? 95 : isSwapping ? 30 : 25;
  const diskIoPercent = isSwapping ? 98 : workloadType === "io-heavy" ? 85 : 15;

  return (
    <div className="p-5 rounded-2xl bg-studio-900 border border-studio-700/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-studio-700/60 gap-2">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 font-bold">
            INTERACTIVE HARDWARE EXPERIMENT
          </span>
          <h3 className="text-base font-bold text-white mt-1">CPU, RAM &amp; SSD Bottleneck Visualizer</h3>
        </div>
        <button
          onClick={() => {
            setRamSizeGb(4);
            setDatasetSizeGb(3);
            setWorkloadType("standard");
          }}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Illustrative Disclaimer */}
      <div className="p-2.5 rounded-xl bg-studio-850 border border-studio-750 text-[11px] text-slate-400 font-mono">
        <span className="text-accent-amber font-semibold">Note:</span> Latency and utilization figures are illustrative educational models to demonstrate bottleneck transitions, not real hardware benchmarks.
      </div>

      {/* Physical Hardware Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU Node */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
          cpuLoadPercent > 85 ? "bg-accent-amber/10 border-accent-amber" : "bg-studio-850/80 border-studio-700"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-accent-cyan flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> CPU (Processor)
            </span>
            <span className="text-[10px] font-mono text-slate-400">4 Cores @ 3.2GHz</span>
          </div>

          <div className="my-4 text-center">
            <div className="text-2xl font-bold font-mono text-white">{cpuLoadPercent}%</div>
            <span className="text-[11px] text-slate-400">Compute Load</span>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-studio-750 pt-2">
            Speed: ~1 nanosecond per clock cycle
          </div>
        </div>

        {/* RAM Node */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
          isSwapping ? "bg-accent-rose/15 border-accent-rose shadow-lg shadow-accent-rose/20 animate-pulse" : "bg-studio-850/80 border-studio-700"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-accent-purple flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> RAM (Working Memory)
            </span>
            <span className="text-[10px] font-mono text-slate-300 font-bold">{ramSizeGb} GB Total</span>
          </div>

          <div className="my-4 text-center">
            <div className={`text-2xl font-bold font-mono ${isSwapping ? "text-accent-rose" : "text-white"}`}>
              {datasetSizeGb} GB / {ramSizeGb} GB
            </div>
            <span className="text-[11px] text-slate-400">
              {isSwapping ? "🚨 RAM OVERFLOW (100% Full)" : `${memoryUtilization}% Utilized`}
            </span>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-studio-750 pt-2">
            Access: ~100 nanoseconds (Volatile)
          </div>
        </div>

        {/* SSD Disk Node */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
          diskIoPercent > 80 ? "bg-accent-rose/15 border-accent-rose" : "bg-studio-850/80 border-studio-700"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-brand-500 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4" /> NVMe SSD (Persistent)
            </span>
            <span className="text-[10px] font-mono text-slate-400">512 GB Durable</span>
          </div>

          <div className="my-4 text-center">
            <div className={`text-2xl font-bold font-mono ${diskIoPercent > 80 ? "text-accent-rose" : "text-white"}`}>
              {diskIoPercent}%
            </div>
            <span className="text-[11px] text-slate-400">
              {isSwapping ? "Extreme Swapping I/O" : "Normal Disk I/O"}
            </span>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-studio-750 pt-2">
            Access: ~100 microseconds (Durable)
          </div>
        </div>
      </div>

      {/* Dynamic Bottleneck Feedback Banner */}
      {isSwapping ? (
        <div className="p-4 rounded-xl bg-accent-rose/15 border border-accent-rose/40 text-accent-rose text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-sm">
            <AlertTriangle className="w-4 h-4" /> CRITICAL BOTTLENECK: Disk Swapping Activated!
          </div>
          <p className="leading-relaxed text-slate-200 text-xs">
            The active dataset ({datasetSizeGb}GB) exceeds physical RAM ({ramSizeGb}GB). The Operating System is paging memory to SSD disk. Because disk access is ~1,000× slower than RAM, average request latency surges from 8ms to <strong>{estimatedLatencyMs}ms</strong>!
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-500" />
            <span>RAM is healthy. All active data fits in fast working memory (~{estimatedLatencyMs}ms latency).</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">Status: Optimal</span>
        </div>
      )}

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-studio-700/60">
        {/* RAM Size Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Physical RAM Size</span>
            <span className="font-mono text-accent-purple font-bold">{ramSizeGb} GB</span>
          </div>
          <input
            type="range"
            min="2"
            max="16"
            step="2"
            value={ramSizeGb}
            onChange={(e) => setRamSizeGb(Number(e.target.value))}
            className="w-full accent-accent-purple h-1.5 bg-studio-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>2GB</span>
            <span>8GB</span>
            <span>16GB</span>
          </div>
        </div>

        {/* Dataset Size Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-medium">Active Working Dataset</span>
            <span className="font-mono text-accent-cyan font-bold">{datasetSizeGb} GB</span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            step="1"
            value={datasetSizeGb}
            onChange={(e) => setDatasetSizeGb(Number(e.target.value))}
            className="w-full accent-accent-cyan h-1.5 bg-studio-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>1GB</span>
            <span>6GB</span>
            <span>12GB</span>
          </div>
        </div>

        {/* Workload Type Selector */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-300 font-medium block">Workload Profile</span>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: "standard", label: "Web API" },
              { id: "cpu-heavy", label: "Crypto/Math" },
              { id: "io-heavy", label: "File I/O" },
            ].map((w) => (
              <button
                key={w.id}
                onClick={() => setWorkloadType(w.id as typeof workloadType)}
                className={`py-1.5 px-2 text-[11px] rounded-lg font-medium transition ${
                  workloadType === w.id
                    ? "bg-accent-cyan text-studio-950 font-bold"
                    : "bg-studio-850 hover:bg-studio-800 text-slate-300 border border-studio-700"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

