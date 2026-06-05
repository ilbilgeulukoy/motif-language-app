import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator
} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import { useWordbook } from '../context/WordbookContext';

const LANGS = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

// Statik içerik — dile göre
const CONTENT = {
  fr: {
    wordOfDay: { word: 'épanouir', translation: 'gelişmek, açılmak', pos: 'fiil', example: 'Elle s\'épanouit dans son travail.' },
    idioms: [
      { phrase: 'Avoir le cafard', meaning: 'Canı sıkkın olmak', literal: 'Hamamböceği olmak' },
      { phrase: 'Casser les pieds', meaning: 'Sinir bozmak', literal: 'Ayakları kırmak' },
      { phrase: 'Avoir le coup de foudre', meaning: 'Aşka düşmek', literal: 'Yıldırım çarpmak' },
      { phrase: 'Poser un lapin', meaning: 'Randevuya gelmemek', literal: 'Tavşan koymak' },
      { phrase: 'Il pleut des cordes', meaning: 'Bardaktan boşanırcasına yağmak', literal: 'İp yağıyor' },
    ],
    essential: [
      { source: 'Excusez-moi, où est la gare ?', target: 'Affedersiniz, istasyon nerede?' },
      { source: 'Combien ça coûte ?', target: 'Bu ne kadar?' },
      { source: 'Je ne comprends pas.', target: 'Anlamıyorum.' },
      { source: 'Pouvez-vous répéter ?', target: 'Tekrar edebilir misiniz?' },
      { source: 'Je voudrais un café, s\'il vous plaît.', target: 'Bir kahve istiyorum, lütfen.' },
      { source: 'Où sont les toilettes ?', target: 'Tuvalet nerede?' },
      { source: 'À quelle heure ouvre... ?', target: 'Saat kaçta açılıyor?' },
      { source: 'Je suis allergique à...', target: '...e alerjim var.' },
      { source: 'Appelez une ambulance !', target: 'Ambulans çağırın!' },
      { source: 'Enchant(é/e) de vous rencontrer.', target: 'Tanıştığımıza memnun oldum.' },
    ],
  },
  de: {
    wordOfDay: { word: 'verschmutzen', translation: 'kirletmek', pos: 'fiil', example: 'Man soll die Natur nicht verschmutzen.' },
    idioms: [
      { phrase: 'Daumen drücken', meaning: 'Parmak basmak (şans dilemek)', literal: 'Başparmak sıkmak' },
      { phrase: 'Ins Gras beißen', meaning: 'Ölmek', literal: 'Çimeni ısırmak' },
      { phrase: 'Einen Kater haben', meaning: 'Akşamdan kalma olmak', literal: 'Erkek kedisi olmak' },
      { phrase: 'Auf den Hund kommen', meaning: 'Çöküşe geçmek', literal: 'Köpeğe gelmek' },
      { phrase: 'Tomaten auf den Augen haben', meaning: 'Görmemezlikten gelmek', literal: 'Gözlerde domates olmak' },
    ],
    essential: [
      { source: 'Entschuldigung, wo ist der Bahnhof?', target: 'Affedersiniz, istasyon nerede?' },
      { source: 'Was kostet das?', target: 'Bu ne kadar?' },
      { source: 'Ich verstehe nicht.', target: 'Anlamıyorum.' },
      { source: 'Können Sie das wiederholen?', target: 'Tekrar edebilir misiniz?' },
      { source: 'Einen Kaffee bitte.', target: 'Bir kahve lütfen.' },
      { source: 'Wo ist die Toilette?', target: 'Tuvalet nerede?' },
      { source: 'Ich bin allergisch gegen...', target: '...e alerjim var.' },
      { source: 'Rufen Sie einen Krankenwagen!', target: 'Ambulans çağırın!' },
      { source: 'Schön, Sie kennenzulernen.', target: 'Tanıştığımıza memnun oldum.' },
      { source: 'Wie viel Uhr ist es?', target: 'Saat kaç?' },
    ],
  },
  es: {
    wordOfDay: { word: 'madrugada', translation: 'gece yarısından sonra erken saatler', pos: 'isim', example: 'Llegué a casa de madrugada.' },
    idioms: [
      { phrase: 'No hay mal que por bien no venga', meaning: 'Her şerde bir hayır vardır', literal: 'İyilik getirmeyen kötülük yoktur' },
      { phrase: 'Estar en las nubes', meaning: 'Dalgın olmak', literal: 'Bulutlarda olmak' },
      { phrase: 'Costar un ojo de la cara', meaning: 'Çok pahalı olmak', literal: 'Yüzün gözüne mal olmak' },
      { phrase: 'Ser pan comido', meaning: 'Çok kolay olmak', literal: 'Yenmiş ekmek olmak' },
      { phrase: 'Meter la pata', meaning: 'Pot kırmak', literal: 'Pençeyi sokmak' },
    ],
    essential: [
      { source: '¿Dónde está la estación?', target: 'İstasyon nerede?' },
      { source: '¿Cuánto cuesta?', target: 'Ne kadar?' },
      { source: 'No entiendo.', target: 'Anlamıyorum.' },
      { source: '¿Puede repetir?', target: 'Tekrar edebilir misiniz?' },
      { source: 'Un café, por favor.', target: 'Bir kahve lütfen.' },
      { source: '¿Dónde están los baños?', target: 'Tuvalet nerede?' },
      { source: 'Soy alérgico a...', target: '...e alerjim var.' },
      { source: '¡Llame a una ambulancia!', target: 'Ambulans çağırın!' },
      { source: 'Mucho gusto.', target: 'Memnun oldum.' },
      { source: '¿Qué hora es?', target: 'Saat kaç?' },
    ],
  },
  it: {
    wordOfDay: { word: 'abbiocco', translation: 'yemek sonrası uyku hali', pos: 'isim', example: 'Dopo pranzo ho un abbiocco terribile.' },
    idioms: [
      { phrase: 'In bocca al lupo', meaning: 'İyi şanslar', literal: 'Kurdun ağzına' },
      { phrase: 'Avere le mani in pasta', meaning: 'Her işe karışmak', literal: 'Elleri hamurda olmak' },
      { phrase: 'Prendere due piccioni con una fava', meaning: 'Bir taşla iki kuş vurmak', literal: 'Bir baklayla iki güvercin almak' },
      { phrase: 'Non avere peli sulla lingua', meaning: 'Dobra dobra konuşmak', literal: 'Dilinde kıl olmamak' },
      { phrase: 'Avere il prugno in bocca', meaning: 'Ağdalı konuşmak', literal: 'Ağzında erik olmak' },
    ],
    essential: [
      { source: 'Dov\'è la stazione?', target: 'İstasyon nerede?' },
      { source: 'Quanto costa?', target: 'Ne kadar?' },
      { source: 'Non capisco.', target: 'Anlamıyorum.' },
      { source: 'Può ripetere?', target: 'Tekrar edebilir misiniz?' },
      { source: 'Un caffè, per favore.', target: 'Bir kahve lütfen.' },
      { source: 'Dov\'è il bagno?', target: 'Tuvalet nerede?' },
      { source: 'Sono allergico a...', target: '...e alerjim var.' },
      { source: 'Chiami un\'ambulanza!', target: 'Ambulans çağırın!' },
      { source: 'Piacere di conoscerti.', target: 'Tanıştığımıza memnun oldum.' },
      { source: 'Che ore sono?', target: 'Saat kaç?' },
    ],
  },
  en: {
    wordOfDay: { word: 'serendipity', translation: 'tesadüfen güzel şeyler bulmak', pos: 'isim', example: 'Finding this café was pure serendipity.' },
    idioms: [
      { phrase: 'Break a leg', meaning: 'İyi şanslar', literal: 'Bacağını kır' },
      { phrase: 'Bite the bullet', meaning: 'Dişini sıkıp katlanmak', literal: 'Kurşunu ısır' },
      { phrase: 'Hit the sack', meaning: 'Yatmak', literal: 'Çuvala vur' },
      { phrase: 'Under the weather', meaning: 'Keyifsiz olmak', literal: 'Havanın altında' },
      { phrase: 'Piece of cake', meaning: 'Çok kolay', literal: 'Kek parçası' },
    ],
    essential: [
      { source: 'Where is the station?', target: 'İstasyon nerede?' },
      { source: 'How much does it cost?', target: 'Ne kadar?' },
      { source: 'I don\'t understand.', target: 'Anlamıyorum.' },
      { source: 'Could you repeat that?', target: 'Tekrar edebilir misiniz?' },
      { source: 'A coffee, please.', target: 'Bir kahve lütfen.' },
      { source: 'Where is the bathroom?', target: 'Tuvalet nerede?' },
      { source: 'I\'m allergic to...', target: '...e alerjim var.' },
      { source: 'Call an ambulance!', target: 'Ambulans çağırın!' },
      { source: 'Nice to meet you.', target: 'Tanıştığımıza memnun oldum.' },
      { source: 'What time is it?', target: 'Saat kaç?' },
    ],
  },
};

export default function KesifScreen() {
  const [lang, setLang] = useState('fr');
  const [tab, setTab] = useState('word'); // word | essential | idioms
  const [savedWord, setSavedWord] = useState(false);
  const { addWord } = useWordbook();
  const content = CONTENT[lang];

  useEffect(() => { setSavedWord(false); }, [lang]);

  function saveWordOfDay() {
    addWord({
      sourceLang: lang,
      targetLang: 'tr',
      source: content.wordOfDay.word,
      target: content.wordOfDay.translation,
      alternatives: [],
      partOfSpeech: content.wordOfDay.pos,
      examples: [{ source: content.wordOfDay.example, target: '' }],
    });
    setSavedWord(true);
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Keşfet<Text style={styles.dot}>.</Text></Text>
          </View>

          {/* Dil seçici */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langScroll} style={{ marginBottom: 16 }}>
            {LANGS.map(l => (
              <TouchableOpacity
                key={l.code}
                style={[styles.langBtn, lang === l.code && styles.langBtnActive]}
                onPress={() => setLang(l.code)}
              >
                <Text style={styles.langFlag}>{l.flag}</Text>
                <Text style={[styles.langLabel, lang === l.code && styles.langLabelActive]}>{l.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Tab seçici */}
          <View style={styles.tabRow}>
            {[
              { key: 'word', label: '✨ Günün Kelimesi' },
              { key: 'essential', label: '💬 Önemli Cümleler' },
              { key: 'idioms', label: '🎭 İdiomlar' },
            ].map(t => (
              <TouchableOpacity
                key={t.key}
                style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
                onPress={() => setTab(t.key)}
              >
                <Text style={[styles.tabLabel, tab === t.key && styles.tabLabelActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* GÜNÜN KELİMESİ */}
          {tab === 'word' && (
            <View style={styles.wordCard}>
              <View style={styles.wordCardTop}>
                <Text style={styles.wordCardTag}>GÜNÜN KELİMESİ</Text>
                <Text style={styles.wordCardLang}>{LANGS.find(l => l.code === lang)?.flag}</Text>
              </View>
              <Text style={styles.wordCardWord}>{content.wordOfDay.word}</Text>
              <Text style={styles.wordCardPos}>{content.wordOfDay.pos}</Text>
              <Text style={styles.wordCardTranslation}>{content.wordOfDay.translation}</Text>
              <View style={styles.wordCardDivider} />
              <Text style={styles.wordCardExLabel}>ÖRNEK</Text>
              <Text style={styles.wordCardExample}>{content.wordOfDay.example}</Text>
              <TouchableOpacity
                style={[styles.saveWordBtn, savedWord && styles.saveWordBtnSaved]}
                onPress={saveWordOfDay}
                disabled={savedWord}
              >
                <Text style={styles.saveWordBtnText}>
                  {savedWord ? '✓ Deftere Eklendi' : '+ Deftere Ekle'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ÖNEMLİ CÜMLELER */}
          {tab === 'essential' && (
            <View style={styles.section}>
              <Text style={styles.sectionDesc}>
                {LANGS.find(l => l.code === lang)?.flag} Seyahat, günlük hayat ve acil durumlar için bilmen gereken cümleler.
              </Text>
              {content.essential.map((item, i) => (
                <View key={i} style={styles.sentenceCard}>
                  <Text style={styles.sentenceNum}>{String(i + 1).padStart(2, '0')}</Text>
                  <View style={styles.sentenceBody}>
                    <Text style={styles.sentenceSource}>{item.source}</Text>
                    <Text style={styles.sentenceTarget}>{item.target}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* İDİOMLAR */}
          {tab === 'idioms' && (
            <View style={styles.section}>
              <Text style={styles.sectionDesc}>
                {LANGS.find(l => l.code === lang)?.flag} Anadil konuşanların kullandığı deyimler.
              </Text>
              {content.idioms.map((item, i) => (
                <View key={i} style={styles.idiomCard}>
                  <Text style={styles.idiomPhrase}>"{item.phrase}"</Text>
                  <Text style={styles.idiomMeaning}>{item.meaning}</Text>
                  <Text style={styles.idiomLiteral}>Kelime anlamı: {item.literal}</Text>
                </View>
              ))}
            </View>
          )}

        </ScrollView>
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

  langScroll: { flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
  langBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  langBtnActive: { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.35)' },
  langFlag: { fontSize: 16 },
  langLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.4)' },
  langLabelActive: { color: 'rgba(255,255,255,0.95)' },

  tabRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 20, flexWrap: 'wrap' },
  tabBtn: {
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  tabBtnActive: { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.35)' },
  tabLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.4)' },
  tabLabelActive: { color: 'rgba(255,255,255,0.95)' },

  // Word of day
  wordCard: {
    marginHorizontal: 16, padding: 24, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  wordCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  wordCardTag: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.3)', letterSpacing: 2 },
  wordCardLang: { fontSize: 24 },
  wordCardWord: { fontSize: 42, fontWeight: '200', color: 'rgba(255,255,255,0.95)', letterSpacing: -1, marginBottom: 4 },
  wordCardPos: { fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 },
  wordCardTranslation: { fontSize: 20, fontWeight: '400', color: 'rgba(255,255,255,0.7)', marginBottom: 20 },
  wordCardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginBottom: 16 },
  wordCardExLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.25)', letterSpacing: 2, marginBottom: 8 },
  wordCardExample: { fontSize: 15, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', lineHeight: 22, marginBottom: 20 },
  saveWordBtn: {
    paddingVertical: 12, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
  },
  saveWordBtnSaved: { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.4)' },
  saveWordBtnText: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.8)' },

  // Section
  section: { paddingHorizontal: 16 },
  sectionDesc: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16, lineHeight: 20 },

  // Essential sentences
  sentenceCard: {
    flexDirection: 'row', gap: 14, alignItems: 'flex-start',
    padding: 16, borderRadius: 18, marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
  },
  sentenceNum: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.2)', paddingTop: 2, width: 24 },
  sentenceBody: { flex: 1 },
  sentenceSource: { fontSize: 15, fontWeight: '500', color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
  sentenceTarget: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' },

  // Idioms
  idiomCard: {
    padding: 18, borderRadius: 18, marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)',
  },
  idiomPhrase: { fontSize: 17, fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: 6 },
  idiomMeaning: { fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 4 },
  idiomLiteral: { fontSize: 12, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' },
});
