import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme, THEMES } from '../context/ThemeContext';

const LANG_ORDER = ['fr', 'de', 'es', 'it', 'en'];

export default function LangSwitcher() {
  const { currentCode, setTheme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {LANG_ORDER.map((code) => {
        const t = THEMES[code];
        const active = code === currentCode;
        return (
          <TouchableOpacity
            key={code}
            style={[styles.btn, active && styles.btnActive]}
            onPress={() => setTheme(code)}
            activeOpacity={0.75}
          >
            <Text style={[styles.flag]}>{t.flag}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  btnActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderColor: 'rgba(255,255,255,0.35)',
  },
  flag: {
    fontSize: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.45)',
  },
  labelActive: {
    color: 'rgba(255,255,255,0.95)',
  },
});
