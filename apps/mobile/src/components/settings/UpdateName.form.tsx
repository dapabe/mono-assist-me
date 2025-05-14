import { ReactNode, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { InputControl } from '../form/InputControl';
import { IRegisterLocalSchema, IFormProps, RegisterLocalSchema } from '@mono/assist-api';
import { useNavigationContainerRef } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button, Text } from '@rneui/themed';
import { useLocalDataRepository } from '#src/hooks/useLocalData.repo';
import { zodResolver } from '@hookform/resolvers/zod';

export function UpdateNameForm({
  values,
  isLoading,
  loadErrors,
}: IFormProps<IRegisterLocalSchema>): ReactNode {
  const { t } = useTranslation();
  const { patch } = useLocalDataRepository();
  const form = useForm<IRegisterLocalSchema>({
    defaultValues: { name: values.name },
    // resolver: zodResolver(RegisterLocalSchema),
  });

  const onSubmit = async (data: IRegisterLocalSchema) => {
    await patch.mutateAsync({ currentName: data.name });
  };

  const fieldName = form.watch('name');
  const hasUnsavedChanges = useMemo(() => fieldName !== values.name, [fieldName, values.name]);

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

  if (isLoading) return <Text>Loading</Text>;

  return (
    <FormProvider {...form}>
      <View style={styles.formRoot}>
        <InputControl
          name="name"
          label={t('Dashboard.PageSettings.FormLocalName.Label')}
          description={t('Dashboard.PageSettings.FormLocalName.Hint')}
          isDisabled={!!loadErrors?.name}
          placeholder={loadErrors?.name ?? ''}
        />
        <View style={styles.updateName}>
          <Button
            size="sm"
            disabled={
              !!loadErrors?.name ||
              !hasUnsavedChanges ||
              form.formState.isSubmitting ||
              !form.formState.isValid
            }
            onPress={form.handleSubmit(onSubmit)}
          >
            {t('CommonWords.Update')}
          </Button>
        </View>
      </View>
    </FormProvider>
  );
}
const styles = StyleSheet.create({
  formRoot: {
    rowGap: 4,
  },
  updateName: {
    marginTop: 10,
  },
});
