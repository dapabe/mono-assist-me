import { z, ZodTypeAny } from 'zod';

import { z18n } from './zod-i18n';

export const RegisterLocalSchema: z.ZodObject<{ name: z.ZodString }, 'strip', ZodTypeAny> =
  z18n.object({
    name: z18n.string().trim().min(3),
  });

export type IRegisterLocalSchema = typeof RegisterLocalSchema._type;
