import { BookPattern } from '@/components/atoms/book-pattern';
import { Icon } from '@/components/atoms/icon';
import { H2, S2 } from '@/components/atoms/text';
import { Button } from '@/components/molecules';
import { Colors } from '@/constants/theme';
import { BOOKS } from '@/lib/books';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function UnlockedScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const book = BOOKS.find((b) => b.id === Number(bookId));

  if (!book) return null;

  return (
    <SafeAreaView style={styles.root}>
      {/* Muted colour tint */}
      <View style={[styles.tint, { backgroundColor: book.accentColor }]} />
      {/* Pattern */}
      <BookPattern type={book.pattern} color={book.accentColor} />

      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Icon name="arrow-back" size="lg" color={Colors.colorDark} />
        <Text style={styles.backLabel}>Zurück</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.headingGroup}>
          <H2 style={styles.heading} adjustsFontSizeToFit numberOfLines={2}>NEUER INHALT{'\n'}FREIGESCHALTET</H2>
          <S2 style={styles.bookTitle}>{book.title}</S2>
        </View>

        <Button
          label="Entdecken"
          size="large"
          variant="primary"
          onPress={() => router.replace(`/(main)/book/${book.id}` as any)}
        />

        <View style={styles.coverCard}>
          <Image
            source={book.coverFull}
            style={styles.coverImage}
            resizeMode="contain"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 6,
  },
  backLabel: {
    fontSize: 16,
    color: Colors.colorDark,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 24,
  },
  headingGroup: {
    gap: 8,
  },
  heading: {
    color: Colors.colorDark,
  },
  bookTitle: {
    color: Colors.grey500,
  },
  coverCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
});
