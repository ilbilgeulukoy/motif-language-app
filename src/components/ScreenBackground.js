import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

function Orb({ style, color, delay = 0 }) {
  const anim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: { x: 20, y: 18 }, duration: 4500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(anim, { toValue: { x: 0, y: 0 }, duration: 4500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={[styles.orb, style, { backgroundColor: color, transform: [{ translateX: anim.x }, { translateY: anim.y }] }]} />
  );
}

export default function ScreenBackground({ children }) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <LinearGradient colors={theme.bgGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <Orb style={{ width: 280, height: 280, top: -80, left: -80 }} color={theme.glow} delay={0} />
      <Orb style={{ width: 220, height: 220, bottom: -60, right: -60 }} color={theme.glow2} delay={500} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  orb: { position: 'absolute', borderRadius: 999, opacity: 0.7 },
});
