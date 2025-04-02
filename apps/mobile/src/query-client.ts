import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const QueryKey = {
	GetLocalName: "localName",
	GetAppId: "getAppId",
} as const;

export type IQueryKey = (typeof QueryKey)[keyof typeof QueryKey];
