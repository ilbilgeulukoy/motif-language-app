import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import { useWordbook } from '../context/WordbookContext';

const LANGS = [
  { code: 'tr', label: 'Türkçe', flag: require('../../assets/icons/tr.png') },
  { code: 'fr', label: 'Français', flag: require('../../assets/icons/mf.png') },
  { code: 'de', label: 'Deutsch', flag: require('../../assets/icons/de.png') },
  { code: 'es', label: 'Español', flag: require('../../assets/icons/es.png') },
  { code: 'it', label: 'Italiano', flag: require('../../assets/icons/it.png') },
  { code: 'en', label: 'English', flag: require('../../assets/icons/gb.png') },
];

async function translateWithClaude(word, sourceLang, targetLang) {
  // 1. ÇEVİRİ — MyMemory
  let translation = '';
  let alternatives = [];
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${sourceLang}|${targetLang}`
    );
    const data = await res.json();
    console.log('MYMEMORY:', JSON.stringify(data));
    
    translation = data.responseData?.translatedText || '';
    // URL encoding düzelt
    try { translation = decodeURIComponent(translation); } catch {}
    // MATCHES_LIMIT hatası varsa temizle
    if (translation.includes('MYMEMORY WARNING') || translation.includes('%')) {
      translation = word;
    }

    alternatives = data.matches
      ?.filter(m => m.segment === word && m.translation && m.translation !== translation)
      ?.slice(0, 3)
      ?.map(m => { try { return decodeURIComponent(m.translation); } catch { return m.translation; } })
      ?.filter(Boolean) || [];

  } catch (e) { console.log('MyMemory error:', e); }

  // 2. KELIME TÜRÜ — Wiktionary
  let partOfSpeech = '';
  try {
    const wikiRes = await fetch(
      `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`
    );
    const wikiData = await wikiRes.json();
    const langData = wikiData['tr'] || wikiData['en'] || wikiData['fr'] || [];
    if (langData.length > 0) {
      const pos = langData[0]?.partOfSpeech || '';
      const posMap = {
        'Verb': 'fiil', 'Noun': 'isim', 'Adjective': 'sıfat',
        'Adverb': 'zarf', 'Pronoun': 'zamir', 'Preposition': 'edat',
        'Conjunction': 'bağlaç', 'Interjection': 'ünlem',
      };
      partOfSpeech = posMap[pos] || pos.toLowerCase();
    }
  } catch (e) { console.log('Wiktionary error:', e); }

  // 3. ÖRNEK CÜMLELER — MyMemory'den uzun olanlar
  let examples = [];
  try {
    const memRes = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=${sourceLang}|${targetLang}`
    );
    const memData = await memRes.json();
    examples = memData.matches
      ?.filter(m => m.segment?.includes(' ') && m.translation && m.segment.length > 5)
      ?.slice(0, 2)
      ?.map(m => ({
        source: m.segment,
        target: (() => { try { return decodeURIComponent(m.translation); } catch { return m.translation; } })()
      })) || [];
  } catch (e) { console.log('Examples error:', e); }

  return { translation, alternatives, partOfSpeech, examples };
}

export default function SozlukScreen() {
  const [query, setQuery] = useState('');
  const [sourceLang, setSourceLang] = useState('tr');
  const [targetLang, setTargetLang] = useState('fr');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const { addWord } = useWordbook();

  function swapLangs() {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setResult(null);
    setSaved(false);
  }

async function handleSearch() {
  if (!query.trim()) return;
  setLoading(true);
  setError('');
  setResult(null);
  setSaved(false);
  try {
    const res = await translateWithClaude(query.trim(), sourceLang, targetLang);
    console.log('API RESPONSE:', JSON.stringify(res));
    setResult(res);
  } catch (e) {
    console.log('API ERROR:', e.message);
    setError('Bağlantı hatası: ' + e.message);
  } finally {
    setLoading(false);
  }
}

  function handleSave() {
    if (!result) return;
    addWord({
      sourceLang,
      targetLang,
      source: query.trim(),
      target: result.translation,
      alternatives: result.alternatives || [],
      partOfSpeech: result.partOfSpeech || '',
      examples: result.examples || [],
    });
    setSaved(true);
  }

  const srcLang = LANGS.find(l => l.code === sourceLang);
  const tgtLang = LANGS.find(l => l.code === targetLang);

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Sözlük<Text style={styles.dot}>.</Text></Text>
            </View>

            {/* Lang selector — kaynak dil */}
            <View style={styles.langRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langScroll}>
                {LANGS.map(l => (
                  <TouchableOpacity
                    key={l.code}
                    style={[styles.langBtn, sourceLang === l.code && styles.langBtnActive]}
                    onPress={() => { setSourceLang(l.code); setResult(null); setSaved(false); }}
                  >
                    <Image source={l.flag} style={styles.flagImg} resizeMode="contain" />
                    <Text style={[styles.langLabel, sourceLang === l.code && styles.langLabelActive]}>{l.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Swap + hedef dil */}
            <View style={styles.swapRow}>
              <View style={styles.swapFrom}>
                <Image source={srcLang?.flag} style={styles.flagImgSm} resizeMode="contain" />
                <Text style={styles.swapFromText}>{srcLang?.label}</Text>
              </View>
              <TouchableOpacity style={styles.swapBtn} onPress={swapLangs}>
                <Text style={styles.swapIcon}>⇄</Text>
              </TouchableOpacity>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.targetScroll} contentContainerStyle={styles.targetScrollContent}>
                {LANGS.filter(l => l.code !== sourceLang).map(l => (
                  <TouchableOpacity
                    key={l.code}
                    style={[styles.targetBtn, targetLang === l.code && styles.targetBtnActive]}
                    onPress={() => { setTargetLang(l.code); setResult(null); setSaved(false); }}
                  >
                    <Image source={l.flag} style={styles.flagImgSm} resizeMode="contain" />
                    <Text style={[styles.langLabel, targetLang === l.code && styles.langLabelActive]}>{l.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Search input */}
            <View style={styles.searchBox}>
              <TextInput
                style={styles.searchInput}
                placeholder={`${srcLang?.label} kelime yaz...`}
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={query}
                onChangeText={t => { setQuery(t); setResult(null); setSaved(false); }}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => { setQuery(''); setResult(null); }}>
                  <Text style={styles.clearBtn}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.searchActionBtn} onPress={handleSearch} disabled={loading || !query.trim()}>
              {loading
                ? <ActivityIndicator color="rgba(255,255,255,0.8)" />
                : <Text style={styles.searchActionText}>Çevir</Text>
              }
            </TouchableOpacity>

            {/* Error */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Result */}
            {result && (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={styles.resultWord}>{result.translation}</Text>
                    {result.partOfSpeech ? (
                      <Text style={styles.resultPos}>{result.partOfSpeech.toUpperCase()}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    style={[styles.saveBtn, saved && styles.saveBtnSaved]}
                    onPress={handleSave}
                    disabled={saved}
                  >
                    <Text style={styles.saveBtnText}>{saved ? '✓ Kaydedildi' : '+ Deftere Ekle'}</Text>
                  </TouchableOpacity>
                </View>

                {result.alternatives?.length > 0 && (
                  <View style={styles.altRow}>
                    {result.alternatives.map((a, i) => (
                      <View key={i} style={styles.altPill}>
                        <Text style={styles.altText}>{a}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {result.examples?.length > 0 && (
                  <View style={styles.examplesSection}>
                    <Text style={styles.examplesTitle}>ÖRNEK CÜMLELER</Text>
                    {result.examples.map((ex, i) => (
                      <View key={i} style={styles.exampleItem}>
                        <Text style={styles.exampleSource}>{ex.source}</Text>
                        <Text style={styles.exampleTarget}>{ex.target}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 40 },

  header: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 12 },
  headerTitle: { fontSize: 34, fontWeight: '300', color: 'rgba(255,255,255,0.95)', letterSpacing: -0.5 },
  dot: { color: 'rgba(255,255,255,0.3)' },

  flagImg: { width: 28, height: 28 },
  flagImgSm: { width: 22, height: 22 },

  langRow: { marginBottom: 10 },
  langScroll: { flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  langBtnActive: { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.35)' },
  langLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.4)' },
  langLabelActive: { color: 'rgba(255,255,255,0.95)' },

  swapRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 14, gap: 10 },
  swapFrom: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swapFromText: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  swapBtn: {
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  swapIcon: { fontSize: 16, color: 'rgba(255,255,255,0.7)' },
  targetScroll: { flex: 1 },
  targetScrollContent: { flexDirection: 'row', gap: 8 },
  targetBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  targetBtnActive: { backgroundColor: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.3)' },

  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginBottom: 10,
    paddingHorizontal: 18, paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  searchInput: { flex: 1, fontSize: 17, color: 'rgba(255,255,255,0.95)', fontWeight: '400' },
  clearBtn: { fontSize: 14, color: 'rgba(255,255,255,0.4)', padding: 4 },

  searchActionBtn: {
    marginHorizontal: 16, marginBottom: 16,
    paddingVertical: 15, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  searchActionText: { fontSize: 15, fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: 0.5 },

  errorText: { textAlign: 'center', color: 'rgba(255,100,100,0.8)', marginHorizontal: 16, marginBottom: 12, fontSize: 13 },

  resultCard: {
    marginHorizontal: 16, padding: 20, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  resultHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 },
  resultWord: { fontSize: 32, fontWeight: '300', color: 'rgba(255,255,255,0.95)', letterSpacing: -0.5 },
  resultPos: { fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: 1.5 },

  saveBtn: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  saveBtnSaved: { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.4)' },
  saveBtnText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.8)' },

  altRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  altPill: {
    paddingVertical: 5, paddingHorizontal: 12, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  altText: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },

  examplesSection: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', paddingTop: 14 },
  examplesTitle: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.25)', letterSpacing: 2, marginBottom: 12 },
  exampleItem: { marginBottom: 12 },
  exampleSource: { fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: '500', marginBottom: 3 },
  exampleTarget: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' },
});