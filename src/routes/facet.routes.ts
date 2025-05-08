// src/routes/facet.routes.ts

import { Router } from "express";
import * as facetService from '../services/facetService.ts';


const router = Router();

/**
 * GET /api/oracle/facet-lookup
 * Fetches and returns all Spiralogic facets from the database.
 */
router.get("/", async (_req, res) => {
  try {
    const facets = await facetService.getAllFacets();
    return res.status(200).json({ success: true, facets });
  } catch (err: any) {
    console.error("❌ Error fetching facets:", err.message || err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch facets" });
  }
});

export default router;
