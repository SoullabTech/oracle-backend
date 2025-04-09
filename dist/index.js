// src/index.ts
// Import modules from your core folder
import { detectElement, adjustGuidance } from './core/elementalFramework';
import { MainOracleAgent } from './core/mainOracleAgent';
import { ClientAgent } from './clientAgent';
import { GuideAgent } from './core/guideAgent';
import { MentorAgent } from './core/mentorAgent';
// Test the Elemental Framework
async function testElementalFramework() {
    const queries = [
        "I feel like a spark is igniting my passion today!",
        "There's a calm flow of emotions, like a gentle river.",
        "I need to ground myself and build something stable.",
        "I crave clarity, and my thoughts are like a cool breeze.",
        "I sense something mystical and spiritual about the cosmos."
    ];
    queries.forEach(query => {
        const element = detectElement(query);
        const guidance = adjustGuidance(query, "Your guidance:");
        console.log(`Query: "${query}"`);
        console.log(`Detected Element: ${element}`);
        console.log(`Adjusted Guidance: ${guidance}`);
        console.log('---------------------------');
    });
}
// Test the Main Oracle Agent
async function testMainOracleAgent() {
    const mainOracle = new MainOracleAgent({ debug: true });
    const query = "I feel like a spark is igniting my passion today!";
    const response = await mainOracle.processQuery(query);
    console.log("Final Oracle Response:", response);
}
// Test the Client Agent
async function testClientAgent() {
    const clientAgent = new ClientAgent("client1", true);
    const query = "What are the latest technology trends?";
    const response = await clientAgent.handleQuery(query);
    console.log("ClientAgent Response:", response);
}
// Test the Guide Agent
async function testGuideAgent() {
    const guideAgent = new GuideAgent({ debug: true });
    const query = "How can I overcome challenges in my career?";
    const response = await guideAgent.processQuery(query);
    console.log("GuideAgent Response:", response);
}
// Test the Mentor Agent
async function testMentorAgent() {
    const mentorAgent = new MentorAgent({ debug: true });
    const query = "How can I achieve my long-term career goals?";
    const response = await mentorAgent.processQuery(query);
    console.log("MentorAgent Response:", response);
}
// Run all tests sequentially
async function runTests() {
    console.log("=== Testing Elemental Framework ===");
    await testElementalFramework();
    console.log("\n=== Testing Main Oracle Agent ===");
    await testMainOracleAgent();
    console.log("\n=== Testing Client Agent ===");
    await testClientAgent();
    console.log("\n=== Testing Guide Agent ===");
    await testGuideAgent();
    console.log("\n=== Testing Mentor Agent ===");
    await testMentorAgent();
}
runTests();
