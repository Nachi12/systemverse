export interface ProjectBlueprint {
  id: string;
  title: string;
  tagline: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  icon: string;
  summary: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  capacityEstimation: {
    label: string;
    value: string;
    details: string;
  }[];
  apiEndpoints: {
    method: "GET" | "POST" | "PUT" | "DELETE" | "WS";
    path: string;
    description: string;
    params: string;
  }[];
  databaseDesign: {
    table: string;
    type: "SQL" | "NoSQL" | "Redis";
    fields: string[];
    indexes: string[];
    notes: string;
  }[];
  architectureHighlights: string[];
  tradeoffs: {
    decision: string;
    chosen: string;
    alternative: string;
    rationale: string;
  }[];
  bottlenecksAndSolutions: {
    bottleneck: string;
    solution: string;
  }[];
  defaultArchitecture: {
    nodes: Array<{
      id: string;
      label: string;
      type: string;
      x: number;
      y: number;
      capacityRps: number;
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
      label?: string;
    }>;
  };
}

export const REAL_WORLD_PROJECTS: ProjectBlueprint[] = [
  {
    id: "url-shortener",
    title: "Design a URL Shortener (TinyURL)",
    tagline: "Shorten billions of links with sub-10ms redirection and 99.999% availability.",
    category: "High-Throughput Storage & Caching",
    difficulty: "Beginner",
    estimatedMinutes: 20,
    icon: "🔗",
    summary:
      "A classic system design problem that tests understanding of hashing, base encoding, write vs read traffic asymmetry (100:1 read ratio), and caching hot keys to protect disk databases.",
    functionalRequirements: [
      "Given a long URL, generate a unique, short alias (e.g. https://tiny.cc/a8f9Z2).",
      "When users access a short URL, redirect them immediately (HTTP 301 or 302) to the original long URL.",
      "Custom URL alias support (optional vanity URLs).",
      "Links expire after a configurable TTL (default 2 years).",
      "Basic link analytics (click counts, referrer geolocation).",
    ],
    nonFunctionalRequirements: [
      "Ultra-low redirect latency (P99 < 15ms).",
      "Extremely high availability (99.999% uptime) — a broken short link breaks external sites.",
      "Read-heavy workload: 100:1 Read to Write ratio.",
      "Short URLs must not be easily guessable (security against link enumeration scraping).",
    ],
    capacityEstimation: [
      {
        label: "Write Volume (New URLs)",
        value: "500 writes/sec (43 Million URLs/month)",
        details: "500 writes/sec * 86,400s ≈ 43.2M URLs per day.",
      },
      {
        label: "Read Volume (Redirections)",
        value: "50,000 reads/sec (100:1 ratio)",
        details: "Peak read traffic reaches 100,000 QPS globally.",
      },
      {
        label: "Storage Over 5 Years",
        value: "15 Terabytes",
        details: "43M * 30 days * 12 mos * 5 yrs ≈ 77 Billion URLs. At 500 bytes per record = ~38.5 TB.",
      },
      {
        label: "Cache Memory (20% Pareto Rule)",
        value: "170 GB RAM",
        details: "Daily active reads = 50,000 * 86,400 = 4.3B reads. 20% hot links * 200 bytes = ~170 GB Redis cluster.",
      },
    ],
    apiEndpoints: [
      {
        method: "POST",
        path: "/api/v1/shorten",
        description: "Creates a shortened URL from a long original URL.",
        params: "{ originalUrl: string, customAlias?: string, expireDate?: string }",
      },
      {
        method: "GET",
        path: "/:shortKey",
        description: "Redirects client to original destination via HTTP 302 Found.",
        params: "Path param shortKey (Base62 7-character string)",
      },
      {
        method: "GET",
        path: "/api/v1/analytics/:shortKey",
        description: "Returns click count, referrers, and timeline data.",
        params: "shortKey string",
      },
    ],
    databaseDesign: [
      {
        table: "url_mappings",
        type: "NoSQL",
        fields: ["short_key (PK)", "original_url", "user_id", "created_at", "expires_at"],
        indexes: ["PK: short_key (Hash index)", "Index: user_id"],
        notes: "Key-value or Document store (DynamoDB/Cassandra) provides O(1) reads and seamless horizontal sharding by short_key.",
      },
      {
        table: "redis_hot_cache",
        type: "Redis",
        fields: ["key: url:{short_key}", "val: {original_url}", "TTL: 86400"],
        indexes: ["In-memory Hash table"],
        notes: "Absorbs 85-90% of all redirection traffic, keeping database reads under 5,000 QPS.",
      },
    ],
    architectureHighlights: [
      "Base62 Encoding [0-9, a-z, A-Z]: 62^7 = 3.52 Trillion unique short URLs using only 7 characters.",
      "Pre-generated Key Generation Service (KGS): Eliminates hash collisions and synchronization locks between web nodes.",
      "HTTP 302 Found vs 301 Moved Permanently: 302 routes every click through the server for accurate analytics tracking, whereas 301 caches in browser.",
    ],
    tradeoffs: [
      {
        decision: "Redirection HTTP Status Code",
        chosen: "HTTP 302 Temporary Redirect",
        alternative: "HTTP 301 Permanent Redirect",
        rationale: "HTTP 301 is permanently cached by client browsers, which disables click tracking and analytics. 302 forces clients to hit the edge router every time.",
      },
      {
        decision: "Short Key Generation",
        chosen: "Distributed Counter / Pre-generated KGS",
        alternative: "MD5/SHA256 Hashing with Base62 slice",
        rationale: "Hashing requires checking the DB for collision and re-hashing with salt on duplicate, causing latency spikes.",
      },
    ],
    bottlenecksAndSolutions: [
      {
        bottleneck: "Celebrity / Viral URL Cache Stampede (Thundering Herd)",
        solution: "Use Redis Mutex (Distributed Lock) during cache miss, so only one worker queries the database while others wait on cache populate.",
      },
      {
        bottleneck: "Analytics write lockup during traffic surge",
        solution: "Decouple analytics via Apache Kafka message stream. Asynchronously batch insert click logs into ClickHouse or BigQuery.",
      },
    ],
    defaultArchitecture: {
      nodes: [
        { id: "client", label: "Global Clients", type: "client", x: 60, y: 180, capacityRps: 100000 },
        { id: "dns", label: "Anycast DNS (Cloudflare)", type: "dns", x: 260, y: 180, capacityRps: 100000 },
        { id: "lb", label: "Nginx / Envoy Load Balancer", type: "load_balancer", x: 480, y: 180, capacityRps: 60000 },
        { id: "app1", label: "API Web Server #1", type: "app_server", x: 700, y: 100, capacityRps: 5000 },
        { id: "app2", label: "API Web Server #2", type: "app_server", x: 700, y: 260, capacityRps: 5000 },
        { id: "redis", label: "Redis Cluster (Cache-Aside)", type: "cache", x: 920, y: 100, capacityRps: 50000 },
        { id: "db", label: "DynamoDB / Cassandra (Shard)", type: "database", x: 920, y: 260, capacityRps: 10000 },
      ],
      edges: [
        { id: "e1", source: "client", target: "dns" },
        { id: "e2", source: "dns", target: "lb" },
        { id: "e3", source: "lb", target: "app1" },
        { id: "e4", source: "lb", target: "app2" },
        { id: "e5", source: "app1", target: "redis" },
        { id: "e6", source: "app2", target: "redis" },
        { id: "e7", source: "redis", target: "db" },
      ],
    },
  },
  {
    id: "realtime-chat",
    title: "Design a Real-Time Messenger (WhatsApp / Discord)",
    tagline: "Deliver billions of encrypted messages with sub-second delivery and offline sync.",
    category: "Real-Time Distributed Streaming",
    difficulty: "Intermediate",
    estimatedMinutes: 25,
    icon: "💬",
    summary:
      "Architect a global bidirectional messaging system supporting 1-on-1 conversations, group chats, message statuses (sent, delivered, read), presence tracking, and offline push notifications.",
    functionalRequirements: [
      "One-on-one real-time messaging with instant delivery.",
      "Group chat functionality up to 1,000 members.",
      "Message delivery receipts: Sent (single check), Delivered (double check), Read (blue check).",
      "Presence status: Online, Offline, Last seen timestamp.",
      "Offline message storage and syncing when receiver reconnects.",
      "Media sharing (images, voice notes) via Object Storage.",
    ],
    nonFunctionalRequirements: [
      "Extremely low latency: End-to-end delivery < 200ms globally.",
      "Zero message loss (Durability is paramount).",
      "End-to-End Encryption (E2EE) using Signal protocol.",
      "High scalability: 2 Billion active users, 100 Billion messages per day.",
    ],
    capacityEstimation: [
      {
        label: "Message Volume",
        value: "1.15 Million msgs/sec",
        details: "100 Billion messages / 86,400s ≈ 1.15M msgs/sec. Peak = 2.5M msgs/sec.",
      },
      {
        label: "Daily Storage (Text)",
        value: "10 Terabytes/day",
        details: "100B messages * 100 bytes average payload = 10 TB/day.",
      },
      {
        label: "Concurrent Persistent Connections",
        value: "50 Million Open WebSockets",
        details: "Distributed across hundreds of lightweight WebSocket gateway nodes (Erlang/Go).",
      },
      {
        label: "Memory Per Connection",
        value: "500 GB RAM total",
        details: "Optimized connection state occupies ~10 KB per socket in memory.",
      },
    ],
    apiEndpoints: [
      {
        method: "WS",
        path: "/ws/connect",
        description: "Establishes long-lived bidirectional WebSocket stream with Auth token.",
        params: "{ user_id, device_id, auth_token }",
      },
      {
        method: "POST",
        path: "/api/v1/messages/send",
        description: "Fallback HTTP message send when socket is interrupted.",
        params: "{ recipient_id, payload, message_id, timestamp }",
      },
      {
        method: "GET",
        path: "/api/v1/messages/sync",
        description: "Pulls undelivered messages since last synchronized sequence ID.",
        params: "?last_sync_seq=1849204",
      },
    ],
    databaseDesign: [
      {
        table: "messages",
        type: "NoSQL",
        fields: ["message_id (PK)", "chat_id (Partition Key)", "sender_id", "content", "created_at (Sort Key)", "status"],
        indexes: ["Composite PK: (chat_id, created_at)"],
        notes: "Apache Cassandra or ScyllaDB handles sequential append-only writes with blazing fast time-range queries.",
      },
      {
        table: "user_presence",
        type: "Redis",
        fields: ["Key: presence:{user_id}", "Val: { status: 'online', socket_server_id: 'ws-node-42', last_heartbeat }"],
        indexes: ["Redis Hash with 60s TTL"],
        notes: "Heartbeats refresh presence; expiration automatically marks user as offline.",
      },
    ],
    architectureHighlights: [
      "WebSocket Gateway Layer: Maintains persistent TCP connections. Lightweight and stateless with regard to business logic.",
      "Redis Pub/Sub or Kafka Broker: Routes outbound messages to whichever specific WebSocket Gateway holds the recipient's connection.",
      "Offline Storage Engine: Undelivered messages are held in a durable queue until client acknowledgment (ACK) is received.",
    ],
    tradeoffs: [
      {
        decision: "Persistent Protocol",
        chosen: "WebSockets",
        alternative: "HTTP Long-Polling / Server-Sent Events",
        rationale: "Chat requires two-way full duplex. SSE is server-to-client only, requiring separate HTTP POST requests for every sent message.",
      },
      {
        decision: "Group Chat Fanout",
        chosen: "Fanout-on-Write for small groups, message broker for large groups",
        alternative: "Single shared queue",
        rationale: "Copying message to every member's inbox provides offline isolation and individual read receipt tracking.",
      },
    ],
    bottlenecksAndSolutions: [
      {
        bottleneck: "Millions of concurrent WebSocket disconnects during cell tower switch",
        solution: "Session resumption with 30-second grace periods and idempotency tokens to prevent re-sending duplicated messages.",
      },
      {
        bottleneck: "Celebrity / Massive group message fanout (1,000 members)",
        solution: "Decouple fanout workers with Apache Kafka. Instead of blocking the sender, queue the fanout task into Kafka partition workers.",
      },
    ],
    defaultArchitecture: {
      nodes: [
        { id: "mobile_client", label: "Mobile Apps (iOS/Android)", type: "client", x: 60, y: 180, capacityRps: 80000 },
        { id: "lb", label: "AWS ALB / TCP NLB", type: "load_balancer", x: 280, y: 180, capacityRps: 60000 },
        { id: "ws_gateway", label: "WebSocket Gateway Cluster", type: "app_server", x: 500, y: 180, capacityRps: 25000 },
        { id: "kafka", label: "Kafka Message Bus", type: "message_queue", x: 720, y: 100, capacityRps: 50000 },
        { id: "presence", label: "Redis Presence & Session Store", type: "cache", x: 720, y: 260, capacityRps: 40000 },
        { id: "cassandra", label: "Cassandra Messages DB", type: "database", x: 940, y: 100, capacityRps: 30030 },
        { id: "worker", label: "Offline Push Worker (APNS/FCM)", type: "worker", x: 940, y: 260, capacityRps: 15000 },
      ],
      edges: [
        { id: "e1", source: "mobile_client", target: "lb" },
        { id: "e2", source: "lb", target: "ws_gateway" },
        { id: "e3", source: "ws_gateway", target: "presence" },
        { id: "e4", source: "ws_gateway", target: "kafka" },
        { id: "e5", source: "kafka", target: "cassandra" },
        { id: "e6", source: "kafka", target: "worker" },
      ],
    },
  },
  {
    id: "netflix-streaming",
    title: "Design a Global Video Streaming Platform (Netflix / YouTube)",
    tagline: "Deliver multi-gigabit video streaming with zero buffering across 190 countries.",
    category: "CDN & Massive Media Ingestion",
    difficulty: "Advanced",
    estimatedMinutes: 30,
    icon: "🎬",
    summary:
      "Examine how raw 4K videos are chunked, encoded into multiple bitrates (HLS/DASH), and distributed across custom Open Connect CDN appliances deployed directly inside ISP exchange points.",
    functionalRequirements: [
      "Users can upload original 4K/HDR video files.",
      "Asynchronous transcoding pipeline into multi-bitrate chunks (360p, 720p, 1080p, 4K).",
      "Adaptive Bitrate Streaming (ABR): Automatically adjusts quality according to client bandwidth.",
      "Video search and personalized recommendations feed.",
      "Track watch history and resume from exact playback timestamp.",
    ],
    nonFunctionalRequirements: [
      "Buffer-free playback: Time to First Frame < 500ms.",
      "Scalable to 15% of total global internet traffic.",
      "High reliability: Video playback continues even if primary control plane fails.",
      "Cost-effective content delivery to avoid astronomical egress fees.",
    ],
    capacityEstimation: [
      {
        label: "Peak Streaming Bandwidth",
        value: "100+ Terabits / second",
        details: "Millions of concurrent streams at an average 5 Mbps bit rate.",
      },
      {
        label: "Storage per 2-hour 4K Movie",
        value: "1.2 Terabytes across all codecs & bitrates",
        details: "Chunked into 4-second fragments (.ts / .m4s) for HLS/DASH.",
      },
      {
        label: "Daily Active Streamers",
        value: "80 Million concurrent viewers",
        details: "Peak evenings in North America, Europe, and Asia.",
      },
    ],
    apiEndpoints: [
      {
        method: "GET",
        path: "/api/v1/videos/:id/manifest.m3u8",
        description: "Returns master playlist containing available bitrates and CDN fragment URLs.",
        params: "Video ID string",
      },
      {
        method: "POST",
        path: "/api/v1/playback/progress",
        description: "Heartbeat every 10 seconds to record resume timestamp.",
        params: "{ video_id, timestamp_seconds, user_id }",
      },
    ],
    databaseDesign: [
      {
        table: "video_metadata",
        type: "SQL",
        fields: ["id (PK)", "title", "duration", "resolutions_available", "created_at"],
        indexes: ["PK: id"],
        notes: "Relational database (PostgreSQL/Spanner) for ACID consistency on catalogs and rights.",
      },
      {
        table: "user_playback_state",
        type: "Redis",
        fields: ["Key: playback:{user_id}:{video_id}", "Val: { timestamp: 3421, updated_at }"],
        indexes: ["In-memory key-value"],
        notes: "High frequency resume markers stored in Redis and periodically flushed to persistent DB.",
      },
    ],
    architectureHighlights: [
      "Custom CDN Edge (Netflix Open Connect / OCA): Physical hardware appliances installed inside ISP networks to deliver 95%+ of video traffic locally with zero transit cost.",
      "Chunked Video Delivery: Video split into 4-second chunks. Browser downloads next chunk based on measured buffer health.",
      "Decoupled Control Plane: User interface and metadata run on AWS, while media streaming runs entirely on ISP edge appliances.",
    ],
    tradeoffs: [
      {
        decision: "Video Delivery Protocol",
        chosen: "HLS / MPEG-DASH over standard HTTP/2",
        alternative: "RTSP / WebRTC",
        rationale: "HTTP chunking allows video to be cached by any standard HTTP reverse proxy or CDN edge without maintaining expensive persistent state.",
      },
    ],
    bottlenecksAndSolutions: [
      {
        bottleneck: "Massive egress bandwidth costs from public cloud",
        solution: "Partner with telecom ISPs to place storage cache servers (OCAs) directly inside internet service provider server rooms.",
      },
      {
        bottleneck: "Heavy computational overhead for multi-resolution 4K transcoding",
        solution: "Distributed chunked transcoding worker grid orchestrated by Apache Mesos/Kubernetes and spot instances.",
      },
    ],
    defaultArchitecture: {
      nodes: [
        { id: "viewer", label: "Smart TV / Mobile / Browser", type: "client", x: 60, y: 180, capacityRps: 50000 },
        { id: "cdn", label: "Open Connect Edge CDN", type: "cdn", x: 280, y: 100, capacityRps: 80000 },
        { id: "api_lb", label: "Metadata Load Balancer", type: "load_balancer", x: 280, y: 260, capacityRps: 20000 },
        { id: "app", label: "Metadata & Recommendation Service", type: "app_server", x: 500, y: 260, capacityRps: 10000 },
        { id: "s3", label: "AWS S3 Video Master Storage", type: "object_storage", x: 500, y: 100, capacityRps: 30030 },
        { id: "transcoder", label: "Kubernetes Transcoding Cluster", type: "worker", x: 740, y: 100, capacityRps: 5000 },
        { id: "db", label: "Catalog Database (CockroachDB)", type: "database", x: 740, y: 260, capacityRps: 8000 },
      ],
      edges: [
        { id: "e1", source: "viewer", target: "cdn" },
        { id: "e2", source: "viewer", target: "api_lb" },
        { id: "e3", source: "api_lb", target: "app" },
        { id: "e4", source: "app", target: "db" },
        { id: "e5", source: "s3", target: "transcoder" },
        { id: "e6", source: "transcoder", target: "cdn" },
      ],
    },
  },
];

