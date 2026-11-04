"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { 
  Globe, 
  Activity, 
  Layers, 
  Zap, 
  Server, 
  Cpu, 
  Database, 
  Copy, 
  Box, 
  Archive, 
  ShieldCheck, 
  BarChart3, 
  Sliders
} from "lucide-react";

export interface SystemNodeData {
  label: string;
  type: string;
  capacityRps: number;
  baseLatencyMs: number;
  isFailing: boolean;
  cacheHitRate?: number;
  currentLoadRps?: number;
  saturationPercent?: number;
  droppedRps?: number;
  [key: string]: unknown;
}

const ICON_MAP: Record<string, React.ElementType> = {
  client: Globe,
  dns: Activity,
  cdn: Layers,
  api_gateway: ShieldCheck,
  load_balancer: Sliders,
  web_server: Server,
  app_server: Cpu,
  database: Database,
  read_replica: Copy,
  cache: Zap,
  message_queue: Box,
  worker: Cpu,
  object_storage: Archive,
  auth_service: ShieldCheck,
  monitoring: BarChart3,
};

export const SystemCustomNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as SystemNodeData;
  const Icon = ICON_MAP[nodeData.type] || Box;
  const saturation = nodeData.saturationPercent ?? 0;
  const isHighSaturation = saturation >= 85;

  // Geometric component visualization badge based on type
  const renderComponentGlyph = () => {
    switch (nodeData.type) {
      case "database":
      case "read_replica":
        return (
          <div className="w-4 h-4 border border-theme-accent flex flex-col justify-between py-0.5 px-0.5 bg-theme-card">
            <div className="h-0.5 bg-theme-accent w-full" />
            <div className="h-0.5 bg-theme-muted w-full" />
            <div className="h-0.5 bg-theme-accent w-full" />
          </div>
        );
      case "server":
      case "app_server":
      case "web_server":
        return (
          <div className="w-4 h-4 border border-theme-primary flex flex-col justify-around py-0.5 px-0.5 bg-theme-card">
            <div className="flex justify-between items-center w-full">
              <div className="w-1 h-1 bg-theme-primary" />
              <div className="w-1.5 h-0.5 bg-theme-muted" />
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="w-1 h-1 bg-theme-primary" />
              <div className="w-1.5 h-0.5 bg-theme-muted" />
            </div>
          </div>
        );
      case "cache":
        return (
          <div className="w-4 h-4 border border-theme-accent grid grid-cols-2 gap-0.5 p-0.5 bg-theme-card">
            <div className="bg-theme-accent w-full h-full" />
            <div className="bg-theme-bg w-full h-full" />
            <div className="bg-theme-bg w-full h-full" />
            <div className="bg-theme-accent w-full h-full" />
          </div>
        );
      case "message_queue":
        return (
          <div className="w-4 h-4 border border-theme-muted flex items-center justify-between px-0.5 bg-theme-card">
            <div className="w-0.5 h-2.5 bg-theme-primary" />
            <div className="w-0.5 h-2.5 bg-theme-accent" />
            <div className="w-0.5 h-2.5 bg-theme-muted" />
          </div>
        );
      default:
        return <Icon className="w-3.5 h-3.5 text-theme-primary" />;
    }
  };

  return (
    <div
      className={`relative min-w-[190px] border font-mono transition-all duration-150 ${
        nodeData.isFailing
          ? "border-theme-error bg-theme-card text-theme-text shadow-md"
          : isHighSaturation
          ? "border-theme-warning bg-theme-cardElevated"
          : selected
          ? "border-theme-primary bg-theme-card shadow-lg ring-1 ring-theme-primary"
          : "border-theme-border bg-theme-card hover:border-theme-borderLight"
      }`}
    >
      {/* Target input handle (Left and Top) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !rounded-none !bg-theme-accent !border !border-theme-bg hover:scale-125 transition"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !rounded-none !bg-theme-accent !border !border-theme-bg hover:scale-125 transition"
      />

      {/* Node Header */}
      <div className="p-2.5 border-b border-theme-border bg-theme-bg flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          {renderComponentGlyph()}
          <span className="font-display font-bold text-theme-text text-xs tracking-tight">
            {nodeData.label}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {nodeData.isFailing ? (
            <span className="text-[9px] text-theme-error uppercase font-bold">[CRASHED]</span>
          ) : (
            <span className="text-[9px] text-theme-muted uppercase font-bold">
              {nodeData.type.substring(0, 4)}
            </span>
          )}
        </div>
      </div>

      {/* Node Metrics Body */}
      <div className="p-2.5 space-y-1.5 text-[10px] text-theme-muted bg-theme-card">
        <div className="flex justify-between items-center">
          <span className="text-theme-muted">CAPACITY:</span>
          <span className="text-theme-text font-bold">
            {nodeData.capacityRps ? nodeData.capacityRps.toLocaleString() : 2000} RPS
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-theme-muted">BASE LATENCY:</span>
          <span className="text-theme-accent font-bold">
            {nodeData.baseLatencyMs || 10} MS
          </span>
        </div>

        {/* Live Load Telemetry (When simulated) */}
        {nodeData.currentLoadRps !== undefined && (
          <div className="pt-1.5 border-t border-theme-border space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-theme-muted">CURRENT LOAD:</span>
              <span className="text-theme-text font-bold">
                {nodeData.currentLoadRps.toLocaleString()} RPS
              </span>
            </div>

            <div className="w-full bg-theme-border h-1">
              <div
                className="h-full bg-theme-primary transition-all duration-200"
                style={{ width: `${Math.min(100, saturation)}%` }}
              />
            </div>

            {nodeData.droppedRps && nodeData.droppedRps > 0 ? (
              <div className="text-[9px] text-theme-error font-bold">
                DROPPING: {nodeData.droppedRps.toLocaleString()} RPS
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Source output handle (Right and Bottom) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !rounded-none !bg-theme-primary !border !border-theme-bg hover:scale-125 transition"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !rounded-none !bg-theme-primary !border !border-theme-bg hover:scale-125 transition"
      />
    </div>
  );
});

SystemCustomNode.displayName = "SystemCustomNode";
