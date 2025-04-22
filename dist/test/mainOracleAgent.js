// test/mainOracleAgent.test.ts
import { MainOracleAgent } from "../src/core/agents/mainOracleAgent";
import { runLangChainMock } from "./__mocks__/langchain";
import { triggerPrefectFlowMock } from "./__mocks__/prefect";
vi.mock("../../services/langchainService", () => ({
  runLangChain: runLangChainMock,
  triggerPrefectFlow: triggerPrefectFlowMock,
}));
describe("MainOracleAgent", () => {
  let oracle;
  beforeEach(() => {
    oracle = new MainOracleAgent();
  });
  it('should call LangChain if the query contains "oracle"', async () => {
    const query = { input: "oracle, tell me something wise", userId: "user-1" };
    const response = await oracle.processQuery(query);
    expect(runLangChainMock).toHaveBeenCalledWith(
      "oracle, tell me something wise",
    );
    expect(response.content).toEqual("Mocked LangChain Response");
  });
  it("should trigger Prefect flow after processing", async () => {
    const query = { input: "What is my purpose?", userId: "user-2" };
    const response = await oracle.processQuery(query);
    expect(triggerPrefectFlowMock).toHaveBeenCalledWith({ userId: "user-2" });
  });
});
