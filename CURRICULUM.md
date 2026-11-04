# SYSTEMVERSE — Complete 12-Level System Design Curriculum

Every module in SYSTEMVERSE incorporates a hands-on interactive laboratory, concrete real-world analogy, animated step-through, and formative quiz.

---

### Level 1: Internet & Network Foundations
- **1.1 What Happens When You Open a Website? (The Flagship Experience)**
  - Browser DNS lookup -> TCP Handshake -> TLS Negotiation -> HTTP GET -> Server processing -> Response rendering.
  - Interactive packet animator, DNS resolver latency, server failure toggles.
- **1.2 The Anatomy of IP, TCP & UDP**
  - Reliability vs speed; packet ordering, sliding window, retransmissions, SYN flood.
- **1.3 HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)**
  - Head-of-line blocking, multiplexing, binary framing, TLS 1.3 0-RTT.

---

### Level 2: Scalability, Availability & Core Metrics
- **2.1 Vertical vs Horizontal Scaling**
  - Upgrading CPU/RAM vs distributing load across commodity clusters. Cost curves and physical limits.
- **2.2 Latency, Throughput & Bandwidth**
  - Little's Law ($L = \lambda W$), P50/P90/P99 tail latency, SLOs, SLAs, and SLIs.
- **2.3 Availability Calculations & Disaster Recovery**
  - High availability math (99.9% "three nines" vs 99.999% "five nines"), MTTR, MTBF, RTO, RPO.

---

### Level 3: Load Balancing & Reverse Proxies
- **3.1 Load Balancing Algorithms**
  - Round Robin, Weighted Round Robin, Least Connections, IP Hash, Consistent Hashing.
- **3.2 Layer 4 vs Layer 7 Load Balancing**
  - Transport layer (TCP/UDP) vs Application layer (HTTP header routing, SSL termination, cookie affinity).
- **3.3 Health Checks & Self-Healing Clusters**
  - Active vs passive health checking, exponential backoff, circuit breaking, failover pools.

---

### Level 4: Database Systems & Data Modeling
- **4.1 SQL vs NoSQL Trade-offs**
  - Relational guarantees (ACID) vs Horizontal flexibility (BASE, document, key-value, wide-column, graph).
- **4.2 Indexes & Query Execution Paths**
  - B-Trees, LSM-Trees, Hash indexes, table scans, write amplification.
- **4.3 Database Replication & Read Scaling**
  - Single-leader, multi-leader, leaderless; synchronous vs asynchronous replication lag.
- **4.4 Database Sharding & Partitioning**
  - Range-based, hash-based, directory-based; re-sharding challenges and hot-spot mitigation.

---

### Level 5: High-Performance Caching & CDNs
- **5.1 Caching Strategies**
  - Cache-Aside (Lazy loading), Read-Through, Write-Through, Write-Behind (Write-back).
- **5.2 Cache Invalidation & Eviction Policies**
  - LRU (Least Recently Used), LFU, FIFO, TTL expiry; solving the "Cache Stampede" (Thundering Herd).
- **5.3 Content Delivery Networks (CDNs)**
  - Edge caching, Anycast routing, Origin shielding, static vs dynamic acceleration.

---

### Level 6: Distributed Systems & Consensus
- **6.1 CAP Theorem & PACELC**
  - Consistency vs Availability during Network Partitions; Latency vs Consistency trade-offs.
- **6.2 Distributed Consistency Models**
  - Strong consistency, Eventual consistency, Read-your-writes, Monotonic reads.
- **6.3 Consensus Protocols & Leader Election**
  - Raft and Paxos fundamentals; Quorum reads/writes ($R + W > N$), split-brain defense.

---

### Level 7: Asynchronous Messaging & Event Streams
- **7.1 Message Queues vs Event Streams**
  - RabbitMQ (point-to-point, AMQP) vs Apache Kafka (distributed append-only commit log).
- **7.2 Delivery Semantics & Idempotency**
  - At-most-once, At-least-once, Exactly-once; consumer offset management and idempotency keys.
- **7.3 Backpressure, Dead-Letter Queues (DLQ) & Circuit Breakers**
  - Rate smoothing during traffic surges; handling malformed poisons pills safely.

---

### Level 8: Modern APIs & Real-Time Communication
- **8.1 REST vs GraphQL vs gRPC**
  - Over/under-fetching, Protobuf binary efficiency, streaming RPCs, contract schema evolution.
- **8.2 Real-Time Protocols: WebSockets vs SSE vs Long-Polling**
  - Full-duplex persistent connections vs unidirectional server push.
- **8.3 API Gateways & Distributed Rate Limiting**
  - Token Bucket, Leaky Bucket, Fixed Window, Sliding Window Log with Redis sorted sets.

---

### Level 9: Cloud Infrastructure, Security & Reliability
- **9.1 Containers, Microservices & Service Mesh**
  - Docker containers, Kubernetes orchestration, sidecar proxies (Envoy/Istio).
- **9.2 The Observability Triad: Metrics, Logs & Distributed Tracing**
  - OpenTelemetry, Prometheus, Grafana, Jaeger; correlation IDs through microservice chains.
- **9.3 Defense-in-Depth & Zero Trust Security**
  - TLS mTLS, JWT vs Session tokens, DDoS mitigation, WAF, OAuth2/OIDC.

---

### Level 10: Architectural Decision Frameworks
- **10.1 Monolith vs Microservices**
  - Modular monoliths, microservice boundaries, distributed transactions, 2-Phase Commit vs Sagas.
- **10.2 CQRS & Event Sourcing**
  - Command Query Responsibility Segregation, immutable event stores, read projection rebuilds.

---

### Level 11: Real-World Flagship Blueprint Projects
1. **Design a URL Shortener (TinyURL)**
2. **Design a Real-Time Chat System (WhatsApp)**
3. **Design a Social Media Newsfeed (Instagram/Twitter)**
4. **Design a Video Streaming Platform (Netflix/YouTube)**
5. **Design a Ride-Hailing Platform (Uber/Lyft)**
6. **Design an E-Commerce Flash Sale Platform (Amazon/Shopee)**
7. **Design a Distributed Notification Engine**
8. **Design a Cloud File Storage Service (Dropbox/Google Drive)**
9. **Design a Distributed API Rate Limiter**
10. **Design a Real-Time Search Autocomplete (Google Typeahead)**

---

### Level 12: System Design Interview Simulator
- **Interactive Interview Engine:** Real-time prompts, timed stages (Requirements, Capacity Estimation, High-Level Design, Deep-Dive, Bottlenecks).
- **Self-Assessment & Automated Rubric:** Score breakdown across Scalability, Resilience, Efficiency, and Trade-off Clarity.

