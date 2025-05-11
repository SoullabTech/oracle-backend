import { oracle } from "../core/agents/mainOracleAgent";
async function runSymbolicTest() {
  const testQuery = {
    userId: "test-user-001",
    input: "Last night I had a dream about walking through fire with a guide",
  };
  const response = await oracle.processQuery(testQuery);
  console.log("🧪 TEST: Symbolic Oracle Response");
  console.log("Content:\n", response.content);
  console.log("Metadata:\n", response.metadata);
  console.log("Feedback Prompt:\n", response.feedbackPrompt);
}
runSymbolicTest().catch((err) => {
  console.error("❌ Error running symbolic test:", err);
});
