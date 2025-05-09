import { storeMemoryItem } from "@/services/memoryService";
import { detectFacetFromInput } from "@/utils/facetUtil";
import { scoreQuery } from "@/utils/agentScoreUtil";
import { MainOracleAgent } from "@/core/agents/mainOracleAgent";
const oracle = new MainOracleAgent();
export async function reflectInJournal({ userId, entryText, }) {
    const facet = await detectFacetFromInput(entryText);
    const scores = scoreQuery(entryText);
    // Choose a dominant element
    const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    const reflection = await oracle.processQuery({ input: entryText, userId });
    await storeMemoryItem({
        content: entryText,
        element: dominant,
        sourceAgent: "user",
        clientId: userId,
        confidence: 0.8,
        metadata: { role: "journal-entry", facet },
    });
    await storeMemoryItem({
        content: reflection.content,
        element: dominant,
        sourceAgent: "oracle",
        clientId: userId,
        confidence: reflection.confidence,
        metadata: {
            role: "oracle-reflection",
            facet,
            phase: reflection.metadata?.phase,
            archetype: reflection.metadata?.archetype,
        },
    });
    return {
        userEntry: entryText,
        agentReflection: reflection.content,
        metadata: reflection.metadata,
    };
}
