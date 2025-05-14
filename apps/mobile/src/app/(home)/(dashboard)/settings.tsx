import { zodResolver } from '@hookform/resolvers/zod';
import { IRegisterLocalSchema, RegisterLocalSchema } from '@mono/assist-api';
import { Button } from '@rneui/themed';
import { useNavigationContainerRef } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InputControl } from '#src/components/form/InputControl';
import { useTranslation } from 'react-i18next';
import { useLocalDataRepository } from '#src/hooks/useLocalData.repo';
import { UpdateNameForm } from '#src/components/settings/UpdateName.form';

export default function SettingsScreen() {
  const localData = useLocalDataRepository.getLocalData();

  return (
    <SafeAreaView style={styles.root}>
      <UpdateNameForm
        values={{ name: localData.data?.currentName ?? '' }}
        isLoading={localData.isLoading}
        loadErrors={{ name: localData.error?.key }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 40,
  },
});
