import { describe, it, expect } from 'vitest';
import { MentorAgent } from '../../core/agents/mentorAgent';

describe('MentorAgent', () => {
  const mentorAgent = new MentorAgent();

  it('should process a query and return enhanced response', async () => {
    const query = 'Test query';
    const response = await mentorAgent.processQuery(query);

    expect(response).toHaveProperty('response');
    expect(response).toHaveProperty('metadata');
    expect(response).toHaveProperty('routingPath');
    expect(response.metadata?.mentor).toBe(true);
    expect(response.memoryEnhanced).toBe(true);
  });

  it('should include mentor wisdom in response', async () => {
    const query = 'Test query';
    const response = await mentorAgent.processQuery(query);

    expect(response.response).toContain("Mentor's wisdom");
  });

  it('should maintain routing path', async () => {
    const query = 'Test query';
    const response = await mentorAgent.processQuery(query);

    expect(response.routingPath).toContain('oracleAgent');
    expect(response.routingPath).toContain('mentorAgent');
  });
});