import { NonEmptyStringSchema } from '@mono/assist-api';
import * as ExpoStore from 'expo-secure-store';

export const LocalStoreService = {
  getLocalName: async () => {
    return await ExpoStore.getItemAsync('name');
  },
  updateLocalName: async (name: string) => {
    await ExpoStore.setItemAsync('name', name);
  },
  getAppId: async () => {
    const v = await ExpoStore.getItemAsync('appId');
    return v;
  },
  updateAppId: async (appId: string) => {
    await ExpoStore.setItemAsync('appId', appId);
  },
  getAppIdListeningTo: async () => {
    const v = await ExpoStore.getItemAsync('listeningTo');
    return NonEmptyStringSchema.array().parse(v);
  },
  addAppIdListeningTo: async (appId: string) => {},
  removeAppIdListeningTo: async (appId: string) => {},
} as const;
