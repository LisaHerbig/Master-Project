import { BookPattern } from '@/components/atoms/book-pattern';
import { Icon } from '@/components/atoms/icon';
import { Colors, Typography } from '@/constants/theme';
import { Book } from '@/lib/books';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BookCardProps {
  book: Book;
  isUnlocked: boolean;
  width: number;
  onPress: () => void;
}

export function BookCard({ book, isUnlocked, width, onPress }: BookCardProps) {
  return (
    <TouchableOpacity
      style={[styles.wrapper, { width }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.card, !isUnlocked && styles.locked]}>
        <BookPattern type={book.pattern} color={book.accentColor} />

        {/* Full-height accent bar */}
        <View style={[styles.accentBar, { backgroundColor: book.accentColor }]} />

        {/* Image + content stacked in a column */}
        <View style={styles.body}>
          <Image source={book.cover} style={styles.cover} resizeMode="contain" />
          <View style={styles.content}>
            <Text style={styles.bookNumber}>BUCH {book.id}</Text>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.series}>{book.seriesTitle}</Text>
          </View>
        </View>

        {!isUnlocked && (
          <View style={styles.lockOverlay}>
            <Icon name="locked" size="lg" color={Colors.colorDark} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#1C1408',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey200,
  },
  locked: {
    opacity: 0.55,
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  body: {
    flex: 1,
  },
  cover: {
    width: '80%',
    height: 200,
    alignSelf: 'flex-end',
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  bookNumber: {
    ...Typography.b3Medium,
    color: Colors.grey400,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontFamily: 'EBGaramond_600SemiBold',
    fontSize: 32,
    lineHeight: 38,
    color: Colors.colorDark,
    marginBottom: 6,
  },
  series: {
    ...Typography.b3Regular,
    color: Colors.grey400,
    letterSpacing: 1,
  },
  lockOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});
