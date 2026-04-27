import { Icon, IconName } from '@/components/atoms/icon';
import { Colors, Typography } from '@/constants/theme';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type ButtonSize = 'giant' | 'large' | 'medium' | 'small' | 'tiny';
type ButtonVariant = 'primary' | 'dark' | 'outline' | 'error' | 'success';

const SIZE_STYLES: Record<ButtonSize, { font: typeof Typography.buttonLarge; paddingVertical: number; paddingHorizontal: number }> = {
  giant:  { font: Typography.buttonGiant,  paddingVertical: 18, paddingHorizontal: 28 },
  large:  { font: Typography.buttonLarge,  paddingVertical: 16, paddingHorizontal: 24 },
  medium: { font: Typography.buttonMedium, paddingVertical: 12, paddingHorizontal: 20 },
  small:  { font: Typography.buttonSmall,  paddingVertical: 10, paddingHorizontal: 16 },
  tiny:   { font: Typography.buttonTiny,   paddingVertical: 8,  paddingHorizontal: 12 },
};

const VARIANT_COLORS: Record<ButtonVariant, { background: string; text: string; border?: string }> = {
  primary: { background: Colors.primary,   text: Colors.white },
  dark:    { background: Colors.colorDark, text: Colors.white },
  outline: { background: 'transparent',    text: Colors.colorDark, border: Colors.secondary },
  error:   { background: Colors.error,     text: Colors.white },
  success: { background: Colors.success,   text: Colors.white },
};

type ButtonProps = TouchableOpacityProps & {
  label: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  leftIcon?: IconName;
  rightIcon?: IconName;
  loading?: boolean;
};

export function Button({
  label,
  size = 'large',
  variant = 'primary',
  leftIcon,
  rightIcon,
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { font, paddingVertical, paddingHorizontal } = SIZE_STYLES[size];
  const { background, text, border } = VARIANT_COLORS[variant];
  const iconSize = font.fontSize;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        {
          backgroundColor: background,
          paddingVertical,
          paddingHorizontal,
          borderColor: border ?? 'transparent',
          borderWidth: border ? 1 : 0,
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={text} size="small" />
      ) : (
        <>
          {leftIcon && (
            <View style={styles.iconCircle}>
              <Icon name={leftIcon} size={iconSize - 4} color={text} />
            </View>
          )}
          <Text style={[font, { color: text }]}>{label}</Text>
          {rightIcon && <Icon name={rightIcon} size={iconSize} color={text} />}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    gap: 10,
  },
  iconCircle: {
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 999,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
