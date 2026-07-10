import { SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';

describe('Nexus Git Agent', () => {
  it('GET /health', async () => {
    const response = await SELF.fetch('http://localhost/health');
    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data.status).toBe('ok');
    expect(data.repo).toBe('nexus-git-agent');
  });

  it('GET /vessel.json', async () => {
    const response = await SELF.fetch('http://localhost/vessel.json');
    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data.name).toBe('nexus-git-agent');
  });

  it('POST /api/bridge with telemetry updates trust score and still works without DEEPSEEK_API_KEY', async () => {
    const nodeId = 'test-bridge-' + Date.now();
    const response = await SELF.fetch('http://localhost/api/bridge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nodeId,
        telemetry: [{ type: 'GOOD', severity: 2 }],
        intent: 'move forward 10 cm',
      }),
    });
    expect(response.status).toBe(200);
    const data = await response.json() as any;
    expect(data.acknowledged).toBe(true);
    expect(data.reflex).toBeNull(); // key not set -> LLM skipped
    expect(data.trustScore).toBeGreaterThan(0);
  });

  it('POST /api/trust creates and persists a trust record', async () => {
    const nodeId = 'test-trust-' + Date.now();
    const create = await SELF.fetch('http://localhost/api/trust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeId, type: 'BAD', severity: 3 }),
    });
    expect(create.status).toBe(200);
    const created = await create.json() as any;
    expect(created.nodeId).toBe(nodeId);
    expect(created.score).toBeGreaterThan(0);

    // query the same node
    const query = await SELF.fetch(`http://localhost/api/trust?node=${nodeId}`);
    expect(query.status).toBe(200);
    const queried = await query.json() as any;
    expect(queried.nodeId).toBe(nodeId);
    expect(queried.score).toBe(created.score); // persisted
  });

  it('GET /api/fleet returns fleet state with trust scores', async () => {
    // ensure at least one node exists
    const nodeId = 'test-fleet-' + Date.now();
    await SELF.fetch('http://localhost/api/bridge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeId }),
    });

    const response = await SELF.fetch('http://localhost/api/fleet');
    expect(response.status).toBe(200);
    const fleet = await response.json() as any;
    expect(Array.isArray(fleet.nodes)).toBe(true);
    const match = fleet.nodes.find((n: any) => n.id === nodeId);
    expect(match).toBeDefined();
    expect(match.trustScore).toBeGreaterThan(0);
  });
});
