import { Colors, Typography } from '@/constants/theme';
import { StyleSheet, Text, TextProps } from 'react-native';

// Garamond applies to headings (H1–H5) only
const garamond = 'EBGaramond_600SemiBold';

export function H1({ style, ...props }: TextProps) {
  return <Text style={[styles.h1, style]} {...props} />;
}
export function H2({ style, ...props }: TextProps) {
  return <Text style={[styles.h2, style]} {...props} />;
}
export function H3({ style, ...props }: TextProps) {
  return <Text style={[styles.h3, style]} {...props} />;
}
export function H4({ style, ...props }: TextProps) {
  return <Text style={[styles.h4, style]} {...props} />;
}
export function H5({ style, ...props }: TextProps) {
  return <Text style={[styles.h5, style]} {...props} />;
}
export function S1({ style, ...props }: TextProps) {
  return <Text style={[styles.s1, style]} {...props} />;
}
export function S2({ style, ...props }: TextProps) {
  return <Text style={[styles.s2, style]} {...props} />;
}
export function B1({ style, ...props }: TextProps) {
  return <Text style={[styles.b1, style]} {...props} />;
}
export function B2({ style, ...props }: TextProps) {
  return <Text style={[styles.b2, style]} {...props} />;
}
export function B3({ style, ...props }: TextProps) {
  return <Text style={[styles.b3, style]} {...props} />;
}

const styles = StyleSheet.create({
  h1: { ...Typography.h1, fontFamily: garamond, color: Colors.black },
  h2: { ...Typography.h2, fontFamily: garamond, color: Colors.black },
  h3: { ...Typography.h3, fontFamily: garamond, color: Colors.black },
  h4: { ...Typography.h4, fontFamily: garamond, color: Colors.black },
  h5: { ...Typography.h5, fontFamily: garamond, color: Colors.black },
  s1: { ...Typography.s1, fontFamily: garamond, color: Colors.black },
  s2: { ...Typography.s2, fontFamily: garamond, color: Colors.black },
  b1: { ...Typography.b1Regular, color: Colors.colorDark },
  b2: { ...Typography.b2Regular, color: Colors.colorDark },
  b3: { ...Typography.b3Regular, color: Colors.colorDark },
});
