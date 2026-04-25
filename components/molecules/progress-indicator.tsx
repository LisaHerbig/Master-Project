import { Colors } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

type ProgressIndicatorProps = {
  step: number;  // 1-indexed: which step is currently active
  total: number;
};

export function ProgressIndicator({ step, total }: ProgressIndicatorProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={i === step - 1 ? styles.active : styles.inactive}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  // current step: wide pill
  active: {
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  // all other steps: small dot
  inactive: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.progressInactive,
  },
});
