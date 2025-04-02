import { z } from "zod";

export const SafePortIPv4Schema = z.number().int().min(0).max(65535);

export type ISafePortIPv4 = z.infer<typeof SafePortIPv4Schema>;
