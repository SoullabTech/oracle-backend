"use strict";
// src/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
// Import modules from your core folder
const elementalFramework_1 = require("./core/elementalFramework");
const mainOracleAgent_1 = require("./core/mainOracleAgent");
const clientAgent_1 = require("./clientAgent");
const guideAgent_1 = require("./core/guideAgent");
const mentorAgent_1 = require("./core/mentorAgent");
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
        const element = (0, elementalFramework_1.detectElement)(query);
        const guidance = (0, elementalFramework_1.adjustGuidance)(query, "Your guidance:");
        console.log(`Query: "${query}"`);
        console.log(`Detected Element: ${element}`);
        console.log(`Adjusted Guidance: ${guidance}`);
        console.log('---------------------------');
    });
}
// Test the Main Oracle Agent
async function testMainOracleAgent() {
    const mainOracle = new mainOracleAgent_1.MainOracleAgent({ debug: true });
    const query = "I feel like a spark is igniting my passion today!";
    const response = await mainOracle.processQuery(query);
    console.log("Final Oracle Response:", response);
}
// Test the Client Agent
async function testClientAgent() {
    const clientAgent = new clientAgent_1.ClientAgent("client1", true);
    const query = "What are the latest technology trends?";
    const response = await clientAgent.handleQuery(query);
    console.log("ClientAgent Response:", response);
}
// Test the Guide Agent
async function testGuideAgent() {
    const guideAgent = new guideAgent_1.GuideAgent({ debug: true });
    const query = "How can I overcome challenges in my career?";
    const response = await guideAgent.processQuery(query);
    console.log("GuideAgent Response:", response);
}
// Test the Mentor Agent
async function testMentorAgent() {
    const mentorAgent = new mentorAgent_1.MentorAgent({ debug: true });
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
