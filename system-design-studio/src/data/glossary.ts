import { GlossaryTerm } from "../types/lesson";

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Latency",
    simpleDefinition: "The time it takes for a request to travel to the server and come back.",
    technicalDetails: "Measured in milliseconds (ms) or microseconds (µs). Network round-trip time (RTT), serialization delay, and disk access all contribute to total latency.",
    category: "Performance",
  },
  {
    term: "Throughput (QPS / RPS)",
    simpleDefinition: "How many operations or requests a system can handle in one second.",
    technicalDetails: "Queries per second (QPS) or Requests per second (RPS). Little's Law states: Concurrency = Throughput × Latency.",
    category: "Performance",
  },
  {
    term: "RAM (Working Memory)",
    simpleDefinition: "Ultra-fast temporary workspace for variables and active programs. When the computer turns off, RAM forgets everything.",
    technicalDetails: "Volatile memory with ~50-100 nanoseconds access time. It is NOT a permanent database alternative.",
    category: "Hardware",
  },
  {
    term: "SSD / Disk (Persistent Storage)",
    simpleDefinition: "Permanent storage that remembers data even when power is turned off, but is slower than RAM.",
    technicalDetails: "Non-volatile NAND flash memory. NVMe SSDs read at ~10-100 microseconds (1,000x slower than RAM, but 100x faster than magnetic spinning HDDs).",
    category: "Hardware",
  },
  {
    term: "Read Replica",
    simpleDefinition: "A copy of your primary database that only answers read queries to reduce traffic on the main database.",
    technicalDetails: "Replicas synchronize asynchronously or synchronously from the primary write database. Does NOT solve write scaling, and introduces replication lag.",
    category: "Database",
  },
  {
    term: "Replication Lag",
    simpleDefinition: "The slight delay before a newly saved change reaches the replica copy.",
    technicalDetails: "If a user updates their profile and immediately refreshes from a laggy replica, they may see their old data (violating read-after-write consistency).",
    category: "Database",
  },
  {
    term: "Database Sharding",
    simpleDefinition: "Splitting a giant database across multiple smaller physical database machines using a shard key.",
    technicalDetails: "The absolute last resort after query indexing, caching, and read replicas. Breaks cross-shard transactions and joins, and requires complex resharding.",
    category: "Database",
  },
  {
    term: "Cache (Redis)",
    simpleDefinition: "A fast in-memory key-value store placed in front of your database to answer frequent queries instantly.",
    technicalDetails: "Implements Cache-Aside, Write-Through, or Read-Through patterns. Introduces the challenge of cache invalidation when database records update.",
    category: "Architecture",
  },
  {
    term: "High-Level Design (HLD)",
    simpleDefinition: "The 30,000-foot blueprint showing overall services, databases, caches, and data pipelines without implementation code.",
    technicalDetails: "Focuses on component boundaries, capacity estimation, network protocols, availability, and non-functional requirements.",
    category: "System Design",
  },
  {
    term: "Low-Level Design (LLD)",
    simpleDefinition: "The zoom-in engineering view showing exact classes, methods, design patterns, schemas, and API contracts.",
    technicalDetails: "Focuses on object-oriented design, SOLID principles, transaction boundaries, validation rules, error handling, and unit testability.",
    category: "System Design",
  },
  {
    term: "CAP Theorem",
    simpleDefinition: "In a distributed network where communication cuts (partitions) can happen, you must choose between consistency or availability.",
    technicalDetails: "Network partitions (P) are an unavoidable physical reality. CAP is NOT 'pick any two freely'—it states that when P occurs, you choose Consistency (C) or Availability (A).",
    category: "Distributed Systems",
  },
  {
    term: "Idempotency",
    simpleDefinition: "An operation that can be run multiple times safely without changing the result beyond the first execution.",
    technicalDetails: "Essential when retrying failed network requests (e.g. payment processing). Passing a unique idempotency key prevents charging a customer twice.",
    category: "Architecture",
  },
];

