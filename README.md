# Nexus Bridge

You run edge hardware. It works alone. Adding more nodes creates coordination problems. This is the cloud-side service that helps them work as a team.

A coordination layer for edge device fleets. It connects Jetson, ESP32, and other nodes via the Cocapn fleet protocol, using behaviour-based trust to manage communication.

**Live Instance:** [https://nexus-git-agent.casey-digennaro.workers.dev](https://nexus-git-agent.casey-digennaro.workers.dev)

---

## Why This Exists
Fleet orchestration often requires heavy infrastructure. You might not need a large control plane, but you do need a reliable, lightweight coordinator that treats your nodes as participants. This runs at the cloud edge, built for real deployments.

---

## What It Provides
- Zero runtime dependencies. Pure TypeScript built for Cloudflare Workers.
- Behaviour-based trust. Nodes gain or lose coordination authority based on their actions over time.
- Low-latency cold starts. Execution begins in milliseconds.
- Designed for physical hardware, tested with devices in the field.

---

## Getting Started
1. **Fork & Deploy** – Fork this repository and deploy it to Cloudflare Workers.
2. **Configure** – Set your `DEEPSEEK_API_KEY` as a Worker secret and bind a `NEXUS_KV` namespace.
3. **Connect Nodes** – Configure your edge devices to send heartbeats and telemetry to your Worker's URL.
4. **Extend** – Modify the trust logic in `src/index.ts` for your specific use case.

---

## Core Features
- **Trust Engine** – Each node has a trust score (0-100). Reliable heartbeats and accurate data raise it; failures and contradictions lower it. This score influences broadcast priority.
- **Reflex Compiler** – Assembles and dispatches behaviour rules to nodes based on aggregated fleet state.
- **Fleet State Management** – Maintains a consistent view of node status, handling network partitions gracefully.
- **Telemetry Bridge** – Translates between the Cocapn fleet protocol and your devices' native formats.
- **LLM Coordination** – Optional DeepSeek integration for low-latency decision support in ambiguous states.
- **KV Persistence** – Stores trust scores and fleet state durably in Cloudflare KV.

---

## One Honest Limitation
This is built for coordination, not deep data processing. It handles message routing and trust, but is not a data pipeline or time-series database. If you need heavy analytics, pair it with a dedicated system.

---

## Architecture
Nexus Bridge runs as a stateless Cloudflare Worker. It acts as a neutral message router between your edge nodes and the broader Cocapn fleet. All communication is initiated by your hardware; the Worker responds.

---

## Customization
The trust scoring logic in `getTrustScore()` and `logTrustEvent()` is designed to be modified. Adjust the KV schema and endpoint handlers to fit your fleet's needs. The code is straightforward and forkable.

---

## License & Attribution
MIT License. Maintained by Superinstance & Lucineer (DiGennaro et al.).

---

<div align="center">
  <br>
  Part of the Cocapn Fleet.
  <br>
  <a href="https://the-fleet.casey-digennaro.workers.dev">The Fleet</a> •
  <a href="https://cocapn.ai">Cocapn.ai</a>
</div>