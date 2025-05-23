"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
// scripts/seedMemoryItems.ts
var supabase_js_1 = require("@supabase/supabase-js");
var uuid_1 = require("uuid");
var supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
var seedData = [
    {
        userId: (0, uuid_1.v4)(),
        sourceAgent: "FireOracle",
        isCollective: false,
        theme: "transformation",
        content: "The phoenix rose in my dream last night. I felt the ache of grief, but also the fire of something new.",
    },
    {
        userId: (0, uuid_1.v4)(),
        sourceAgent: "WaterOracle",
        isCollective: false,
        theme: "grief",
        content: "My tears mirrored the ocean’s sadness. I placed a mirror on my altar. I saw my mother’s eyes in it.",
    },
    {
        userId: (0, uuid_1.v4)(),
        sourceAgent: "ShadowAgent",
        isCollective: true,
        theme: "shadow",
        content: "I walked a labyrinth of doubt. Each step felt like a question: who am I beneath these masks?",
    },
    {
        userId: (0, uuid_1.v4)(),
        sourceAgent: "AetherOracle",
        isCollective: false,
        theme: "integration",
        content: "There was a doorway of light. I crossed it and left behind a part of me I had clung to. The sky opened.",
    }
];
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var entries, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    entries = seedData.map(function (item) { return (__assign(__assign({}, item), { createdAt: new Date().toISOString() })); });
                    return [4 /*yield*/, supabase.from("MemoryItem").insert(entries)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error("Seed Error:", error);
                    }
                    else {
                        console.log("Seeded MemoryItems:", data);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
seed();
