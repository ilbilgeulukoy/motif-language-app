import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = [
  { name: 'Sozluk', label: 'Sözlük', icon: require('../../assets/icons/sozluk.png') },
  { name: 'Defter', label: 'Defter', icon: require('../../assets/icons/defter.png') },
  { name: 'Calis', label: 'Çalış', icon: require('../../assets/icons/calis.png') },
  { name: 'Kesif', label: 'Keşfet', emoji: '✨' },
];

export default function TabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      {TABS.map((tab, index) => {
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.7}
          >
            <Image
              source={tab.icon}
              style={[styles.icon, { opacity: isFocused ? 1 : 0.4 }]}
              resizeMode="contain"
            />
            <Text style={[styles.label, isFocused && styles.labelActive]}>{tab.label}</Text>
            {isFocused && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10,8,18,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  icon: { width: 32, height: 32 },
  label: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 },
  labelActive: { color: 'rgba(255,255,255,0.9)' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)', marginTop: 2 },
});
