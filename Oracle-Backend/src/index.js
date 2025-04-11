"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var elementalFramework_js_1 = require("./core/elementalFramework.js");
var mainOracleAgent_js_1 = require("./core/mainOracleAgent.js");
var clientAgent_js_1 = require("./core/clientAgent.js");
var guideAgent_js_1 = require("./core/guideAgent.js");
var mentorAgent_js_1 = require("./core/mentorAgent.js");
function testElementalFramework() {
    return __awaiter(this, void 0, void 0, function () {
        var queries, _i, queries_1, query, element, guidance;
        return __generator(this, function (_a) {
            queries = [
                "I feel like a spark is igniting my passion today!",
                "There's a calm flow of emotions, like a gentle river.",
                "I need to ground myself and build something stable.",
                "I crave clarity, and my thoughts are like a cool breeze.",
                "I sense something mystical and spiritual about the cosmos."
            ];
            for (_i = 0, queries_1 = queries; _i < queries_1.length; _i++) {
                query = queries_1[_i];
                try {
                    element = (0, elementalFramework_js_1.detectElement)(query);
                    guidance = (0, elementalFramework_js_1.adjustGuidance)(query, "Your guidance:");
                    console.log("Query: \"".concat(query, "\""));
                    console.log("Detected Element: ".concat(element));
                    console.log("Adjusted Guidance: ".concat(guidance));
                    console.log('---------------------------');
                }
                catch (error) {
                    console.error("Error processing query \"".concat(query, "\":"), error);
                }
            }
            return [2 /*return*/];
        });
    });
}
function testMainOracleAgent() {
    return __awaiter(this, void 0, void 0, function () {
        var mainOracle, query, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    mainOracle = new mainOracleAgent_js_1.MainOracleAgent({ debug: true });
                    query = "I feel like a spark is igniting my passion today!";
                    return [4 /*yield*/, mainOracle.processQuery(query)];
                case 1:
                    response = _a.sent();
                    console.log("Final Oracle Response:", response);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error in Main Oracle Agent:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function testClientAgent() {
    return __awaiter(this, void 0, void 0, function () {
        var clientAgent, query, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    clientAgent = new clientAgent_js_1.ClientAgent("client1");
                    query = "What are the latest technology trends?";
                    return [4 /*yield*/, clientAgent.processQuery(query)];
                case 1:
                    response = _a.sent();
                    console.log("ClientAgent Response:", response);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error in Client Agent:", error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function testGuideAgent() {
    return __awaiter(this, void 0, void 0, function () {
        var guideAgent, query, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    guideAgent = new guideAgent_js_1.GuideAgent({ debug: true });
                    query = "How can I overcome challenges in my career?";
                    return [4 /*yield*/, guideAgent.processQuery(query)];
                case 1:
                    response = _a.sent();
                    console.log("GuideAgent Response:", response);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error in Guide Agent:", error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function testMentorAgent() {
    return __awaiter(this, void 0, void 0, function () {
        var mentorAgent, query, response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    mentorAgent = new mentorAgent_js_1.MentorAgent({ debug: true });
                    query = "How can I achieve my long-term career goals?";
                    return [4 /*yield*/, mentorAgent.processQuery(query)];
                case 1:
                    response = _a.sent();
                    console.log("MentorAgent Response:", response);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error("Error in Mentor Agent:", error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function runTests() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("=== Testing Elemental Framework ===");
                    return [4 /*yield*/, testElementalFramework()];
                case 1:
                    _a.sent();
                    console.log("\n=== Testing Main Oracle Agent ===");
                    return [4 /*yield*/, testMainOracleAgent()];
                case 2:
                    _a.sent();
                    console.log("\n=== Testing Client Agent ===");
                    return [4 /*yield*/, testClientAgent()];
                case 3:
                    _a.sent();
                    console.log("\n=== Testing Guide Agent ===");
                    return [4 /*yield*/, testGuideAgent()];
                case 4:
                    _a.sent();
                    console.log("\n=== Testing Mentor Agent ===");
                    return [4 /*yield*/, testMentorAgent()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
runTests().catch(function (error) {
    console.error("Unexpected error running tests:", error);
});
