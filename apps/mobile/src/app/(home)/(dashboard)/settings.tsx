import { zodResolver } from '@hookform/resolvers/zod';
import { IRegisterLocalSchema, RegisterLocalSchema } from '@mono/assist-api';
import { Button } from '@rneui/themed';
import { useNavigationContainerRef } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InputControl } from '#src/components/form/InputControl';

export default function SettingsScreen() {
  const form = useForm<IRegisterLocalSchema>({
    defaultValues: { name: '' },
    // resolver: zodResolver(RegisterLocalSchema),
  });

  const onSubmit = async (data: IRegisterLocalSchema) => {
    // await updateCurrentNameMutation(data);
  };

  const fieldName = form.watch('name');
  // const hasUnsavedChanges = useMemo(
  //   () => fieldName !== currentName.data,
  //   [fieldName, currentName.data]
  // );
  const hasUnsavedChanges = false;

  // //	No other way of doing this
  const nav = useNavigationContainerRef();
  useEffect(() => {
    const unsub = nav.addListener('__unsafe_action__', (evt) => {
      if (evt.data.action.type === 'NAVIGATE') {
        if (hasUnsavedChanges) {
          // Activate form reset after navigation
          setTimeout(() => {
            form.reset();
          }, 0);
        }
      }
    });
    return unsub;
  }, [nav]);

  return (
    <SafeAreaView style={styles.root}>
      <FormProvider {...form}>
        <View style={styles.formRoot}>
          <InputControl
            name="name"
            label="Tu nombre actual"
            description="Asi te veras para otros"
          />
          <View style={styles.updateName}>
            <Button
              size="sm"
              disabled={
                !hasUnsavedChanges || form.formState.isSubmitting || !form.formState.isValid
              }
              onPress={form.handleSubmit(onSubmit)}
            >
              Actualizar
            </Button>
          </View>
        </View>
      </FormProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    // marginTop: 20,
    // paddingInline: 20,
    paddingHorizontal: 40,
    // flex: 1,
  },
  formRoot: {
    rowGap: 4,
  },
  updateName: {
    marginTop: 10,
  },
});
