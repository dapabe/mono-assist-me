import { z } from "zod";

export const NonEmptyStringSchema = z.string().trim().min(1);

export const stringToJSONSchema = z.string().transform((str, ctx) => {
	try {
		return JSON.parse(str);
	} catch (e) {
		ctx.addIssue({ code: "custom", message: "Invalid JSON" });
		return z.NEVER;
	}
});
