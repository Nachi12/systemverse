export interface TutorResponse {
  mode: "eli5" | "deepdive" | "failure" | "hint" | "interview";
  title: string;
  content: string;
  takeawayBullet: string;
}

export const TUTOR_KNOWLEDGE_BASE: Record<string, Record<string, TutorResponse>> = {
  "what-happens-when-website-loads": {
    eli5: {
      mode: "eli5",
      title: "Opening a Website — Explain Like I'm 5",
      content:
        "Imagine you want to send a postcard to your grandma, but you only know her name, not her address. First, you check your fridge sticky notes (Browser Cache). If it's not there, you call directory assistance (DNS) to get her street number. Then, you send a bicycle messenger to knock on her door, shake hands, and check a secret password (TCP and TLS encryption). Once they agree on the password, the messenger asks for her secret cookie recipe (HTTP GET). Her home chef pulls it from the pantry (Database) and mails it back to you in tiny pieces!",
      takeawayBullet: "DNS gives the address; TCP/TLS builds a safe tunnel; HTTP requests the page.",
    },
    deepdive: {
      mode: "deepdive",
      title: "Network Lifecycle — Staff Engineer Deep Dive",
      content:
        "The web request lifecycle is governed by the OSI and TCP/IP models. DNS resolution uses recursive lookups across Root (.), TLD (.com/.dev), and Authoritative nameservers via UDP port 53. Once the A/AAAA record is returned, the client initiates the TCP 3-way handshake (SYN, SYN-ACK, ACK) followed by TLS 1.3 Key Exchange via ECDHE. TLS 1.3 optimizes this to a single round-trip (1-RTT) by piggybacking key shares inside ClientHello. Modern edge CDNs terminate TLS near the client to shorten RTT, then multiplex requests over HTTP/2 binary framing streams to backend reverse proxies.",
      takeawayBullet: "Latency is bound by physical speed-of-light in fiber (~5ms per 1,000km); TLS termination at the edge minimizes round-trip penalties.",
    },
    failure: {
      mode: "failure",
      title: "Why Did My Request Fail?",
      content:
        "If you encounter a DNS resolution failure (NXDOMAIN or Timeout), check if the nameserver is responding within your socket timeout (typically 2000ms). If you receive HTTP 504 Gateway Timeout, the reverse proxy connected successfully, but the upstream application or database exceeded the timeout threshold under heavy load.",
      takeawayBullet: "Inspect whether failure happened at Transport (TCP timeout), Security (TLS certificate invalid), or Application (HTTP 5xx).",
    },
    hint: {
      mode: "hint",
      title: "Architect's Clue",
      content:
        "Observe the packet inspector during Step 2 (DNS) and Step 3 (TCP). Notice that no actual web content (HTML/CSS) is being transferred yet! All initial latency is purely establishing the secure channel.",
      takeawayBullet: "Use connection pooling and HTTP keep-alive so subsequent requests skip the handshake penalty entirely.",
    },
    interview: {
      mode: "interview",
      title: "Mock Interviewer Question",
      content:
        "\"Candidate, if a user reports that 'systemverse.dev' is taking 4 seconds to load in Australia while users in California experience 200ms, how would you systematically diagnose and resolve the bottleneck?\"",
      takeawayBullet: "Mention Anycast DNS, Edge TLS termination via Cloudflare/CloudFront, and CDN caching for static assets.",
    },
  },
  "load-balancing": {
    eli5: {
      mode: "eli5",
      title: "Load Balancers — Explain Like I'm 5",
      content:
        "Imagine a busy bank with 5 teller windows. If everyone rushed into a single window, people would wait an hour while the other 4 tellers sat bored. A load balancer is the friendly queue manager at the entrance holding the rope. Every time a customer arrives, they guide them to the next available teller window!",
      takeawayBullet: "A load balancer distributes work so no single server gets overwhelmed.",
    },
    deepdive: {
      mode: "deepdive",
      title: "Load Balancing Architecture — Staff Deep Dive",
      content:
        "Layer 4 (L4) balancing operates at the TCP/UDP transport layer using IP/Port hashing without inspecting payload data (ultra-high throughput, millions of PPS via Maglev or IPVS). Layer 7 (L7) load balancers (like Envoy, Nginx, HAProxy) terminate TLS, inspect HTTP headers, path cookies, and enable intelligent path-based routing (e.g., /api/videos to media cluster, /api/auth to auth cluster).",
      takeawayBullet: "Use L4 at ingress for line-rate routing, and L7 behind it for application-aware microservice routing.",
    },
    failure: {
      mode: "failure",
      title: "Why Did the Load Balancer Fail?",
      content:
        "When servers crash without active health checks, the load balancer continues blindly forwarding requests to dead IPs, returning 502 Bad Gateway to users. Always enable active health checks with exponential backoff and circuit breaking.",
      takeawayBullet: "Without health checks, a crashed node acts as a black hole dropping traffic.",
    },
    hint: {
      mode: "hint",
      title: "Optimization Clue",
      content:
        "If some requests take 5 milliseconds while others take 2000 milliseconds (e.g. heavy report generation), Round Robin will cause server imbalance. Switch to 'Least Connections' so busy servers aren't assigned more work.",
      takeawayBullet: "Least Connections prevents long-running requests from starving server threads.",
    },
    interview: {
      mode: "interview",
      title: "Mock Interviewer Question",
      content:
        "\"How does Consistent Hashing prevent cache invalidation when scaling cache nodes up or down from 10 to 11 nodes?\"",
      takeawayBullet: "Consistent hashing maps keys and servers onto a virtual ring (0 to 2^32-1), remapping only K/N keys on node addition.",
    },
  },
};

export function getTutorAdvice(topicKey: string, mode: "eli5" | "deepdive" | "failure" | "hint" | "interview"): TutorResponse {
  const topic = TUTOR_KNOWLEDGE_BASE[topicKey] || TUTOR_KNOWLEDGE_BASE["what-happens-when-website-loads"];
  return topic[mode] || topic.eli5;
}

