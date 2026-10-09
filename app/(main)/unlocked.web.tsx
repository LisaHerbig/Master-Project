import { BookPattern } from '@/components/atoms/book-pattern';
import { Button } from '@/components/molecules';
import { Colors } from '@/constants/theme';
import { BOOKS, PatternType } from '@/lib/books';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

// Web variant: the unlock success view of the web unlock page (docs/index.html), which is
// what readers see after scanning a sticker. Same pattern background, book icon and confetti.

const CONFETTI_SRC = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';

function loadConfetti(): Promise<any> {
  const w = window as any;
  if (w.confetti) return Promise.resolve(w.confetti);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = CONFETTI_SRC;
    script.onload = () => resolve(w.confetti);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function BookIcon({ type, color }: { type: PatternType; color: string }) {
  const stroke = { stroke: color, strokeLinecap: 'round' as const };
  return (
    <View style={[styles.icon, { borderColor: color }]}>
      <Svg width="100%" height="100%" viewBox="0 0 64 64">
        {type === 'wave' && (
          <>
            <Path d="M4,21 Q20,9 36,21 Q52,33 60,21" fill="none" strokeWidth={2} {...stroke} />
            <Path d="M4,43 Q20,31 36,43 Q52,55 60,43" fill="none" strokeWidth={2} {...stroke} />
          </>
        )}
        {type === 'lines' && (
          <>
            <Line x1={8} y1={22} x2={56} y2={22} stroke={color} strokeWidth={1.5} />
            <Line x1={8} y1={42} x2={56} y2={42} stroke={color} strokeWidth={1.5} />
          </>
        )}
        {type === 'dots' &&
          [[21, 21], [43, 21], [21, 43], [43, 43]].map(([cx, cy]) => (
            <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={6} fill={color} />
          ))}
        {type === 'dashes' &&
          [[10, 21, 26], [38, 21, 54], [10, 43, 26], [38, 43, 54]].map(([x1, y, x2]) => (
            <Line key={`${x1}-${y}`} x1={x1} y1={y} x2={x2} y2={y} strokeWidth={2.5} {...stroke} />
          ))}
        {type === 'diamonds' &&
          ['M21,10 L30,21 L21,32 L12,21 Z', 'M43,10 L52,21 L43,32 L34,21 Z', 'M21,32 L30,43 L21,54 L12,43 Z', 'M43,32 L52,43 L43,54 L34,43 Z'].map((d) => (
            <Path key={d} d={d} fill="none" stroke={color} strokeWidth={1.5} />
          ))}
      </Svg>
    </View>
  );
}

export default function UnlockedScreen() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const book = BOOKS.find((b) => b.id === Number(bookId));

  useEffect(() => {
    if (!book) return;
    const color = book.accentColor;
    loadConfetti()
      .then((confetti) => {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: [color, '#ffffff', color + '99'] });
        setTimeout(() => confetti({ particleCount: 60, spread: 120, origin: { y: 0.5 }, colors: [color, '#ffffff'] }), 400);
      })
      .catch(() => {});
  }, [book]);

  if (!book) return null;

  return (
    <View style={styles.root}>
      <BookPattern type={book.pattern} color={book.accentColor} />

      <View style={styles.container}>
        <BookIcon type={book.pattern} color={book.accentColor} />
        <Text style={styles.series}>{book.seriesTitle}</Text>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.subtitle}>
          Freigeschaltet! Fakten, Quellen und der KI-Assistent zu diesem Buch sind jetzt in der App verfügbar.
        </Text>

        <Button
          label="Entdecken"
          size="large"
          variant="primary"
          style={styles.button}
          onPress={() => router.replace(`/(main)/book/${book.id}` as any)}
        />
      </View>
    </View>
  );
}

const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.colorLight,
    justifyContent: 'center',
    padding: 32,
  },
  container: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    marginBottom: 24,
  },
  series: {
    fontFamily: sans,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: Colors.grey500,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'EBGaramond_600SemiBold',
    fontSize: 40,
    lineHeight: 48,
    color: Colors.colorDark,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: sans,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.grey500,
    marginBottom: 40,
  },
  button: {
    width: '100%',
  },
});
