# Nexus Git Agent

You have edge devices deployed. Some fail. Some lie. This agent notices, calculates trust scores, quarantines bad nodes, and coordinates the group.

**Live Instance:** [https://nexus-git-agent.casey-digennaro.workers.dev](https://nexus-git-agent.casey-digennaro.workers.dev)
Open source | MIT Licensed | Runs on Cloudflare Workers | Zero dependencies

## Purpose
This agent provides fleet coordination without requiring custom heartbeat and trust logic. Instead of writing those components from scratch, you deploy this worker and point your devices at it.

## Quick Start
1.  **Fork** this repository. Deployment starts with your own copy.
2.  Deploy to Cloudflare Workers. No servers to manage.
3.  Add your `DEEPSEEK_API_KEY` as a Worker secret and bind a `NEXUS_KV` namespace.
4.  Point your devices to your new Worker URL. It will begin scoring them immediately.

## How It Works
1.  **No Required On-Device Agent:** You don't flash custom firmware. Devices send simple JSON heartbeats. That's the integration.
2.  **Does Not Trust All Nodes:** Untrusted devices receive partial fleet state. It isolates bad nodes; it doesn't just log them.
3.  **No Central Lock-In:** You fork first. There is no upstream service that can disable or observe your fleet.

## Features
- **Behavior-Based Trust Engine:** Assigns a dynamic 0-100 score per node. Missed heartbeats, bad data, or conflicting reports lower it. Score controls broadcast priority.
- **Reflex Compiler:** Pushes simple behavior rules to nodes automatically (e.g., "retry sensor read twice").
- **Partition-Tolerant Fleet State:** Maintains a consistent view of connected devices, even during partial network outages.
- **Telemetry Bridge:** Translates between the Cocapn fleet protocol and your hardware's native format.
- **Optional LLM Reasoning:** DeepSeek integration resolves ambiguous edge cases, like conflicting sensor readings. You can disable this by simply not configuring the `DEEPSEEK_API_KEY` secret — the agent skips LLM reasoning gracefully (no errors).
- Cold starts under 50ms. No npm dependencies.

## One Honest Limitation
The agent uses Cloudflare Workers KV for state storage. The effective number of devices your deployment can actively manage depends on your KV usage plan's write rate limits. Under the standard (paid) tier with a typical heartbeat interval of 1 minute, you can expect to support around 1000 devices before encountering write throughput constraints. Always consult Cloudflare's [KV limits documentation](https://developers.cloudflare.com/workers/platform/limits/#kv-limits) for your specific plan.

## Related Repos
- **[nexus-edge-runtime](https://github.com/SuperInstance/nexus-edge-runtime)** — a full edge runtime (bytecode VM, wire protocol, 4-tier safety validation, sensor fusion) that includes its own trust-engine and fleet-coordination modules; a heavier-weight alternative if you need more than a lightweight Worker-hosted trust scorer.
- **[fleet-conductor](https://github.com/SuperInstance/fleet-conductor)** — an in-memory agent-state orchestration core (FSM, conservation guard, reconcile loop); useful if your fleet needs richer per-agent state management than this repo's trust-score model covers.
- **[vessel-bridge](https://github.com/SuperInstance/vessel-bridge)** — a thin ESP32→Jetson→Cloud hardware HAL; a natural on-device counterpart if you need firmware-level heartbeat/telemetry plumbing feeding into this agent's Worker.

## License
MIT. Do whatever you want with this code.

Attribution: Superinstance and Lucineer (DiGennaro et al.)

<div style="text-align:center;padding:16px;color:#64748b;font-size:.8rem"><a href="https://the-fleet.casey-digennaro.workers.dev" style="color:#64748b">The Fleet</a> &middot; <a href="https://cocapn.ai" style="color:#64748b">Cocapn</a></div>
