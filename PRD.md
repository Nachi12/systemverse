# SYSTEMVERSE — Product Requirements Document (PRD)

**Product Name:** SYSTEMVERSE  
**Tagline:** Build Systems. Break Systems. Master Architecture.  
**Target Audience:** Beginner-to-intermediate developers, computer science students, and engineers preparing for System Design interviews.

---

## 1. Vision & Core Philosophy
SYSTEMVERSE transforms System Design education from static diagrams and passive video watching into an active, high-octane engineering laboratory. Users do not merely read about load balancers, caches, or sharding—they deploy them in real-time, inject traffic spikes, simulate cascading failures, observe bottlenecks, and tune distributed parameters.

### Core Tenets
1. **Don't just explain. SHOW.** Every concept features an interactive visual representation.
2. **Don't just show. Let users INTERACT.** Sliders, toggles, packet step-throughs, and drag-and-drop mechanics.
3. **Don't just teach. Let users BUILD.** Full architectural canvas with verified connections and load simulations.
4. **Don't just celebrate success. Let users BREAK and FIX.** Chaos engineering, node failure simulations, latency spikes, and recovery validation.

---

## 2. Key Modules & Functional Requirements

### 2.1 Mission Control Dashboard
- **Gamified Overview:** XP counter, Current Level (e.g., "Junior Architect", "Distributed Systems Specialist"), Daily Streaks, Completed modules.
- **Quick Resume:** Jump directly to the next incomplete lesson or challenge.
- **Live Simulator Teaser:** Mini-playground to stress test an instant 3-tier architecture.
- **Skill Mastery Matrix:** Visual representation of proficiency across 12 architecture disciplines.
- **Daily Quests:** Daily missions granting bonus XP (e.g., "Simulate a cache failure", "Complete DNS resolution lifecycle").

### 2.2 Visual Learning Roadmap
- **Interactive Tech Tree:** 12 Levels with prerequisite gating, unlocking animations, and status indicators (Locked, In-Progress, Mastered).
- **Difficulty progression:** Foundations -> Core Components -> Data Tier -> Distributed Consensus -> Real-World High Scale -> Mock Interviews.
- **Node Inspection:** Hover/click to view learning objectives, estimated time, and key concepts.

### 2.3 Interactive Lesson Player (Deep Exploration)
- **Multi-Phase Pedagogical Model:**
  1. *Core Concept:* Concise, high-signal explanation without walls of text.
  2. *Real-World Analogy:* Physical analogy (e.g., restaurant kitchens, postal services, airport security).
  3. *Animated Step-Through:* Packet-by-packet flow with pause, step-forward, step-backward, and inspector pane.
  4. *Live Laboratory:* Real-time parameter modulation (RPS, network latency, failure injection).
  5. *Architecture Breakdown:* Production anatomy (e.g., Netflix, Google, Cloudflare).
  6. *Interactive Quiz & Challenge:* Formative knowledge check with immediate explanation of wrong answers.
- **Featured First Lesson:** "What Happens When You Open a Website?" (Browser -> DNS Resolver -> Root/TLD/Authoritative Server -> TCP Handshake -> TLS -> HTTP GET -> Reverse Proxy -> App Server -> Database -> DOM Render).

### 2.4 Drag-and-Drop Architecture Lab (@xyflow/react)
- **Palette of 15+ Architectural Nodes:** Client, DNS, CDN, API Gateway, Load Balancers (L4/L7), Web Servers, Microservices, Relational DB (Leader/Follower), NoSQL, Redis Cache, Kafka/RabbitMQ Message Queue, Workers, Object Storage (S3), Auth Service, Prometheus/Monitoring.
- **Connection Logic:** Port-based handle connections with live validation (e.g., warning if Client connects directly to Database).
- **Node Property Inspector:** Configure capacity (RPS limit, max connections, cache eviction policy LRU/LFU, read/write latency).
- **Execution & Flow Animation:** Moving data packets indicating current throughput and active routes.
- **Templates:** Instant import of classic architectures (URL Shortener, E-Commerce Flash Sale, Social Feed, Video Streaming).
- **Export/Import:** Export design to JSON and diagram snapshot.

### 2.5 Real-Time System Simulation Engine
- **Deterministic Mathematical Model:** Computes throughput, drop rate, queue backlog, P50/P99 latency, and saturation using Little's Law and queuing theory.
- **Chaos Injection Controls:**
  - Increase traffic from 10 RPS to 1,000,000 RPS.
  - Sever connection or kill node (Simulate server crash).
  - Add latency penalty (inter-region delay).
  - Cache failure (0% hit rate simulation causing DB stampede).
- **Metrics Visualizer:** Real-time Recharts showing Throughput vs Drop Rate, Latency Distribution, and Component Saturation Gauges.

### 2.6 Real-World System Design Walkthroughs
- Deep interactive architectures for top 10 interview questions:
  1. TinyURL / URL Shortener (Base62, hash collision, write-heavy cache)
  2. WhatsApp / Real-time Messenger (WebSockets, presence server, message queues)
  3. Instagram Feed (Fan-out on write vs fan-out on read, hybrid model)
  4. Netflix Video Delivery (Transcoding workers, multi-CDN, chunked streaming)
  5. Uber Ride Dispatch (Geohashing, quadtrees, dynamic pricing engine)
  6. E-Commerce Flash Sale (Redis atomic decrements, inventory locking, DLQ)
  7. Distributed Notification Engine (Priority queues, provider fallbacks)
  8. Cloud File Storage / Dropbox (Chunking, deduplication, sync protocol)
  9. Distributed Rate Limiter (Token bucket, sliding window counter in Redis)
  10. Search Autocomplete (Trie data structure, frequency caches)

### 2.7 Architect AI Tutor
- Context-aware technical assistant.
- Multiple tutoring personas: "Explain Like I'm 5", "Senior Staff Deep-Dive", "Why Did My System Fail?", "Give Me a Hint", "Interview Me".
- Rule-based offline intelligence fallback with hundreds of contextual tips + optional user Gemini API Key integration for infinite open-ended architectural reasoning.

### 2.8 Gamification & Persistence
- Local persistence via `localStorage` with exportable JSON profile.
- XP, badges, streak tracking, sound/visual celebration effects upon module mastery.

