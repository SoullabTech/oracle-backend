import { retrieveMemory } from './persistentMemory';
import { MemoryItem } from './types'; // Make sure the path is correct

export class FacilitatorAgent {
  /**
   * Proposes an intervention for a client based on the memory items stored.
   * @param clientId The client's unique identifier.
   * @returns A string with the proposed intervention.
   */
  async proposeIntervention(clientId: string): Promise<string> {
    // Retrieve all memory items
    const allMemories = await retrieveMemory();
    
    // Filter memory items for the specified client
    const clientMemories = allMemories.filter((memory: MemoryItem) => memory.clientId === clientId);
    
    // Determine intervention based on the count of memory items
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
