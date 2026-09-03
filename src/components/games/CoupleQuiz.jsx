import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  CheckCircle2,
  XCircle,
  Trophy,
  Plus,
  Sparkles,
  RotateCcw,
  Gift,
  HelpCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

const CoupleQuiz = () => {
  const { quizQuestions, addQuizQuestion, deleteQuizQuestion, awardXP, currentPartner, addCoupon } = useSharedData();
  const { playPop, playChime } = useSound();

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleDeleteQuestion = (id) => {
    if (window.confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
      playPop();
      deleteQuizQuestion(id);
      if (currentQIndex >= quizQuestions.length - 1) {
        setCurrentQIndex((prev) => Math.max(0, prev - 1));
      }
      setSelectedOption(null);
    }
  };

  // New Question Form State
  const [newQTitle, setNewQTitle] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanationText, setExplanationText] = useState('');

  const currentQ = quizQuestions[currentQIndex];

  // Handle Option Click
  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return; // Prevent double click

    setSelectedOption(index);
    const isCorrect = index === currentQ.correctIndex;

    if (isCorrect) {
      playChime();
      setScore((prev) => prev + 1);
    } else {
      playPop();
    }
  };

  // Next Question
  const handleNext = () => {
    playPop();
    if (currentQIndex + 1 < quizQuestions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Finished
      setQuizFinished(true);
      awardXP(40);
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#fb7185', '#f59e0b', '#34d399', '#c084fc'],
      });
    }
  };

  // Restart Quiz
  const handleRestart = () => {
    playPop();
    setCurrentQIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  // Claim Surprise Reward
  const handleClaimReward = () => {
    playChime();
    addCoupon({
      title: 'Aşk Testi Şampiyonu Ödülü 🏆',
      description: 'Testi başarıyla tamamladığın için kazandığın özel romantik joker hakkı!',
      category: 'love',
      color: 'from-amber-400 to-rose-500',
    });
    alert('Özel Aşk Kuponunuz Kupon Defterinize Eklendi! 🎁✨');
  };

  // Add Question Submit
  const handleCreateQuestion = (e) => {
    e.preventDefault();
    if (!newQTitle.trim() || newOptions.some((o) => !o.trim())) {
      alert('Lütfen soru başlığını ve 4 seçeneğin tamamını doldurun.');
      return;
    }

    playChime();
    addQuizQuestion({
      question: newQTitle.trim(),
      options: newOptions.map((o) => o.trim()),
      correctIndex: Number(correctIdx),
      explanation: explanationText.trim() || 'Doğru cevap!',
    });

    setNewQTitle('');
    setNewOptions(['', '', '', '']);
    setExplanationText('');
    setIsAddingNew(false);
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/80 shadow-xl relative overflow-hidden">
      {/* Glow */}
      <div className="absolute -top-16 -left-16 w-44 h-44 bg-rose-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base leading-tight">
              "Beni Ne Kadar Tanıyorsun?" Testi 🧠
            </h3>
            <span className="text-[11px] text-rose-500 font-semibold">
              Birbirimizin zevklerini ve hatıralarını test edelim! 💖
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            playPop();
            setIsAddingNew(!isAddingNew);
          }}
          className="px-3 py-1.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Soru Ekle</span>
        </button>
      </div>

      {/* Add New Question Form Modal/Accordion */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateQuestion}
            className="mb-6 p-4 sm:p-5 bg-rose-50/80 rounded-2xl border border-rose-200 space-y-3"
          >
            <h4 className="font-bold text-xs text-rose-900">Partnerine Yeni Bir Test Sorusu Sor:</h4>
            <div>
              <label className="text-[11px] text-slate-600 block mb-1">Soru Metni:</label>
              <input
                type="text"
                required
                placeholder="Örn: En sevdiğim tatlı hangisi?"
                value={newQTitle}
                onChange={(e) => setNewQTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {newOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-rose-100">
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={correctIdx === i}
                    onChange={() => setCorrectIdx(i)}
                    className="text-rose-600 focus:ring-rose-400"
                  />
                  <input
                    type="text"
                    required
                    placeholder={`${String.fromCharCode(65 + i)}) Seçenek...`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newOptions];
                      updated[i] = e.target.value;
                      setNewOptions(updated);
                    }}
                    className="flex-1 text-xs bg-transparent focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-rose-600 italic">
              * Doğru olan seçeneğin solundaki yuvarlağı (radio) işaretleyin.
            </p>

            <div>
              <input
                type="text"
                placeholder="Açıklama / Tatlı Not (Opsiyonel)..."
                value={explanationText}
                onChange={(e) => setExplanationText(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-100 text-slate-600"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-xs"
              >
                Soruyu Kaydet 💖
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Quiz Screen */}
      {!quizFinished && currentQ ? (
        <div className="space-y-4">
          {/* Progress, Navigation & Author with Delete Question */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setCurrentQIndex((prev) => Math.max(0, prev - 1));
                  setSelectedOption(null);
                }}
                disabled={currentQIndex === 0}
                className="p-0.5 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                title="Önceki Soru"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-slate-700 min-w-[70px] text-center">
                Soru {currentQIndex + 1} / {quizQuestions.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setCurrentQIndex((prev) => Math.min(quizQuestions.length - 1, prev + 1));
                  setSelectedOption(null);
                }}
                disabled={currentQIndex >= quizQuestions.length - 1}
                className="p-0.5 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                title="Sonraki Soru"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 text-xs font-semibold">
                Hazırlayan: {currentQ.creator || 'Ceren & Tahir'}
              </span>
              <button
                type="button"
                onClick={() => handleDeleteQuestion(currentQ.id)}
                className="p-1.5 rounded-xl hover:bg-rose-100 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-300 transition-colors cursor-pointer"
                title="Bu Soruyu Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Question Box */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-50/90 to-pink-50/90 rounded-2xl border border-rose-200/80 text-center">
            <h4 className="text-base sm:text-lg font-bold text-slate-800">
              {currentQ.question}
            </h4>
          </div>

          {/* 4 Choices Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, idx) => {
              let btnStyle = 'bg-white/90 hover:bg-rose-50/70 border-rose-100 text-slate-700';

              if (selectedOption !== null) {
                if (idx === currentQ.correctIndex) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200';
                } else if (idx === selectedOption) {
                  btnStyle = 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200';
                } else {
                  btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {selectedOption !== null && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                  {selectedOption !== null &&
                    idx === selectedOption &&
                    idx !== currentQ.correctIndex && (
                      <XCircle className="w-4 h-4 text-white" />
                    )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Button */}
          {selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white/95 rounded-2xl border border-rose-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <p className="text-xs text-slate-700 italic">
                💬 <strong>Açıklama:</strong> {currentQ.explanation}
              </p>
              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all cursor-pointer whitespace-nowrap"
              >
                {currentQIndex + 1 < quizQuestions.length ? 'Sonraki Soru ➔' : 'Sonuçları Gör 🏆'}
              </button>
            </motion.div>
          )}
        </div>
      ) : quizQuestions.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 sm:p-10 text-center border border-rose-100 text-slate-500 space-y-3">
          <p className="text-4xl">🧠</p>
          <h4 className="font-bold text-slate-800 text-sm sm:text-base">Henüz Test Sorusu Eklenmedi</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Partnerini ne kadar tanıdığını test etmek ve aranızdaki bağı güçlendirmek için ilk 4 şıklı soruyu oluştur!
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-200 cursor-pointer"
          >
            İlk Soruyu Oluştur 💖
          </button>
        </div>
      ) : (
        /* Results Screen */
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-6 space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-200">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-2xl font-extrabold text-slate-800">Test Tamamlandı! 🎉</h4>
            <p className="text-rose-600 font-bold text-base mt-1">
              Skorunuz: {score} / {quizQuestions.length}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {score === quizQuestions.length
                ? 'Mükemmel Çift Uyumu! Birbirinizi avucunuzun içi gibi tanıyorsunuz! 👑💖'
                : 'Harika bir çaba! Birlikte yeni hatıralar biriktirdikçe daha da iyi tanıyacaksınız! 🥰'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Testi Tekrar Çöz</span>
            </button>

            <button
              onClick={handleClaimReward}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Sürpriz Kuponunu Al 🎁</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CoupleQuiz;
