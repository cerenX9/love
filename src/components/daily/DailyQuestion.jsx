import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Lock,
  Unlock,
  Send,
  Sparkles,
  Heart,
  Plus,
  Calendar,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

const DailyQuestion = () => {
  const {
    dailyQuestions,
    answerDailyQuestion,
    addDailyQuestion,
    deleteDailyQuestion,
    activePersona,
    profile,
  } = useSharedData();
  const { playPop, playChime } = useSound();

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');

  const handleDeleteQuestion = (id) => {
    if (window.confirm('Bu günün sorusunu silmek istediğinize emin misiniz?')) {
      playPop();
      deleteDailyQuestion(id);
      if (activeQuestionIndex >= dailyQuestions.length - 1) {
        setActiveQuestionIndex((prev) => Math.max(0, prev - 1));
      }
      setAnswerInput('');
    }
  };

  const currentQuestion = dailyQuestions[activeQuestionIndex] || dailyQuestions[0];
  const answers = currentQuestion?.answers || {};

  const myKey = activePersona; // 'partner1' or 'partner2'
  const partnerKey = activePersona === 'partner1' ? 'partner2' : 'partner1';

  const myAnswer = answers[myKey];
  const partnerAnswer = answers[partnerKey];

  const myName = activePersona === 'partner1' ? profile.partner1?.name : profile.partner2?.name;
  const partnerName = activePersona === 'partner1' ? profile.partner2?.name : profile.partner1?.name;

  const isBothAnswered = Boolean(myAnswer && partnerAnswer);

  const handleSendAnswer = (e) => {
    e.preventDefault();
    if (!answerInput.trim()) return;

    playChime();
    answerDailyQuestion(currentQuestion.id, answerInput.trim());
    setAnswerInput('');

    if (partnerAnswer) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fb7185', '#c084fc', '#34d399', '#f59e0b'],
      });
    }
  };

  const handleAddNewQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    playChime();
    addDailyQuestion(newQuestionText.trim());
    setNewQuestionText('');
    setIsAddingNew(false);
    setActiveQuestionIndex(0);
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/80 shadow-xl relative overflow-hidden">
      {/* Glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-purple-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-rose-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-md">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base leading-tight">
              Kilitli Günün Sorusu 💬
            </h3>
            <span className="text-[11px] text-purple-600 font-semibold">
              İki taraf da yanıtlayınca kilitler açılır! 🔒✨
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Question selector tabs */}
          <div className="flex gap-1 bg-rose-50/80 p-1 rounded-2xl border border-rose-100 overflow-x-auto max-w-full">
            {dailyQuestions.map((q, idx) => {
              const qAnswers = q.answers || {};
              const bothDone = Boolean(qAnswers.partner1 && qAnswers.partner2);
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    playPop();
                    setActiveQuestionIndex(idx);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activeQuestionIndex === idx
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-rose-600'
                  }`}
                >
                  <span>Soru {idx + 1}</span>
                  {bothDone ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  ) : (
                    <Lock className="w-2.5 h-2.5 opacity-70" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playPop();
                setIsAddingNew(!isAddingNew);
              }}
              className="px-3 py-1.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
              title="Yeni soru ekle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Soru Ekle</span>
            </button>

            {currentQuestion && (
              <button
                type="button"
                onClick={() => handleDeleteQuestion(currentQuestion.id)}
                className="px-3 py-1.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                title="Aktif Soruyu Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Soruyu Sil</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add new question form */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddNewQuestion}
            className="mb-5 p-4 bg-purple-50/80 rounded-2xl border border-purple-200 space-y-2.5"
          >
            <h4 className="font-bold text-xs text-purple-900">İkiniz İçin Yeni Bir Soru Yaz:</h4>
            <input
              type="text"
              required
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="Örn: Birlikte gitmeyi en çok hayal ettiğin şehir neresi?"
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1 text-xs rounded-lg bg-slate-100 text-slate-600"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-3.5 py-1 text-xs rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-xs"
              >
                Soruyu Kaydet
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Active Question Box */}
      {currentQuestion ? (
        <div className="space-y-5">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-50/90 via-pink-50/70 to-purple-50/90 rounded-2xl border border-rose-200/80 text-center relative shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-500">
                Günün Sorusu #{activeQuestionIndex + 1}
              </span>
              <button
                type="button"
                onClick={() => handleDeleteQuestion(currentQuestion.id)}
                className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Bu Soruyu Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 font-romantic leading-snug">
              "{currentQuestion.question}"
            </h2>
          </div>

          {/* Answers Grid: Ceren vs Tahir */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* My Answer Box */}
            <div className="p-4 rounded-2xl border bg-white/90 border-rose-200/80 shadow-xs flex flex-col justify-between min-h-[140px]">
              <div className="flex items-center justify-between pb-2 border-b border-rose-100 mb-2">
                <span className="font-bold text-xs text-rose-700 flex items-center gap-1.5">
                  <span>{activePersona === 'partner1' ? profile.partner1?.avatar : profile.partner2?.avatar}</span>
                  <span>Senin Yanıtın ({myName})</span>
                </span>
                {myAnswer ? (
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Yanıtlandı ✅
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Bekleniyor ⏳
                  </span>
                )}
              </div>

              {myAnswer ? (
                <p className="text-xs sm:text-sm text-slate-700 italic my-auto leading-relaxed">
                  "{myAnswer.answer}"
                </p>
              ) : (
                <form onSubmit={handleSendAnswer} className="space-y-2 mt-auto">
                  <textarea
                    rows={2}
                    required
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Kendi cevabını buraya yaz..."
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Cevabımı Kilitle & Gönder</span>
                  </button>
                </form>
              )}
            </div>

            {/* Partner's Answer Box */}
            <div
              className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between min-h-[140px] transition-all ${
                isBothAnswered
                  ? 'bg-white/90 border-purple-200'
                  : 'bg-purple-50/50 border-purple-200/60'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-purple-100 mb-2">
                <span className="font-bold text-xs text-purple-800 flex items-center gap-1.5">
                  <span>{activePersona === 'partner1' ? profile.partner2?.avatar : profile.partner1?.avatar}</span>
                  <span>{partnerName}'in Yanıtı</span>
                </span>
                {isBothAnswered ? (
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> Açıldı
                  </span>
                ) : (
                  <span className="text-[10px] text-purple-700 font-bold bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Kilitli
                  </span>
                )}
              </div>

              {isBothAnswered && partnerAnswer ? (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs sm:text-sm text-slate-700 italic my-auto leading-relaxed"
                >
                  "{partnerAnswer.answer}"
                </motion.p>
              ) : (
                <div className="my-auto text-center p-3 space-y-1.5">
                  <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-purple-900 font-bold">
                    {partnerAnswer
                      ? `${partnerName} yanıtladı! Görmek için sen de yanıtla.`
                      : `${partnerName} henüz yanıtlamadı.`}
                  </p>
                  <p className="text-[10px] text-purple-600">
                    Her iki taraf da yanıt verince kilit otomatik olarak kalkar. 🔒
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Both Answered Celebration Banner */}
          {isBothAnswered && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-rose-500 rounded-2xl text-white text-center shadow-md flex items-center justify-center gap-2 text-xs font-bold"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Harika! İkiniz de bu soruyu yanıtladınız ve birbirinizin kalbini okudunuz! 💖🎉</span>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-8 sm:p-10 text-center border border-rose-100 text-slate-500 space-y-3">
          <p className="text-4xl">💬</p>
          <h4 className="font-bold text-slate-800 text-sm sm:text-base">Henüz Günün Sorusu Eklenmedi</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Birbirinize sormak istediğiniz ilk soruyu ekleyin ve kilitli cevaplarınızı yazarak aşkınızı test edin!
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-200 cursor-pointer"
          >
            İlk Soruyu Ekle 💖
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyQuestion;
