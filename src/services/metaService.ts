import type { Metadata } from "../types";

export class MetaService {
  static createMeta(): Metadata {
    return {
      timestamp: new Date().toISOString(),
      clientId: "clientXYZ",
      processedAt: new Date().toISOString(),
    };
  }

  static enrichMeta(
    meta: Metadata,
    additionalData: Partial<Metadata>,
  ): Metadata {
    return {
      ...meta,
      ...additionalData,
      lastUpdated: new Date().toISOString(),
    };
  }

  static validateMeta(meta: Metadata): boolean {
    return !!(meta.timestamp && meta.clientId);
  }
}
