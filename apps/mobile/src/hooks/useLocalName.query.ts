import { IRegisterLocalSchema, RegisterLocalSchema } from '@mono/assist-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { queryClient, QueryKey } from '#src/query-client';
import { LocalStoreService } from '#src/services/LocalStore.service';

export function useLocalNameQuery() {
  const localName = useQuery({
    queryKey: [QueryKey.GetLocalName],
    queryFn: async () => {
      const v = await LocalStoreService.getLocalName();

      return RegisterLocalSchema.parse({ name: v }).name;
    },
  });

  const { mutateAsync: updateCurrentNameMutation } = useMutation<void, Error, IRegisterLocalSchema>(
    {
      mutationKey: [QueryKey.GetLocalName],
      mutationFn: async (data) => await LocalStoreService.updateLocalName(data.name),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [QueryKey.GetLocalName] }),
    }
  );

  return useMemo(() => ({ currentName: localName, updateCurrentNameMutation }), [localName]);
}
