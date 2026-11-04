export interface SimulationNode {
  id: string;
  name: string;
  type:
    | "client"
    | "dns"
    | "cdn"
    | "load_balancer"
    | "web_server"
    | "app_server"
    | "database"
    | "read_replica"
    | "cache"
    | "message_queue"
    | "worker"
    | "object_storage";
  capacityRps: number;
  baseLatencyMs: number;
  isFailing: boolean;
  cacheHitRate?: number; // 0 to 1 for cache and cdn
  queueLength?: number; // for message queues
  currentLoadRps?: number;
  saturationPercent?: number;
  droppedRps?: number;
  effectiveLatencyMs?: number;
}

export interface SimulationEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
}

export interface SimulationResult {
  totalIngressRps: number;
  successfulRps: number;
  droppedRps: number;
  p50LatencyMs: number;
  p99LatencyMs: number;
  systemSaturationPercent: number;
  bottleneckNodeId: string | null;
  bottleneckReason: string | null;
  nodeMetrics: Record<
    string,
    {
      currentLoadRps: number;
      saturationPercent: number;
      droppedRps: number;
      effectiveLatencyMs: number;
      isFailing: boolean;
    }
  >;
}

/**
 * Computes deterministic queuing latency using M/M/1 approximation.
 * When utilization rho < 1, W = 1 / (mu - lambda)
 * When rho >= 1, system enters saturation, latency degrades exponentially and packets drop.
 */
export function calculateQueuingLatency(baseLatencyMs: number, arrivalRps: number, capacityRps: number): {
  effectiveLatencyMs: number;
  saturationPercent: number;
  droppedRps: number;
} {
  if (capacityRps <= 0) {
    return {
      effectiveLatencyMs: 9999,
      saturationPercent: 100,
      droppedRps: arrivalRps,
    };
  }

  const rho = arrivalRps / capacityRps;
  const saturationPercent = Math.min(100, Math.round(rho * 100));

  if (rho <= 0.8) {
    // Normal healthy queuing curve
    const latencyMultiplier = 1 + (rho / (1 - rho)) * 0.25;
    return {
      effectiveLatencyMs: Math.max(baseLatencyMs, baseLatencyMs * latencyMultiplier),
      saturationPercent,
      droppedRps: 0,
    };
  } else if (rho <= 1.0) {
    // Heavy load queuing tail
    const excess = (rho - 0.8) / 0.2;
    const latencyMultiplier = 2.0 + excess * 5.0; // scales up to 7x
    return {
      effectiveLatencyMs: baseLatencyMs * latencyMultiplier,
      saturationPercent,
      droppedRps: 0,
    };
  } else {
    // Saturation and packet drops
    const droppedRps = Math.round(arrivalRps - capacityRps);
    const effectiveLatencyMs = Math.min(5000, baseLatencyMs * 12 + (rho - 1) * 200);
    return {
      effectiveLatencyMs,
      saturationPercent: 100,
      droppedRps,
    };
  }
}

/**
 * Simulates end-to-end traffic propagation across an arbitrary directed graph of system components.
 */
export function runSystemSimulation(
  nodes: SimulationNode[],
  edges: SimulationEdge[],
  ingressTrafficRps: number
): SimulationResult {
  const nodeMap = new Map<string, SimulationNode>(nodes.map((n) => [n.id, { ...n }]));
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, []);
    }
    adjacency.get(edge.source)!.push(edge.target);
  }

  const nodeLoads = new Map<string, number>();
  for (const n of nodes) {
    nodeLoads.set(n.id, 0);
  }

  // Find root ingress (Clients or Load Balancers without incoming edges)
  const incomingEdgeCounts = new Map<string, number>();
  for (const n of nodes) {
    incomingEdgeCounts.set(n.id, 0);
  }
  for (const edge of edges) {
    incomingEdgeCounts.set(edge.target, (incomingEdgeCounts.get(edge.target) || 0) + 1);
  }

  const ingressNodes = nodes.filter(
    (n) => n.type === "client" || (incomingEdgeCounts.get(n.id) === 0 && adjacency.has(n.id))
  );

  const startNodes = ingressNodes.length > 0 ? ingressNodes : nodes.slice(0, 1);
  const perIngressRps = startNodes.length > 0 ? ingressTrafficRps / startNodes.length : ingressTrafficRps;

  for (const start of startNodes) {
    nodeLoads.set(start.id, perIngressRps);
  }

  // Topological / BFS forward propagation
  const queue: string[] = startNodes.map((n) => n.id);
  const visited = new Set<string>();

  const nodeMetrics: SimulationResult["nodeMetrics"] = {};
  let totalSuccessfulRps = 0;
  let totalDroppedRps = 0;
  let accumulatedLatencyPath = 0;
  let deepestPathDepth = 0;

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const node = nodeMap.get(currentId);
    if (!node) continue;

    const currentLoad = nodeLoads.get(currentId) || 0;
    let nodeDropped = 0;
    let nodeLatency = node.baseLatencyMs;
    let nodeSaturation = 0;

    if (node.isFailing) {
      nodeDropped = currentLoad;
      nodeLatency = 5000;
      nodeSaturation = 100;
    } else {
      const qCalc = calculateQueuingLatency(node.baseLatencyMs, currentLoad, node.capacityRps);
      nodeDropped = qCalc.droppedRps;
      nodeLatency = qCalc.effectiveLatencyMs;
      nodeSaturation = qCalc.saturationPercent;
    }

    const survivingLoad = Math.max(0, currentLoad - nodeDropped);

    nodeMetrics[currentId] = {
      currentLoadRps: Math.round(currentLoad),
      saturationPercent: nodeSaturation,
      droppedRps: Math.round(nodeDropped),
      effectiveLatencyMs: Math.round(nodeLatency),
      isFailing: node.isFailing,
    };

    totalDroppedRps += nodeDropped;
    accumulatedLatencyPath += nodeLatency;
    deepestPathDepth += 1;

    // Distribute surviving load to outbound neighbors
    const neighbors = adjacency.get(currentId) || [];
    if (neighbors.length === 0) {
      totalSuccessfulRps += survivingLoad;
    } else {
      // If node is a Cache or CDN, apply hit rate
      let outboundLoad = survivingLoad;
      if (node.type === "cache" || node.type === "cdn") {
        const hitRate = node.cacheHitRate ?? 0.8;
        const cacheMissLoad = survivingLoad * (1 - hitRate);
        outboundLoad = cacheMissLoad; // Only misses proceed downstream to Database!
      }

      // Filter out failing targets for intelligent load balancer routing
      let targetNeighbors = neighbors;
      if (node.type === "load_balancer") {
        const healthyNeighbors = neighbors.filter((nId) => !nodeMap.get(nId)?.isFailing);
        if (healthyNeighbors.length > 0) {
          targetNeighbors = healthyNeighbors;
        }
      }

      const splitRps = outboundLoad / targetNeighbors.length;
      for (const targetId of targetNeighbors) {
        nodeLoads.set(targetId, (nodeLoads.get(targetId) || 0) + splitRps);
        if (!visited.has(targetId)) {
          visited.add(targetId);
          queue.push(targetId);
        }
      }
    }
  }

  // Detect primary bottleneck node
  let highestSaturation = 0;
  let bottleneckNodeId: string | null = null;
  let bottleneckReason: string | null = null;

  for (const [nId, metrics] of Object.entries(nodeMetrics)) {
    if (metrics.isFailing) {
      bottleneckNodeId = nId;
      bottleneckReason = `Component is in a CRASHED state! Traffic dropped immediately.`;
      break;
    }
    if (metrics.saturationPercent > highestSaturation) {
      highestSaturation = metrics.saturationPercent;
      bottleneckNodeId = nId;
    }
  }

  if (!bottleneckReason && bottleneckNodeId && highestSaturation >= 85) {
    const node = nodeMap.get(bottleneckNodeId);
    bottleneckReason = `${node?.name || "Node"} is saturated at ${highestSaturation}% capacity! Consider horizontal scaling or caching.`;
  }

  const avgHopLatency = deepestPathDepth > 0 ? accumulatedLatencyPath / deepestPathDepth : 20;
  const p50LatencyMs = Math.round(avgHopLatency * 1.2);
  const p99LatencyMs = Math.round(
    highestSaturation > 90 ? p50LatencyMs * 4.5 + totalDroppedRps * 0.1 : p50LatencyMs * 2.2
  );

  return {
    totalIngressRps: Math.round(ingressTrafficRps),
    successfulRps: Math.max(0, Math.round(ingressTrafficRps - totalDroppedRps)),
    droppedRps: Math.round(totalDroppedRps),
    p50LatencyMs,
    p99LatencyMs,
    systemSaturationPercent: Math.min(100, Math.round(highestSaturation)),
    bottleneckNodeId,
    bottleneckReason,
    nodeMetrics,
  };
}

