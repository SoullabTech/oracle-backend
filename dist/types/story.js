import { z } from "zod";
/**
 * Enum for supported elemental themes.
 */
export const elementalThemeSchema = z.enum([
  "fire",
  "water",
  "earth",
  "air",
  "aether",
]);
