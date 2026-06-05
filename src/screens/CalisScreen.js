import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView
} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import { useWordbook } from '../context/WordbookContext';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuiz(words) {
  return words.map((word, i) => {
    const others = words.filter((_, j) => j !== i);
    const wrongOptions = shuffle(others).slice(0, 3).map(w => w.target);
    const options = shuffle([...wrongOptions, word.target]);
    return {
      question: word.source,
      sourceLang: word.sourceLang,
      targetLang: word.targetLang,
      correct: word.target,
      options,
    };
  });
}

export default function CalisScreen() {
  const { words } = useWordbook();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (words.length >= 2) {
      setQuestions(shuffle(buildQuiz(words)));
      setCurrent(0);
      setSelected(null);
      setScore(0);
      setFinished(false);
    }
  }, [words]);

  if (words.length === 0) {
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✏️</Text>
            <Text style={styles.emptyTitle}>Defterin boş</Text>
            <Text style={styles.emptySub}>Sözlük'ten kelime ekleyince{'\n'}burada çalışabilirsin.</Text>
          </View>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  if (words.length < 2) {
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>➕</Text>
            <Text style={styles.emptyTitle}>En az 2 kelime gerek</Text>
            <Text style={styles.emptySub}>Sözlük'ten daha fazla kelime ekle.</Text>
          </View>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.resultContainer}>
            <Text style={styles.resultEmoji}>{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}</Text>
            <Text style={styles.resultTitle}>Tamamlandı!</Text>
            <Text style={styles.resultScore}>{score}/{questions.length}</Text>
            <Text style={styles.resultPct}>%{pct} başarı</Text>
            <Text style={styles.resultSub}>
              {pct >= 80 ? 'Harika!' : pct >= 50 ? 'İyi gidiyor, devam et!' : 'Tekrar çalışalım!'}
            </Text>
            <TouchableOpacity style={styles.restartBtn} onPress={() => {
              setQuestions(shuffle(buildQuiz(words)));
              setCurrent(0);
              setSelected(null);
              setScore(0);
              setFinished(false);
            }}>
              <Text style={styles.restartText}>Tekrar Başla</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  const q = questions[current];
  if (!q) return null;
  const isCorrect = selected === q.correct;

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Çalış<Text style={styles.dot}>.</Text></Text>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>{score}/{questions.length}</Text>
            </View>
          </View>

          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${(current / questions.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{current + 1} / {questions.length}</Text>

          <View style={styles.questionCard}>
            <Text style={styles.questionLabel}>NE ANLAMA GELİR?</Text>
            <Text style={styles.questionText}>{q.question}</Text>
            <Text style={styles.questionLangHint}>
              {q.sourceLang?.toUpperCase()} → {q.targetLang?.toUpperCase()}
            </Text>
          </View>

          <View style={styles.optionsGrid}>
            {q.options.map((opt, i) => {
              let optStyle = styles.optionDefault;
              let textStyle = styles.optionText;
              if (selected) {
                if (opt === q.correct) { optStyle = styles.optionCorrect; textStyle = styles.optionTextCorrect; }
                else if (opt === selected) { optStyle = styles.optionWrong; textStyle = styles.optionTextWrong; }
              }
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.optionBtn, optStyle]}
                  onPress={() => {
                    if (selected) return;
                    setSelected(opt);
                    if (opt === q.correct) setScore(s => s + 1);
                  }}
                  disabled={!!selected}
                >
                  <Text style={[styles.optionLetter, textStyle]}>{String.fromCharCode(65 + i)}</Text>
                  <Text style={[styles.optionText, textStyle]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selected ? (
            <View style={[styles.feedbackRow, isCorrect ? styles.fbCorrect : styles.fbWrong]}>
              <Text style={styles.fbEmoji}>{isCorrect ? '✓' : '✗'}</Text>
              <Text style={styles.fbText}>{isCorrect ? 'Doğru!' : `Doğrusu: ${q.correct}`}</Text>
              <TouchableOpacity style={styles.nextBtn} onPress={() => {
                if (current + 1 >= questions.length) setFinished(true);
                else { setCurrent(c => c + 1); setSelected(null); }
              }}>
                <Text style={styles.nextText}>{current + 1 >= questions.length ? 'Bitir' : 'Devam →'}</Text>
              </TouchableOpacity>
            </View>
          ) : null}

        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 32 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 22, fontWeight: '400', color: 'rgba(255,255,255,0.8)' },
  emptySub: { fontSize: 14, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 22 },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, paddingHorizontal: 6 },
  headerTitle: { flex: 1, fontSize: 30, fontWeight: '300', color: 'rgba(255,255,255,0.95)', letterSpacing: -0.5 },
  dot: { color: 'rgba(255,255,255,0.3)' },
  scoreBox: { paddingVertical: 5, paddingHorizontal: 14, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  scoreText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },

  progressBg: { height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 6, marginHorizontal: 6 },
  progressFill: { height: 3, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 2 },
  progressLabel: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 6, marginBottom: 16 },

  questionCard: { padding: 24, borderRadius: 22, marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  questionLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.25)', letterSpacing: 2.5, marginBottom: 10 },
  questionText: { fontSize: 28, fontWeight: '300', color: 'rgba(255,255,255,0.95)', letterSpacing: -0.5, marginBottom: 6 },
  questionLangHint: { fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 },

  optionsGrid: { gap: 10 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, paddingHorizontal: 18, borderRadius: 16, borderWidth: 1 },
  optionDefault: { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' },
  optionCorrect: { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.5)' },
  optionWrong: { backgroundColor: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.5)' },
  optionLetter: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.3)', width: 20 },
  optionText: { fontSize: 15, fontWeight: '500', color: 'rgba(255,255,255,0.8)', flex: 1 },
  optionTextCorrect: { color: 'rgba(134,239,172,0.95)' },
  optionTextWrong: { color: 'rgba(252,165,165,0.95)' },

  feedbackRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16, padding: 16, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  fbCorrect: { backgroundColor: 'rgba(34,197,94,0.12)' },
  fbWrong: { backgroundColor: 'rgba(239,68,68,0.12)' },
  fbEmoji: { fontSize: 18, color: 'rgba(255,255,255,0.85)' },
  fbText: { flex: 1, fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.85)' },
  nextBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.12)' },
  nextText: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },

  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10, paddingHorizontal: 32 },
  resultEmoji: { fontSize: 64 },
  resultTitle: { fontSize: 30, fontWeight: '300', color: 'rgba(255,255,255,0.95)' },
  resultScore: { fontSize: 52, fontWeight: '200', color: 'rgba(255,255,255,0.9)' },
  resultPct: { fontSize: 16, color: 'rgba(255,255,255,0.4)' },
  resultSub: { fontSize: 15, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  restartBtn: { marginTop: 12, paddingVertical: 16, paddingHorizontal: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  restartText: { fontSize: 16, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
});
