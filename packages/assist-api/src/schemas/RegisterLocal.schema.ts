import { z } from "zod";
import { I18nKeys } from "../constants";

export const RegisterLocalSchema = z.object({
	name: z.string().trim().min(3, I18nKeys.form.minLength),
});

export type IRegisterLocalSchema = z.infer<typeof RegisterLocalSchema>;
