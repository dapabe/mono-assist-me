import { queryClient, QueryKey } from "#src/query-client";
import { LocalStoreService } from "#src/services/LocalStore.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { z } from "zod";

import ExpoCrypto from "expo-crypto";

export function useAppIdQuery() {
	const AppId = useQuery({
		queryKey: [QueryKey.GetAppId],
		queryFn: async () => {
			const v = await LocalStoreService.getAppId();
			const parsed = z.string().uuid().safeParse(v);
			if (parsed.success) return parsed.data;
			const uuid = ExpoCrypto.randomUUID();
			await updateCurrentAppIdMutation(uuid);
			return uuid;
		},
	});

	const { mutateAsync: updateCurrentAppIdMutation } = useMutation<
		void,
		Error,
		string
	>({
		mutationKey: [QueryKey.GetAppId],
		mutationFn: async (data) => await LocalStoreService.updateAppId(data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: [QueryKey.GetAppId] }),
	});

	return useMemo(
		() => ({ currentAppId: AppId, updateCurrentAppIdMutation }),
		[AppId]
	);
}
