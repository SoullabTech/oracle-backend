// src/server.ts

import "dotenv/config";
import util from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { supabase } from "./lib/supabaseClient";
import { authenticate } from "./middleware/authenticate";

import userProfileRouter from "./routes/userProfile.routes";
import oracleRouter from "./routes/oracle.routes";
import facetRouter from "./routes/facet.routes";
import facetMapRouter from "./routes/facetMap.routes";
import insightHistoryRouter from "./routes/insightHistory.routes";
import storyGeneratorRouter from "./routes/storyGenerator.routes";
import surveyRouter from "./routes/survey.routes";
import memoryRouter from "./routes/memory.routes";
import feedbackRouter from "./routes/feedback.routes";
import notionIngestRoutes from "./routes/notionIngest.routes";

import logger from "./utils/logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health & Smoke Tests ─────────────────────────────────────────────────────
app.get("/", (_req, res) =>
  res.send("🧠 Spiralogic Oracle backend is alive and listening."),
);

app.get("/test-supabase", async (_req, res) => {
  const { data, error } = await supabase
    .from("insight_history")
    .select("*")
    .limit(1);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ sampleRow: data });
});

// ─── Public Routes ────────────────────────────────────────────────────────────
app.use("/api/oracle", oracleRouter);
app.use("/api/oracle/facet-lookup", facetRouter);
app.use("/api/oracle/facet-map", facetMapRouter);
app.use("/api/oracle/story-generator", storyGeneratorRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/", userProfileRouter); // e.g. POST /update-profile

// ─── Ingestion Endpoints ──────────────────────────────────────────────────────
app.use("/api/notion/ingest", notionIngestRoutes);

// ─── Protected Routes ─────────────────────────────────────────────────────────
app.use("/api/oracle/insight-history", authenticate, insightHistoryRouter);
app.use("/api/survey", authenticate, surveyRouter);
app.use("/api/oracle/memory", authenticate, memoryRouter);

// ─── Swagger Docs ─────────────────────────────────────────────────────────────
let swaggerDocument = {};
try {
  swaggerDocument = YAML.load(
    path.join(__dirname, "docs", "oracle.openapi.yaml"),
  );
} catch (e) {
  console.warn("⚠️ Could not load Swagger YAML:", e);
}

const PORT = Number(process.env.PORT) || 5001;
if (Object.keys(swaggerDocument).length) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`📘 Swagger UI available at http://localhost:${PORT}/docs`);
}

// ─── Global Error Handling ────────────────────────────────────────────────────
process.on("unhandledRejection", (reason, promise) => {
  console.error("🔥 Unhandled Rejection at:", promise);
  console.error(util.inspect(reason, { depth: null, colors: true }));
});
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err.stack || err);
});
process.on("SIGINT", () => {
  console.log("🛑 Gracefully shutting down...");
  process.exit();
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`🚀 Oracle backend listening on port ${PORT}`);
});
