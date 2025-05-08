// src/utils/meta.ts
/**
 * Generate a metadata object for requests or logs.
 * @param clientId - The ID of the current user/client
 */
export function createMeta(clientId) {
    return {
        timestamp: new Date().toISOString(),
        clientId,
    };
}
