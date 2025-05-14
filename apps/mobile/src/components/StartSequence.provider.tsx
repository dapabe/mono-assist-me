import { initI18nReact } from '@mono/assist-api/i18n/next';
import { useEffect, PropsWithChildren, ReactNode, useRef, useCallback } from 'react';
import { I18nextProvider } from 'react-i18next';
import { DatabaseService, schemaBarrel } from '@mono/assist-api';
import migrations from '@mono/assist-api/migrations';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useMigrations, migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseSync } from 'expo-sqlite';
import { ActivityIndicator, Dimensions, PixelRatio, Text, View } from 'react-native';
import { Icon } from '@rneui/themed';
import { useImplicitToggle } from '#src/hooks/useImplicitToggle.hook';
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';

// Just in case in the future a long loading sequence is needed, commented

// const StepEvent = {
//   Init: 0,
//   i18nLoading: 1,
//   DbStart: 2,
//   DbError: 3,
//   DbMigrate: 4,
//   DbSuccess: 5,
//   Done: 6,
//   StopSequence: 7,
// } as const;
// type IStep = (typeof StepEvent)[keyof typeof StepEvent];
// type IStepPayload = { step: IStep; error?: null | Error };
// type IStepState = {
//   steps: IStepPayload[];
//   currentStep: IStep;
// };
// type IReducerActionStep = { type: 'ADD_STEP'; payload: IStepPayload } | { type: 'RESET' };

// function reducer(state: IStepState, action: IReducerActionStep): IStepState {
//   switch (action.type) {
//     case 'ADD_STEP':
//       state.steps.push({ step: action.payload.step, error: action.payload.error ?? null });
//       return { ...state, currentStep: action.payload.step };
//     case 'RESET':
//       state.steps = [];
//       return state;
//     default:
//       throw new Error();
//   }
// }

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export function StartSequenceProvider({ children }: PropsWithChildren): ReactNode {
  // const [state, dispatch] = useReducer(reducer, {
  //   steps: [],
  //   currentStep: StepEvent.Init,
  // });
  const [isLoaded, toggleLoading] = useImplicitToggle(false);
  const conf = useRef<null | ReturnType<typeof initI18nReact>>(null);

  useEffect(() => {
    const load = async () => {
      try {
        toggleLoading();
        // dispatch({ type: 'ADD_STEP', payload: { step: StepEvent.i18nLoading } });
        const i18n = initI18nReact();
        conf.current = i18n;
        // dispatch({ type: 'ADD_STEP', payload: { step: StepEvent.DbStart } });
        const expo = openDatabaseSync('assist.db');
        const db = drizzle(expo, { schema: schemaBarrel });
        DatabaseService.getInstance().setAdapter(db);
        // dispatch({ type: 'ADD_STEP', payload: { step: StepEvent.DbMigrate } });
        await migrate(db, migrations);
        // .then(() => dispatch({ type: 'ADD_STEP', payload: { step: StepEvent.DbSuccess } }))
        // .catch((e: Error) => {
        // dispatch({ type: 'ADD_STEP', payload: { step: StepEvent.DbError, error: e } });
        // });
        // dispatch({ type: 'ADD_STEP', payload: { step: StepEvent.Done } });
        // dispatch({ type: 'ADD_STEP', payload: { step: StepEvent.StopSequence } });
      } catch (error) {
        throw error;
      } finally {
        toggleLoading();
      }
    };
    load();
    // return () => dispatch({ type: 'RESET' });
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (isLoaded) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hide();
    }
  }, [isLoaded]);

  if (!conf.current) return <Text>Loading</Text>;

  return (
    <I18nextProvider i18n={conf.current}>
      <View
        style={{
          flex: 1,
        }}
        onLayout={onLayoutRootView}
      >
        {children}
      </View>
      {/* <StepLoader steps={state.steps} currentStep={state.currentStep}>
        {children}
      </StepLoader> */}
    </I18nextProvider>
  );
}

// type StepProps = PropsWithChildren<{
//   currentStep: IStep;
//   steps: IStepPayload[];
// }>;

// function StepLoader({ currentStep, steps, children }: StepProps): ReactNode {
//   // if (currentStep === StepEvent.StopSequence) return children;

//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       {steps.map((x) => (
//         <Text key={x.step}>
//           {/* <Icon name='' /> */}
//           Step: {x.step} {x.error ? ' - ' + x.error.message : null}
//         </Text>
//       ))}
//     </View>
//   );
// }
