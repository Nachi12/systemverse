"use client";

import React, { useState } from "react";
import { 
  Globe, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Terminal,
  Clock,
  Layers
} from "lucide-react";

interface NetworkHop {
  id: string;
  stepNumber: number;
  actor: string;
  role: string;
  protocol: string;
  accumulatedLatencyMs: number;
  hopLatencyMs: number;
  actionTitle: string;
  description: string;
  packetHeaders: Record<string, string>;
  packetBody: string;
  architectNote: string;
}

const NETWORK_HOPS: NetworkHop[] = [
  {
    id: "browser",
    stepNumber: 1,
    actor: "Client Browser",
    role: "User Device (Laptop / Phone)",
    protocol: "Internal IPC / OS Cache",
    accumulatedLatencyMs: 2,
    hopLatencyMs: 2,
    actionTitle: "URL Parsing & Local Cache Verification",
    description: "The browser extracts protocol (HTTPS) and hostname (api.systemverse.dev). It inspects browser cache, OS DNS cache (/etc/hosts), and socket pools before transmitting any physical signals.",
    packetHeaders: {
      "Scheme": "https://",
      "Host": "api.systemverse.dev",
      "LocalCache": "MISS",
      "NextHop": "Local ISP Recursive Resolver (UDP/53)"
    },
    packetBody: "Initiating DNS resolution request for A / AAAA records.",
    architectNote: "Modern browsers aggressively cache DNS records for 60 seconds to bypass OS syscall overhead."
  },
  {
    id: "dns",
    stepNumber: 2,
    actor: "Recursive DNS Resolver",
    role: "ISP / Cloudflare 1.1.1.1 / Google 8.8.8.8",
    protocol: "DNS (UDP 53 / DoH)",
    accumulatedLatencyMs: 28,
    hopLatencyMs: 26,
    actionTitle: "Hierarchical Recursive DNS Resolution",
    description: "The recursive resolver queries the Root server ('.'), the TLD server ('.dev'), and finally the Authoritative Nameserver (Route 53 / Cloudflare) to resolve the IP address 104.21.48.91.",
    packetHeaders: {
      "Query": "A api.systemverse.dev",
      "RecordType": "A (IPv4)",
      "ResolvedIP": "104.21.48.91",
      "TTL": "300 seconds"
    },
    packetBody: "SUCCESS: Directing browser socket to 104.21.48.91:443.",
    architectNote: "DNS Anycast routes users to the geographically closest DNS nameserver in under 30ms."
  },
  {
    id: "cdn",
    stepNumber: 3,
    actor: "CDN Edge Server",
    role: "Global Edge PoP (Cloudflare / Fastly)",
    protocol: "TLS 1.3 over TCP",
    accumulatedLatencyMs: 44,
    hopLatencyMs: 16,
    actionTitle: "TLS 1.3 Handshake & Edge Cache Inspection",
    description: "Client performs TCP 3-way handshake and 1-RTT TLS 1.3 cryptographic key exchange (ECDHE). Edge checks if the requested resource is already cached in local SSD/RAM edge memory.",
    packetHeaders: {
      "Cipher": "TLS_AES_256_GCM_SHA384",
      "KeyExchange": "X25519 (ECDH)",
      "EdgeCache": "MISS (Dynamic API request)",
      "Action": "Proxying to Origin Load Balancer"
    },
    packetBody: "GET /api/v1/user/feed HTTP/2\nAuthorization: Bearer eyJhbGciOi...",
    architectNote: "Static assets return instantly here (Cache HIT, 10ms); dynamic queries tunnel through private backbone to origin."
  },
  {
    id: "lb",
    stepNumber: 4,
    actor: "Origin Load Balancer",
    role: "Reverse Proxy (Nginx / Envoy / AWS ALB)",
    protocol: "HTTP/2 (Layer 7 Routing)",
    accumulatedLatencyMs: 62,
    hopLatencyMs: 18,
    actionTitle: "TLS Termination & Health-Aware Path Routing",
    description: "The load balancer offloads TLS encryption, inspects path '/api/v1/user/feed', checks backend server health, and dispatches the stream to App Server 03 via Least Connections.",
    packetHeaders: {
      "X-Forwarded-For": "203.0.113.195",
      "X-Request-ID": "req_88f910ab32",
      "TargetPool": "user-service-cluster",
      "SelectedBackend": "10.0.3.14:8080"
    },
    packetBody: "Decrypted internal HTTP request routed over VPC private subnet.",
    architectNote: "SSL termination at the LB offloads heavy crypto computation from application containers."
  },
  {
    id: "app",
    stepNumber: 5,
    actor: "Application Server",
    role: "Stateless Microservice (Node / Go / Rust)",
    protocol: "gRPC / Internal HTTP",
    accumulatedLatencyMs: 84,
    hopLatencyMs: 22,
    actionTitle: "Authentication, Rate Limiting & Query Execution",
    description: "The microservice validates JWT claims, executes business rate limits in Redis, and queries the relational PostgreSQL database pool for the user's newsfeed entries.",
    packetHeaders: {
      "AuthStatus": "200 VALID (UserId: 4091)",
      "RateLimitRemaining": "98 / 100",
      "ConnectionPool": "Active (Postgres pooler 8/20)"
    },
    packetBody: "SELECT post_id, title, author FROM posts WHERE user_id = 4091 LIMIT 20;",
    architectNote: "Stateless servers can scale horizontally to hundreds of replicas behind load balancers."
  },
  {
    id: "db",
    stepNumber: 6,
    actor: "Database Cluster",
    role: "Primary DB & Read Replicas (PostgreSQL / Aurora)",
    protocol: "PostgreSQL Wire Protocol",
    accumulatedLatencyMs: 98,
    hopLatencyMs: 14,
    actionTitle: "B-Tree Index Scan & Response Serialization",
    description: "Postgres executes an Index Scan using the clustered index on user_id, retrieves 20 tuples from the buffer pool, and serializes the JSON response back through the pipeline.",
    packetHeaders: {
      "ExecutionPlan": "INDEX SCAN on idx_posts_user_id",
      "BufferCache": "HIT (Pages in RAM)",
      "RowsReturned": "20 rows",
      "Status": "200 OK"
    },
    packetBody: '{"status":"success","data":{"count":20,"posts":[...]}}',
    architectNote: "Reading from buffer pool memory takes <1ms; cold disk seeks take 10-15ms."
  }
];

export function NetworkSimulator() {
  const [currentHopIndex, setCurrentHopIndex] = useState(0);

  const hop = NETWORK_HOPS[currentHopIndex];

  const handleNext = () => {
    setCurrentHopIndex(prev => (prev < NETWORK_HOPS.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentHopIndex(prev => (prev > 0 ? prev - 1 : NETWORK_HOPS.length - 1));
  };

  const handleReset = () => {
    setCurrentHopIndex(0);
  };

  return (
    <div className="border border-theme-border bg-theme-card text-theme-text font-sans">
      {/* Header Bar */}
      <div className="px-5 py-3.5 border-b border-theme-border flex flex-wrap items-center justify-between gap-3 bg-theme-bg">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border border-theme-border bg-theme-card flex items-center justify-center text-theme-primary">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold tracking-tight text-theme-text flex items-center gap-2">
              End-to-End Request Journey & Packet Inspector
              <span className="text-[9px] font-mono uppercase bg-theme-cardElevated border border-theme-border text-theme-primary px-1.5 py-0.5">
                LAB // 01
              </span>
            </h3>
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <button
            onClick={handlePrev}
            className="px-2.5 py-1 border border-theme-border hover:border-theme-primary bg-theme-card text-theme-muted hover:text-theme-text transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PREV</span>
          </button>

          <span className="px-2 text-theme-muted">
            HOP {currentHopIndex + 1} / {NETWORK_HOPS.length}
          </span>

          <button
            onClick={handleNext}
            className="px-3 py-1 bg-theme-primary hover:brightness-110 text-theme-bg font-bold uppercase tracking-wider transition flex items-center gap-1"
          >
            <span>NEXT HOP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            className="p-1 border border-theme-border hover:border-theme-muted bg-theme-card text-theme-muted hover:text-theme-text transition ml-1"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Hop Progression Breadcrumbs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono text-xs">
          {NETWORK_HOPS.map((h, idx) => {
            const isCurrent = idx === currentHopIndex;
            const isPassed = idx < currentHopIndex;

            return (
              <button
                key={h.id}
                onClick={() => setCurrentHopIndex(idx)}
                className={`p-2.5 border text-left transition ${
                  isCurrent
                    ? "border-theme-primary bg-theme-primary/10 text-theme-text font-bold"
                    : isPassed
                    ? "border-theme-border bg-theme-bg text-theme-muted"
                    : "border-theme-border bg-theme-bg/60 text-theme-muted hover:border-theme-borderLight"
                }`}
              >
                <div className="text-[10px] text-theme-muted">HOP 0{h.stepNumber}</div>
                <div className="font-bold truncate mt-0.5">{h.actor}</div>
                <div className="text-[10px] text-theme-primary mt-1">+{h.hopLatencyMs}ms</div>
              </button>
            );
          })}
        </div>

        {/* Current Hop Detail Pane */}
        <div className="p-5 border border-theme-border bg-theme-bg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-border pb-3">
            <div>
              <div className="text-[10px] font-mono uppercase text-theme-muted tracking-wider">
                ACTIVE HOP #{hop.stepNumber} &bull; {hop.role}
              </div>
              <h4 className="font-display text-base font-bold text-theme-text mt-0.5">
                {hop.actionTitle}
              </h4>
            </div>

            <div className="flex items-center space-x-3 font-mono text-xs">
              <div className="flex items-center space-x-1.5 text-theme-muted border border-theme-border px-2.5 py-1 bg-theme-card">
                <Clock className="w-3 h-3 text-theme-primary" />
                <span>ELAPSED:</span>
                <strong className="text-theme-text font-bold">{hop.accumulatedLatencyMs} MS</strong>
              </div>

              <div className="px-2 py-1 border border-theme-border text-theme-primary bg-theme-card">
                {hop.protocol}
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-theme-secondary font-sans leading-relaxed">
            {hop.description}
          </p>

          {/* Wire Packet Inspector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 font-mono text-xs">
            <div className="p-3 border border-theme-border bg-theme-card space-y-1.5">
              <div className="text-theme-muted uppercase text-[10px] font-bold flex items-center gap-1.5 pb-1 border-b border-theme-border">
                <Terminal className="w-3 h-3 text-theme-primary" />
                PACKET HEADERS
              </div>
              {Object.entries(hop.packetHeaders).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2 text-[11px]">
                  <span className="text-theme-muted">{k}:</span>
                  <span className="text-theme-text truncate text-right">{v}</span>
                </div>
              ))}
            </div>

            <div className="p-3 border border-theme-border bg-theme-card space-y-1.5">
              <div className="text-theme-muted uppercase text-[10px] font-bold flex items-center gap-1.5 pb-1 border-b border-theme-border">
                <Layers className="w-3 h-3 text-theme-primary" />
                PAYLOAD WIRE DATA
              </div>
              <pre className="text-theme-text whitespace-pre-wrap text-[11px] leading-relaxed">
                {hop.packetBody}
              </pre>
            </div>
          </div>

          <div className="p-3 border border-theme-border bg-theme-card text-xs text-theme-secondary flex items-start gap-2.5 font-sans">
            <Terminal className="w-4 h-4 text-theme-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-theme-text font-mono uppercase text-[11px]">Architectural Model:</strong> {hop.architectNote}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
