// src/services/testBaseClient.ts

import { Metadata } from "../types/metadata";

export function createMeta(): Metadata {
  return {
    timestamp: Date.now(),
    clientId: "clientXYZ",
    // etc.
  };
}
