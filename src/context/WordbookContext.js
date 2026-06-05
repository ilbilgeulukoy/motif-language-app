import React, { createContext, useContext, useState } from 'react';

const WordbookContext = createContext(null);

export function WordbookProvider({ children }) {
  const [words, setWords] = useState([]); 
  // word shape: { id, sourceLang, targetLang, source, target, examples, savedAt }

  function addWord(word) {
    setWords(prev => {
      const exists = prev.find(w => w.source === word.source && w.sourceLang === word.sourceLang && w.targetLang === word.targetLang);
      if (exists) return prev;
      return [{ ...word, id: Date.now().toString(), savedAt: new Date().toISOString() }, ...prev];
    });
  }

  function removeWord(id) {
    setWords(prev => prev.filter(w => w.id !== id));
  }

  return (
    <WordbookContext.Provider value={{ words, addWord, removeWord }}>
      {children}
    </WordbookContext.Provider>
  );
}

export function useWordbook() {
  return useContext(WordbookContext);
}
