import React, { useState } from "react";
import { 
  Layers, 
  Code2, 
  Database, 
  FileCode2, 
  ShieldCheck, 
  Server, 
  CheckCircle2, 
  Zap, 
  Box 
} from "lucide-react";

export function HldVsLldDemo() {
  const [activeView, setActiveView] = useState<"hld" | "lld">("hld");
  const [lldTab, setLldTab] = useState<"classes" | "schema" | "api" | "transaction">("classes");

  return (
    <div className="p-5 rounded-2xl bg-studio-900 border border-studio-700/80 space-y-6">
      {/* View Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-studio-700/60 gap-3">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-purple/10 text-accent-purple border border-accent-purple/30 font-bold">
            SAME SYSTEM &bull; TWO PERSPECTIVES
          </span>
          <h3 className="text-base font-bold text-white mt-1">
            Application: E-Commerce Checkout Service
          </h3>
        </div>

        {/* Big Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-studio-950 border border-studio-750">
          <button
            onClick={() => setActiveView("hld")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeView === "hld"
                ? "bg-accent-cyan text-studio-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>High-Level Design (HLD)</span>
          </button>
          <button
            onClick={() => setActiveView("lld")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeView === "lld"
                ? "bg-accent-purple text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Low-Level Design (LLD)</span>
          </button>
        </div>
      </div>

      {/* High-Level Design View */}
      {activeView === "hld" ? (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-4 rounded-xl bg-studio-850/60 border border-studio-750 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-accent-cyan uppercase font-mono text-[10px] block mb-1">
              The 30,000-Foot View:
            </span>
            HLD defines the system boundaries, major architectural components, synchronous versus asynchronous communication protocols, and capacity targets.
          </div>

          {/* Visual Architecture Map */}
          <div className="p-6 rounded-2xl bg-studio-950/80 border border-studio-800 space-y-4">
            <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
              Component &amp; Data Pipeline Topology
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-center">
              <div className="p-3 rounded-xl bg-studio-900 border border-studio-700 space-y-1">
                <div className="text-[10px] text-slate-400">INGRESS</div>
                <div className="font-bold text-slate-200">Mobile &amp; Web Apps</div>
                <div className="text-[9px] text-accent-cyan">HTTPS / REST</div>
              </div>

              <div className="p-3 rounded-xl bg-studio-900 border border-accent-cyan/40 space-y-1">
                <div className="text-[10px] text-accent-cyan font-bold">API GATEWAY</div>
                <div className="font-bold text-white">Kong / Envoy</div>
                <div className="text-[9px] text-slate-400">Auth, Rate Limiting</div>
              </div>

              <div className="p-3 rounded-xl bg-studio-900 border border-accent-purple/40 space-y-1">
                <div className="text-[10px] text-accent-purple font-bold">CORE SERVICE</div>
                <div className="font-bold text-white">Order Microservice</div>
                <div className="text-[9px] text-slate-400">Go / Java Cluster</div>
              </div>

              <div className="p-3 rounded-xl bg-studio-900 border border-brand-500/40 space-y-1">
                <div className="text-[10px] text-brand-500 font-bold">DATA TIER</div>
                <div className="font-bold text-white">PostgreSQL (ACID)</div>
                <div className="text-[9px] text-slate-400">Primary + Replicas</div>
              </div>
            </div>

            {/* Asynchronous Pipeline */}
            <div className="pt-3 border-t border-studio-800 flex items-center justify-center space-x-3 text-xs font-mono">
              <span className="text-slate-400">Order Service</span>
              <span className="text-accent-amber">&rarr; Event Push &rarr;</span>
              <span className="px-2.5 py-1 rounded-lg bg-accent-amber/10 border border-accent-amber/30 text-accent-amber font-bold">
                Apache Kafka (Topic: order_created)
              </span>
              <span className="text-accent-amber">&rarr;</span>
              <span className="text-slate-300">Notification &amp; Invoice Workers</span>
            </div>
          </div>

          {/* HLD Engineering Metrics & Trade-offs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-studio-850 border border-studio-750 space-y-1 font-mono">
              <span className="text-[10px] text-slate-400 uppercase">Non-Functional Target</span>
              <div className="font-bold text-accent-cyan">99.99% Availability</div>
              <div className="text-[10px] text-slate-400">Max 52 minutes downtime/year</div>
            </div>

            <div className="p-3 rounded-xl bg-studio-850 border border-studio-750 space-y-1 font-mono">
              <span className="text-[10px] text-slate-400 uppercase">Capacity Sizing</span>
              <div className="font-bold text-brand-500">5,000 Peak Orders/sec</div>
              <div className="text-[10px] text-slate-400">Storage: 8 TB / Year</div>
            </div>

            <div className="p-3 rounded-xl bg-studio-850 border border-studio-750 space-y-1 font-mono">
              <span className="text-[10px] text-slate-400 uppercase">Protocol Strategy</span>
              <div className="font-bold text-accent-purple">Sync REST + Async Kafka</div>
              <div className="text-[10px] text-slate-400">Decouples email/push delivery</div>
            </div>
          </div>
        </div>
      ) : (
        /* Low-Level Design View */
        <div className="space-y-5 animate-fadeIn">
          {/* LLD Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-studio-750 pb-2">
            {[
              { id: "classes", label: "Classes & Interfaces", icon: Code2 },
              { id: "schema", label: "DB Schema & Constraints", icon: Database },
              { id: "api", label: "API Contract Schema", icon: FileCode2 },
              { id: "transaction", label: "Transaction Boundaries", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setLldTab(tab.id as typeof lldTab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    lldTab === tab.id
                      ? "bg-accent-purple/20 text-accent-purple border border-accent-purple/40 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* LLD Content Panels */}
          {lldTab === "classes" && (
            <div className="p-4 rounded-2xl bg-studio-950 font-mono text-xs space-y-3 border border-studio-800">
              <div className="text-accent-purple font-bold flex items-center justify-between">
                <span>Class Structure (Strategy Pattern for Payments)</span>
                <span className="text-[10px] text-slate-500">SOLID Principles</span>
              </div>
              <pre className="text-slate-300 overflow-x-auto p-3 rounded-xl bg-studio-900 border border-studio-850 leading-relaxed">
{`interface PaymentGatewayInterface {
  processPayment(amountCents: number, currency: string, idempotencyKey: string): Promise<PaymentResult>;
}

class StripePaymentAdapter implements PaymentGatewayInterface {
  async processPayment(...) { /* Stripe SDK API call with retries */ }
}

class PayPalPaymentAdapter implements PaymentGatewayInterface {
  async processPayment(...) { /* PayPal v2 REST SDK */ }
}

class OrderService {
  constructor(
    private readonly paymentGateway: PaymentGatewayInterface,
    private readonly orderRepo: OrderRepository,
    private readonly eventBus: KafkaEventProducer
  ) {}

  async createOrder(userId: string, items: CartItem[], idempotencyKey: string): Promise<Order> {
    // 1. Validate cart items & price calculation
    // 2. Reserve inventory with pessimistic lock
    // 3. Process payment via strategy adapter
    // 4. Save order record in database transaction
    // 5. Emit 'order_created' event to Kafka outbox
  }
}`}
              </pre>
            </div>
          )}

          {lldTab === "schema" && (
            <div className="p-4 rounded-2xl bg-studio-950 font-mono text-xs space-y-3 border border-studio-800">
              <div className="text-accent-cyan font-bold flex items-center justify-between">
                <span>SQL Schema &amp; Strict Constraints (PostgreSQL)</span>
                <span className="text-[10px] text-slate-500">ACID Relational Model</span>
              </div>
              <pre className="text-slate-300 overflow-x-auto p-3 rounded-xl bg-studio-900 border border-studio-850 leading-relaxed">
{`CREATE TABLE orders (
  order_id         BIGSERIAL PRIMARY KEY,
  user_id          BIGINT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
  total_amount     INT NOT NULL CHECK (total_amount > 0), -- Amount in cents
  status           VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  idempotency_key  VARCHAR(64) NOT NULL UNIQUE,          -- Prevents double billing
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing strategy
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders (status) WHERE status IN ('PENDING', 'PROCESSING');`}
              </pre>
            </div>
          )}

          {lldTab === "api" && (
            <div className="p-4 rounded-2xl bg-studio-950 font-mono text-xs space-y-3 border border-studio-800">
              <div className="text-brand-500 font-bold flex items-center justify-between">
                <span>API Contract: POST /v1/orders</span>
                <span className="text-[10px] text-slate-500">OpenAPI 3.1 Spec</span>
              </div>
              <pre className="text-slate-300 overflow-x-auto p-3 rounded-xl bg-studio-900 border border-studio-850 leading-relaxed">
{`// Headers:
// Idempotency-Key: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
// Authorization: Bearer <jwt_token>

// Request Body:
{
  "currency": "USD",
  "paymentMethod": "STRIPE",
  "items": [
    { "skuId": "sku_iphone16_256gb", "quantity": 1 }
  ]
}

// Success 201 Created Response:
{
  "orderId": "ord_918204910",
  "status": "PROCESSING",
  "totalAmountCents": 99900,
  "createdAt": "2026-10-30T10:30:00Z"
}

// Error 409 Conflict Response (Idempotent replay detected):
{
  "error": "DUPLICATE_ORDER_ATTEMPT",
  "message": "Order already processed for this idempotency key"
}`}
              </pre>
            </div>
          )}

          {lldTab === "transaction" && (
            <div className="p-4 rounded-2xl bg-studio-950 font-mono text-xs space-y-3 border border-studio-800">
              <div className="text-accent-amber font-bold flex items-center justify-between">
                <span>ACID Transaction Boundaries &amp; Inventory Locking</span>
                <span className="text-[10px] text-slate-500">Concurrency Safety</span>
              </div>
              <pre className="text-slate-300 overflow-x-auto p-3 rounded-xl bg-studio-900 border border-studio-850 leading-relaxed">
{`BEGIN TRANSACTION;

-- 1. Pessimistic Row Lock on inventory to avoid race condition / overselling:
SELECT stock_count FROM inventory 
WHERE sku_id = 'sku_iphone16_256gb' FOR UPDATE;

-- 2. Deduct inventory:
UPDATE inventory 
SET stock_count = stock_count - 1 
WHERE sku_id = 'sku_iphone16_256gb';

-- 3. Insert order record:
INSERT INTO orders (user_id, total_amount, idempotency_key, status)
VALUES (942, 99900, 'idemp_key_849', 'COMPLETED');

-- 4. Commit atomic change:
COMMIT;`}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

