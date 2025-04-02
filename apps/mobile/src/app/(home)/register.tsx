import { zodResolver } from '@hookform/resolvers/zod';
import { IRegisterLocalSchema, RegisterLocalSchema } from '@mono/assist-api';
import { Button, Text } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BackHandler, StyleSheet, View } from 'react-native';

import { InputControl } from '#src/components/form/InputControl';
import { useLocalNameQuery } from '#src/hooks/useLocalName.query';

export default function RegisterScreen() {
  const router = useRouter();
  const form = useForm<IRegisterLocalSchema>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(RegisterLocalSchema),
  });
  const { updateCurrentNameMutation } = useLocalNameQuery();

  const onSubmit = async (data: IRegisterLocalSchema) => {
    await updateCurrentNameMutation(data);
    router.replace('/(dashboard)/emitter');
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });
  }, []);

  return (
    <FormProvider {...form}>
      <View style={styles.container}>
        <InputControl
          name="name"
          label="Tu nombre público"
          description="Asi se verá para otras personas"
          placeholder="ej: John Anti-Cheat"
        />
        <Text>Podras cambiarlo luego</Text>
        <View>
          <Button
            disabled={form.formState.isSubmitting || !form.formState.isValid}
            title="Guardar"
            onPress={form.handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </FormProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingInline: '15%',
    // alignItems: "center",
    justifyContent: 'center',
    rowGap: 12,
  },
});
