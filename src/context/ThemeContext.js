import React, { createContext, useContext, useState } from 'react';

export const THEMES = {
  fr: {
    code: 'fr',
    flag: '🇫🇷',
    label: 'Français',
    pill: 'TR → FR',
    langLabel: 'FRANÇAIS',
    ca: '#3B4FD8',
    cb: '#9B2335',
    cc: '#6B3FA0',
    glow: 'rgba(59,79,216,0.4)',
    glow2: 'rgba(155,35,53,0.3)',
    bgGradient: ['#1a1f6e', '#2d1b5e', '#6b1a2a', '#2a1040'],
    badges: ['NOUVEAU', 'SU', 'RÉVISER'],
    nbPills: ['Tous', 'Nouveau', 'Réviser', 'Su'],
    words: ['apprendre', 'étudier', "s'instruire", 'appris / apprit'],
    nb: ['apprendre · étudier', 'aimer · adorer', 'aller · partir', 'parler · discuter', 'écrire · rédiger'],
    nbKeys: ['apprendre', 'aimer', 'aller', 'parler', 'écrire'],
    ans: 'aller',
  },
  de: {
    code: 'de',
    flag: '🇩🇪',
    label: 'Deutsch',
    pill: 'TR → DE',
    langLabel: 'DEUTSCH',
    ca: '#1A1A1A',
    cb: '#D4A017',
    cc: '#555',
    glow: 'rgba(26,26,26,0.5)',
    glow2: 'rgba(212,160,23,0.35)',
    bgGradient: ['#0a0a0a', '#1a1a1a', '#2a2000', '#111'],
    badges: ['NEU', 'KANN ICH', 'WIEDERHOLEN'],
    nbPills: ['Alle', 'Neu', 'Wiederholen', 'Kann ich'],
    words: ['lernen', 'studieren', 'begreifen', 'lernte / gelernt'],
    nb: ['lernen · studieren', 'lieben · mögen', 'gehen · fahren', 'sprechen · reden', 'schreiben · verfassen'],
    nbKeys: ['lernen', 'lieben', 'gehen', 'sprechen', 'schreiben'],
    ans: 'gehen',
  },
  es: {
    code: 'es',
    flag: '🇪🇸',
    label: 'Español',
    pill: 'TR → ES',
    langLabel: 'ESPAÑOL',
    ca: '#C0392B',
    cb: '#E67E22',
    cc: '#922B21',
    glow: 'rgba(192,57,43,0.4)',
    glow2: 'rgba(230,126,34,0.3)',
    bgGradient: ['#4a0a08', '#7a1a0a', '#3a1500', '#2a0800'],
    badges: ['NUEVO', 'LO SÉ', 'REPASAR'],
    nbPills: ['Todo', 'Nuevo', 'Repasar', 'Lo sé'],
    words: ['aprender', 'estudiar', 'comprender', 'aprendí / aprendido'],
    nb: ['aprender · estudiar', 'amar · querer', 'ir · viajar', 'hablar · conversar', 'escribir · redactar'],
    nbKeys: ['aprender', 'amar', 'ir', 'hablar', 'escribir'],
    ans: 'ir',
  },
  it: {
    code: 'it',
    flag: '🇮🇹',
    label: 'Italiano',
    pill: 'TR → IT',
    langLabel: 'ITALIANO',
    ca: '#1A6B3C',
    cb: '#C0392B',
    cc: '#145A32',
    glow: 'rgba(26,107,60,0.4)',
    glow2: 'rgba(192,57,43,0.3)',
    bgGradient: ['#0a2a18', '#0d3d20', '#2a0a08', '#08200f'],
    badges: ['NUOVO', 'SO', 'RIPASSARE'],
    nbPills: ['Tutti', 'Nuovo', 'Ripassare', 'So'],
    words: ['imparare', 'studiare', 'capire', 'imparai / imparato'],
    nb: ['imparare · studiare', 'amare · adorare', 'andare · partire', 'parlare · discutere', 'scrivere · redigere'],
    nbKeys: ['imparare', 'amare', 'andare', 'parlare', 'scrivere'],
    ans: 'andare',
  },
  en: {
    code: 'en',
    flag: '🇬🇧',
    label: 'English',
    pill: 'TR → EN',
    langLabel: 'ENGLISH',
    ca: '#0D2B6B',
    cb: '#B22222',
    cc: '#1A3A8F',
    glow: 'rgba(13,43,107,0.4)',
    glow2: 'rgba(178,34,34,0.3)',
    bgGradient: ['#040d2a', '#0d1f5e', '#2a0808', '#080420'],
    badges: ['NEW', 'GOT IT', 'REVIEW'],
    nbPills: ['All', 'New', 'Review', 'Got it'],
    words: ['learn', 'study', 'understand', 'learned / learnt'],
    nb: ['learn · study', 'love · adore', 'go · leave', 'speak · talk', 'write · compose'],
    nbKeys: ['learn', 'love', 'go', 'speak', 'write'],
    ans: 'go',
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('fr');

  return (
    <ThemeContext.Provider value={{ theme: THEMES[currentTheme], setTheme: setCurrentTheme, currentCode: currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
