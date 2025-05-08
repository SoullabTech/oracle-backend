import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import testRoutes from "./testRoutes";
const app = express();
const PORT = process.env.PORT || 5001;
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Routes
app.use("/api/test", testRoutes);
// Health check endpoint
app.get("/health", (_req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
});
// Error handling
app.use((err, _req, res) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Test server running on port ${PORT}`);
});
export default app;
