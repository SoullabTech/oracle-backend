// src/index.ts
// Import modules from your core folder
<<<<<<< HEAD
// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();
// src/index.ts
// Import modules from your core folder
import { detectElement, adjustGuidance } from './core/elementalFramework.js';
import { MainOracleAgent } from './core/mainOracleAgent.js';
import { ClientAgent } from './core/clientAgent.js';
import { GuideAgent } from './core/guideAgent.js';
import { MentorAgent } from './core/mentorAgent.js';
/**
 * Test the Elemental Framework by processing several sample queries.
 */
=======
import { detectElement, adjustGuidance } from './core/elementalFramework';
import { MainOracleAgent } from './core/mainOracleAgent';
import { ClientAgent } from './core/clientAgent';
import { GuideAgent } from './core/guideAgent';
import { MentorAgent } from './core/mentorAgent';
// Test the Elemental Framework
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
async function testElementalFramework() {
    const queries = [
        "I feel like a spark is igniting my passion today!",
        "There's a calm flow of emotions, like a gentle river.",
        "I need to ground myself and build something stable.",
        "I crave clarity, and my thoughts are like a cool breeze.",
        "I sense something mystical and spiritual about the cosmos."
    ];
    for (const query of queries) {
<<<<<<< HEAD
        try {
            const element = detectElement(query);
            const guidance = adjustGuidance(query, "Your guidance:");
            console.log(`Query: "${query}"`);
            console.log(`Detected Element: ${element}`);
            console.log(`Adjusted Guidance: ${guidance}`);
            console.log('---------------------------');
        }
        catch (error) {
            console.error(`Error processing query "${query}":`, error);
        }
    }
}
/**
 * Test the Main Oracle Agent.
 */
async function testMainOracleAgent() {
    try {
        const mainOracle = new MainOracleAgent({ debug: true });
        const query = "I feel like a spark is igniting my passion today!";
        const response = await mainOracle.processQuery(query);
        console.log("Final Oracle Response:", response);
    }
    catch (error) {
        console.error("Error in Main Oracle Agent:", error);
    }
}
/**
 * Test the Client Agent.
 */
async function testClientAgent() {
    try {
        const clientAgent = new ClientAgent("client1", true);
        const query = "What are the latest technology trends?";
        const response = await clientAgent.handleQuery(query);
        console.log("ClientAgent Response:", response);
    }
    catch (error) {
        console.error("Error in Client Agent:", error);
    }
}
/**
 * Test the Guide Agent.
 */
async function testGuideAgent() {
    try {
        const guideAgent = new GuideAgent({ debug: true });
        const query = "How can I overcome challenges in my career?";
        const response = await guideAgent.processQuery(query);
        console.log("GuideAgent Response:", response);
    }
    catch (error) {
        console.error("Error in Guide Agent:", error);
    }
}
/**
 * Test the Mentor Agent.
 */
async function testMentorAgent() {
    try {
        const mentorAgent = new MentorAgent({ debug: true });
        const query = "How can I achieve my long-term career goals?";
        const response = await mentorAgent.processQuery(query);
        console.log("MentorAgent Response:", response);
    }
    catch (error) {
        console.error("Error in Mentor Agent:", error);
    }
}
/**
 * Run all tests sequentially.
 */
=======
        const element = detectElement(query);
        const guidance = adjustGuidance(query, "Your guidance:");
        console.log(`Query: "${query}"`);
        console.log(`Detected Element: ${element}`);
        console.log(`Adjusted Guidance: ${guidance}`);
        console.log('---------------------------');
    }
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
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
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
<<<<<<< HEAD
// Execute all tests
runTests().catch((error) => {
    console.error("Unexpected error running tests:", error);
});
=======
runTests();
>>>>>>> 268cb604fe12a917c8e4d04e4a80dde66f880973
