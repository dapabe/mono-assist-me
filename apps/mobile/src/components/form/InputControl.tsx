import { Text } from '@rneui/themed';
import { ComponentProps, ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, TextInput, View } from 'react-native';

type IInputControlProps = Omit<
  ComponentProps<typeof TextInput>,
  'style' | 'value' | 'onChangeText' | 'onBlur'
> & {
  label?: string;
  description?: string;
  /** Schema's property name */
  name: string;
  isDisabled?: boolean;
};

/**
 *  To be used inside a react-hook-form provider FormProvider
 */
export function InputControl({ isDisabled, ...props }: IInputControlProps): ReactNode {
  const { control, getFieldState, formState } = useFormContext<Record<string, string>>();

  const f = getFieldState(props.name, formState);

  return (
    <View style={styles.container}>
      {props.label && (
        <Text h4 h4Style={styles.label}>
          {props.label}
        </Text>
      )}
      {props.description && (
        <Text h4 h4Style={styles.desc}>
          {props.description}
        </Text>
      )}
      <Controller
        name={props.name}
        control={control}
        render={(x) => (
          <TextInput
            style={styles.input}
            value={x.field.value}
            onChangeText={x.field.onChange}
            onBlur={x.field.onBlur}
            selectTextOnFocus={!x.formState.isSubmitting}
            editable={!x.formState.isSubmitting}
            {...props}
          />
        )}
      />
      {f.isTouched && f.error ? <Text style={styles.err}>{f.error?.message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    rowGap: 2,
  },
  label: {
    fontSize: 20,
  },
  desc: {
    fontWeight: '100',
    fontSize: 15,
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  err: {
    color: 'red',
  },
});
