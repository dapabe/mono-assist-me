import { z } from 'zod';
import { NonEmptyStringSchema } from './utils.schema';

export const LocalDataSchema = z.object({
  currentName: NonEmptyStringSchema.default(''),
  currentAppId: NonEmptyStringSchema.default(''),
  previousAppIds: NonEmptyStringSchema.default('').array(),
});

export type ILocalData = z.infer<typeof LocalDataSchema>;
