import { BookCard } from '@/components/molecules';
import { Colors, Typography } from '@/constants/theme';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useNfcScan } from '@/hooks/use-nfc-scan';
import { useUnlockedBooks } from '@/hooks/use-unlocked-books';
import { Book, BOOKS } from '@/lib/books';
import { DEMO_BOOK_ID } from '@/lib/demo-store';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CARD_GAP = 16;
const DEMO_BOOK = BOOKS.find((b) => b.id === DEMO_BOOK_ID)!;

// Demo mode (web only): tapping the locked "Das Fahrwasser" card simulates the NFC scan.
export default function HomeScreen() {
  const { profile } = useAuthContext();
  const { unlockedIds } = useUnlockedBooks();
  const { isScanning, startScan } = useNfcScan();
  const { width } = useWindowDimensions();

  const cardWidth = width - 64;
  const sidePadding = (width - cardWidth) / 2;

  const firstName = profile?.full_name?.split(' ')[0] ?? '';
  const isNavigating = useRef(false);
  const [bubbleBook, setBubbleBook] = useState<Book | null>(null);
  const demoUnlocked = unlockedIds.has(DEMO_BOOK_ID);

  const handleScan = async () => {
    setBubbleBook(null);
    const result = await startScan();
    if (result.status === 'unlocked') {
      router.push({ pathname: '/(main)/unlocked', params: { bookId: String(result.bookId) } } as any);
    } else if (result.status === 'already_unlocked') {
      router.push(`/(main)/book/${result.bookId}` as any);
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
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => supabase.auth.signOut()}
          accessibilityLabel="Demo zurücksetzen"
        >
          <Ionicons name="log-out-outline" size={24} color={Colors.colorDark} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: sidePadding }]}
        snapToInterval={cardWidth + CARD_GAP}
        decelerationRate="fast"
        style={styles.scroll}
        onScrollBeginDrag={() => setBubbleBook(null)}
      >
        {BOOKS.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isUnlocked={unlockedIds.has(book.id)}
            width={cardWidth}
            onPress={() => {
              if (isScanning) return;
              if (unlockedIds.has(book.id)) {
                if (isNavigating.current) return;
                isNavigating.current = true;
                setBubbleBook(null);
                router.push(`/(main)/book/${book.id}` as any);
                setTimeout(() => { isNavigating.current = false; }, 1000);
              } else if (book.id === DEMO_BOOK_ID) {
                handleScan();
              } else {
                setBubbleBook(prev => prev?.id === book.id ? null : book);
              }
            }}
          />
        ))}
      </ScrollView>

      {bubbleBook && (
        <View style={[styles.bubbleWrapper, { paddingHorizontal: sidePadding }]}>
          <View style={[styles.bubbleTail, { borderBottomColor: bubbleBook.accentColor }]} />
          <View style={[styles.bubble, { borderColor: bubbleBook.accentColor, backgroundColor: bubbleBook.accentColor + '1F' }]}>
            <Text style={styles.bubbleText}>
              Dieser Inhalt ist noch nicht freigeschaltet. In der Demo lässt sich nur „Das Fahrwasser“
              freischalten – in der App scannst du dafür den Sticker im gedruckten Buch.
            </Text>
          </View>
        </View>
      )}

      {!demoUnlocked && !bubbleBook && (
        <View style={styles.hintRow}>
          <View style={[styles.hint, { borderColor: DEMO_BOOK.accentColor }]}>
            <Text style={[styles.hintLabel, { color: DEMO_BOOK.accentColor }]}>DEMO</Text>
            <Text style={styles.hintText}>
              Tippe auf „Das Fahrwasser“, um den NFC-Scan des Buches zu simulieren.
            </Text>
          </View>
        </View>
      )}

      {isScanning && (
        <View style={styles.scanOverlay}>
          <View style={styles.scanSheet}>
            <Text style={styles.scanTitle}>Bereit zum Scannen</Text>
            <View style={[styles.scanCircle, { borderColor: DEMO_BOOK.accentColor }]}>
              <ActivityIndicator color={DEMO_BOOK.accentColor} size="large" />
            </View>
            <Text style={styles.scanText}>Sticker in „Das Fahrwasser“ wird gelesen …</Text>
            <Text style={styles.scanNote}>Simulierter Scan · In der App hältst du dein Smartphone an den Sticker im Buch.</Text>
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
    gap: CARD_GAP,
    paddingBottom: 8,
  },
  // Below the cards instead of pinned to the screen bottom, so it never covers a card
  bubbleWrapper: {
    paddingTop: 4,
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
  hintRow: {
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 8,
  },
  hint: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  hintLabel: {
    ...Typography.b4Medium,
    letterSpacing: 1.5,
  },
  hintText: {
    ...Typography.b2Regular,
    color: Colors.colorDark,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(1, 1, 58, 0.35)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  scanSheet: {
    backgroundColor: Colors.white,
    borderRadius: 32,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 16,
  },
  scanTitle: {
    ...Typography.h5,
    color: Colors.grey500,
  },
  scanCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: {
    ...Typography.b1Regular,
    color: Colors.colorDark,
    textAlign: 'center',
  },
  scanNote: {
    ...Typography.b3Regular,
    color: Colors.grey500,
    textAlign: 'center',
  },
});
