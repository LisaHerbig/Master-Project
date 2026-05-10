import { BookCard } from '@/components/molecules';
import { Colors, Typography } from '@/constants/theme';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useUnlockedBooks } from '@/hooks/use-unlocked-books';
import { Book, BOOKS } from '@/lib/books';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 64;
const CARD_GAP = 16;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
const LOOPED_BOOKS = [...BOOKS, ...BOOKS, ...BOOKS];
const INITIAL_OFFSET = BOOKS.length * SNAP_INTERVAL;

export default function HomeScreen() {
  const { profile } = useAuthContext();
  const { unlockedIds } = useUnlockedBooks();

  const firstName = profile?.full_name?.split(' ')[0] ?? '';
  const scrollRef = useRef<ScrollView>(null);
  const [centeredBookId, setCenteredBookId] = useState(BOOKS[0].id);
  const [bubbleBook, setBubbleBook] = useState<Book | null>(null);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.greeting}>HALLO{firstName ? ',' : ''}</Text>
        {firstName ? <Text style={styles.greeting}>{firstName.toUpperCase()}</Text> : null}
        <Text style={styles.subtitle}>DEINE BÜCHER – IN EINER WELT VON MORGEN</Text>
        <Text style={styles.body}>
          Entdecke exklusive Inhalte über die Geschichte, insbesondere die Welt und ihre Zukunft.
        </Text>
      </View>

      {/* DEV ONLY */}
      <View style={styles.devRow}>
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => router.push({ pathname: '/(main)/unlocked', params: { bookId: String(centeredBookId) } } as any)}
        >
          <Text style={styles.testButtonLabel}>🧪 Test Unlock Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => supabase.auth.signOut()}
        >
          <Text style={styles.testButtonLabel}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        contentOffset={{ x: INITIAL_OFFSET, y: 0 }}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        style={styles.scroll}
        onScrollBeginDrag={() => setBubbleBook(null)}
        onMomentumScrollEnd={(e) => {
          const offsetX = e.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / SNAP_INTERVAL);
          const bookIndex = ((index % BOOKS.length) + BOOKS.length) % BOOKS.length;
          setCenteredBookId(BOOKS[bookIndex].id);

          if (index < BOOKS.length) {
            scrollRef.current?.scrollTo({ x: (index + BOOKS.length) * SNAP_INTERVAL, animated: false });
          } else if (index >= BOOKS.length * 2) {
            scrollRef.current?.scrollTo({ x: (index - BOOKS.length) * SNAP_INTERVAL, animated: false });
          }
        }}
      >
        {LOOPED_BOOKS.map((book, i) => (
          <BookCard
            key={`${book.id}-${i}`}
            book={book}
            isUnlocked={unlockedIds.has(book.id)}
            width={CARD_WIDTH}
            onPress={() => {
              if (unlockedIds.has(book.id)) {
                setBubbleBook(null);
                router.push(`/(main)/book/${book.id}` as any);
              } else {
                setBubbleBook(prev => prev?.id === book.id ? null : book);
              }
            }}
          />
        ))}
      </ScrollView>

      {bubbleBook && (
        <View style={styles.bubbleWrapper}>
          <View style={[styles.bubbleTail, { borderBottomColor: bubbleBook.accentColor }]} />
          <View style={[styles.bubble, { borderColor: bubbleBook.accentColor, backgroundColor: bubbleBook.accentColor + '1F' }]}>
            <Text style={styles.bubbleText}>
              Dieser Inhalt ist noch nicht freigeschaltet. Scanne den Sticker im Buch mit deinem Smartphone, um den Inhalt freizuschalten.
            </Text>
          </View>
        </View>
      )}
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
    paddingBottom: 8,
  },
  bubbleWrapper: {
    paddingHorizontal: SIDE_PADDING,
    paddingTop: 8,
    paddingBottom: 24,
  },
  bubbleTail: {
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 13,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: -1,
  },
  bubble: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
  },
  bubbleText: {
    ...Typography.b2Regular,
    color: Colors.colorDark,
  },
  devRow: {
    flexDirection: 'row',
    marginHorizontal: 32,
    marginBottom: 12,
    gap: 8,
  },
  testButton: {
    flex: 1,
    marginBottom: 0,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.grey200,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonLabel: {
    ...Typography.b3Medium,
    color: Colors.grey600,
  },
});
