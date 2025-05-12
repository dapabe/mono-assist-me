import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export const QueryKey = {
  LocalData: {
    all: ['localData'],
    data: () => [...QueryKey.LocalData.all, 'data'] as const,
    exists: () => [...QueryKey.LocalData.all, 'exists'] as const,
  },
} as const;

export type IQueryKey = (typeof QueryKey)[keyof typeof QueryKey];
