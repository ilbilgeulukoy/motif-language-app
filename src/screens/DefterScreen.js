import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView
} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import { useWordbook } from '../context/WordbookContext';

const LANGS = {
  tr: { flag: '🇹🇷', label: 'TR' },
  fr: { flag: '🇫🇷', label: 'FR' },
  de: { flag: '🇩🇪', label: 'DE' },
  es: { flag: '🇪🇸', label: 'ES' },
  it: { flag: '🇮🇹', label: 'IT' },
  en: { flag: '🇬🇧', label: 'EN' },
};

export default function DefterScreen() {
  const { words, removeWord } = useWordbook();
  const [search, setSearch] = useState('');

  const filtered = words.filter(w =>
    w.source.toLowerCase().includes(search.toLowerCase()) ||
    w.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Defter<Text style={styles.dot}>.</Text></Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{words.length} kelime</Text>
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Kelime ara..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Text style={styles.clearBtn}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Empty state */}
          {words.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📖</Text>
              <Text style={styles.emptyTitle}>Defterin boş</Text>
              <Text style={styles.emptySub}>Sözlük'ten kelime arayıp{'\n'}deftere ekleyebilirsin.</Text>
            </View>
          )}

          {/* Word list */}
          {filtered.length > 0 && (
            <View style={styles.listCard}>
              {filtered.map((word, i) => {
                const src = LANGS[word.sourceLang];
                const tgt = LANGS[word.targetLang];
                return (
                  <View key={word.id} style={[styles.wordRow, i === filtered.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={styles.wordLeft}>
                      <View style={styles.wordTopRow}>
                        <Text style={styles.wordMain}>{word.source}</Text>
                        <Text style={styles.langPair}>
                          {src?.flag}{src?.label} → {tgt?.flag}{tgt?.label}
                        </Text>
                      </View>
                      <Text style={styles.wordTarget}>{word.target}</Text>
                      {word.alternatives?.length > 0 && (
                        <Text style={styles.wordAlts}>{word.alternatives.join(', ')}</Text>
                      )}
                    </View>
                    <TouchableOpacity onPress={() => removeWord(word.id)} style={styles.deleteBtn}>
                      <Text style={styles.deleteIcon}>✕</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {search.length > 0 && filtered.length === 0 && (
            <Text style={styles.noResult}>"{search}" için sonuç yok</Text>
          )}

        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 8, paddingBottom: 16 },
  headerTitle: { fontSize: 34, fontWeight: '300', color: 'rgba(255,255,255,0.95)', letterSpacing: -0.5 },
  dot: { color: 'rgba(255,255,255,0.3)' },
  countBadge: { paddingVertical: 5, paddingHorizontal: 14, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  countText: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },

  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginBottom: 16,
    paddingHorizontal: 16, paddingVertical: 13,
    backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 15, color: 'rgba(255,255,255,0.9)' },
  clearBtn: { fontSize: 14, color: 'rgba(255,255,255,0.4)', padding: 4 },

  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 20, fontWeight: '400', color: 'rgba(255,255,255,0.7)' },
  emptySub: { fontSize: 14, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 22 },

  listCard: {
    marginHorizontal: 16, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 18,
  },
  wordRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  wordLeft: { flex: 1 },
  wordTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  wordMain: { fontSize: 16, fontWeight: '500', color: 'rgba(255,255,255,0.9)' },
  langPair: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  wordTarget: { fontSize: 14, color: 'rgba(255,255,255,0.55)', fontWeight: '400' },
  wordAlts: { fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 2 },
  deleteBtn: { padding: 8 },
  deleteIcon: { fontSize: 14, color: 'rgba(255,255,255,0.25)' },

  noResult: { textAlign: 'center', color: 'rgba(255,255,255,0.3)', paddingTop: 20, fontSize: 14 },
});
