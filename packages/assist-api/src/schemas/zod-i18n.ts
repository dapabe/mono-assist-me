import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';

z.setErrorMap(zodI18nMap);
export const z18n = z;
