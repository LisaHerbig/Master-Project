import { BookCard } from '@/components/molecules';
import { Colors, Typography } from '@/constants/theme';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useNfcScan } from '@/hooks/use-nfc-scan';
import { useUnlockedBooks } from '@/hooks/use-unlocked-books';
import { Book, BOOKS } from '@/lib/books';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, AppState, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const { unlockedIds, refresh } = useUnlockedBooks();
  const { isSupported, isScanning, startScan } = useNfcScan();

  const firstName = profile?.full_name?.split(' ')[0] ?? '';
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  const scrollRef = useRef<ScrollView>(null);
  const isNavigating = useRef(false);
  const [bubbleBook, setBubbleBook] = useState<Book | null>(null);
  const [unknownTagUid, setUnknownTagUid] = useState<string | null>(null);

  const handleScan = async () => {
    const result = await startScan();
    if (result.status === 'unlocked') {
      await refresh();
      router.push({ pathname: '/(main)/unlocked', params: { bookId: String(result.bookId) } } as any);
    } else if (result.status === 'already_unlocked') {
      router.push(`/(main)/book/${result.bookId}` as any);
    } else if (result.status === 'not_found') {
      setUnknownTagUid(result.uid);
    } else if (result.status === 'error') {
      Alert.alert('Fehler', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.greeting}>HALLO{firstName ? ',' : ''}</Text>
        {firstName ? <Text style={styles.greeting}>{firstName.toUpperCase()}</Text> : null}
        <Text style={styles.subtitle}>
          Entdecke mehr über die Geschichten, unsere Welt und ihre Zukunft.
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={() => supabase.auth.signOut()}>
          <Ionicons name="log-out-outline" size={24} color={Colors.colorDark} />
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
                if (isNavigating.current) return;
                isNavigating.current = true;
                setBubbleBook(null);
                router.push(`/(main)/book/${book.id}` as any);
                setTimeout(() => { isNavigating.current = false; }, 1000);
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

      {isSupported && (
        <View style={styles.scanRow}>
          <TouchableOpacity
            style={[styles.scanButton, isScanning && styles.scanButtonActive]}
            onPress={() => { setUnknownTagUid(null); handleScan(); }}
            disabled={isScanning}
          >
            <Text style={styles.scanButtonLabel}>
              {isScanning ? 'Warte auf Sticker …' : 'Buch scannen'}
            </Text>
          </TouchableOpacity>
          {unknownTagUid && (
            <Text style={styles.debugText}>Uups, falscher Tag – UID: {unknownTagUid}</Text>
          )}
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
    paddingBottom: 24,
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
    lineHeight: 28,
    color: Colors.colorDark,
    marginBottom: 12,
    textTransform: 'uppercase',
    paddingRight: 48,
  },
  body: {
    ...Typography.b2Regular,
    color: Colors.grey500,
  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    right: 32,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.colorDark,
    alignItems: 'center',
    justifyContent: 'center',
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
    position: 'absolute',
    bottom: 56,
    left: SIDE_PADDING,
    right: SIDE_PADDING,
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
  scanRow: {
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 8,
  },
  scanButton: {
    backgroundColor: Colors.colorDark,
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  scanButtonActive: {
    opacity: 0.5,
  },
  scanButtonLabel: {
    ...Typography.b2Regular,
    color: Colors.white,
  },
  debugText: {
    ...Typography.b2Regular,
    color: Colors.grey500,
    textAlign: 'center',
    marginTop: 8,
  },
});
