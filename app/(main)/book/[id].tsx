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
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = BOOKS.find((b) => b.id === Number(id));
  const content = getBookContent(Number(id));

  const [filter, setFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiFocused, setAiFocused] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string; isError?: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatScrollRef = useRef<ScrollView>(null);
  const [highlightedSource, setHighlightedSource] = useState<number | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const sourcesY = useRef(0);

  // Auto-clear highlight after 2.5 s
  useEffect(() => {
    if (highlightedSource === null) return;
    const t = setTimeout(() => setHighlightedSource(null), 2500);
    return () => clearTimeout(t);
  }, [highlightedSource]);

  // Scroll to sources when a ref is tapped (100 ms delay lets filter clear + re-render first)
  useEffect(() => {
    if (highlightedSource === null) return;
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: sourcesY.current - 16, animated: true });
    }, 100);
    return () => clearTimeout(t);
  }, [highlightedSource]);

  if (!book || !content) return null;

  const accentMuted = book.accentColor + '1F';
  const filterNum = parseInt(filter, 10);
  const isFiltering = !isNaN(filterNum) && filter.trim() !== '';

  function bulletMatches(bullet: BulletPoint) {
    if (!isFiltering) return true;
    return (
      (bullet.pages?.includes(filterNum) ?? false) ||
      (bullet.chapters?.includes(filterNum) ?? false)
    );
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
    return (
      <Text style={styles.bulletText}>
        {parts.map((part, i) => {
          const match = part.match(/^\[(\d+)\]$/);
          if (match) {
            const refId = parseInt(match[1], 10);
            return (
              <Text
                key={i}
                style={[styles.refLink, { color: book!.accentColor }]}
                onPress={() => handleRefPress(refId)}
              >
                {part}
              </Text>
            );
          }
          return part;
        })}
      </Text>
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
          <View style={[styles.searchContainer, { borderColor: searchFocused ? book.accentColor : 'transparent' }]}>
            <Icon name="explore" size="sm" color={Colors.grey500} />
            <TextInput
              style={styles.searchInput}
              placeholder="Seite oder Kapitel eingeben…"
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

        {/* ── SCROLLABLE CONTENT ── */}
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {!hasResults && isFiltering && (
            <Text style={styles.noResults}>Keine Einträge für diese Seite / dieses Kapitel.</Text>
          )}

          {/* WICHTIGE PUNKTE */}
          {filteredKeyPoints.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>WICHTIGE PUNKTE</Text>
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
              style={styles.section}
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
                >
                  <Text style={[styles.sourceRef, { color: book.accentColor }]}>[{source.id}]</Text>
                  <Text style={styles.sourceText}>{source.text}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: aiOpen ? 200 : 80 }} />
        </ScrollView>

        {/* ── KI-ASSISTENT (fixed bottom) — hidden while search keyboard is open ── */}
        {!searchFocused && <View style={[styles.aiContainer, { backgroundColor: accentMuted, borderTopColor: book.accentColor }]}>
          <TouchableOpacity
            style={styles.aiHeader}
            onPress={() => setAiOpen((o) => !o)}
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

          {aiOpen && (
            <View style={styles.aiBody}>
              {chatHistory.length > 0 && (
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
                    <View style={styles.modelBubble}>
                      <Text style={styles.modelText}>…</Text>
                    </View>
                  )}
                </ScrollView>
              )}
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
            </View>
          )}
        </View>}
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
    paddingBottom: 8,
    overflow: 'hidden',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
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
    paddingBottom: 8,
  },
  seriesLabel: {
    fontFamily: Fonts.serif,
    fontSize: 12,
    color: Colors.grey500,
    letterSpacing: 1,
  },
  bookTitle: {
    fontFamily: Fonts.serif,
    fontSize: 36,
    lineHeight: 40,
    color: Colors.colorDark,
  },
  handImage: {
    width: 130,
    height: 130,
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
  sectionTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    letterSpacing: 1.5,
    color: Colors.colorDark,
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
  bulletText: {
    flex: 1,
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
  sourceText: {
    flex: 1,
    fontSize: 13,
    color: Colors.grey500,
    lineHeight: 18,
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
  aiBody: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 10,
  },
  chatMessages: {
    maxHeight: 200,
    marginBottom: 4,
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
    backgroundColor: Colors.grey200,
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
  },
  aiInput: {
    flex: 1,
    backgroundColor: Colors.grey200,
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
