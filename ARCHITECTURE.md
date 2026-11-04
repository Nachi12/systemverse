# SYSTEMVERSE — System & Technical Architecture

## 1. High-Level Technology Architecture

```
+-----------------------------------------------------------------------------------+
|                                  NEXT.JS (APP ROUTER)                             |
|                                                                                   |
|  +-------------------------+  +--------------------------+  +------------------+  |
|  |     Mission Control     |  |     Roadmap Navigator    |  |  Lesson Player   |  |
|  |  - Dashboard metrics    |  |  - Prerequisite graphs   |  |  - Interactive   |  |
|  |  - Daily challenges     |  |  - Node unlock status    |  |    step-through   |  |
|  |  - Quick resume         |  |  - Level progression     |  |  - Live lab & quiz|  |
|  +-------------------------+  +--------------------------+  +------------------+  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                     Architecture Playground & Studio                        |  |
|  |  - @xyflow/react canvas with custom interactive node components             |  |
|  |  - Dynamic bezier edge connection with animated packet streaming           |  |
|  |  - Node configuration inspector (capacities, fail rates, latencies)         |  |
|  |  - Architecture validation engine (anti-pattern detector)                   |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                   Client-Side System Simulation Engine                      |  |
|  |  - Deterministic queuing model (M/M/1 & M/M/c approximation)                |  |
|  |  - Cascading failure propagation & bottleneck detector                      |  |
|  |  - Real-time performance calculation (P50/P99 latency, RPS, saturation)     |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  +--------------------------+  +-------------------------+  +------------------+  |
|  |    Architect AI Tutor    |  |    Gamification Store   |  | System Designs   |  |
|  |  - Multi-mode guidance   |  |  - Zustand + LocalStore |  |  - 10 Reference  |  |
|  |  - Offline rule matrix   |  |  - XP, levels, badges   |  |    blueprints     |  |
|  |  - Optional Gemini hook  |  |  - Challenge state      |  |  - Interactive    |  |
|  +--------------------------+  +-------------------------+  +------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Directory Structure

```
system-design-visuals/
├── PRD.md
├── ARCHITECTURE.md
├── CURRICULUM.md
├── IMPLEMENTATION_PLAN.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Mission Control Dashboard
│   │   ├── roadmap/page.tsx            # Visual Tech Tree / Roadmap
│   │   ├── lessons/[lessonId]/page.tsx # Interactive Lesson Engine
│   │   ├── playground/page.tsx         # Drag & Drop Architecture Studio
│   │   ├── projects/[projectId]/page.tsx# Real-World System Design Blueprints
│   │   ├── interview/page.tsx          # Mock Interview Simulator
│   │   └── api/ai-tutor/route.ts       # Optional Gemini API Proxy
│   ├── components/
│   │   ├── ui/                         # Badges, Buttons, Modals, Sliders, Tabs
│   │   ├── navigation/                 # Navbar, Sidebar, Breadcrumb
│   │   ├── dashboard/                  # Stats, Streak, Activity, QuickSim
│   │   ├── roadmap/                    # Interactive roadmap canvas & node cards
│   │   ├── lesson/                     # Packet visualizer, inspector, quiz, experimenter
│   │   ├── playground/                 # Custom React Flow nodes, toolbar, inspector
│   │   │   ├── nodes/                  # ClientNode, LoadBalancerNode, DbNode, CacheNode, etc.
│   │   │   ├── edges/                  # AnimatedPacketEdge
│   │   │   └── inspector/              # Component settings & metrics
│   │   ├── simulation/                 # Real-time metrics charts, traffic controller
│   │   └── tutor/                      # Architect AI dialogue drawer
│   ├── lib/
│   │   ├── simulation/                 # Simulation mathematical models & algorithms
│   │   ├── curriculum/                 # Complete 12-level curriculum data & lessons
│   │   ├── projects/                   # System design blueprints (URL shortener, Netflix, etc.)
│   │   ├── store/                      # Zustand state slices (progress, playground, sim)
│   │   └── utils.ts                    # Classnames & formatting helpers
```

---

## 3. Mathematical Simulation Engine Design
The simulation engine runs deterministically at 10Hz to 60Hz inside a requestAnimationFrame or interval loop:

1. **Node Processing Capacity ($C_i$):** Maximum requests per second a node can handle before saturation.
2. **Effective Ingress ($\lambda_i$):** Flow arriving at node $i$ from all source nodes.
3. **Queue Utilization ($\rho_i = \lambda_i / C_i$):**
   - If $\rho_i < 1.0$: Node operates stably; queue length $L_q \approx \frac{\rho^2}{1 - \rho}$.
   - If $\rho_i \ge 1.0$: Node drops excess requests $Drop = \lambda_i - C_i$; queue fills; P99 latency surges exponentially.
4. **Cache Amplification Factor:** A cache with hit rate $h$ reduces downstream DB load to $\lambda_{DB} = \lambda \times (1 - h)$.
5. **Cascading Failure:** If a server node fails, its traffic is instantly redistributed across remaining cluster nodes, potentially creating a domino outage.

