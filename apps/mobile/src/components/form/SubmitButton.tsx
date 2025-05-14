import { Button } from '@rneui/themed';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { ButtonProps } from 'react-native';

type Props = {
  title: string;
  disabledConditions?: boolean[];
  onPress: ButtonProps['onPress'];
};

export function SubmitButton(props: Props) {
  const { formState } = useFormContext();

  const disabled = useMemo(
    () =>
      [
        formState.isSubmitting || !formState.isValid,
        ...(props?.disabledConditions ?? [false]),
      ].some(Boolean),
    [props.disabledConditions]
  );

  return <Button {...props} disabled={disabled} />;
}
