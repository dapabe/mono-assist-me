import { RegisterLocalSchema } from './RegisterLocal.schema';
import { z18n } from './zod-i18n';
import { IndexedClassDTO } from '../types/IndexedClassDTO.zod';

export class LocalDataDTO {
  static Create = z18n.object({
    currentName: RegisterLocalSchema.shape.name,
    currentAppId: z18n.string().cuid2(),
    previousAppIds: z18n.string().cuid2().array(),
  });

  static Update = LocalDataDTO.Create.omit({ previousAppIds: true }).partial();
}

export type ILocalDataDTO = IndexedClassDTO<typeof LocalDataDTO>;
