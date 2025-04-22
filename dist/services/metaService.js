export class MetaService {
  static createMeta() {
    return {
      timestamp: new Date().toISOString(),
      clientId: "clientXYZ",
      processedAt: new Date().toISOString(),
    };
  }
  static enrichMeta(meta, additionalData) {
    return {
      ...meta,
      ...additionalData,
      lastUpdated: new Date().toISOString(),
    };
  }
  static validateMeta(meta) {
    return !!(meta.timestamp && meta.clientId);
  }
}
