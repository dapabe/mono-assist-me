import { z } from 'zod';

import { NonEmptyStringSchema } from './utils.schema';
import { z18n } from './zod-i18n';

export const LocalDataSchema = z18n.object({
  currentName: NonEmptyStringSchema.default(''),
  currentAppId: NonEmptyStringSchema.default(''),
  previousAppIds: NonEmptyStringSchema.default('').array(),
});

export type ILocalData = z.infer<typeof LocalDataSchema>;
