import { Colors, Typography } from '@/constants/theme';
import { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

type InputVariant = 'default' | 'error' | 'success' | 'warning';

const BORDER_COLOR: Record<InputVariant, string> = {
  default: Colors.grey200,
  error:   Colors.error,
  success: Colors.success,
  warning: Colors.warning,
};

type InputProps = TextInputProps & {
  variant?: InputVariant;
};

export function Input({ variant = 'default', style, onFocus, onBlur, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = focused ? Colors.primary : BORDER_COLOR[variant];

  return (
    <View style={[styles.container, { borderColor }]}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Colors.grey300}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  input: {
    ...Typography.b2Regular,
    color: Colors.colorDark,
    padding: 0,
  },
});
