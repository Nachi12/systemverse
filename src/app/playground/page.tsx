"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  BackgroundVariant,
  Panel,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { SystemCustomNode, SystemNodeData } from "@/components/playground/SystemCustomNode";
import { runSystemSimulation, SimulationNode, SimulationEdge } from "@/lib/simulation/simulationEngine";
import { useProgressStore } from "@/lib/store/useProgressStore";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  Flame,
  Zap,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Settings2,
  Box
} from "lucide-react";

const nodeTypes = {
  systemNode: SystemCustomNode,
};

// Preset sample architectures
const PRESET_ARCHITECTURES = {
  three_tier: {
    name: "Standard 3-Tier Web App",
    nodes: [
      { id: "client-1", type: "systemNode", position: { x: 50, y: 150 }, data: { label: "Web Clients", type: "client", capacityRps: 50000, baseLatencyMs: 5, isFailing: false } },
      { id: "dns-1", type: "systemNode", position: { x: 260, y: 150 }, data: { label: "Cloudflare DNS", type: "dns", capacityRps: 50000, baseLatencyMs: 2, isFailing: false } },
      { id: "lb-1", type: "systemNode", position: { x: 470, y: 150 }, data: { label: "Nginx Load Balancer", type: "load_balancer", capacityRps: 20000, baseLatencyMs: 4, isFailing: false } },
      { id: "app-1", type: "systemNode", position: { x: 700, y: 60 }, data: { label: "App Server A", type: "app_server", capacityRps: 2500, baseLatencyMs: 15, isFailing: false } },
      { id: "app-2", type: "systemNode", position: { x: 700, y: 240 }, data: { label: "App Server B", type: "app_server", capacityRps: 2500, baseLatencyMs: 15, isFailing: false } },
      { id: "db-1", type: "systemNode", position: { x: 940, y: 150 }, data: { label: "Postgres Primary", type: "database", capacityRps: 1800, baseLatencyMs: 22, isFailing: false } },
    ],
    edges: [
      { id: "e1", source: "client-1", target: "dns-1", animated: true },
      { id: "e2", source: "dns-1", target: "lb-1", animated: true },
      { id: "e3", source: "lb-1", target: "app-1", animated: true },
      { id: "e4", source: "lb-1", target: "app-2", animated: true },
      { id: "e5", source: "app-1", target: "db-1", animated: true },
      { id: "e6", source: "app-2", target: "db-1", animated: true },
    ],
  },
  cached_scale: {
    name: "High-Traffic with Redis Cache",
    nodes: [
      { id: "c1", type: "systemNode", position: { x: 50, y: 160 }, data: { label: "Mobile Apps", type: "client", capacityRps: 80000, baseLatencyMs: 5, isFailing: false } },
      { id: "cdn1", type: "systemNode", position: { x: 260, y: 160 }, data: { label: "Fastly CDN Edge", type: "cdn", capacityRps: 80000, baseLatencyMs: 3, isFailing: false, cacheHitRate: 0.6 } },
      { id: "lb1", type: "systemNode", position: { x: 480, y: 160 }, data: { label: "AWS ALB", type: "load_balancer", capacityRps: 30030, baseLatencyMs: 4, isFailing: false } },
      { id: "web1", type: "systemNode", position: { x: 700, y: 160 }, data: { label: "Golang Microservice", type: "app_server", capacityRps: 8000, baseLatencyMs: 8, isFailing: false } },
      { id: "redis1", type: "systemNode", position: { x: 930, y: 60 }, data: { label: "Redis Cluster", type: "cache", capacityRps: 35000, baseLatencyMs: 1.2, isFailing: false, cacheHitRate: 0.85 } },
      { id: "db1", type: "systemNode", position: { x: 930, y: 250 }, data: { label: "MySQL Shard 01", type: "database", capacityRps: 2000, baseLatencyMs: 25, isFailing: false } },
    ],
    edges: [
      { id: "e1", source: "c1", target: "cdn1", animated: true },
      { id: "e2", source: "cdn1", target: "lb1", animated: true },
      { id: "e3", source: "lb1", target: "web1", animated: true },
      { id: "e4", source: "web1", target: "redis1", animated: true },
      { id: "e5", source: "redis1", target: "db1", animated: true },
    ],
  },
  event_driven: {
    name: "Event-Driven with Kafka & Workers",
    nodes: [
      { id: "c1", type: "systemNode", position: { x: 50, y: 160 }, data: { label: "Clients", type: "client", capacityRps: 50000, baseLatencyMs: 5, isFailing: false } },
      { id: "gw1", type: "systemNode", position: { x: 270, y: 160 }, data: { label: "API Gateway (Kong)", type: "api_gateway", capacityRps: 35000, baseLatencyMs: 5, isFailing: false } },
      { id: "srv1", type: "systemNode", position: { x: 490, y: 160 }, data: { label: "Ingestion API", type: "web_server", capacityRps: 10000, baseLatencyMs: 10, isFailing: false } },
      { id: "kafka1", type: "systemNode", position: { x: 720, y: 160 }, data: { label: "Apache Kafka", type: "message_queue", capacityRps: 40000, baseLatencyMs: 6, isFailing: false } },
      { id: "wrk1", type: "systemNode", position: { x: 950, y: 80 }, data: { label: "Worker Cluster", type: "worker", capacityRps: 6000, baseLatencyMs: 20, isFailing: false } },
      { id: "s3_1", type: "systemNode", position: { x: 950, y: 240 }, data: { label: "S3 Object Store", type: "object_storage", capacityRps: 15000, baseLatencyMs: 30, isFailing: false } },
    ],
    edges: [
      { id: "e1", source: "c1", target: "gw1", animated: true },
      { id: "e2", source: "gw1", target: "srv1", animated: true },
      { id: "e3", source: "srv1", target: "kafka1", animated: true },
      { id: "e4", source: "kafka1", target: "wrk1", animated: true },
      { id: "e5", source: "kafka1", target: "s3_1", animated: true },
    ],
  },
};

export default function ArchitecturePlaygroundPage() {
  const [nodes, setNodes] = useState<Node[]>(PRESET_ARCHITECTURES.three_tier.nodes);
  const [edges, setEdges] = useState<Edge[]>(PRESET_ARCHITECTURES.three_tier.edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [trafficRps, setTrafficRps] = useState<number>(3000);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { unlockAchievement } = useProgressStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: "#38bdf8" },
            style: { stroke: "#38bdf8", strokeWidth: 2 },
          },
          eds
        )
      ),
    []
  );

  // Convert ReactFlow graph into Simulation format
  const simResult = useMemo(() => {
    if (!isSimulating) {
      return {
        totalIngressRps: 0,
        successfulRps: 0,
        droppedRps: 0,
        p50LatencyMs: 0,
        p99LatencyMs: 0,
        systemSaturationPercent: 0,
        bottleneckNodeId: null,
        bottleneckReason: null,
        nodeMetrics: {},
      };
    }

    const simNodes: SimulationNode[] = nodes.map((n) => {
      const data = n.data as unknown as SystemNodeData;
      return {
        id: n.id,
        name: data.label || n.id,
        type: (data.type as SimulationNode["type"]) || "app_server",
        capacityRps: data.capacityRps || 2000,
        baseLatencyMs: data.baseLatencyMs || 10,
        isFailing: !!data.isFailing,
        cacheHitRate: data.cacheHitRate ?? (data.type === "cache" ? 0.85 : undefined),
      };
    });

    const simEdges: SimulationEdge[] = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
    }));

    return runSystemSimulation(simNodes, simEdges, trafficRps);
  }, [nodes, edges, trafficRps, isSimulating]);

  // Trigger achievement safely in useEffect
  useEffect(() => {
    if (trafficRps >= 10000 && simResult.droppedRps === 0) {
      unlockAchievement("traffic_controller");
    }
  }, [trafficRps, simResult.droppedRps, unlockAchievement]);

  // Derive visual display nodes with simulation metrics without recursive state updates
  const displayNodes = useMemo(() => {
    if (!isSimulating) return nodes;

    return nodes.map((n) => {
      const metrics = simResult.nodeMetrics[n.id];
      if (!metrics) return n;

      const currentData = n.data as unknown as SystemNodeData;
      return {
        ...n,
        data: {
          ...currentData,
          currentLoadRps: metrics.currentLoadRps,
          saturationPercent: metrics.saturationPercent,
          droppedRps: metrics.droppedRps,
        },
      };
    });
  }, [nodes, simResult, isSimulating]);

  // Selected node object
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );
  const selectedNodeData = selectedNode ? (selectedNode.data as unknown as SystemNodeData) : null;

  // Handlers for modifying selected node
  const updateSelectedNodeData = (updates: Partial<SystemNodeData>) => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNodeId) {
          const prev = n.data as unknown as SystemNodeData;
          return {
            ...n,
            data: {
              ...prev,
              ...updates,
            },
          };
        }
        return n;
      })
    );
  };

  const handleAddNode = (type: string, label: string, defaultCap: number, defaultLat: number) => {
    const newId = `${type}-${Date.now().toString().slice(-4)}`;
    const newNode: Node = {
      id: newId,
      type: "systemNode",
      position: { x: 350 + Math.random() * 80, y: 150 + Math.random() * 80 },
      data: {
        label,
        type,
        capacityRps: defaultCap,
        baseLatencyMs: defaultLat,
        isFailing: false,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(newId);
  };

  const handleDeleteNode = () => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  };

  const handleDuplicateNode = () => {
    if (!selectedNode) return;
    const data = selectedNode.data as unknown as SystemNodeData;
    const newId = `${data.type}-${Date.now().toString().slice(-4)}`;
    const clonedNode: Node = {
      id: newId,
      type: "systemNode",
      position: { x: selectedNode.position.x + 40, y: selectedNode.position.y + 40 },
      data: {
        ...data,
        label: `${data.label} (Copy)`,
      },
    };
    setNodes((nds) => [...nds, clonedNode]);
    setSelectedNodeId(newId);
  };

  // Export JSON
  const handleExportJson = () => {
    const exported = JSON.stringify({ nodes, edges, trafficRps }, null, 2);
    const blob = new Blob([exported], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `systemverse-architecture-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] bg-theme-bg text-theme-muted font-mono text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-2 bg-theme-primary animate-ping" />
          <span>INITIALIZING ARCHITECTURE LAB...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-theme-bg text-theme-text overflow-hidden select-none font-mono">
      {/* Top Telemetry & Controls Toolbar */}
      <div className="px-4 py-2.5 bg-theme-card border-b border-theme-border flex flex-wrap items-center justify-between gap-4 z-20 text-xs">
        {/* Left: Preset blueprint switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-theme-muted font-bold">PRESETS:</span>
          {Object.entries(PRESET_ARCHITECTURES).map(([k, preset]) => (
            <button
              key={k}
              onClick={() => {
                setNodes(preset.nodes);
                setEdges(preset.edges);
                setSelectedNodeId(null);
              }}
              className="px-2.5 py-1 text-xs border border-theme-border bg-theme-bg hover:border-theme-primary text-theme-secondary hover:text-theme-text transition uppercase"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Center: Live Telemetry Gauges */}
        <div className="flex items-center space-x-4 bg-theme-bg px-4 py-1 border border-theme-border text-xs">
          <div>
            <span className="text-theme-muted text-[10px] block">INGRESS</span>
            <span className="text-theme-text font-bold">{trafficRps.toLocaleString()} RPS</span>
          </div>
          <div className="border-l border-theme-border pl-3">
            <span className="text-theme-muted text-[10px] block">THROUGHPUT</span>
            <span className="text-theme-primary font-bold">{simResult.successfulRps.toLocaleString()} RPS</span>
          </div>
          <div className="border-l border-theme-border pl-3">
            <span className="text-theme-muted text-[10px] block">DROPPED</span>
            <span className={simResult.droppedRps > 0 ? "text-theme-error font-bold underline" : "text-theme-muted"}>
              {simResult.droppedRps.toLocaleString()} RPS
            </span>
          </div>
          <div className="border-l border-theme-border pl-3">
            <span className="text-theme-muted text-[10px] block">P99 LATENCY</span>
            <span className="text-theme-accent font-bold">
              {simResult.p99LatencyMs} MS
            </span>
          </div>
        </div>

        {/* Right: Traffic Slider & Run/Pause */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-theme-muted text-[10px]">LOAD</span>
            <input
              type="range"
              min="500"
              max="25000"
              step="500"
              value={trafficRps}
              onChange={(e) => setTrafficRps(Number(e.target.value))}
              className="w-24 sm:w-32 accent-theme-primary h-1 bg-theme-border cursor-pointer"
            />
          </div>

          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition border ${
              isSimulating
                ? "border-theme-primary bg-theme-primary text-theme-bg"
                : "border-theme-border bg-theme-card text-theme-muted hover:text-theme-text"
            }`}
          >
            {isSimulating ? "SIMULATING" : "PAUSED"}
          </button>

          <button
            onClick={handleExportJson}
            className="p-1 border border-theme-border hover:border-theme-primary bg-theme-card text-theme-muted hover:text-theme-text transition"
            title="Export Architecture JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottleneck Warning Banner */}
      {simResult.bottleneckReason && (
        <div className="bg-theme-cardElevated border-b border-theme-border px-4 py-1.5 flex items-center justify-between text-xs text-theme-text z-10 font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-theme-warning font-bold">[BOTTLENECK DETECTED]</span>
            <span className="text-theme-secondary">{simResult.bottleneckReason}</span>
          </div>
          <span className="text-[10px] uppercase border border-theme-border px-1.5 py-0.5 text-theme-muted">
            SATURATION {simResult.systemSaturationPercent}%
          </span>
        </div>
      )}

      {/* Main Workspace: Left Palette + Canvas + Right Inspector */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Palette: Architecture Nodes */}
        <div className="w-52 bg-theme-card border-r border-theme-border p-3 overflow-y-auto space-y-1.5 z-10 hidden md:block">
          <span className="text-[10px] font-bold text-theme-muted uppercase tracking-wider block mb-2 pb-1 border-b border-theme-border">
            COMPONENT PALETTE
          </span>

          <div className="space-y-1 text-xs">
            {[
              { type: "client", label: "Client Ingress", cap: 50000, lat: 5 },
              { type: "dns", label: "DNS Resolver", cap: 50000, lat: 2 },
              { type: "cdn", label: "CDN Edge", cap: 60000, lat: 4 },
              { type: "api_gateway", label: "API Gateway", cap: 25000, lat: 6 },
              { type: "load_balancer", label: "Load Balancer", cap: 20000, lat: 3 },
              { type: "web_server", label: "Web Server", cap: 3003, lat: 12 },
              { type: "app_server", label: "App Server", cap: 2000, lat: 18 },
              { type: "database", label: "Relational DB", cap: 1500, lat: 25 },
              { type: "read_replica", label: "Read Replica", cap: 3003, lat: 15 },
              { type: "cache", label: "Redis Cache", cap: 30030, lat: 1.5 },
              { type: "message_queue", label: "Message Queue", cap: 25000, lat: 5 },
              { type: "worker", label: "Async Worker", cap: 4000, lat: 25 },
              { type: "object_storage", label: "Object Storage", cap: 10000, lat: 35 },
              { type: "auth_service", label: "Auth Service", cap: 8000, lat: 10 },
              { type: "monitoring", label: "Monitoring", cap: 40000, lat: 2 },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => handleAddNode(item.type, item.label, item.cap, item.lat)}
                className="w-full text-left p-1.5 border border-theme-border bg-theme-bg hover:border-theme-primary text-theme-secondary hover:text-theme-text transition flex items-center justify-between text-xs"
              >
                <span>{item.label}</span>
                <Plus className="w-3 h-3 text-theme-primary" />
              </button>
            ))}
          </div>
        </div>

        {/* Center: React Flow Canvas */}
        <div className="flex-1 relative h-full bg-theme-bg">
          <ReactFlow
            nodes={displayNodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            fitView
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: "#2DD4BF", strokeWidth: 1.5 },
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#24333B" />
            <Controls />
            <Panel position="bottom-left" className="bg-theme-card border border-theme-border p-2 text-[11px] text-theme-muted">
              DRAG NODES &bull; CONNECT PORTS TO ROUTE TRAFFIC
            </Panel>
          </ReactFlow>
        </div>

        {/* Right Node Inspector Drawer */}
        {selectedNode && selectedNodeData && (
          <div className="w-72 bg-theme-card border-l border-theme-border p-4 space-y-4 overflow-y-auto z-10 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-theme-border">
              <div className="flex items-center space-x-2">
                <Settings2 className="w-3.5 h-3.5 text-theme-primary" />
                <h3 className="font-bold uppercase tracking-wider text-theme-text">
                  NODE INSPECTOR
                </h3>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-theme-muted hover:text-theme-text text-sm"
              >
                &times;
              </button>
            </div>

            {/* Label Input */}
            <div className="space-y-1">
              <label className="text-[10px] text-theme-muted uppercase">Component Label</label>
              <input
                type="text"
                value={selectedNodeData.label}
                onChange={(e) => updateSelectedNodeData({ label: e.target.value })}
                className="w-full px-2 py-1 bg-theme-bg border border-theme-border text-xs text-theme-text focus:outline-none focus:border-theme-primary"
              />
            </div>

            {/* Capacity RPS Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-theme-muted">CAPACITY</span>
                <span className="text-theme-primary font-bold">
                  {selectedNodeData.capacityRps.toLocaleString()} RPS
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="50000"
                step="200"
                value={selectedNodeData.capacityRps}
                onChange={(e) => updateSelectedNodeData({ capacityRps: Number(e.target.value) })}
                className="w-full accent-theme-primary h-1 bg-theme-border cursor-pointer"
              />
            </div>

            {/* Base Latency Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-theme-muted">BASE LATENCY</span>
                <span className="text-theme-accent font-bold">
                  {selectedNodeData.baseLatencyMs} MS
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={selectedNodeData.baseLatencyMs}
                onChange={(e) => updateSelectedNodeData({ baseLatencyMs: Number(e.target.value) })}
                className="w-full accent-theme-primary h-1 bg-theme-border cursor-pointer"
              />
            </div>

            {/* Chaos Fail Toggle */}
            <div className="pt-2 border-t border-theme-border">
              <div className="flex items-center justify-between p-2.5 bg-theme-bg border border-theme-border">
                <div>
                  <span className="font-bold text-theme-text block">NODE CHAOS</span>
                  <span className="text-[10px] text-theme-muted">Simulate total outage</span>
                </div>
                <button
                  onClick={() => updateSelectedNodeData({ isFailing: !selectedNodeData.isFailing })}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition border ${
                    selectedNodeData.isFailing
                      ? "border-theme-error bg-theme-error/20 text-theme-error"
                      : "border-theme-border bg-theme-card text-theme-muted hover:text-theme-text"
                  }`}
                >
                  {selectedNodeData.isFailing ? "CRASHED" : "HEALTHY"}
                </button>
              </div>
            </div>

            {/* Launch Dedicated Simulator Lab */}
            <div className="pt-2 border-t border-theme-border">
              <Link
                href={
                  selectedNodeData.type === "database" || selectedNodeData.type === "read_replica"
                    ? "/learn/database-indexes-and-scans"
                    : selectedNodeData.type === "cache"
                    ? "/learn/cache-aside-and-redis"
                    : selectedNodeData.type === "load_balancer"
                    ? "/learn/load-balancing-algorithms"
                    : selectedNodeData.type === "message_queue" || selectedNodeData.type === "worker"
                    ? "/learn/message-queues-and-decoupling"
                    : selectedNodeData.type === "cdn"
                    ? "/learn/latency-vs-bandwidth"
                    : "/learn/client-and-server-architecture"
                }
                className="w-full py-2 px-3 bg-theme-cardElevated border border-theme-border hover:border-theme-primary text-theme-text text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition"
              >
                <Box className="w-3.5 h-3.5 text-theme-primary" />
                <span>Launch {selectedNodeData.label} Lab</span>
              </Link>
            </div>

            {/* Clone & Delete Actions */}
            <div className="pt-2 border-t border-theme-border grid grid-cols-2 gap-2">
              <button
                onClick={handleDuplicateNode}
                className="p-1.5 border border-theme-border hover:border-theme-primary text-theme-muted hover:text-theme-text text-xs uppercase flex items-center justify-center space-x-1 transition"
              >
                <Copy className="w-3 h-3" />
                <span>Clone</span>
              </button>
              <button
                onClick={handleDeleteNode}
                className="p-1.5 border border-theme-border hover:border-theme-error text-theme-muted hover:text-theme-error text-xs uppercase flex items-center justify-center space-x-1 transition"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

