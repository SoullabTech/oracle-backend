import { Metadata } from "../core/types.js";

export function createMeta(): Metadata {
  return {
    timestamp: new Date().toISOString(),
    clientId: "clientXYZ",
  };
}