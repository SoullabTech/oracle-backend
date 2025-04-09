// src/services/exampleService.ts

import { Metadata } from "../types/metadata";
export function createMeta(): Metadata {
  return {
    timestamp: Date.now(),
    clientId: "clientXYZ",
    // add any other properties as needed
  };
}

console.log(createMeta());
