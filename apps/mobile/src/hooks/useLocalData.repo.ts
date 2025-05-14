import { QueryKey } from '#src/query-client';
import {
  DatabaseService,
  ExpectedError,
  ILocalDataDTO,
  IRegisterLocalSchema,
  useRoomStore,
} from '@mono/assist-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

export function useLocalDataRepository() {
  const qc = useQueryClient();
  const ctx = useRoomStore();

  const register = useMutation({
    mutationFn: (data: IRegisterLocalSchema) => {
      return DatabaseService.getInstance().Repo.LocalData.create(data);
    },
    onSuccess: (_, args) => {
      qc.invalidateQueries({ queryKey: QueryKey.LocalData.exists() });
      ctx.updateMemoryState('currentName', args.name);
    },
    onError: (e: ExpectedError) => {
      Alert.alert(e.name, e.key);
    },
  });

  const patch = useMutation({
    mutationFn: (data: ILocalDataDTO['Update']) => {
      return DatabaseService.getInstance().Repo.LocalData.patch(data);
    },
    onSuccess: (_, args) => {
      qc.invalidateQueries({ queryKey: QueryKey.LocalData.data() });
      if (args.currentName) ctx.updateMemoryState('currentName', args.currentName);
      if (args.currentAppId) ctx.updateMemoryState('currentAppId', args.currentAppId);
    },
    onError: (e: ExpectedError) => {
      Alert.alert(e.name, e.key);
    },
  });

  const deleteData = useMutation({
    mutationFn: () => {
      return DatabaseService.getInstance().Repo.LocalData.delete();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QueryKey.LocalData.all });
      ctx.updateMemoryState('currentName', null);
      ctx.updateMemoryState('currentDevice', null);
    },
    onError: (e: ExpectedError) => {
      Alert.alert(e.name, e?.key ?? e.message);
    },
  });

  return { register, patch, deleteData };
}

useLocalDataRepository.getLocalData = function () {
  return useQuery<ILocalDataDTO['Read'] | undefined, ExpectedError>({
    queryKey: QueryKey.LocalData.data(),
    queryFn: async () => await DatabaseService.getInstance().Repo.LocalData.get(),
  });
};

useLocalDataRepository.entryExists = function () {
  return useQuery<boolean | undefined, ExpectedError>({
    queryKey: QueryKey.LocalData.exists(),
    queryFn: async () => await DatabaseService.getInstance().Repo.LocalData.entryExists(),
  });
};
