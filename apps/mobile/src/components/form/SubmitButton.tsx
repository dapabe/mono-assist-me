import { Button } from '@rneui/themed';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ButtonProps } from 'react-native';

type Props = {
  title: string;
  onPress: ButtonProps['onPress'];
};

export function SubmitButton(props: Props) {
  const { formState } = useFormContext();
  return <Button {...props} disabled={formState.isSubmitting || !formState.isValid} />;
}
