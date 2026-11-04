import { EducationalLesson } from "../types/lesson";

export const LESSONS: EducationalLesson[] = [
  {
    id: "cpu-ram-ssd",
    moduleId: 1,
    moduleName: "Module 1: Computer & Server Fundamentals",
    title: "CPU vs RAM vs SSD: Where Does Your Code Actually Run?",
    shortSummary:
      "Understand the physical roles of the processor, working memory, and disk storage before designing large-scale distributed architectures.",
    estimatedMinutes: 8,
    status: "complete",
    simpleDefinition:
      "A computer server is made of three fundamental physical parts: the CPU (the thinker that executes calculations), RAM (the fast temporary desk where active data sits), and SSD/Disk (the permanent filing cabinet that stores data even when power is turned off).",
    analogy: {
      title: "The Master Chef Kitchen Analogy",
      story:
        "Think of a restaurant kitchen. The Chef is the CPU—rapidly chopping vegetables and cooking dishes. The Chef's Cutting Board is the RAM—items right in front of them can be reached in a fraction of a second, but space is limited. The Walk-in Pantry downstairs is the SSD/Disk—it holds thousands of pounds of ingredients permanently, but it takes 100 times longer for the chef to walk down and fetch a bag of flour.",
      icon: "👨‍🍳",
    },
    technicalExplanation:
      "Latency numbers every software engineer must know: Accessing CPU L1/L2 Cache takes ~0.5–2 nanoseconds. Reading from RAM takes ~50–100 nanoseconds. Reading from a blazing-fast NVMe SSD takes ~50–100 microseconds (1,000× slower than RAM). Reading from spinning magnetic disk takes ~5–10 milliseconds (100,000× slower than RAM). If your application runs out of RAM, the operating system is forced to swap memory to disk ('page swapping'), causing the server to crawl to an immediate halt.",
    whenToUse: [
      "Use CPU optimization (multithreading, algorithms) when the server is CPU-bound (cryptography, video encoding, complex math).",
      "Use RAM (in-memory data structures, Redis) when you need sub-millisecond lookups for frequently accessed hot records.",
      "Use SSD/Persistent Storage when data durability is required (databases, write-ahead logs, transaction ledgers).",
    ],
    limitationsAndTradeoffs: [
      "RAM is volatile: If the server loses power or crashes, every byte in RAM vanishes instantly.",
      "Cost per gigabyte: RAM costs approximately 10× to 20× more per gigabyte compared to enterprise NVMe SSD storage.",
      "CPU register bottleneck: Having 64 cores does not help if your application is blocked waiting for slow disk I/O.",
    ],
    commonMisconception: {
      myth: "RAM and Databases are competing alternatives: 'Why use a database when we can just hold everything in RAM?'",
      reality:
        "RAM is temporary working memory for active programs; Databases provide durable, persistent storage with transaction guarantees. Even in-memory databases like Redis write append-only logs (AOF) or snapshots to persistent SSD so data survives a server reboot.",
    },
    quiz: [
      {
        id: "q1",
        question: "Why can't an enterprise system store its main customer ledger solely in RAM?",
        options: [
          "RAM is too slow to handle modern payment volumes.",
          "RAM is volatile memory; if the server loses power or restarts, all data is permanently lost.",
          "Operating systems forbid databases from touching RAM.",
          "SSDs are faster than RAM for sequential reads.",
        ],
        correctIndex: 1,
        explanation:
          "RAM is volatile storage. A sudden power outage, hardware fault, or server restart would wipe out the entire database without persistent disk backup.",
      },
      {
        id: "q2",
        question: "Approximately how much slower is reading from an NVMe SSD compared to reading from RAM?",
        options: [
          "They have roughly the exact same speed.",
          "NVMe SSD is roughly 10× faster than RAM.",
          "NVMe SSD is roughly 1,000× slower than RAM (~100 microseconds vs ~100 nanoseconds).",
          "NVMe SSD is 1,000,000× slower than RAM.",
        ],
        correctIndex: 2,
        explanation:
          "RAM operates on the order of tens of nanoseconds, while an NVMe SSD takes tens to hundreds of microseconds—making disk approximately 1,000× slower.",
      },
      {
        id: "q3",
        question: "What happens when an application's memory usage exceeds physical RAM capacity?",
        options: [
          "The CPU automatically doubles its clock speed.",
          "The OS begins memory swapping (paging memory to disk), which drastically slows down performance and risks OOM crash.",
          "The database automatically deletes old rows to make room.",
          "The network router caches the extra memory packets.",
        ],
        correctIndex: 1,
        explanation:
          "When RAM is exhausted, the operating system uses disk space as virtual memory (swapping). Because disk is 1,000x slower, the server performance degrades catastrophically.",
      },
    ],
    interactiveDemoId: "cpu-ram-ssd",
    instagram: {
      hook: "Why did your server crash? It’s not your code—it’s how CPU, RAM, and SSD talk to each other! 💥",
      captionCopy:
        "Ever wondered what really happens under the hood when your server goes down? Here is the mental model senior engineers use to design scalable systems without confusion. Save this post for your next system design interview! 📌 #systemdesign #softwareengineering #ankitsays #backend #coding",
      hashtags: ["#systemdesign", "#webdevelopment", "#programming", "#backend", "#computerscience"],
      carouselSlides: [
        {
          slideNumber: 1,
          badge: "HARDWARE FOUNDATIONS",
          headline: "CPU vs RAM vs SSD",
          mainIdea: "Where does your code actually run? The mental model every developer needs.",
          footerTakeaway: "Swipe to see why servers crash ➡️",
        },
        {
          slideNumber: 2,
          badge: "THE RESTAURANT ANALOGY",
          headline: "The Kitchen Analogy",
          mainIdea: "Think of your server as a high-volume restaurant kitchen.",
          bulletPoints: [
            "👨‍🍳 CPU = The Head Chef (Executes tasks rapidly)",
            "🪵 RAM = The Cutting Board (Fast, right in front of you, limited space)",
            "🚪 SSD = The Basement Pantry (Permanent storage, takes time to fetch)",
          ],
          footerTakeaway: "Speed differences are massive ➡️",
        },
        {
          slideNumber: 3,
          badge: "THE LATENCY NUMBERS",
          headline: "How Fast Are They Really?",
          mainIdea: "Understanding computer latency in human seconds.",
          visualType: "comparison",
          visualData: {
            leftLabel: "RAM Access",
            leftValue: "~100 Nanoseconds\n(Feels like 1 second)",
            rightLabel: "SSD Disk Access",
            rightValue: "~100 Microseconds\n(Feels like 15 minutes!)",
          },
          footerTakeaway: "Disk is 1,000x slower than RAM ➡️",
        },
        {
          slideNumber: 4,
          badge: "WHAT GOES WRONG?",
          headline: "The Silent Server Killer: Swapping",
          mainIdea: "What happens when your server runs out of RAM?",
          bulletPoints: [
            "Operating system tries to save itself by 'swapping' memory onto disk.",
            "Suddenly your app is reading disk instead of RAM.",
            "Request times jump from 5ms to 5,000ms.",
            "Server times out and crashes with Out-Of-Memory (OOM).",
          ],
          footerTakeaway: "Never let your app exhaust RAM ➡️",
        },
        {
          slideNumber: 5,
          badge: "COMMON MISCONCEPTION",
          headline: "Myth: 'Can we just use RAM instead of a DB?'",
          mainIdea: "RAM is volatile. When power cuts, everything vanishes.",
          bulletPoints: [
            "❌ Mistake: Treating RAM as a durable database.",
            "✅ Reality: RAM is for active variables and hot caches (Redis).",
            "✅ Databases write to SSD/Disk so your data survives reboots.",
          ],
          footerTakeaway: "Durability requires persistent storage ➡️",
        },
        {
          slideNumber: 6,
          badge: "ARCHITECT'S RULEBOOK",
          headline: "When To Optimize What",
          mainIdea: "How senior engineers solve bottlenecks:",
          bulletPoints: [
            "CPU at 100%? Optimize loops, multithreading, or scale horizontally.",
            "RAM at 90%? Add Redis cache eviction, fix memory leaks.",
            "Disk I/O high? Add database indexes, batch disk writes.",
          ],
          footerTakeaway: "Summary on next slide ➡️",
        },
        {
          slideNumber: 7,
          badge: "QUICK RECAP",
          headline: "Key Takeaways",
          mainIdea: "Master these three physical roles:",
          bulletPoints: [
            "1. CPU computes.",
            "2. RAM holds active data temporarily.",
            "3. SSD stores permanent data durably.",
          ],
          footerTakeaway: "Drop your questions below! 👇",
        },
      ],
      reelScript: {
        hookDuration: "0-3s",
        totalDuration: "45s",
        scenes: [
          {
            sceneNumber: 1,
            timestamp: "00:00 - 00:05",
            visualDescription: "Speaker pointing at laptop with animated CPU, RAM, and SSD floating icons.",
            narration: "Why did your backend server just crash? Let me explain in 40 seconds.",
            onScreenText: "Why did your server crash? 💥",
          },
          {
            sceneNumber: 2,
            timestamp: "00:05 - 00:15",
            visualDescription: "Split screen graphic showing a Chef at cutting board vs walking to pantry.",
            narration:
              "Think of your CPU as a chef. RAM is their cutting board—super fast, right in front of them, but tiny. SSD is the pantry downstairs—huge, permanent, but slow.",
            onScreenText: "CPU = Chef 👨‍🍳\nRAM = Cutting Board 🪵\nSSD = Pantry 🚪",
          },
          {
            sceneNumber: 3,
            timestamp: "00:15 - 00:28",
            visualDescription: "Animation showing RAM filling up to 100% and red alert 'Swapping' activated.",
            narration:
              "When your app runs out of RAM, the operating system starts swapping data to disk. But reading from SSD is 1,000 times slower than RAM! Your server freezes and dies.",
            onScreenText: "Out of RAM = Disk Swapping (1,000x Slower!) 🛑",
          },
          {
            sceneNumber: 4,
            timestamp: "00:28 - 00:38",
            visualDescription: "Clear checklist appearing on screen.",
            narration:
              "Remember: CPU does the thinking, RAM holds active tasks, SSD keeps things safe forever. Never treat RAM as a permanent database.",
            onScreenText: "CPU = Math\nRAM = Working Memory\nSSD = Permanent Data",
          },
          {
            sceneNumber: 5,
            timestamp: "00:38 - 00:45",
            visualDescription: "Call to action with question prompt.",
            narration: "Have you ever faced an Out of Memory error in production? Tell me in the comments!",
            onScreenText: "Have you hit an OOM crash? Comment below! 👇",
          },
        ],
        callToAction: "Follow for daily visual system design breakdowns!",
        audienceQuestion: "What is the biggest memory leak you have ever debugged?",
      },
    },
    referenceCitation: {
      mentor: "Ankit Jain (#ankitsays)",
      channelName: "Vidhya Skill School / Ankit Jain",
      topicConcept: "Computer Fundamentals for System Design",
      note: "Inspired by Ankit Jain's teaching principle of grounding architecture in physical server hardware (CPU, RAM, Disk) before building distributed abstractions.",
    },
  },
  {
    id: "database-scaling",
    moduleId: 4,
    moduleName: "Module 4: Database Scaling",
    title: "How to Scale a Database (The Step-by-Step Order)",
    shortSummary:
      "Stop jumping to sharding first! Learn the disciplined 5-stage progression senior architects use to scale databases safely from 100 to 1,000,000 users.",
    estimatedMinutes: 10,
    status: "complete",
    simpleDefinition:
      "Database scaling is the process of helping your database handle more queries and data without slowing down or crashing. However, scaling must be done in a strict order: measure the bottleneck first, optimize queries, add caching, introduce read replicas, and only shard as the final resort.",
    analogy: {
      title: "The Busy Library Desk Analogy",
      story:
        "Imagine a library with one librarian and a giant room of books. When a line of students forms, you don't immediately demolish the building into 10 smaller branch libraries (Sharding)! First, you create an index card catalog so the librarian doesn't scan every shelf (Database Index). Next, you put the 20 most requested textbooks right on the front counter (Redis Cache). Next, you hire assistant librarians who only answer student questions while the main librarian handles book returns (Read Replicas). Only if the entire city shows up do you open separate regional branch libraries (Sharding).",
      icon: "📚",
    },
    technicalExplanation:
      "Every architecture change addresses one specific bottleneck while introducing new operational trade-offs:\n1. Query & Index Optimization: Eliminates O(N) full table scans with O(log N) B-Tree seeks. Trade-off: Each index slows down writes (INSERT/UPDATE/DELETE) due to index tree rebalancing.\n2. In-Memory Cache (Redis): Intercepts 80–90% of read traffic. Trade-off: Cache invalidation challenges and potential stale reads.\n3. Read Replicas: Offloads analytical and read queries from the primary node. Trade-off: Replication lag (writes take milliseconds to propagate), and read replicas do NOT scale writes.\n4. Sharding: Splits tables across multiple independent database nodes by partition key (e.g., hash(user_id) % N). Trade-off: Cross-shard joins become impossible or painfully slow, distributed transactions require 2PC/Sagas, and re-sharding is dangerous.",
    whenToUse: [
      "Add indexes when queries trigger sequential table scans with high disk I/O.",
      "Add Redis cache-aside when identical read queries are executed frequently with high read-to-write ratios (e.g., 50:1).",
      "Add read replicas when the primary database CPU is saturated purely by read traffic.",
      "Shard when a single machine can no longer hold the dataset size on disk or single-leader write throughput reaches physical saturation.",
    ],
    limitationsAndTradeoffs: [
      "Read replicas do NOT scale writes! All writes must still go to the single primary database.",
      "Replication is NOT a substitute for backups! If someone runs 'DROP TABLE', the command replicates to all read replicas in milliseconds.",
      "Sharding is irreversible and introduces massive architectural complexity. Always exhaust vertical scaling, caching, and read replicas first.",
    ],
    commonMisconception: {
      myth: "Sharding is the first step to scale a database, and read replicas allow unlimited write scaling.",
      reality:
        "Sharding is the absolute LAST resort due to cross-shard join limitations and re-sharding complexity. Read replicas only scale reads; every write must still be processed by the primary database and copied over the network.",
    },
    quiz: [
      {
        id: "q1",
        question: "What is the primary reason why read replicas cannot solve a write-heavy database bottleneck?",
        options: [
          "Read replicas are written in a different programming language than the primary database.",
          "All write operations (INSERT/UPDATE/DELETE) must still be handled by the single primary database to guarantee consistency.",
          "Replicas delete all data every 24 hours.",
          "Cloud providers ban writes on SSDs.",
        ],
        correctIndex: 1,
        explanation:
          "In standard single-leader replication, only the primary node accepts writes. Read replicas only copy write-ahead logs to serve read queries.",
      },
      {
        id: "q2",
        question: "Why is replication NOT a substitute for automated database backups?",
        options: [
          "Replicas don't store tables.",
          "If an accidental 'DROP TABLE' or data corruption occurs, the mistake replicates instantly to all replicas.",
          "Backups are stored in RAM.",
          "Replicas run 10x slower than backups.",
        ],
        correctIndex: 1,
        explanation:
          "Replication mirrors all primary operations in near real-time. An accidental delete or corrupted transaction is immediately applied to all replicas, whereas backups allow point-in-time recovery.",
      },
      {
        id: "q3",
        question: "What is the correct architectural order of operations when scaling a database?",
        options: [
          "Sharding -> Read Replicas -> Caching -> Indexes",
          "Measure Bottleneck -> Optimize Queries & Indexes -> Cache (Redis) -> Read Replicas -> Sharding (Last)",
          "Immediately replace SQL with NoSQL -> Shard -> Add 10 servers",
          "Double the CPU every week without measuring",
        ],
        correctIndex: 1,
        explanation:
          "Senior architects always measure first, optimize queries/indexes, add in-memory caching, split reads via replicas, and only shard if physical limits are reached.",
      },
    ],
    interactiveDemoId: "database-scaling",
    instagram: {
      hook: "Never shard your database first! Here is the exact 5-step order senior architects use to scale databases. 🛑",
      captionCopy:
        "In system design interviews, jumping straight to 'we will shard the database' is an instant red flag. Real production engineering is about doing the simplest, highest-leverage optimization first. Save this roadmap! 📌 #systemdesign #database #sql #redis #backend #coding #ankitsays",
      hashtags: ["#database", "#systemdesign", "#sql", "#softwarearchitecture", "#codingtips"],
      carouselSlides: [
        {
          slideNumber: 1,
          badge: "SYSTEM ARCHITECTURE",
          headline: "How To Scale a Database",
          mainIdea: "The step-by-step order senior engineers follow. (Never jump to sharding first!)",
          footerTakeaway: "Swipe to see Step 1 ➡️",
        },
        {
          slideNumber: 2,
          badge: "STEP 1: MEASURE FIRST",
          headline: "Step 1: Query & Index Tuning",
          mainIdea: "Before buying more servers, fix your slow queries.",
          bulletPoints: [
            "Use EXPLAIN ANALYZE to identify sequential table scans.",
            "Add B-Tree indexes on frequently filtered columns.",
            "Changes query time from O(N) to O(log N).",
            "Cost: $0. Complexity: Minimal.",
          ],
          footerTakeaway: "What if traffic keeps growing? ➡️",
        },
        {
          slideNumber: 3,
          badge: "STEP 2: IN-MEMORY CACHE",
          headline: "Step 2: Add Redis Cache",
          mainIdea: "The fastest database query is the one that never touches the database.",
          bulletPoints: [
            "Use the Cache-Aside pattern with Redis.",
            "Absorbs 80–90% of frequent read requests in sub-milliseconds.",
            "Leaves the database free to process important writes.",
          ],
          footerTakeaway: "Trade-off: Cache invalidation ➡️",
        },
        {
          slideNumber: 4,
          badge: "STEP 3: READ REPLICAS",
          headline: "Step 3: Read Replicas",
          mainIdea: "Separate reads from writes with primary-replica replication.",
          bulletPoints: [
            "Primary node handles all INSERT, UPDATE, DELETE.",
            "Replica nodes answer all user SELECT queries.",
            "⚠️ Watch out: Replication lag can cause stale reads!",
            "⚠️ Critical: Replicas do NOT scale writes!",
          ],
          footerTakeaway: "What about data safety? ➡️",
        },
        {
          slideNumber: 5,
          badge: "CRITICAL SAFETY RULE",
          headline: "Replication ≠ Backup!",
          mainIdea: "Never confuse a replica with a backup.",
          bulletPoints: [
            "If someone runs 'DROP TABLE', that command replicates instantly to all replicas.",
            "Always maintain isolated, automated snapshot backups.",
            "Test your restore procedures regularly.",
          ],
          footerTakeaway: "When do we finally shard? ➡️",
        },
        {
          slideNumber: 6,
          badge: "STEP 4: SHARDING",
          headline: "Step 4: Horizontal Sharding",
          mainIdea: "The absolute LAST resort when one disk physically cannot hold the data.",
          bulletPoints: [
            "Split rows across DB-1, DB-2, DB-3 by shard key (e.g. hash(user_id)).",
            "❌ Cross-shard joins become impossible or very slow.",
            "❌ Re-sharding when a shard fills up is a nightmare.",
            "Only shard when petabyte scale forces you to.",
          ],
          footerTakeaway: "Summary on next slide ➡️",
        },
        {
          slideNumber: 7,
          badge: "SUMMARY CHEAT SHEET",
          headline: "The 5-Step Scaling Rule",
          mainIdea: "Memorize this progression for interviews:",
          bulletPoints: [
            "1. Measure & add Indexes",
            "2. Vertical scale & connection pools",
            "3. Redis Cache-Aside",
            "4. Read Replicas",
            "5. Sharding (only when forced)",
          ],
          footerTakeaway: "Save this for your next interview! 📌",
        },
      ],
      reelScript: {
        hookDuration: "0-3s",
        totalDuration: "50s",
        scenes: [
          {
            sceneNumber: 1,
            timestamp: "00:00 - 00:04",
            visualDescription: "Host holding a 'SHARDING' sign with a red cross over it.",
            narration: "Stop saying 'I will shard the database' in your system design interviews! Here is what you should do instead.",
            onScreenText: "Don't Shard First! 🛑",
          },
          {
            sceneNumber: 2,
            timestamp: "00:04 - 00:16",
            visualDescription: "Animation showing a query table scan vs an index bookmark.",
            narration:
              "Step 1: Always optimize your queries and add indexes. A single missing index can make a query 10,000 times slower. Fix that first for zero dollars.",
            onScreenText: "Step 1: Add Indexes (O(N) ➡️ O(log N))",
          },
          {
            sceneNumber: 3,
            timestamp: "00:16 - 00:28",
            visualDescription: "Redis cache icon appearing between App server and Database.",
            narration:
              "Step 2: Add a Redis cache. 80% of your users read the same hot data. Answer them in 1 millisecond from RAM and protect your database.",
            onScreenText: "Step 2: Redis In-Memory Cache ⚡",
          },
          {
            sceneNumber: 4,
            timestamp: "00:28 - 00:40",
            visualDescription: "One primary DB sending write-ahead logs to two read replicas.",
            narration:
              "Step 3: Add Read Replicas. Let replicas handle heavy read queries, but remember: replicas do NOT scale writes! All writes still hit the primary.",
            onScreenText: "Step 3: Read Replicas (Reads only, not writes!)",
          },
          {
            sceneNumber: 5,
            timestamp: "00:40 - 00:50",
            visualDescription: "Sharding warning banner with recap.",
            narration:
              "Only when your database is petabytes large do you shard. Master this order and you will ace your architecture interviews!",
            onScreenText: "Index ➡️ Cache ➡️ Replicas ➡️ Shard",
          },
        ],
        callToAction: "Follow for weekly system design animations!",
        audienceQuestion: "Have you ever implemented database sharding in production?",
      },
    },
    referenceCitation: {
      mentor: "Ankit Jain (#ankitsays)",
      channelName: "Vidhya Skill School / Ankit Jain",
      topicConcept: "Database Scaling Order of Operations",
      note: "Based on Ankit Jain's emphasis on practical step-by-step database scaling: measure bottlenecks before prematurely adding distributed complexity.",
    },
  },
  {
    id: "hld-vs-lld",
    moduleId: 7,
    moduleName: "Module 7 & 8: High-Level vs Low-Level Design",
    title: "HLD vs LLD: Designing Systems from 30,000 Feet to Code",
    shortSummary:
      "Clarify the confusing boundary between High-Level Design (boxes and data pipelines) and Low-Level Design (classes, contracts, and design patterns).",
    estimatedMinutes: 9,
    status: "complete",
    simpleDefinition:
      "High-Level Design (HLD) is the macro architecture showing which major services, databases, queues, and caches exist and how data flows between them. Low-Level Design (LLD) is the micro engineering blueprint showing the exact classes, interfaces, database schemas, validation rules, and error handling inside a specific service.",
    analogy: {
      title: "The City Planner vs Building Architect Analogy",
      story:
        "High-Level Design is like a City Urban Plan: it shows where the highway runs, where the power plant sits, where the water reservoir is connected, and how traffic travels between neighborhoods. Low-Level Design is the structural blueprint for a specific building inside that city: it shows the exact electrical wiring, plumbing pipes, fire escape doors, and room dimensions.",
      icon: "🏙️",
    },
    technicalExplanation:
      "In an interview or production engineering project, HLD and LLD address completely different questions:\n- HLD focuses on: System boundaries, non-functional requirements (99.99% availability, 100K QPS), component selection (Kafka vs RabbitMQ, SQL vs NoSQL), data replication, failover strategies, and network protocols (REST, gRPC, WebSockets).\n- LLD focuses on: Object-Oriented Design (OOD), SOLID principles, design patterns (Factory, Strategy, Observer), exact database schema with foreign keys and unique constraints, API request/response JSON schemas, input validation, and ACID transaction boundaries (@Transactional).",
    whenToUse: [
      "Use HLD when architecting a new product end-to-end, evaluating system scalability limits, or communicating with engineering leadership and cross-team leads.",
      "Use LLD before writing production code, during code reviews, when implementing maintainable extensible software patterns, or during LLD/Machine Coding interview rounds.",
    ],
    limitationsAndTradeoffs: [
      "A great HLD cannot save a system from terrible LLD: If classes leak memory, lack database connection timeouts, or execute N+1 queries, the system will crash regardless of how pretty the HLD diagram looks.",
      "A great LLD cannot fix a broken HLD: Beautifully structured clean code cannot prevent a single un-replicated database from being a single point of failure.",
    ],
    commonMisconception: {
      myth: "HLD is just drawing random boxes on a whiteboard, and LLD is just writing messy code right away.",
      reality:
        "HLD requires rigorous capacity math, latency budgets, and trade-off rationales. LLD requires disciplined interface contracts, error boundaries, and design patterns that make code testable and maintainable.",
    },
    quiz: [
      {
        id: "q1",
        question: "Which of the following topics belongs strictly to Low-Level Design (LLD)?",
        options: [
          "Deciding between CDN edge caching vs origin server caching.",
          "Designing the Class diagram, Strategy pattern, and DB foreign key constraints for payment checkout.",
          "Calculating the global network bandwidth required for 10 million concurrent video streams.",
          "Choosing multi-region active-active database replication.",
        ],
        correctIndex: 1,
        explanation:
          "Class structures, software design patterns, and exact database table constraints are core Low-Level Design concerns.",
      },
      {
        id: "q2",
        question: "Why does an engineering team need BOTH High-Level Design and Low-Level Design?",
        options: [
          "They don't; only junior engineers write LLD.",
          "HLD ensures global scalability and resilience, while LLD ensures code correctness, maintainability, and data integrity inside each service.",
          "HLD is only used for sales pitches.",
          "LLD is automatically generated by compilers.",
        ],
        correctIndex: 1,
        explanation:
          "HLD prevents architectural bottlenecks and single points of failure, while LLD prevents buggy, unmaintainable, tightly coupled spaghetti code.",
      },
      {
        id: "q3",
        question: "If an application experiences deadlocks and N+1 query execution bottlenecks, where does the root cause usually lie?",
        options: [
          "In the DNS provider configuration.",
          "In the Low-Level Design (ORM queries, transaction boundaries, and locking logic).",
          "In the CDN Point of Presence.",
          "In the server power supply.",
        ],
        correctIndex: 1,
        explanation:
          "N+1 query problems, lack of eager loading, and transaction lock contention are Low-Level Design implementation flaws.",
      },
    ],
    interactiveDemoId: "hld-vs-lld",
    instagram: {
      hook: "Confused between HLD and LLD? Here is the simplest explanation you will ever find! 🏙️",
      captionCopy:
        "System design rounds can be intimidating because people mix up High-Level and Low-Level design. Here is how senior tech leads distinguish them effortlessly. Swipe through to master both! 📌 #systemdesign #hld #lld #softwareengineering #ankitsays #coding #techinterview",
      hashtags: ["#hld", "#lld", "#systemdesign", "#softwareengineer", "#cleancode"],
      carouselSlides: [
        {
          slideNumber: 1,
          badge: "DESIGN INTERVIEW GUIDE",
          headline: "HLD vs LLD Explained",
          mainIdea: "Designing systems from 30,000 feet down to clean production code.",
          footerTakeaway: "Swipe to see the difference ➡️",
        },
        {
          slideNumber: 2,
          badge: "THE BIG PICTURE",
          headline: "The City vs Building Analogy",
          mainIdea: "Think of software architecture like constructing a modern metropolis.",
          bulletPoints: [
            "🏙️ HLD = City Urban Plan (Highways, power grid, water pipes between districts)",
            "🏢 LLD = Building Blueprint (Electrical wiring, room plumbing, door locks)",
          ],
          footerTakeaway: "Let's break down HLD first ➡️",
        },
        {
          slideNumber: 3,
          badge: "HIGH-LEVEL DESIGN",
          headline: "What is HLD?",
          mainIdea: "The 30,000-foot view of your entire infrastructure.",
          bulletPoints: [
            "Boxes and arrows: Clients, Load Balancers, Services, DBs, Queues.",
            "Capacity estimation: 100K QPS, 50TB storage.",
            "Protocol choices: REST vs gRPC vs WebSockets.",
            "Availability: 99.99% uptime, multi-region failover.",
          ],
          footerTakeaway: "Now let's zoom in to LLD ➡️",
        },
        {
          slideNumber: 4,
          badge: "LOW-LEVEL DESIGN",
          headline: "What is LLD?",
          mainIdea: "The zoom-in blueprint of classes, code, and schemas.",
          bulletPoints: [
            "Class diagrams & interfaces (SOLID principles).",
            "Design patterns: Factory, Strategy, Observer.",
            "Database table schemas, column types & foreign keys.",
            "API JSON payload validation & error handling.",
          ],
          footerTakeaway: "How do they work together? ➡️",
        },
        {
          slideNumber: 5,
          badge: "REAL-WORLD EXAMPLE",
          headline: "Example: Ride-Hailing App",
          mainIdea: "How Uber or Lyft uses both:",
          bulletPoints: [
            "HLD: Rider App ➡️ API Gateway ➡️ Match Service ➡️ Redis Geohash ➡️ Kafka.",
            "LLD: DriverMatchingStrategy interface, RideState enum, ACID transaction lock on driver assignment.",
          ],
          footerTakeaway: "Can one survive without the other? ➡️",
        },
        {
          slideNumber: 6,
          badge: "THE GOLDEN RULE",
          headline: "Why You Need Both",
          mainIdea: "A failure at either level breaks the entire product.",
          bulletPoints: [
            "❌ Bad HLD + Good Code = Single DB crashes under 100K users.",
            "❌ Good HLD + Bad Code = Spaghetti code, memory leaks, and silent data corruption.",
            "✅ Senior engineers master the bridge between both.",
          ],
          footerTakeaway: "Summary on next slide ➡️",
        },
        {
          slideNumber: 7,
          badge: "SUMMARY CHEAT SHEET",
          headline: "HLD vs LLD Quick Recap",
          mainIdea: "Remember this mental model:",
          bulletPoints: [
            "HLD answers: 'WHICH components and HOW do they connect?'",
            "LLD answers: 'HOW does each component WORK internally in code?'",
          ],
          footerTakeaway: "Save this post for your next interview! 📌",
        },
      ],
      reelScript: {
        hookDuration: "0-3s",
        totalDuration: "55s",
        scenes: [
          {
            sceneNumber: 1,
            timestamp: "00:00 - 00:05",
            visualDescription: "Host presenting two blueprint drawings: one high level, one code-level.",
            narration: "What is the actual difference between HLD and LLD? Here is the 50-second breakdown.",
            onScreenText: "HLD vs LLD in 50 Seconds! 🏙️",
          },
          {
            sceneNumber: 2,
            timestamp: "00:05 - 00:18",
            visualDescription: "Illustration of city skyline transforming into building blueprint.",
            narration:
              "High-Level Design is like a City Urban Plan. It shows where the highways run, where the power grid connects, and how services talk to databases. It’s the 30,000-foot view.",
            onScreenText: "HLD = City Urban Plan 🏙️ (Services & Data Flow)",
          },
          {
            sceneNumber: 3,
            timestamp: "00:18 - 00:32",
            visualDescription: "Zoom in on classes, interfaces, and database table schemas.",
            narration:
              "Low-Level Design is the structural blueprint for a specific building inside that city. It defines the exact classes, design patterns, database constraints, and error handling in your code.",
            onScreenText: "LLD = Building Blueprint 🏢 (Classes, Patterns, Schemas)",
          },
          {
            sceneNumber: 4,
            timestamp: "00:32 - 00:46",
            visualDescription: "Side-by-side comparison of Ride Hailing example.",
            narration:
              "In an Uber-like app: HLD is Gateway, Kafka, and Redis. LLD is the DriverMatchingStrategy class and the database transaction that locks a driver to prevent double-booking.",
            onScreenText: "HLD = What components exist\nLLD = How code runs inside",
          },
          {
            sceneNumber: 5,
            timestamp: "00:46 - 00:55",
            visualDescription: "Host pointing to save button.",
            narration: "Save this post and drop your favorite design pattern in the comments!",
            onScreenText: "What is your favorite design pattern? Comment below! 👇",
          },
        ],
        callToAction: "Follow for visual engineering breakdowns!",
        audienceQuestion: "Which do you find harder: High-Level Design or Low-Level Design?",
      },
    },
    referenceCitation: {
      mentor: "Ankit Jain (#ankitsays)",
      channelName: "Vidhya Skill School / Ankit Jain",
      topicConcept: "Bridging HLD and LLD for Practical Engineering",
      note: "Inspired by Ankit Jain's teaching framework separating architectural macro decisions from clean low-level software engineering.",
    },
  },
  {
    id: "how-web-request-works",
    moduleId: 2,
    moduleName: "Module 2: How a Web Request Works",
    title: "The Lifecycle of a Web Request: From Browser to DB and Back",
    shortSummary: "Track a web request through DNS, TCP handshake, TLS, Reverse Proxy, and DB.",
    estimatedMinutes: 8,
    status: "upcoming",
    simpleDefinition: "A web request is a message sent from your device over the internet to a server asking for data, which then returns a response.",
    analogy: {
      title: "The Postal Service",
      story: "Sending a letter with a return address.",
      icon: "✉️",
    },
    technicalExplanation: "DNS lookup -> TCP SYN/ACK -> TLS 1.3 -> HTTP GET -> Nginx Reverse Proxy -> App logic -> SQL query -> Response.",
    whenToUse: ["Understanding web fundamentals and API performance bottlenecks."],
    limitationsAndTradeoffs: ["Every network hop adds physical speed-of-light latency."],
    commonMisconception: {
      myth: "DNS lookups always hit the internet on every click.",
      reality: "Browsers, operating systems, and routers heavily cache DNS records using TTLs.",
    },
    quiz: [],
    interactiveDemoId: "request-journey",
    instagram: {
      hook: "What actually happens when you click enter in your browser? 🌐",
      captionCopy: "Understanding the request lifecycle is step 1 in system design! #systemdesign #webdev",
      hashtags: ["#webdev", "#networking"],
      carouselSlides: [],
      reelScript: { hookDuration: "0-3s", totalDuration: "40s", scenes: [], callToAction: "Follow for more!", audienceQuestion: "Did you know DNS uses UDP?" }
    },
    referenceCitation: {
      mentor: "Ankit Jain (#ankitsays)",
      channelName: "Vidhya Skill School",
      topicConcept: "Web Request Fundamentals",
      note: "Educational outline."
    }
  },
  {
    id: "load-balancers-and-servers",
    moduleId: 5,
    moduleName: "Module 5: Architecture Components",
    title: "Load Balancers & Health Checks: Distribute Traffic with Zero Downtime",
    shortSummary: "Round-robin, least-connections, and automated failover when servers crash.",
    estimatedMinutes: 9,
    status: "upcoming",
    simpleDefinition: "A load balancer is a traffic controller that distributes incoming network requests evenly across multiple healthy backend servers.",
    analogy: {
      title: "The Bank Line Coordinator",
      story: "A bank queue manager guiding people to open teller windows.",
      icon: "⚖️",
    },
    technicalExplanation: "L4 vs L7 load balancing, active vs passive health checks, and circuit breakers.",
    whenToUse: ["Distributing load across stateless backend application clusters."],
    limitationsAndTradeoffs: ["Load balancers themselves must be redundant (Active-Passive VRRP) to avoid becoming a single point of failure."],
    commonMisconception: {
      myth: "Adding more servers always guarantees higher speed.",
      reality: "If your bottleneck is a locked database table, adding 100 web servers only makes the database choke faster.",
    },
    quiz: [],
    interactiveDemoId: "load-balancing",
    instagram: {
      hook: "Why your servers crash when traffic spikes (and how to fix it)! 🚦",
      captionCopy: "Load balancers are the unsung heroes of high-scale systems. #systemdesign #devops",
      hashtags: ["#loadbalancing", "#cloud"],
      carouselSlides: [],
      reelScript: { hookDuration: "0-3s", totalDuration: "45s", scenes: [], callToAction: "Follow for more!", audienceQuestion: "Do you prefer L4 or L7 load balancers?" }
    },
    referenceCitation: {
      mentor: "Ankit Jain (#ankitsays)",
      channelName: "Vidhya Skill School",
      topicConcept: "Load Balancing Mechanics",
      note: "Educational outline."
    }
  }
];

