// src/utils/meta.ts

export interface Meta {
  timestamp: string;
  clientId: string;
}

/**
 * Generate a metadata object for requests or logs.
 * @param clientId - The ID of the current user/client
 */
export function createMeta(clientId: string): Meta {
  return {
    timestamp: new Date().toISOString(),
    clientId,
  };
}
