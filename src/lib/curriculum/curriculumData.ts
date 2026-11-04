export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonStep {
  id: string;
  title: string;
  actor: string;
  target: string;
  status: string;
  description: string;
  packetInfo: {
    protocol: string;
    type: string;
    payload: Record<string, string>;
  };
  durationMs: number;
}

export interface LessonData {
  id: string;
  stageId: number;
  title: string;
  shortSummary: string;
  simulatorType?: "database" | "server" | "load_balancer" | "cache" | "queue" | "network" | "cdn" | "replication";
  concept: {
    heading: string;
    body: string;
    bulletPoints: string[];
  };
  analogy: {
    headline: string;
    text: string;
    icon: string;
  };
  visualExplanation: {
    diagramDescription: string;
    layers: { name: string; role: string; latency: string }[];
  };
  whatHappened: {
    keyInsights: string[];
    technicalDeepDive: string;
  };
  challenge: {
    scenario: string;
    goal: string;
    hints: string[];
  };
  steps: LessonStep[];
  commonMistakes: string[];
  realWorldExample: {
    company: string;
    headline: string;
    detail: string;
  };
  quiz: QuizQuestion[];
  keyTakeaways: string[];
}

export interface CurriculumStage {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  prerequisites: number[]; // Stage IDs that must be completed first
  lessons: {
    id: string;
    title: string;
    estimatedMinutes: number;
    description: string;
    simulatorType?: "database" | "server" | "load_balancer" | "cache" | "queue" | "network" | "cdn" | "replication";
  }[];
}

export const CURRICULUM_STAGES: CurriculumStage[] = [
  {
    id: 1,
    title: "Stage 1: Understanding the Internet",
    subtitle: "From raw electrical signals and packets to IP, DNS, and HTTP.",
    badge: "🌐",
    prerequisites: [],
    lessons: [
      {
        id: "what-happens-when-website-loads",
        title: "1.1 What Happens When You Open a Website?",
        estimatedMinutes: 8,
        description: "Trace an HTTP packet from browser URL parsing through recursive DNS, TCP 3-way handshake, TLS 1.3, and backend retrieval.",
        simulatorType: "network",
      },
      {
        id: "client-and-server-architecture",
        title: "1.2 Client and Server Architecture",
        estimatedMinutes: 7,
        description: "Understand stateless clients, server listeners, sockets, and the request/response lifecycle.",
        simulatorType: "server",
      },
      {
        id: "latency-vs-bandwidth",
        title: "1.3 Latency vs Bandwidth: The Physics of Networks",
        estimatedMinutes: 6,
        description: "Why adding more bandwidth cannot fix speed-of-light propagation latency over transatlantic cables.",
        simulatorType: "cdn",
      },
    ],
  },
  {
    id: 2,
    title: "Stage 2: Web Application Architecture",
    subtitle: "Frontend, backend APIs, microservices, and stateless communication.",
    badge: "🏛️",
    prerequisites: [1],
    lessons: [
      {
        id: "monolith-vs-microservices",
        title: "2.1 Monolithic vs Microservices Architecture",
        estimatedMinutes: 8,
        description: "Single deployable unit vs decoupled bounded contexts: deployment velocity vs operational complexity.",
      },
      {
        id: "stateless-application-tier",
        title: "2.2 Designing Stateless Application Servers",
        estimatedMinutes: 7,
        description: "Why keeping sessions in server memory destroys horizontal autoscaling, and how JWT/Redis solve it.",
        simulatorType: "server",
      },
      {
        id: "rest-graphql-grpc",
        title: "2.3 API Protocols: REST vs GraphQL vs gRPC",
        estimatedMinutes: 8,
        description: "Payload size, serialization speed, HTTP/2 multiplexing, and schema contracts.",
      },
    ],
  },
  {
    id: 3,
    title: "Stage 3: Server & Concurrency Fundamentals",
    subtitle: "CPU cores, worker threads, event loops, and Little's Law.",
    badge: "⚡",
    prerequisites: [2],
    lessons: [
      {
        id: "concurrency-and-worker-threads",
        title: "3.1 Threads, Event Loops & Async I/O",
        estimatedMinutes: 8,
        description: "Thread-per-request vs non-blocking event-driven runtimes under 10,000 concurrent sockets.",
        simulatorType: "server",
      },
      {
        id: "queueing-theory-and-overload",
        title: "3.2 Queueing Theory: How Servers Collapse",
        estimatedMinutes: 8,
        description: "Little's Law, request queue buffers, and why servers drop requests with HTTP 504 when saturated.",
        simulatorType: "server",
      },
    ],
  },
  {
    id: 4,
    title: "Stage 4: Databases: Foundations to Scale",
    subtitle: "Relational engines, B-Trees, transactions, sharding, and replication.",
    badge: "🗄️",
    prerequisites: [2],
    lessons: [
      {
        id: "database-indexes-and-scans",
        title: "4.1 B-Tree Indexes vs Table Scans",
        estimatedMinutes: 9,
        description: "Understand why indexes turn O(N) disk scans into O(log N) tree seeks, and their write penalty.",
        simulatorType: "database",
      },
      {
        id: "acid-transactions-and-isolation",
        title: "4.2 ACID Transactions & Isolation Levels",
        estimatedMinutes: 8,
        description: "Atomicity, consistency, row locks, dirty reads, and Write-Ahead Logging (WAL).",
        simulatorType: "database",
      },
      {
        id: "primary-replica-replication",
        title: "4.3 Primary-Replica Replication & Lag",
        estimatedMinutes: 8,
        description: "Scaling reads with followers, replication lag, and mitigating stale reads.",
        simulatorType: "replication",
      },
    ],
  },
  {
    id: 5,
    title: "Stage 5: Caching & Performance Optimization",
    subtitle: "RAM caching, cache-aside, TTL, and cache stampede prevention.",
    badge: "🚀",
    prerequisites: [4],
    lessons: [
      {
        id: "cache-aside-and-redis",
        title: "5.1 The Cache-Aside (Lazy Loading) Pattern",
        estimatedMinutes: 8,
        description: "How in-memory key-value stores like Redis deliver sub-2ms reads and reduce DB pressure by 90%.",
        simulatorType: "cache",
      },
      {
        id: "cache-eviction-and-ttl",
        title: "5.2 TTLs & Cache Eviction (LRU/LFU)",
        estimatedMinutes: 7,
        description: "Handling finite RAM with Least Recently Used eviction and deterministic TTL expiration.",
        simulatorType: "cache",
      },
      {
        id: "cache-stampede-and-penetration",
        title: "5.3 Cache Stampede & Thundering Herd",
        estimatedMinutes: 7,
        description: "Protecting the database when a popular cache key expires during peak traffic.",
        simulatorType: "cache",
      },
    ],
  },
  {
    id: 6,
    title: "Stage 6: Load Balancing & High Availability",
    subtitle: "Distribute traffic evenly and maintain zero-downtime reliability.",
    badge: "⚖️",
    prerequisites: [3],
    lessons: [
      {
        id: "load-balancing-algorithms",
        title: "6.1 Round Robin vs Least Connections vs Consistent Hashing",
        estimatedMinutes: 8,
        description: "Compare routing algorithms and observe how traffic shifts across server clusters.",
        simulatorType: "load_balancer",
      },
      {
        id: "health-checks-and-failover",
        title: "6.2 Health Checks & Automatic Failover",
        estimatedMinutes: 7,
        description: "Detecting dead servers via HTTP heartbeats and isolating nodes without dropping user traffic.",
        simulatorType: "load_balancer",
      },
    ],
  },
  {
    id: 7,
    title: "Stage 7: Asynchronous Systems & Event-Driven Architecture",
    subtitle: "Message brokers, FIFO queues, worker pools, and DLQs.",
    badge: "📬",
    prerequisites: [3],
    lessons: [
      {
        id: "message-queues-and-decoupling",
        title: "7.1 Asynchronous Message Queues & Decoupling",
        estimatedMinutes: 8,
        description: "Why background workers and message queues prevent user-facing API timeouts.",
        simulatorType: "queue",
      },
      {
        id: "retries-and-dead-letter-queues",
        title: "7.2 Exponential Backoff & Dead Letter Queues (DLQ)",
        estimatedMinutes: 8,
        description: "Handle poison messages and intermittent third-party outages safely.",
        simulatorType: "queue",
      },
    ],
  },
  {
    id: 8,
    title: "Stage 8: Storage, File Systems & CDNs",
    subtitle: "Object storage (S3), blob stores, edge PoPs, and asset distribution.",
    badge: "🌍",
    prerequisites: [1, 5],
    lessons: [
      {
        id: "global-cdn-edge-caching",
        title: "8.1 Global CDN Edge Caching & Anycast",
        estimatedMinutes: 8,
        description: "How edge PoPs deliver images, videos, and static files from the user's nearest metro area.",
        simulatorType: "cdn",
      },
      {
        id: "blob-storage-architecture",
        title: "8.2 Object Storage (S3) vs Block Storage",
        estimatedMinutes: 7,
        description: "Why relational databases should never store raw video/image blobs directly.",
      },
    ],
  },
  {
    id: 9,
    title: "Stage 9: Distributed Systems Principles",
    subtitle: "CAP theorem, PACELC, consensus, and eventual consistency.",
    badge: "🧬",
    prerequisites: [4, 6],
    lessons: [
      {
        id: "cap-theorem-explained",
        title: "9.1 CAP Theorem in the Real World",
        estimatedMinutes: 9,
        description: "Consistency vs Availability during unavoidable network partitions.",
      },
      {
        id: "eventual-consistency-hazards",
        title: "9.2 Eventual Consistency & Stale Reads",
        estimatedMinutes: 8,
        description: "How read replicas introduce temporal anomalies and how read-your-own-writes guarantees fix it.",
        simulatorType: "replication",
      },
    ],
  },
  {
    id: 10,
    title: "Stage 10: Security, Reliability & Observability",
    subtitle: "Rate limiting, circuit breakers, distributed tracing, and metrics.",
    badge: "🛡️",
    prerequisites: [6, 7],
    lessons: [
      {
        id: "rate-limiting-algorithms",
        title: "10.1 Rate Limiting: Token Bucket & Leaky Bucket",
        estimatedMinutes: 8,
        description: "Preventing API abuse, DDoS, and runaway crawler scripts with distributed token buckets.",
      },
      {
        id: "circuit-breaker-pattern",
        title: "10.2 Circuit Breakers & Cascading Failure Prevention",
        estimatedMinutes: 8,
        description: "Failing fast to save your infrastructure when downstream microservices go down.",
      },
    ],
  },
  {
    id: 11,
    title: "Stage 11: Real-World Architecture Deep Dives",
    subtitle: "Flagship system blueprints: TinyURL, Twitter Feed, Real-time Chat, Payment Gateway.",
    badge: "🏗️",
    prerequisites: [4, 5, 6, 7, 8],
    lessons: [
      {
        id: "design-url-shortener",
        title: "11.1 Design a High-Scale URL Shortener (TinyURL)",
        estimatedMinutes: 10,
        description: "Base62 encoding, distributed ID generation, hash collisions, and read-heavy caching.",
      },
      {
        id: "design-social-news-feed",
        title: "11.2 Design a Real-Time Social Feed (Twitter/Instagram)",
        estimatedMinutes: 11,
        description: "Fan-out on write vs fan-out on read, celebrity problem, and Redis timeline storage.",
      },
      {
        id: "design-realtime-chat",
        title: "11.3 Design a Real-Time Chat System (WhatsApp/Discord)",
        estimatedMinutes: 10,
        description: "Persistent WebSockets, connection managers, presence servers, and message ordering.",
      },
    ],
  },
  {
    id: 12,
    title: "Stage 12: System Design Mastery & Interview Synthesis",
    subtitle: "Framework for aceing Senior / Staff system design interviews.",
    badge: "🎓",
    prerequisites: [11],
    lessons: [
      {
        id: "system-design-interview-framework",
        title: "12.1 The 4-Step System Design Interview Framework",
        estimatedMinutes: 12,
        description: "Requirements scoping, high-level architecture, deep-dive trade-offs, and bottleneck resolution.",
      },
    ],
  },
];

// Backwards compatibility alias for older imports
export const CURRICULUM_LEVELS = CURRICULUM_STAGES;

// Flagship lessons with complete 8-part content
export const LESSON_DETAILS: Record<string, LessonData> = {
  "what-happens-when-website-loads": {
    id: "what-happens-when-website-loads",
    stageId: 1,
    title: "What Happens When You Open a Website?",
    simulatorType: "network",
    shortSummary: "Type 'https://systemverse.dev' into your browser and press Enter. Trace the request through URL parsing, recursive DNS, TCP 3-way handshake, TLS 1.3 encryption, and backend retrieval.",
    concept: {
      heading: "The Request Lifecycle",
      body: "Before a single pixel renders on your screen, your computer executes an intricate sequence of physical and logical handshakes across several distributed network boundaries.",
      bulletPoints: [
        "Browser URL parsing & local DNS cache check (bypasses network if cached)",
        "Recursive DNS resolution across Root (.), TLD (.dev), and Authoritative servers",
        "TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK) for reliable packet transport",
        "TLS 1.3 Cryptographic Key Exchange for 256-bit AES encryption in 1 RTT",
        "HTTP/2 or HTTP/3 Request dispatch, load balancer routing, and backend database fetch"
      ]
    },
    analogy: {
      headline: "The International Postal Order Analogy",
      text: "Imagine mailing a purchase order to a merchant whose name you know, but whose street address is unknown. First, you check your local phonebook (Browser DNS cache). If missing, you call the international operator directory (Hierarchical DNS). Once you obtain their coordinates, you dispatch an escort to exchange secret cryptographic tokens (TCP & TLS). Only then do you hand over your order form (HTTP GET), which warehouse workers (Application Server) retrieve from vaults (Database) and mail back in numbered parcels.",
      icon: "📮"
    },
    visualExplanation: {
      diagramDescription: "Physical network traversal from user terminal to distributed cloud cluster.",
      layers: [
        { name: "1. Browser Cache", role: "Internal memory check", latency: "< 1 ms" },
        { name: "2. DNS Resolver", role: "Recursive name lookup", latency: "~25 ms" },
        { name: "3. CDN Edge Server", role: "TLS termination & edge cache", latency: "~15 ms" },
        { name: "4. Load Balancer", role: "Reverse proxy & server routing", latency: "~18 ms" },
        { name: "5. App Server", role: "Business logic & auth checks", latency: "~22 ms" },
        { name: "6. Database", role: "B-Tree index seek & query return", latency: "~14 ms" },
      ]
    },
    whatHappened: {
      keyInsights: [
        "DNS resolution happens over UDP port 53 for speed without connection overhead.",
        "TLS 1.3 reduced the TLS handshake from 2 round trips (RTT) to just 1 RTT.",
        "Anycast routing directs the client's packet to the geographically closest edge server."
      ],
      technicalDeepDive: "When the client issues an HTTP/2 GET request, it reuses the already negotiated TCP socket. Multiplexing allows hundreds of simultaneous requests and responses over a single TCP connection, eliminating head-of-line blocking at the application layer."
    },
    challenge: {
      scenario: "Your website is reporting high latency (over 800ms) for first-time visitors in Australia, but returning in under 40ms for repeat visitors in the US.",
      goal: "Identify the root causes and formulate an architectural fix.",
      hints: [
        "Check DNS Time-to-Live (TTL) and geographic proximity of DNS resolvers.",
        "Inspect whether static HTML/CSS/JS assets are hosted from a single US origin or cached at CDN edge PoPs in Sydney.",
        "Consider TCP and TLS handshake round trips across submarine fiber cables."
      ]
    },
    steps: [
      {
        id: "step-1",
        title: "1. Browser Cache & URL Parsing",
        actor: "Client Browser",
        target: "Local OS Cache",
        status: "Checking local memory cache",
        description: "The browser dissects the URL: protocol is HTTPS (port 443), host is systemverse.dev. It queries internal memory, OS cache (/etc/hosts), and socket pools.",
        packetInfo: {
          protocol: "INTERNAL",
          type: "CACHE_LOOKUP",
          payload: { Lookup: "systemverse.dev", BrowserCache: "MISS", Next: "Recursive DNS" }
        },
        durationMs: 50
      },
      {
        id: "step-2",
        title: "2. Recursive DNS Resolution",
        actor: "Recursive Resolver",
        target: "Authoritative Nameserver",
        status: "Resolving IP address",
        description: "Queries Root (.), TLD (.dev), and Authoritative server. Returns IPv4 address 104.21.48.91 (A Record) with 300s TTL.",
        packetInfo: {
          protocol: "DNS (UDP/53)",
          type: "DNS_QUERY",
          payload: { RootServer: "Querying .", TLDServer: ".dev", ResolvedIP: "104.21.48.91" }
        },
        durationMs: 80
      },
      {
        id: "step-3",
        title: "3. TCP 3-Way Handshake",
        actor: "Client Browser",
        target: "Edge Server / Load Balancer",
        status: "Establishing reliable transport connection",
        description: "Client sends SYN (Seq=100); Server replies SYN-ACK (Seq=300, Ack=101); Client sends ACK (Seq=101, Ack=301). Connection established.",
        packetInfo: {
          protocol: "TCP (IP/443)",
          type: "SYN_ACK",
          payload: { Step1: "SYN", Step2: "SYN-ACK", Step3: "ACK", State: "ESTABLISHED" }
        },
        durationMs: 60
      },
      {
        id: "step-4",
        title: "4. TLS 1.3 Cryptographic Handshake",
        actor: "Client Browser",
        target: "Edge Server",
        status: "Securing connection with AES-256",
        description: "ClientHello with cipher suites and key share. ServerHello with certificate and ECDHE key exchange. Secure tunnel ready.",
        packetInfo: {
          protocol: "TLS 1.3",
          type: "KEY_EXCHANGE",
          payload: { Cipher: "TLS_AES_256_GCM", KeyExchange: "X25519", Status: "ENCRYPTED" }
        },
        durationMs: 70
      },
      {
        id: "step-5",
        title: "5. HTTP Request & Backend Processing",
        actor: "App Server & Database",
        target: "Client Browser",
        status: "Serving HTTP 200 OK",
        description: "App server verifies session, executes database index query, and streams HTML/JSON response back to client browser.",
        packetInfo: {
          protocol: "HTTP/2",
          type: "RESPONSE",
          payload: { Status: "200 OK", ContentType: "text/html; charset=UTF-8", Transfer: "chunked" }
        },
        durationMs: 90
      }
    ],
    commonMistakes: [
      "Assuming DNS lookup connects directly to the target website server (it connects to DNS nameservers first).",
      "Believing HTTPS encrypts the target IP address (IP headers must remain unencrypted for intermediate routers).",
      "Forgetting that every additional un-reused TCP connection incurs a full 3-way handshake round trip."
    ],
    realWorldExample: {
      company: "Cloudflare & Google",
      headline: "1.1.1.1 and 8.8.8.8 Anycast DNS",
      detail: "Cloudflare and Google announce their DNS resolver IP addresses from hundreds of data centers worldwide using BGP Anycast, ensuring DNS queries resolve in <15ms globally."
    },
    quiz: [
      {
        id: "q1",
        question: "Why does standard DNS resolution use UDP port 53 rather than TCP?",
        options: [
          "UDP is encrypted by default, protecting domain privacy.",
          "UDP avoids the multi-packet 3-way handshake, minimizing latency for small single-packet queries.",
          "UDP guarantees in-order delivery of large responses.",
          "Browsers cannot open TCP connections to network routers."
        ],
        correctIndex: 1,
        explanation: "DNS query/response fits inside a single packet. UDP avoids the 3-packet TCP handshake round-trip overhead."
      },
      {
        id: "q2",
        question: "What major efficiency upgrade did TLS 1.3 introduce compared to TLS 1.2?",
        options: [
          "It removed encryption entirely to speed up transfer rates.",
          "It reduced the cryptographic handshake from 2 Round Trips (RTT) to 1 RTT.",
          "It replaced TCP with Bluetooth.",
          "It eliminated the need for Digital Certificates."
        ],
        correctIndex: 1,
        explanation: "TLS 1.3 combines key negotiation with the ClientHello, completing the cryptographic handshake in just 1 RTT."
      }
    ],
    keyTakeaways: [
      "URL parsing and local caching prevent unnecessary network round trips.",
      "DNS translates human domain names into routable IP addresses hierarchically.",
      "TCP guarantees reliability and packet ordering; TLS guarantees privacy and authenticity.",
      "Modern CDNs terminate TLS at edge servers to minimize handshake distance."
    ]
  },

  "client-and-server-architecture": {
    id: "client-and-server-architecture",
    stageId: 1,
    title: "Client and Server Architecture",
    simulatorType: "server",
    shortSummary: "Master the fundamental boundary of software architecture: how stateless clients talk to listening servers, how OS sockets accept requests, and how concurrency limits define capacity.",
    concept: {
      heading: "The Client-Server Contract",
      body: "Clients initiate communication; servers listen passively on network ports until a connection arrives.",
      bulletPoints: [
        "Clients: Initiators that render UI, hold volatile local state, and issue commands.",
        "Servers: Centralized listeners bound to specific ports (e.g. 80, 443, 8080) that enforce security and consistency.",
        "Socket accept loop: Operating system buffers incoming TCP connections into a backlog queue.",
        "Statelessness: Each request must carry all authentication and parameter context needed for execution."
      ]
    },
    analogy: {
      headline: "The Restaurant Kitchen & Waiter Analogy",
      text: "Customers (Clients) sit at tables and decide what they want to order. They cannot walk into the kitchen and cook food themselves. Instead, they give their order to a waiter (Network Request). The kitchen (Server) processes orders using its cook stations (Worker Threads). If 100 orders arrive at once, tickets sit on the order spindle (Queue Buffer) until a cook is free. If the spindle overflows, the kitchen stops accepting new diners.",
      icon: "🍽️"
    },
    visualExplanation: {
      diagramDescription: "Clients connect across internet to server socket queue and thread pool.",
      layers: [
        { name: "Client Browser / App", role: "Formulates HTTP request with JWT", latency: "0 ms" },
        { name: "OS TCP Socket Queue", role: "Buffers incoming TCP SYN packets", latency: "~1 ms" },
        { name: "Application Worker Pool", role: "Picks up requests, runs business code", latency: "~50 ms" },
        { name: "Storage & Cache", role: "Reads/writes persistent data", latency: "~10 ms" },
      ]
    },
    whatHappened: {
      keyInsights: [
        "A single server thread can only do one CPU-bound task at a time.",
        "If workers spend time waiting for database queries, non-blocking I/O keeps CPU cores utilized.",
        "Horizontal scaling means adding more server instances rather than buying an impossibly huge machine."
      ],
      technicalDeepDive: "When an application listens on `0.0.0.0:8080`, the OS kernel manages the connection accept queue. If the application loop does not call `accept()` fast enough, the OS queue fills and the kernel drops incoming SYN packets with connection refused."
    },
    challenge: {
      scenario: "During a flash sale, your single Node.js application server's CPU spikes to 100% and clients see HTTP 504 Gateway Timeout.",
      goal: "Determine whether the bottleneck is thread starvation, database lock contention, or network bandwidth.",
      hints: [
        "Check request queue backlog depth.",
        "Examine how long worker threads spend processing each request.",
        "Consider splitting long-running image/email jobs to asynchronous background queues."
      ]
    },
    steps: [
      {
        id: "step-1",
        title: "1. Client Initiates Request",
        actor: "Client",
        target: "Server Port 443",
        status: "Sending HTTP GET",
        description: "Client formats JSON payload and sends it over the active TCP connection.",
        packetInfo: { protocol: "HTTP/1.1", type: "REQUEST", payload: { Endpoint: "/api/products", Method: "GET" } },
        durationMs: 40
      },
      {
        id: "step-2",
        title: "2. Server Dispatches to Worker",
        actor: "Kernel Socket",
        target: "Worker Thread 02",
        status: "Assigning request to idle thread",
        description: "The main server dispatcher thread dequeues the request and assigns it to Worker #2.",
        packetInfo: { protocol: "IPC", type: "THREAD_DISPATCH", payload: { WorkerId: "2", Status: "BUSY" } },
        durationMs: 10
      },
      {
        id: "step-3",
        title: "3. Execution & Response Return",
        actor: "Worker Thread 02",
        target: "Client",
        status: "Returning HTTP 200 OK",
        description: "Worker finishes computing JSON, flushes bytes to socket, and transitions back to IDLE.",
        packetInfo: { protocol: "HTTP/1.1", type: "RESPONSE", payload: { Status: "200 OK", BodySize: "1.4KB" } },
        durationMs: 50
      }
    ],
    commonMistakes: [
      "Storing user session data in server RAM memory, making it impossible to add a second server.",
      "Allowing slow database queries to tie up worker threads indefinitely without timeouts."
    ],
    realWorldExample: {
      company: "Netflix",
      headline: "Stateless Microservices Tier",
      detail: "Netflix runs thousands of stateless Spring Boot / Node microservices. Any instance can die at any second without losing user state, because state lives in Cassandra, DynamoDB, and EVCache."
    },
    quiz: [
      {
        id: "q1",
        question: "Why is statelessness considered a core requirement for scalable web servers?",
        options: [
          "It makes code shorter and easier to read.",
          "Any incoming request can be safely routed to any available server instance without losing user context.",
          "It prevents the server from needing a database.",
          "It speeds up CPU clock frequencies."
        ],
        correctIndex: 1,
        explanation: "When servers hold no user session in memory, adding 10 or 100 new servers behind a load balancer is seamless."
      }
    ],
    keyTakeaways: [
      "Servers are listeners; clients are initiators.",
      "Worker pools have finite concurrency limits governed by CPU cores and I/O wait.",
      "Stateless architecture is the foundation of horizontal autoscaling."
    ]
  },

  "latency-vs-bandwidth": {
    id: "latency-vs-bandwidth",
    stageId: 1,
    title: "Latency vs Bandwidth: The Physics of Networks",
    simulatorType: "cdn",
    shortSummary: "Understand the unyielding difference between how wide your pipe is (bandwidth) and how fast light travels through glass fibers across the globe (latency).",
    concept: {
      heading: "Bandwidth vs Latency",
      body: "Bandwidth is how much water fits through the pipe per second; latency is how long a single drop takes to travel from the reservoir to your faucet.",
      bulletPoints: [
        "Bandwidth (Throughput): Amount of data transferred per second (e.g. 1 Gbps, 100 MB/s).",
        "Latency: Time elapsed for a signal to travel from sender to receiver (e.g. 15ms, 180ms).",
        "Speed of light in fiber optic glass is ~200,000 km/s (roughly 30% slower than vacuum).",
        "Round-Trip Time (RTT): The time required for a packet to travel there and back."
      ]
    },
    analogy: {
      headline: "The Highway Lane Analogy",
      text: "Adding more lanes to a highway increases its throughput (more cars can pass each minute), but it does NOT increase the speed limit. A single car driving from San Francisco to New York still takes 40 hours regardless of whether the highway has 2 lanes or 16 lanes. To reduce travel time, you must move the destination closer to the traveler (CDN Edge servers).",
      icon: "🚗"
    },
    visualExplanation: {
      diagramDescription: "Global fiber distances and light propagation round trips.",
      layers: [
        { name: "Local Metro Edge (London -> London)", role: "Direct metro fiber", latency: "5 ms" },
        { name: "Transatlantic Cable (London -> New York)", role: "3,500 miles subsea cable", latency: "75 ms" },
        { name: "Transpacific Cable (Tokyo -> Oregon)", role: "5,100 miles ocean fiber", latency: "165 ms" },
      ]
    },
    whatHappened: {
      keyInsights: [
        "You can buy more bandwidth from your cloud provider; you cannot buy faster speed of light.",
        "Chatty protocols with multiple sequential round trips amplify high latency dramatically.",
        "Edge CDNs solve the latency dilemma by caching data geographically close to end users."
      ],
      technicalDeepDive: "TCP throughput is fundamentally bounded by the Bandwidth-Delay Product (BDP = Bandwidth * RTT). On high-latency connections, a small TCP receive window caps data transfer speed regardless of available physical gigabit links."
    },
    challenge: {
      scenario: "An API client in Sydney makes 6 sequential HTTP requests to a database in Virginia, taking over 1.4 seconds total.",
      goal: "Redesign the architecture to reduce total request time to under 150ms.",
      hints: [
        "Batch the 6 round trips into a single combined payload.",
        "Deploy read replicas or CDN edge caching in the Asia-Pacific region.",
        "Use HTTP/2 multiplexing or GraphQL query batching."
      ]
    },
    steps: [
      {
        id: "step-1",
        title: "1. Transmitting Photon across Subsea Cable",
        actor: "Client Transceiver",
        target: "Subsea Repeater",
        status: "Pulsing laser through ocean glass",
        description: "Photons travel at ~5 microseconds per kilometer of glass cable. Physical distance creates unavoidable minimum RTT.",
        packetInfo: { protocol: "PHYSICAL", type: "PHOTON_PULSE", payload: { DistanceKm: "5800", OpticalDelay: "29ms" } },
        durationMs: 40
      }
    ],
    commonMistakes: [
      "Upgrading internet connection from 100 Mbps to 1 Gbps expecting game ping / latency to decrease (ping depends on distance and routing hops, not bandwidth).",
      "Making multiple sequential REST requests across continents inside a tight UI rendering loop."
    ],
    realWorldExample: {
      company: "High-Frequency Trading & AWS",
      headline: "Direct Subsea Cables",
      detail: "Trading firms spent hundreds of millions of dollars drilling fiber tunnels straight through mountains and laying custom Atlantic cables just to shave 3 milliseconds off trading latency."
    },
    quiz: [
      {
        id: "q1",
        question: "Why can't upgrading a cloud server's network connection from 1 Gbps to 10 Gbps reduce latency from Sydney to London?",
        options: [
          "Cloud providers throttle packet speeds intentionally.",
          "Latency is fundamentally bounded by the speed of light propagating across the physical distance of fiber cables.",
          "10 Gbps requires different DNS servers.",
          "Sydney and London use different electrical frequencies."
        ],
        correctIndex: 1,
        explanation: "Distance determines propagation delay. Bandwidth increases pipe width, not light speed."
      }
    ],
    keyTakeaways: [
      "Bandwidth is volume; latency is delay.",
      "Propagation latency is fixed by physics and geographic distance.",
      "To beat latency: move data closer (CDN), cache aggressively, and minimize round-trip roundabouts."
    ]
  }
};

// Default fallback generator for remaining lessons so all 12 stages render rich, complete pages
export function getLessonById(id: string): LessonData | null {
  if (LESSON_DETAILS[id]) {
    return LESSON_DETAILS[id];
  }

  // Find metadata from stages
  let stageId: number | null = null;
  let title = id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  let shortSummary = "Explore core architectural principles, trade-offs, and interactive experiments for this system design topic.";
  let simulatorType: LessonData["simulatorType"] = undefined;

  for (const stage of CURRICULUM_STAGES) {
    const found = stage.lessons.find(l => l.id === id);
    if (found) {
      stageId = stage.id;
      title = found.title;
      shortSummary = found.description;
      simulatorType = found.simulatorType;
      break;
    }
  }

  // If the lesson ID is not in any curriculum stage and not in LESSON_DETAILS, it's invalid
  if (stageId === null) {
    return null;
  }

  // Choose appropriate simulator default if not specified
  if (!simulatorType) {
    if (id.includes("database") || id.includes("sql") || id.includes("acid")) simulatorType = "database";
    else if (id.includes("cache") || id.includes("redis")) simulatorType = "cache";
    else if (id.includes("queue") || id.includes("async") || id.includes("dlq")) simulatorType = "queue";
    else if (id.includes("load-balanc") || id.includes("failover")) simulatorType = "load_balancer";
    else if (id.includes("cdn") || id.includes("storage")) simulatorType = "cdn";
    else if (id.includes("replica") || id.includes("consistency")) simulatorType = "replication";
    else simulatorType = "server";
  }

  return {
    id,
    stageId,
    title,
    simulatorType,
    shortSummary,
    concept: {
      heading: "Architectural Foundations & Core Principles",
      body: `Mastering ${title} is crucial for designing resilient, scalable software systems that perform under load and survive component failures gracefully.`,
      bulletPoints: [
        "Fundamental trade-offs between latency, throughput, consistency, and operational complexity.",
        "How component failures propagate and how to isolate blast radiuses.",
        "Practical engineering strategies for horizontal autoscaling and failover."
      ]
    },
    analogy: {
      headline: `The Practical Real-World Analogy for ${title}`,
      text: "Think of this architectural component as an essential coordinator in a high-throughput distribution center. Without it, individual workers get overwhelmed, bottlenecks develop at the intake docks, and orders grind to a halt.",
      icon: "💡"
    },
    visualExplanation: {
      diagramDescription: "Architecture data flow, component boundaries, and request traversal.",
      layers: [
        { name: "Client Ingress", role: "Requests initiate from web/mobile clients", latency: "< 5 ms" },
        { name: "Distribution & Logic Tier", role: "Load routing, business logic, validation", latency: "~20 ms" },
        { name: "Storage & Persistence Tier", role: "Data access, caching, replication", latency: "~10 ms" },
      ]
    },
    whatHappened: {
      keyInsights: [
        "Always measure the bottleneck first with telemetry metrics before applying optimizations.",
        "Redundancy and statelessness eliminate single points of failure.",
        "Graceful degradation preserves core user experience during peak traffic surges."
      ],
      technicalDeepDive: "In high-throughput environments, tail latencies (P99, P99.9) govern overall system performance. A single lagging component blocks upstream connections and cascades into cluster-wide timeouts."
    },
    challenge: {
      scenario: `You are asked to architect ${title} to support a 10x traffic spike with zero downtime and strict sub-100ms response targets.`,
      goal: "Identify potential single points of failure and specify your caching, scaling, and redundancy strategy.",
      hints: [
        "Where does state live? Can compute nodes be scaled horizontally?",
        "What happens when the primary node crashes?",
        "How does caching protect downstream storage?"
      ]
    },
    steps: [
      {
        id: "step-1",
        title: "1. Request Ingress",
        actor: "Client",
        target: "System Gateway",
        status: "Initiating flow",
        description: `Client dispatches operation to the ${title} architecture tier.`,
        packetInfo: { protocol: "TCP/HTTPS", type: "INGRESS", payload: { Action: "PROCESS", Topic: id } },
        durationMs: 30
      },
      {
        id: "step-2",
        title: "2. Component Processing",
        actor: "Architecture Tier",
        target: "Storage / Worker",
        status: "Processing operation",
        description: "Applies isolation boundaries, executes business logic, and coordinates with persistence layers.",
        packetInfo: { protocol: "INTERNAL", type: "COORDINATION", payload: { State: "PROCESSING" } },
        durationMs: 50
      }
    ],
    commonMistakes: [
      "Premature optimization before identifying the actual system bottleneck.",
      "Failing to plan for network partitions and component crash recovery."
    ],
    realWorldExample: {
      company: "Industry Production Standard",
      headline: "High-Scale Distributed Deployments",
      detail: "Modern hyperscalers rely on this architectural pattern to maintain 99.99% availability across millions of concurrent requests."
    },
    quiz: [
      {
        id: "q1",
        question: `What is the primary architectural trade-off when implementing ${title}?`,
        options: [
          "Balancing performance and scalability against system complexity and operational cost.",
          "Replacing all databases with flat text files.",
          "Eliminating the need for unit testing.",
          "Requiring clients to run faster CPU hardware."
        ],
        correctIndex: 0,
        explanation: "Every distributed system design decision involves trade-offs between simplicity, latency, consistency, and operational cost."
      }
    ],
    keyTakeaways: [
      "Decoupled components scale independently and recover from failure without crashing the whole system.",
      "Measure bottlenecks using P99 metrics, not misleading averages.",
      "Interactive experimentation develops intuitive architectural mental models."
    ]
  };
}

// Backwards compatibility alias
export const FLAGSHIP_LESSON = LESSON_DETAILS["what-happens-when-website-loads"];
