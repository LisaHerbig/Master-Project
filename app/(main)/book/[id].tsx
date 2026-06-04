import { BookPattern } from '@/components/atoms/book-pattern';
import { Icon } from '@/components/atoms/icon';
import { Colors, Fonts } from '@/constants/theme';
import { BOOKS } from '@/lib/books';
import { getBookContent } from '@/lib/content';
import { BulletPoint } from '@/lib/content/types';
import { supabase } from '@/lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Linking,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PANEL_CLOSED = 88;
const PANEL_OPEN = 360;

const URL_REGEX = /(https?:\/\/[^\s]+)/;

function SourceText({ text, accentColor }: { text: string; accentColor: string }) {
  const match = URL_REGEX.exec(text);
  if (!match) {
    return <Text style={sourceTextStyle}>{text}</Text>;
  }
  const before = text.slice(0, match.index);
  const url = match[0];
  return (
    <Text style={sourceTextStyle}>
      <Text style={{ fontStyle: 'italic' }}>{before}</Text>
      <Text
        style={{ color: accentColor, textDecorationLine: 'underline' }}
        onPress={() =>
          Alert.alert(
            'Externe Website',
            'Du wirst zu einer externen Website weitergeleitet. Möchtest du fortfahren?',
            [
              { text: 'Abbrechen', style: 'cancel' },
              { text: 'Öffnen', onPress: () => Linking.openURL(url) },
            ]
          )
        }
      >
        {url}
      </Text>
    </Text>
  );
}

const sourceTextStyle = { flex: 1, fontSize: 13, color: Colors.grey500, lineHeight: 18 } as const;

export default function BookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = BOOKS.find((b) => b.id === Number(id));
  const content = getBookContent(Number(id));

  const [filter, setFilter] = useState('');
  const [searchMode, setSearchMode] = useState<'seite' | 'kapitel'>('seite');
  const [searchFocused, setSearchFocused] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiFocused, setAiFocused] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string; isError?: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatScrollRef = useRef<ScrollView>(null);

  const panelH = useRef(new Animated.Value(PANEL_CLOSED)).current;
  const dragStartPanelH = useRef(PANEL_CLOSED);
  const maxPanelH = useRef(PANEL_OPEN);

  function snapTo(target: number) {
    if (target <= PANEL_CLOSED) {
      Animated.spring(panelH, {
        toValue: PANEL_CLOSED,
        useNativeDriver: false,
        damping: 22,
        stiffness: 220,
        mass: 0.8,
      }).start(() => setAiOpen(false));
    } else {
      setAiOpen(true);
      Animated.spring(panelH, {
        toValue: target,
        useNativeDriver: false,
        damping: 22,
        stiffness: 220,
        mass: 0.8,
      }).start();
    }
  }

  function handleAiHeaderPress() {
    snapTo(aiOpen ? PANEL_CLOSED : PANEL_OPEN);
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, { dy }) => Math.abs(dy) > 5,
      onPanResponderGrant: () => {
        panelH.stopAnimation(v => { dragStartPanelH.current = v; });
      },
      onPanResponderMove: (_, { dy }) => {
        panelH.setValue(Math.max(PANEL_CLOSED, Math.min(maxPanelH.current, dragStartPanelH.current - dy)));
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        const max = maxPanelH.current;
        const cur = Math.max(PANEL_CLOSED, Math.min(max, dragStartPanelH.current - dy));
        const SNAPS = [PANEL_CLOSED, PANEL_OPEN, max];
        let target: number;
        if (vy < -0.5) target = SNAPS.find(p => p > cur + 10) ?? max;
        else if (vy > 0.5) target = [...SNAPS].reverse().find(p => p < cur - 10) ?? PANEL_CLOSED;
        else target = SNAPS.reduce((a, b) => Math.abs(b - cur) < Math.abs(a - cur) ? b : a);
        snapTo(target);
      },
    })
  ).current;
  const [highlightedSource, setHighlightedSource] = useState<number | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const sourcesY = useRef(0);
  const sourceRowYs = useRef<Map<number, number>>(new Map());

  // Auto-clear highlight after 2.5 s
  useEffect(() => {
    if (highlightedSource === null) return;
    const t = setTimeout(() => setHighlightedSource(null), 2500);
    return () => clearTimeout(t);
  }, [highlightedSource]);

  // Scroll to the specific source row when a ref is tapped
  useEffect(() => {
    if (highlightedSource === null) return;
    const t = setTimeout(() => {
      const rowY = sourceRowYs.current.get(highlightedSource) ?? 0;
      scrollRef.current?.scrollTo({ y: sourcesY.current + rowY - 16, animated: true });
    }, 100);
    return () => clearTimeout(t);
  }, [highlightedSource]);

  if (!book || !content) return null;

  const accentMuted = book.accentColor + '1F';
  const filterNum = parseInt(filter, 10);
  const isFiltering = !isNaN(filterNum) && filter.trim() !== '';

  function bulletMatches(bullet: BulletPoint) {
    if (!isFiltering) return true;
    if (searchMode === 'seite') return bullet.pages?.includes(filterNum) ?? false;
    return bullet.chapters?.includes(filterNum) ?? false;
  }

  async function sendMessage() {
    if (!aiInput.trim() || isLoading) return;
    const userText = aiInput.trim();
    setAiInput('');
    setIsLoading(true);

    const updatedHistory = [...chatHistory, { role: 'user' as const, text: userText }];
    setChatHistory(updatedHistory);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: userText,
          history: chatHistory,
          bookTitle: book!.title,
          seriesTitle: book!.seriesTitle,
        },
      });
      if (error) {
        let detail = error.message;
        try {
          const body = await (error as any).context?.json();
          detail = body?.error ?? error.message;
        } catch {}
        throw new Error(detail);
      }
      if (!data?.text) {
        console.error('Unexpected response:', JSON.stringify(data));
        throw new Error('No text in response');
      }
      setChatHistory([...updatedHistory, { role: 'model', text: data.text }]);
    } catch (err: any) {
      console.error('AI chat error:', err?.message ?? err);
      const errMsg = err?.message ?? '';
      const displayText = errMsg.startsWith('Fehler:')
        ? errMsg
        : errMsg || 'Der KI-Assistent ist momentan nicht verfügbar. Bitte versuche es später erneut.';
      setChatHistory([...updatedHistory, { role: 'model', text: displayText, isError: true }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleRefPress(refId: number) {
    if (isFiltering) setFilter('');
    setHighlightedSource(refId);
  }

  function renderBulletText(text: string) {
    const parts = text.split(/(\[\d+\])/);
    const tokens: Array<{ content: string; refId?: number }> = [];

    parts.forEach(part => {
      const refMatch = part.match(/^\[(\d+)\]$/);
      if (refMatch) {
        tokens.push({ content: part, refId: parseInt(refMatch[1]) });
      } else {
        // split into word-level tokens (including surrounding whitespace) so
        // references flow truly inline instead of being pushed to a new row
        (part.match(/\s*\S+\s*/g) ?? []).forEach(word => tokens.push({ content: word }));
      }
    });

    return (
      <View style={styles.bulletTextRow}>
        {tokens.map((token, i) =>
          token.refId !== undefined ? (
            <Text
              key={i}
              style={[styles.bulletText, styles.refLink, { color: book!.accentColor }]}
              onPress={() => handleRefPress(token.refId!)}
            >
              {token.content}
            </Text>
          ) : (
            <Text key={i} style={styles.bulletText}>{token.content}</Text>
          )
        )}
      </View>
    );
  }

  const filteredKeyPoints = content.keyPoints.filter(bulletMatches);
  const filteredSections = content.sections
    .map((s) => ({ ...s, bullets: s.bullets.filter(bulletMatches) }))
    .filter((s) => s.bullets.length > 0);

  const hasResults = filteredKeyPoints.length > 0 || filteredSections.length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.root} edges={['top']}>
        {/* ── HEADER ── */}
        <View style={[styles.header, { backgroundColor: accentMuted }]}>
          <BookPattern type={book.pattern} color={book.accentColor} />

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="arrow-back" size="lg" color={Colors.colorDark} />
            <Text style={styles.backLabel}>Zurück</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.seriesLabel} numberOfLines={1} adjustsFontSizeToFit>{book.seriesTitle}</Text>
              <Text style={styles.bookTitle} numberOfLines={1} adjustsFontSizeToFit>{book.title}</Text>
            </View>
            <Image
              source={book.cover}
              style={styles.handImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* ── TOOLBAR ── */}
        <View style={styles.toolbar}>
          <View style={[styles.searchToggle, { backgroundColor: accentMuted }]}>
            {(['seite', 'kapitel'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.togglePill, searchMode === mode && styles.togglePillActive]}
                onPress={() => { setSearchMode(mode); setFilter(''); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleLabel, { color: searchMode === mode ? book.accentColor : Colors.colorDark }]}>
                  {mode === 'seite' ? 'Seite' : 'Kapitel'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.searchContainer, { borderColor: searchFocused ? book.accentColor : 'transparent' }]}>
            <Icon name="explore" size="md" color={Colors.grey500} />
            <TextInput
              style={styles.searchInput}
              placeholder={searchMode === 'seite' ? 'z.B. 1' : 'z.B. 2'}
              placeholderTextColor={Colors.grey500}
              keyboardType="number-pad"
              value={filter}
              onChangeText={setFilter}
              returnKeyType="done"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {filter.length > 0 && (
              <TouchableOpacity onPress={() => setFilter('')}>
                <Icon name="close" size="sm" color={Colors.grey500} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.ttsButton} onPress={() => setSoundOn((s) => !s)}>
            <Icon name={soundOn ? 'mute' : 'sound'} size={40} color={book.accentColor} />
          </TouchableOpacity>
        </View>

        {/* ── CONTENT AREA (measured so AI panel never overflows) ── */}
        <View
          style={styles.flex}
          onLayout={(e) => { maxPanelH.current = e.nativeEvent.layout.height; }}
        >
        {/* ── SCROLLABLE CONTENT ── */}
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {!hasResults && isFiltering && (
            <Text style={styles.noResults}>
              {searchMode === 'seite' ? 'Keine Einträge für diese Seite.' : 'Keine Einträge für dieses Kapitel.'}
            </Text>
          )}

          {/* WICHTIGE PUNKTE */}
          {filteredKeyPoints.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>TOP FÜNF FAKTEN</Text>
              {filteredKeyPoints.map((point, i) => (
                <View key={i} style={styles.numberedRow}>
                  <View style={[styles.numberCircle, { borderColor: book.accentColor }]}>
                    <Text style={[styles.numberText, { color: book.accentColor }]}>{i + 1}</Text>
                  </View>
                  {renderBulletText(point.text)}
                </View>
              ))}
            </View>
          )}

          {/* SECTIONS */}
          {filteredSections.map((sec, si) => (
            <View key={si} style={styles.section}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              {sec.bullets.map((bullet, bi) => (
                <View key={bi} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  {renderBulletText(bullet.text)}
                </View>
              ))}
            </View>
          ))}

          {/* SOURCES — only when not filtering */}
          {!isFiltering && (
            <View
              style={[styles.section, styles.sourcesSection]}
              onLayout={(e) => { sourcesY.current = e.nativeEvent.layout.y; }}
            >
              <Text style={styles.sectionTitle}>QUELLEN</Text>
              {content.sources.map((source) => (
                <View
                  key={source.id}
                  style={[
                    styles.sourceRow,
                    highlightedSource === source.id && { backgroundColor: accentMuted, borderRadius: 8, padding: 8, marginHorizontal: -8 },
                  ]}
                  onLayout={(e) => { sourceRowYs.current.set(source.id, e.nativeEvent.layout.y); }}
                >
                  <Text style={[styles.sourceRef, { color: book.accentColor }]}>[{source.id}]</Text>
                  <SourceText text={source.text} accentColor={book.accentColor} />
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 320 }} />
        </ScrollView>

        {/* ── KI-ASSISTENT (fixed bottom) — hidden while search keyboard is open ── */}
        {!searchFocused && (
          <Animated.View style={[styles.aiContainer, { height: panelH, backgroundColor: accentMuted, borderTopColor: book.accentColor }]}>
            <View {...(aiOpen ? panResponder.panHandlers : {})}>
              {aiOpen && (
                <View style={styles.aiDragHandleRow}>
                  <View style={[styles.aiDragHandleBar, { backgroundColor: book.accentColor }]} />
                </View>
              )}
              <TouchableOpacity
                style={styles.aiHeader}
                onPress={handleAiHeaderPress}
                activeOpacity={0.8}
              >
                <View style={styles.aiTitleRow}>
                  <Icon name="ai" size="lg" color={Colors.colorDark} />
                  <View style={styles.flex}>
                    <Text style={styles.aiTitle}>KI-ASSISTENT</Text>
                    <Text style={styles.aiSubtitle}>Powered by Google Gemini 2.5 Flash · Nachrichten werden zur Verarbeitung an Google übermittelt.</Text>
                  </View>
                </View>
                <Icon
                  name={aiOpen ? 'dropdown-opened' : 'dropdown-closed'}
                  size="md"
                  color={Colors.colorDark}
                />
              </TouchableOpacity>
            </View>

            {aiOpen && (
              <ScrollView
                ref={chatScrollRef}
                style={styles.chatMessages}
                onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
                keyboardShouldPersistTaps="handled"
              >
                {chatHistory.map((msg, i) => (
                  <View
                    key={i}
                    style={[
                      styles.messageBubble,
                      msg.role === 'user'
                        ? [styles.userBubble, { backgroundColor: book.accentColor }]
                        : msg.isError
                        ? styles.errorBubble
                        : styles.modelBubble,
                    ]}
                  >
                    <Text style={msg.role === 'user' ? styles.userText : styles.modelText}>
                      {msg.text}
                    </Text>
                  </View>
                ))}
                {isLoading && (
                  <View style={[styles.modelBubble, { backgroundColor: 'transparent' }]}>
                    <Text style={styles.modelText}>…</Text>
                  </View>
                )}
              </ScrollView>
            )}

            {aiOpen && (
              <View style={styles.aiInputRow}>
                <TextInput
                  style={[styles.aiInput, { borderColor: aiFocused ? book.accentColor : 'transparent' }]}
                  placeholder="Stelle eine Frage…"
                  placeholderTextColor={Colors.grey500}
                  value={aiInput}
                  onChangeText={setAiInput}
                  onFocus={() => setAiFocused(true)}
                  onBlur={() => setAiFocused(false)}
                  onSubmitEditing={sendMessage}
                  returnKeyType="send"
                  multiline
                />
                <TouchableOpacity
                  style={[styles.sendButton, { backgroundColor: book.accentColor }, isLoading && styles.sendButtonDisabled]}
                  onPress={sendMessage}
                  disabled={isLoading}
                >
                  <Icon name="send" size="md" color={Colors.white} />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // Header
  header: {
    overflow: 'hidden',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 4,
    gap: 6,
  },
  backLabel: {
    fontSize: 16,
    color: Colors.colorDark,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 24,
    gap: 8,
  },
  headerText: {
    flex: 1,
    gap: 4,
    paddingBottom: 20,
  },
  seriesLabel: {
    fontFamily: Fonts.serif,
    fontSize: 12,
    color: Colors.grey500,
    letterSpacing: 1,
  },
  bookTitle: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    lineHeight: 32,
    color: Colors.colorDark,
  },
  handImage: {
    width: 180,
    height: 180,
    marginTop: -40,
  },

  // Toolbar
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey200,
  },
  searchToggle: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  togglePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  togglePillActive: {
    backgroundColor: Colors.white,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey200,
    borderRadius: 24,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.colorDark,
    padding: 0,
  },
  ttsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
    gap: 12,
  },
  sourcesSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.grey200,
    paddingTop: 32,
  },
  sectionTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    letterSpacing: 1.5,
    color: Colors.colorDark,
    marginTop: 20,
    marginBottom: 4,
  },
  numberedRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  numberText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    flexShrink: 0,
    backgroundColor: Colors.colorDark,
  },
  bulletTextRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bulletText: {
    fontSize: 15,
    color: Colors.colorDark,
    lineHeight: 22,
  },
  refLink: {
    fontWeight: '700',
  },
  sourceRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  sourceRef: {
    fontSize: 13,
    fontWeight: '700',
    flexShrink: 0,
    marginTop: 2,
  },
  noResults: {
    fontSize: 15,
    color: Colors.grey500,
    textAlign: 'center',
    marginTop: 40,
  },

  // KI-Assistent
  aiContainer: {
    borderTopWidth: 2,
    overflow: 'hidden',
  },
  aiDragHandleRow: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  aiDragHandleBar: {
    width: 32,
    height: 4,
    borderRadius: 2,
    opacity: 0.4,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 12,
  },
  aiTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    letterSpacing: 1.5,
    color: Colors.colorDark,
  },
  aiSubtitle: {
    fontSize: 11,
    color: Colors.grey500,
    lineHeight: 15,
    marginTop: 2,
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: 24,
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 6,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  modelBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.colorLight,
    borderBottomLeftRadius: 4,
  },
  errorBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.warning,
    borderBottomLeftRadius: 4,
  },
  userText: {
    fontSize: 14,
    color: Colors.white,
    lineHeight: 20,
  },
  modelText: {
    fontSize: 14,
    color: Colors.colorDark,
    lineHeight: 20,
  },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  aiInput: {
    flex: 1,
    backgroundColor: Colors.colorLight,
    borderRadius: 24,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.colorDark,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
