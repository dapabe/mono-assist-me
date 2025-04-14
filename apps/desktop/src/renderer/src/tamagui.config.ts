import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

export const TamaguiConfig = createTamagui(defaultConfig)

export type UIConfig = typeof TamaguiConfig
declare module '@tamagui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends UIConfig {}
}
