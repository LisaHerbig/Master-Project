import { BookCard } from '@/components/molecules';
import { Colors, Typography } from '@/constants/theme';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useUnlockedBooks } from '@/hooks/use-unlocked-books';
import { BOOKS } from '@/lib/books';
import { router } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 64;
const CARD_GAP = 16;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

export default function HomeScreen() {
  const { profile } = useAuthContext();
  const { unlockedIds } = useUnlockedBooks();

  const firstName = profile?.full_name?.split(' ')[0] ?? '';

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.greeting}>HALLO{firstName ? `, ${firstName.toUpperCase()}` : ''}</Text>
        <Text style={styles.subtitle}>Deine Bücher – In Einer Welt Von Morgen</Text>
        <Text style={styles.body}>
          Entdecke exklusive Inhalte über die Geschichte, insbesondere die Welt und ihre Zukunft.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        style={styles.scroll}
      >
        {BOOKS.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isUnlocked={unlockedIds.has(book.id)}
            width={CARD_WIDTH}
            onPress={() => {
              if (unlockedIds.has(book.id)) {
                router.push(`/(main)/book/${book.id}` as any);
              }
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.colorLight,
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 40,
  },
  greeting: {
    fontFamily: 'EBGaramond_600SemiBold',
    fontSize: 40,
    lineHeight: 48,
    color: Colors.colorDark,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'EBGaramond_600SemiBold',
    fontSize: 18,
    lineHeight: 26,
    color: Colors.colorDark,
    marginBottom: 12,
  },
  body: {
    ...Typography.b2Regular,
    color: Colors.grey500,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: SIDE_PADDING,
    gap: CARD_GAP,
    paddingBottom: 40,
  },
});
