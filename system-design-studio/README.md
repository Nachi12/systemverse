# System Design Learning Studio & Instagram Creator

A beginner-friendly interactive educational platform for learning System Design and generating ready-to-publish educational content for Instagram (Carousels and Reels).

> **Important Note:** This is an isolated, independent project located in `./system-design-studio`. It does not touch or modify your external websites.

---

## 1. Quick Start & Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or pnpm or bun

### Run Development Server
```bash
cd system-design-studio
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

### Run Test Suite
```bash
npm run test
```
Runs 11 comprehensive Vitest unit and integration tests verifying:
- Navigation & lesson selection
- 8-step pedagogical tabs
- Interactive simulations (CPU/RAM swapping, database scaling steps, HLD vs LLD)
- Quizzes and localStorage score persistence
- Real HTML5 Canvas 1080×1350 and 1080×1920 PNG exports

### Build for Production
```bash
npm run build
```

---

## 2. 8-Part Teaching Methodology

Every topic follows a disciplined, beginner-friendly 8-part framework:
1. **Simple Definition:** Plain English without assuming prior technical jargon.
2. **Familiar Analogy:** A concrete physical mental model (e.g. Master Chef kitchen for CPU/RAM/SSD, Library counter for database scaling, City Urban Plan for HLD vs LLD).
3. **Accurate Technical Explanation:** Nanosecond/microsecond hardware latency numbers, B-Tree lookups, ACID semantics, and network boundaries.
4. **Interactive Visual Demonstration:** Hands-on sliders and toggles with illustrative bottlenecks and metrics.
5. **When Useful:** Clear architectural criteria for when to introduce the component.
6. **Limitations & Trade-Offs:** The hidden operational costs and failure modes.
7. **Common Misconceptions (Strict Anti-Fallacy):**
   - RAM and databases are *not* competing alternatives.
   - Read replicas do *not* scale writes.
   - Replication is *not* a substitute for automated backups.
   - Sharding is the *last* resort, never the first.
   - CAP is *not* an unrestricted "pick any two" rule.
   - Caching is *not* automatically beneficial (invalidation & stale read risks).
   - Retries require idempotency tokens.
   - More servers do *not* guarantee performance improvements.
8. **Short Quiz:** Formative knowledge checks with explanations for every answer option.

---

## 3. The 3 Starter Lessons

1. **`cpu-ram-ssd`**: *CPU vs RAM vs SSD: Where Does Your Code Actually Run?*
   - Module 1: Computer & Server Fundamentals
   - Analogy: Head Chef, Cutting Board, Walk-in Pantry.
   - Demo: Adjust RAM size and dataset size to observe the severe 1,000× latency surge when disk swapping activates.
   - Instagram: 7-Slide Carousel + 45s Reel Script & Storyboard.

2. **`database-scaling`**: *How to Scale a Database (The Step-by-Step Order)*
   - Module 4: Database Scaling
   - Analogy: The Busy Library Desk.
   - Demo: Step through Stage 1 (Indexes) $\rightarrow$ Stage 2 (Redis Cache) $\rightarrow$ Stage 3 (Read Replicas) $\rightarrow$ Stage 4 (Sharding), analyzing what bottleneck is solved and what new complexity is introduced at every step.
   - Instagram: 7-Slide Carousel + 50s Reel Script & Storyboard.

3. **`hld-vs-lld`**: *HLD vs LLD: Designing Systems from 30,000 Feet to Code*
   - Module 7 & 8: High-Level vs Low-Level Design
   - Analogy: City Urban Plan vs Building Structural Blueprint.
   - Demo: Toggle between HLD (boxes, data pipelines, non-functional targets) and LLD (Strategy pattern, PostgreSQL schema constraints, API contracts, ACID transaction boundaries) using the exact same E-Commerce Checkout application.
   - Instagram: 7-Slide Carousel + 55s Reel Script & Storyboard.

---

## 4. How to Add New Lessons Easily

All lesson content is cleanly decoupled from UI components in `src/data/lessons.ts`.

To add a new lesson:
1. Open `src/data/lessons.ts`.
2. Add a new object conforming to the `EducationalLesson` TypeScript interface:
```typescript
{
  id: "load-balancers",
  moduleId: 5,
  moduleName: "Module 5: Architecture Components",
  title: "Load Balancers & Reverse Proxies",
  shortSummary: "...",
  estimatedMinutes: 9,
  status: "complete",
  simpleDefinition: "...",
  analogy: { title: "...", story: "...", icon: "⚖️" },
  technicalExplanation: "...",
  whenToUse: [...],
  limitationsAndTradeoffs: [...],
  commonMisconception: { myth: "...", reality: "..." },
  quiz: [...],
  interactiveDemoId: "load-balancing",
  instagram: {
    hook: "...",
    captionCopy: "...",
    hashtags: ["#systemdesign"],
    carouselSlides: [
      {
        slideNumber: 1,
        badge: "TRAFFIC MANAGEMENT",
        headline: "...",
        mainIdea: "...",
        footerTakeaway: "Swipe next ➡️"
      }
    ],
    reelScript: {
      hookDuration: "0-3s",
      totalDuration: "45s",
      scenes: [...],
      callToAction: "Follow for more!",
      audienceQuestion: "..."
    }
  },
  referenceCitation: {
    mentor: "Ankit Jain (#ankitsays)",
    channelName: "Vidhya Skill School",
    topicConcept: "Load Balancing",
    note: "..."
  }
}
```
The lesson will automatically appear in the searchable topic library, filterable by module, with quiz, glossary links, and Instagram export buttons ready to use.

---

## 5. Instagram Creator Mode & Real PNG Exports

In **Instagram Studio**:
- **4:5 Portrait Carousel (1080 × 1350):**
  - Crisp typography with safe margins (80px padding from borders to prevent Instagram UI cropping).
  - Main idea card, bullet points, and comparison visuals.
  - Click **Download Slide PNG** or **Download All Slides (PNG)** to export real, high-resolution PNG files directly into your downloads folder.
- **9:16 Vertical Reel Storyboard (1080 × 1920):**
  - Formatted for Instagram Reels and Shorts with 160px safe zones at the top and bottom.
  - Visual description, camera staging, and teleprompter narration script.
  - Export scene frames as individual 1080×1920 PNG images.
- **Copy Caption & Tags:** Copies formatted captions with hook, line breaks, and hashtags in one click.

---

## 6. Educational Reference Attribution

Topic selection and practical intuition are inspired by **Ankit Jain’s `#ankitsays`** educational material on the **Vidhya Skill School** channel, notably:
- Prioritizing physical hardware mental models (CPU, RAM, Disk) before building distributed abstractions.
- Practical database scaling: measure bottlenecks before prematurely adding distributed complexity.
- Bridging High-Level Architecture with Clean Low-Level Software Design.

All technical explanations, interactive HTML5 simulations, custom SVG/Canvas diagrams, analogies, and quizzes are original creations.

