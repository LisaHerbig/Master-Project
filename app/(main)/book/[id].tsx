import { Colors } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.placeholder}>Book {id} — coming soon</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.colorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: Colors.colorDark,
  },
});
