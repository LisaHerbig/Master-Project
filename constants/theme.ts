import { Platform } from 'react-native';

export const Colors = {
  primary: '#0000DC',
  secondary: '#000095',
  colorDark: '#01013A',
  colorLight: '#F6F6FF',
  white: '#FFFFFF',
  black: '#000000',
  progressInactive: '#D0D0E8',
  cardBackground: 'rgba(246, 246, 255, 0.82)',
  warning: '#F7E83B',
  error: '#D75B65',
  success: '#3EF473',
  grey200: '#D2D2D5',
  grey300: '#ABABB0',
  grey400: '#85858D',
  grey500: '#61616B',
  grey600: '#404048',
  grey700: '#212126',
  // kept for backward compatibility with existing hooks
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0000DC',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0000DC',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

// Semi Bold = '600', Medium = '500', Regular = '400'
export const Typography = {
  h1: { fontSize: 48, lineHeight: 58, fontWeight: '600' as const },
  h2: { fontSize: 40, lineHeight: 48, fontWeight: '600' as const },
  h3: { fontSize: 32, lineHeight: 38, fontWeight: '600' as const },
  h4: { fontSize: 28, lineHeight: 34, fontWeight: '600' as const },
  h5: { fontSize: 24, lineHeight: 28, fontWeight: '600' as const },
  s1: { fontSize: 18, lineHeight: 28, fontWeight: '600' as const },
  s2: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
  b1Regular: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  b1Medium:  { fontSize: 16, lineHeight: 24, fontWeight: '500' as const },
  b2Regular: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  b2Medium:  { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
  b3Regular: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  b3Medium:  { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  b4Medium:  { fontSize: 10, lineHeight: 14, fontWeight: '500' as const },
  buttonGiant:  { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  buttonLarge:  { fontSize: 16, lineHeight: 20, fontWeight: '600' as const },
  buttonMedium: { fontSize: 14, lineHeight: 16, fontWeight: '600' as const },
  buttonSmall:  { fontSize: 12, lineHeight: 16, fontWeight: '600' as const },
  buttonTiny:   { fontSize: 10, lineHeight: 12, fontWeight: '600' as const },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
