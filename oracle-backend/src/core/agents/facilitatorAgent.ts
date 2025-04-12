import { retrieveMemory } from './persistentMemory.js';
import { MemoryItem } from './types.js';

export class FacilitatorAgent {
  async proposeIntervention(clientId: string): Promise<string> {
    const allMemories = await retrieveMemory();
    const clientMemories = allMemories.filter((memory: MemoryItem) => memory.clientId === clientId);
    const count = clientMemories.length;
    let intervention = "";
    
    if (count === 0) {
      intervention = "No significant patterns detected yet. Keep interacting to build insights.";
    } else if (count < 3) {
      intervention = "Emerging patterns observed. Consider scheduling a short check-in session.";
    } else if (count < 6) {
      intervention = "Clear patterns emerging. A focused coaching session could help optimize your strategy.";
    } else {
      intervention = "Strong long-term patterns detected. Consider an in-depth mentoring session for strategic development.";
    }
    
    return intervention;
  }
}