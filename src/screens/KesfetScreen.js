import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView
} from 'react-native';
import { BlurView } from 'expo-blur';
import ScreenBackground from '../components/ScreenBackground';
import LangSwitcher from '../components/LangSwitcher';
import { useTheme } from '../context/ThemeContext';

function GlassCard({ children, style }) {
  return (
    <BlurView intensity={18} tint="dark" style={[styles.glassCard, style]}>
      <View style={styles.glassInner}>{children}</View>
    </BlurView>
  );
}

function WordRow({ word, type, badge, badgeType }) {
  const badgeStyle =
    badgeType === 'new' ? styles.bdgNew :
    badgeType === 'ok' ? styles.bdgOk :
    styles.bdgRep;

  return (
    <View style={styles.wordRow}>
      <View style={styles.wordLeft}>
        <Text style={styles.wordMain}>{word}</Text>
        <Text style={styles.wordType}>{type}</Text>
      </View>
      <View style={[styles.badge, badgeStyle]}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    </View>
  );
}

export default function KesfetScreen() {
  const { theme } = useTheme();

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.heroFlag}>{theme.flag}</Text>
            <Text style={styles.heroTitle}>
              Keşfet<Text style={styles.heroTitleDot}>.</Text>
            </Text>
          </View>

          <LangSwitcher />

          {/* Featured Word Card */}
          <GlassCard style={styles.featuredCard}>
            <View style={styles.pillRow}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{theme.pill}</Text>
              </View>
              <View style={styles.pillSec}>
                <Text style={styles.pillSecText}>{theme.badges[0]}</Text>
              </View>
            </View>
            <Text style={styles.bigWord}>{theme.words[0]}</Text>
            <Text style={styles.bigWordSub}>{theme.words[1]}</Text>
            <View style={styles.divider} />
            <View style={styles.conjugRow}>
              {[theme.words[2], theme.words[3]].map((w, i) => (
                <Text key={i} style={styles.conjugWord}>{w}</Text>
              ))}
            </View>
          </GlassCard>

          {/* Word List */}
          <GlassCard style={styles.listCard}>
            <Text style={styles.listTitle}>Bugün · 5 kelime</Text>
            {theme.nb.map((nb, i) => (
              <WordRow
                key={i}
                word={theme.nbKeys[i]}
                type={nb.split(' · ')[1] || ''}
                badge={i === 0 ? theme.badges[0] : i < 3 ? theme.badges[2] : theme.badges[1]}
                badgeType={i === 0 ? 'new' : i < 3 ? 'rep' : 'ok'}
              />
            ))}
          </GlassCard>

          {/* CTA Button */}
          <View style={[styles.ctaBtn, { borderColor: 'rgba(255,255,255,0.15)' }]}>
            <Text style={styles.ctaText}>Çalışmaya Başla →</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 32 },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 16,
  },
  heroFlag: { fontSize: 28 },
  heroTitle: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.95)',
    letterSpacing: -0.5,
  },
  heroTitleDot: { color: 'rgba(255,255,255,0.3)' },

  glassCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  glassInner: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  pillRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  pillText: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  pillSec: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pillSecText: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: 1.5 },

  bigWord: {
    fontSize: 40,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.95)',
    letterSpacing: -1,
    marginBottom: 2,
  },
  bigWordSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginVertical: 14,
  },
  conjugRow: { flexDirection: 'row', gap: 16 },
  conjugWord: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
  },

  listCard: { marginTop: 0 },
  listTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  wordLeft: { flex: 1 },
  wordMain: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
  },
  wordType: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 2,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  bdgNew: { backgroundColor: 'rgba(59,79,216,0.25)', borderWidth: 1, borderColor: 'rgba(59,79,216,0.4)' },
  bdgOk: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  bdgRep: { backgroundColor: 'rgba(255,200,100,0.1)', borderWidth: 1, borderColor: 'rgba(255,200,100,0.2)' },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.5,
  },

  featuredCard: { marginTop: 16 },

  ctaBtn: {
    marginHorizontal: 16,
    marginTop: 4,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.5,
  },
});
