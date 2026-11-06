# SystemVerse

SystemVerse is an interactive visual platform for learning distributed systems architecture and system design through experimentation. Instead of reading passive documentation, engineers interact with real-time distributed simulators, inspect hop-by-hop packet traversals, and test failure modes directly in the browser.

---

## Overview

Traditional system design material often relies on static diagrams and high-level summaries that fail to demonstrate how systems behave under stress. SystemVerse models runtime characteristics including queue saturation, cache stampedes, replication lag, and network latency so developers can build an accurate mental model of distributed failure modes.

The platform provides:

- A 12-stage structured curriculum progressing from computer fundamentals to large-scale distributed architectures.
- 8 dedicated real-time simulators modeling specific infrastructure components.
- An interactive Architecture Playground powered by React Flow for composing custom topologies.
- Hop-by-hop packet execution views breaking down protocol handshakes and network boundaries.
- Built-in verification quizzes and architectural incident scenarios for each topic.
- An automated route and curriculum regression suite validating every lesson path.

---

## System Architecture

The application is built on Next.js 14 using the App Router. The codebase separates server-side validation and static pre-rendering from client-side simulation state.

```
+-----------------------------------------------------------------------------------+
|                                NEXT.JS APP ROUTER                                 |
|                                                                                   |
|  +--------------------+  +-----------------------+  +--------------------------+  |
|  |    Landing Page    |  |   Curriculum Roadmap  |  |    Lesson Route Engine   |  |
|  |    src/app/page    |  |     src/app/learn     |  |   src/app/learn/[id]     |  |
|  |                    |  |                       |  |  (SSG + Server Boundary) |  |
|  +--------------------+  +-----------------------+  +--------------------------+  |
|                                                                 |                 |
|                                                                 v                 |
|  +-----------------------------------------------------------------------------+  |
|  |                           LessonClientView (Client)                         |  |
|  |  - Active tab controller (Lab Sandbox, Concept, Packet Flow, Challenge)     |  |
|  |  - Progress attribution via Zustand store                                   |  |
|  |  - Interactive Quiz validation and evaluation                               |  |
|  +-----------------------------------------------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  |                      8 Component-Level Simulators                           |  |
|  |  - DatabaseSimulator     - ServerSimulator        - LoadBalancerSimulator   |  |
|  |  - CacheSimulator        - QueueSimulator         - NetworkSimulator        |  |
|  |  - CDNSimulator          - ReplicationSimulator                             |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                     Architecture Playground (@xyflow/react)                 |  |
|  |  - Custom SVG node canvas with connection handles                           |  |
|  |  - Animated packet delivery along bezier paths                              |  |
|  |  - Capacity and bottleneck analysis                                         |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## Dedicated Infrastructure Simulators

Each simulator provides isolated parameter controls, live metrics, and visual feedback:

1. Server Simulator (`ServerSimulator.tsx`)
   Models concurrent worker threads, non-blocking event loops, queue buffers, and Little's Law. Users adjust request rates to observe thread pool exhaustion and HTTP 504 timeouts.

2. Load Balancer Simulator (`LoadBalancerSimulator.tsx`)
   Demonstrates round-robin, least connections, IP hash, and weighted distribution across multiple backend nodes. Simulates worker degradation and automatic health check eviction.

3. Database Simulator (`DatabaseSimulator.tsx`)
   Visualizes B-tree index lookups versus full table scans, query execution costs, and connection pool saturation under write-heavy loads.

4. Cache Simulator (`CacheSimulator.tsx`)
   Demonstrates Cache-Aside, Write-Through, LRU eviction policies, TTL expiration, and cache stampede protection using mutex locking.

5. Queue Simulator (`QueueSimulator.tsx`)
   Simulates producer-consumer decoupling, message buffers, consumer lag, backpressure spikes, and Dead Letter Queue (DLQ) routing for poison pills.

6. Network Simulator (`NetworkSimulator.tsx`)
   Models TCP three-way handshakes, TLS 1.3 cryptographic key exchanges, round-trip times (RTT), and physical propagation constraints over transatlantic distances.

7. CDN Simulator (`CDNSimulator.tsx`)
   Compares origin-fetch latencies against edge Points of Presence (PoPs), demonstrating cache hit ratios, purge mechanics, and bandwidth offloading.

8. Replication Simulator (`ReplicationSimulator.tsx`)
   Models primary-replica architectures, asynchronous replication lag, replica read-scaling, and failover promotion when a primary instance crashes.

---

## Curriculum Structure

The curriculum contains 12 progressive stages. Each lesson includes a real-world physical analogy, technical deep-dive, latency budget matrix, step-by-step packet flow, and a verification quiz.

- Stage 01: Distributed Fundamentals (DNS lookup, TCP/TLS handshakes, latency vs bandwidth)
- Stage 02: Web Application Architecture (monolith vs microservices, stateless servers, REST vs GraphQL vs gRPC)
- Stage 03: Server and Concurrency Fundamentals (threads, event loops, async I/O, queueing theory)
- Stage 04: Storage and Persistence (B-tree indexing, ACID guarantees, transaction isolation)
- Stage 05: Caching Layers (Cache-Aside, Redis memory models, eviction policies, thundering herd)
- Stage 06: High Availability and Load Balancing (Layer 4 vs Layer 7 routing, health checks, failover)
- Stage 07: Asynchronous Message Queues (Kafka and RabbitMQ patterns, DLQs, pub-sub architectures)
- Stage 08: Global Delivery and Edge Networks (CDN edge caching, Anycast DNS, object storage)
- Stage 09: Distributed Data and Consensus (sharding strategies, consistent hashing, CAP theorem)
- Stage 10: Reliability and Observability (token-bucket rate limiting, circuit breakers, distributed tracing)
- Stage 11: Real-World System Blueprints (URL shorteners, social feeds, live real-time chat)
- Stage 12: Interview Preparation Framework (4-step interview template, capacity estimation math)

---

## Technology Stack

- Framework: Next.js 14.2 (App Router with TypeScript)
- UI Library: React 18
- Canvas and Nodes: @xyflow/react (React Flow)
- Charts and Analytics: Recharts
- Styling: Tailwind CSS with CSS custom properties
- State Management: Zustand with persistent storage
- Icons: Lucide React
- Visual Effects: Canvas Confetti

---

## Design System

The application uses an architectural, high-contrast dark theme calibrated for readability and reduced eye fatigue during extended technical study:

- Background: `#090E12` (deep charcoal navy)
- Card Surfaces: `#172126` (elevated slate panel)
- Primary Accent: `#A3E635` (lime green for primary actions, active indicators, and success states)
- Secondary Accent: `#2DD4BF` (cyan for packet flows, network metrics, and endpoints)
- Base Text: `#E7F5F0` (light mint-white for high legibility)
- Typography:
  - Display Headers: Space Grotesk
  - Body Text: Inter
  - Code, Metrics, and Route Data: IBM Plex Mono

---

## Directory Structure

```
system-design-visuals/
├── scripts/
│   └── smoke-test-lessons.js      # Automated HTTP smoke test for all curriculum routes
├── src/
│   ├── app/
│   │   ├── globals.css            # Custom CSS properties and theme variables
│   │   ├── layout.tsx             # Root layout with font declarations and Navbar
│   │   ├── not-found.tsx          # Custom 404 handler matching design system
│   │   ├── page.tsx               # Homepage and mission control dashboard
│   │   ├── interview/page.tsx     # System design interview framework
│   │   ├── learn/
│   │   │   ├── page.tsx           # Curriculum stage navigator
│   │   │   └── [lessonId]/
│   │   │       ├── page.tsx       # Server component with static params and validation
│   │   │       └── LessonClientView.tsx # Interactive client player
│   │   ├── lessons/[lessonId]/
│   │   │   └── page.tsx           # Backward compatibility redirect to /learn/:id
│   │   ├── playground/page.tsx    # Drag-and-drop system architecture studio
│   │   ├── practice/page.tsx      # Hands-on architectural challenges
│   │   └── progress/page.tsx      # User skill trees and completed modules
│   ├── components/
│   │   ├── lesson/
│   │   │   ├── InteractiveQuiz.tsx
│   │   │   └── WebLifecycleSimulator.tsx
│   │   ├── navigation/
│   │   │   └── Navbar.tsx
│   │   ├── playground/
│   │   │   └── SystemCustomNode.tsx
│   │   ├── simulators/            # 8 dedicated component simulators
│   │   └── tutor/
│   │       └── ArchitectAiDrawer.tsx
│   └── lib/
│       ├── curriculum/
│       │   └── curriculumData.ts  # Master curriculum stages and fallback generator
│       ├── simulation/
│       │   └── simulationEngine.ts # Queuing models and metrics calculation
│       └── store/
│           └── useProgressStore.ts # LocalStorage state persistence
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18.17 or higher
- npm 9.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nachi12/systemverse.git
   cd systemverse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

---

## Available Scripts

- `npm run dev`: Runs the local development server with hot reloading.
- `npm run build`: Compiles TypeScript, collects static paths via `generateStaticParams`, and produces an optimized production build.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Executes Next.js ESLint verification.
- `npm run test:routes`: Runs the automated smoke test script across all curriculum routes, invalid 404 paths, and legacy redirects.

---

## Testing and Verification

To verify that all curriculum routes and simulators compile and resolve properly:

```bash
# Build the production bundle
npm run build

# Start production server in background
npm run start -- -p 3001 &

# Execute automated route test suite
npm run test:routes
```

The test runner validates:
1. HTTP 200 responses and rendered interface controls for all 28 curriculum topics.
2. Proper HTTP 404 response codes and custom error UI for non-existent routes.
3. HTTP 307 temporary redirects for deprecated `/lessons/:id` paths to `/learn/:id`.

---

## License

This project is licensed under the MIT License.

