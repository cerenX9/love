import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Send,
  Calendar,
  Clock,
  Edit3,
  Check,
  X,
  Award,
  PartyPopper,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import { calculateTimeTogether, formatDateTurkish, getTimeRemaining } from '../../utils/dateUtils';
import MusicPlayer from './MusicPlayer';

const HeroSection = () => {
  const { profile, activePersona, addNote, updateDailyQuote } = useSharedData();
  const { playPop, playChime } = useSound();

  const [timeTogether, setTimeTogether] = useState(() =>
    calculateTimeTogether(profile.anniversaryDate || '2026-02-05T00:00')
  );

  // Quote editing state
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [quoteInput, setQuoteInput] = useState(
    profile.dailyQuote || 'Seninle geçen her saniye, hayatımın en güzel melodisi...'
  );

  // Floating flying reaction emojis
  const [flyingEmojis, setFlyingEmojis] = useState([]);

  // Live timer update
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTogether(calculateTimeTogether(profile.anniversaryDate || '2026-02-05T00:00'));
    }, 1000);
    return () => clearInterval(timer);
  }, [profile.anniversaryDate]);

  // Next Milestone calculation (Next 5th of month or exact today celebration)
  const currentPartner = activePersona === 'partner1' ? profile.partner1 : profile.partner2;

  const now = new Date();
  const isTodayAnniversary = now.getDate() === 5;
  let next5thYear = now.getFullYear();
  let next5thMonth = now.getMonth();

  if (now.getDate() >= 5) {
    next5thMonth += 1;
    if (next5thMonth > 11) {
      next5thMonth = 0;
      next5thYear += 1;
    }
  }

  const nextMonthlyDateStr = `${next5thYear}-${String(next5thMonth + 1).padStart(2, '0')}-05T00:00:00`;
  const nextMonthRemaining = getTimeRemaining(nextMonthlyDateStr);

  // Calculate which month anniversary it is (Since 2026-02-05)
  const startDate = new Date(profile.anniversaryDate || '2026-02-05T00:00');
  const targetDate = isTodayAnniversary ? now : new Date(nextMonthlyDateStr);
  const monthsDiff =
    (targetDate.getFullYear() - startDate.getFullYear()) * 12 +
    (targetDate.getMonth() - startDate.getMonth());

  // Save updated daily quote
  const handleSaveQuote = (e) => {
    e.preventDefault();
    if (!quoteInput.trim()) return;
    playChime();
    updateDailyQuote(quoteInput.trim(), currentPartner.name);
    setIsEditingQuote(false);
  };

  // Trigger Heart Explosion Confetti
  const handleHeartRain = () => {
    playChime();
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#fb7185', '#f43f5e', '#fda4af', '#f472b6', '#c084fc'],
      shapes: ['circle'],
    });
    spawnEmojis('💖', 8);
  };

  // Trigger Kiss Animation
  const handleKissSend = () => {
    playPop();
    spawnEmojis('💋', 6);
  };

  // Trigger Instant "I Love You" Note
  const handleLoveSend = () => {
    playChime();
    spawnEmojis('❤️', 8);
    const partner = activePersona === 'partner1' ? profile.partner1 : profile.partner2;
    addNote(
      `Seni çok ama çok seviyorum birtanem! ❤️✨ (${new Date().toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      })})`,
      'rose'
    );
  };

  const spawnEmojis = (emoji, count) => {
    const newItems = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      emoji,
      x: 20 + Math.random() * 60,
      delay: i * 0.08,
    }));

    setFlyingEmojis((prev) => [...prev, ...newItems]);
    setTimeout(() => {
      setFlyingEmojis((prev) => prev.filter((item) => !newItems.some((n) => n.id === item.id)));
    }, 2500);
  };

  return (
    <section className="relative px-3 sm:px-6 pt-4 pb-6 max-w-6xl mx-auto w-full">
      {/* Flying Emojis Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {flyingEmojis.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: '80vh', x: `${item.x}vw`, scale: 0.5 }}
              animate={{ opacity: [0, 1, 1, 0], y: '10vh', scale: [0.5, 1.4, 1.2, 0.8] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, delay: item.delay, ease: 'easeOut' }}
              className="absolute text-4xl sm:text-5xl"
            >
              {item.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-5 items-stretch">
        {/* Left: Couple Avatars & Live Love Counter */}
        <div className="glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-7 relative overflow-hidden shadow-xl border border-rose-200/70 flex flex-col justify-between">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-rose-300/30 to-pink-200/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-purple-300/20 to-rose-200/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Date & Milestone Header */}
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-3 pb-2 sm:pb-4 border-b border-rose-100">
            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] sm:text-xs font-semibold shadow-2xs truncate">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">Başlangıç: {formatDateTurkish(profile.anniversaryDate || '2026-02-05')}</span>
            </div>

            <div
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full border text-[10px] sm:text-xs font-bold shadow-2xs truncate ${
                isTodayAnniversary
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-300 animate-pulse'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <PartyPopper className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${isTodayAnniversary ? 'text-white' : 'text-amber-600'}`} />
              <span className="truncate">
                {isTodayAnniversary
                  ? `🎉 Bugün ${monthsDiff}. Ay Dönümümüz! 💖`
                  : monthsDiff === 12
                  ? `1. Yılımıza Son ${nextMonthRemaining.days} Gün! 💖`
                  : `${monthsDiff}. Aya Son ${nextMonthRemaining.days} Gün! 💖`}
              </span>
            </div>
          </div>

          {/* Live Counter Big Display */}
          <div className="relative z-10 my-2.5 sm:my-6 text-center">
            <span className="text-[10px] sm:text-sm font-extrabold tracking-wider text-rose-500 uppercase block mb-1.5 sm:mb-3 truncate">
              BİRLİKTE GEÇEN HER ANAMIZ 💖
            </span>

            {/* Counter Grid */}
            <div className="grid grid-cols-4 gap-1 sm:gap-3 max-w-lg mx-auto">
              {/* Days */}
              <div className="bg-white/90 p-1.5 sm:p-4 rounded-xl sm:rounded-2xl border border-rose-200/80 shadow-md shadow-rose-100/60 flex flex-col items-center">
                <span className="text-base sm:text-4xl font-extrabold text-slate-800 font-mono tracking-tight">
                  {timeTogether.totalDays}
                </span>
                <span className="text-[8px] sm:text-xs font-bold text-rose-500 uppercase mt-0.5">
                  Gün
                </span>
              </div>

              {/* Hours */}
              <div className="bg-white/90 p-1.5 sm:p-4 rounded-xl sm:rounded-2xl border border-rose-200/80 shadow-md shadow-rose-100/60 flex flex-col items-center">
                <span className="text-base sm:text-4xl font-extrabold text-slate-800 font-mono tracking-tight">
                  {String(timeTogether.hours).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-xs font-bold text-rose-500 uppercase mt-0.5">
                  Saat
                </span>
              </div>

              {/* Minutes */}
              <div className="bg-white/90 p-1.5 sm:p-4 rounded-xl sm:rounded-2xl border border-rose-200/80 shadow-md shadow-rose-100/60 flex flex-col items-center">
                <span className="text-base sm:text-4xl font-extrabold text-slate-800 font-mono tracking-tight">
                  {String(timeTogether.minutes).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-xs font-bold text-rose-500 uppercase mt-0.5">
                  Dakika
                </span>
              </div>

              {/* Seconds */}
              <div className="bg-white/90 p-1.5 sm:p-4 rounded-xl sm:rounded-2xl border border-rose-200/80 shadow-md shadow-rose-100/60 flex flex-col items-center relative overflow-hidden">
                <span className="text-base sm:text-4xl font-extrabold text-rose-600 font-mono tracking-tight">
                  {String(timeTogether.seconds).padStart(2, '0')}
                </span>
                <span className="text-[8px] sm:text-xs font-bold text-rose-500 uppercase mt-0.5">
                  Saniye
                </span>
                <span className="absolute top-1 right-1 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-rose-500 animate-ping" />
              </div>
            </div>

            {/* Total Duration Breakdown */}
            <p className="text-[10px] sm:text-xs text-slate-600 mt-2 sm:mt-3 font-medium">
              Tam olarak{' '}
              <strong className="text-rose-600">
                {timeTogether.months > 0 ? `${timeTogether.months} Ay ` : ''}
                {timeTogether.days} Gün
              </strong>{' '}
              ve sayısız güzel hatıra! ✨
            </p>
          </div>

          {/* Quick Action Reactions */}
          <div className="relative z-10 pt-2.5 sm:pt-4 border-t border-rose-100 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3">
            <button
              onClick={handleHeartRain}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-[10px] sm:text-xs font-bold shadow-md shadow-rose-200 transition-all cursor-pointer"
            >
              <span>💖</span>
              <span>Kalp Yağmuru</span>
            </button>

            <button
              onClick={handleKissSend}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-pink-100 hover:bg-pink-200 active:scale-95 text-pink-700 text-[10px] sm:text-xs font-bold border border-pink-200 transition-all cursor-pointer"
            >
              <span>💋</span>
              <span>Öpücük Yolla</span>
            </button>

            <button
              onClick={handleLoveSend}
              className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 active:scale-95 text-white text-[10px] sm:text-xs font-bold shadow-md shadow-purple-200 transition-all cursor-pointer"
            >
              <span>❤️</span>
              <span>Seni Seviyorum Gönder</span>
            </button>
          </div>
        </div>

        {/* Right Col: Music Player & Editable Romantic Quote */}
        <div className="flex flex-col gap-2.5 sm:gap-4 justify-between">
          <MusicPlayer />

          {/* Decorated Romantic Quote Card */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-3 sm:p-6 flex-1 flex flex-col justify-between border-2 border-rose-300/80 shadow-xl shadow-rose-200/50 bg-gradient-to-br from-rose-100/80 via-pink-50/95 to-purple-100/80 backdrop-blur-md">
            {/* Floating Background Floral & Heart Ornaments */}
            <span className="absolute -top-3 -right-3 text-2xl sm:text-3xl opacity-20 pointer-events-none select-none rotate-12">
              🌸
            </span>
            <span className="absolute -bottom-3 -left-3 text-2xl sm:text-3xl opacity-20 pointer-events-none select-none -rotate-12">
              🌷
            </span>
            <span className="absolute top-1/2 right-2 text-lg sm:text-xl opacity-15 pointer-events-none select-none animate-pulse">
              💖
            </span>

            {/* Header with Floral Badge */}
            <div className="flex items-center justify-between pb-1.5 sm:pb-2 border-b border-rose-200/80 relative z-10">
              <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/90 border border-rose-200 text-rose-600 text-[10px] sm:text-xs font-extrabold shadow-2xs">
                <span className="text-xs sm:text-sm">🌸</span>
                <span className="truncate">Günün Romantik Notu</span>
                <span className="text-[10px] sm:text-xs text-pink-500">💌</span>
              </div>
              <button
                onClick={() => {
                  playPop();
                  setQuoteInput(profile.dailyQuote || '');
                  setIsEditingQuote(!isEditingQuote);
                }}
                className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-white/80 hover:bg-white hover:text-rose-600 text-slate-600 border border-rose-200/70 transition-all flex items-center gap-1 text-[10px] sm:text-xs font-bold cursor-pointer shadow-2xs active:scale-95"
                title="Günün notunu düzenle"
              >
                <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500" />
                <span>{isEditingQuote ? 'Kapat' : 'Düzenle'}</span>
              </button>
            </div>

            {/* Note Content / Form */}
            {isEditingQuote ? (
              <form onSubmit={handleSaveQuote} className="my-2 sm:my-3 space-y-2 relative z-10">
                <textarea
                  rows={3}
                  required
                  value={quoteInput}
                  onChange={(e) => setQuoteInput(e.target.value)}
                  placeholder="Bugün için ikinize özel romantik bir söz yaz..."
                  className="w-full p-2 sm:p-3 text-xs sm:text-sm rounded-xl sm:rounded-2xl bg-white/95 border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-400 font-sans shadow-inner text-slate-700"
                  autoFocus
                />
                <div className="flex justify-end gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingQuote(false)}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white text-slate-600 border border-slate-200 text-[10px] sm:text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-[10px] sm:text-xs font-bold shadow-md shadow-rose-200 flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>Kaydet 💖</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="my-2 sm:my-3 text-center px-1 relative z-10 flex-1 flex flex-col justify-center">
                <blockquote className="font-romantic font-extrabold text-slate-800 text-xs sm:text-xl leading-snug sm:leading-relaxed tracking-tight">
                  <span className="text-rose-400 font-serif text-sm sm:text-2xl mr-0.5 select-none">“</span>
                  {profile.dailyQuote || 'Seninle geçen her saniye, hayatımın en güzel melodisi...'}
                  <span className="text-rose-400 font-serif text-sm sm:text-2xl ml-0.5 select-none">”</span>
                </blockquote>

                {/* Aesthetic Floral Divider */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 text-[10px] sm:text-xs select-none">
                  <span className="text-rose-400">🌸</span>
                  <span className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent"></span>
                  <span className="text-rose-500 text-[10px] sm:text-xs">💖</span>
                  <span className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent"></span>
                  <span className="text-pink-400">🌷</span>
                </div>
              </div>
            )}

            {/* Footer with Signature and Infinite Heart */}
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-600 pt-1.5 sm:pt-2 border-t border-rose-200/70 relative z-10">
              <span className="font-semibold text-[9px] sm:text-[11px] text-rose-700/80 flex items-center gap-0.5 sm:gap-1 truncate">
                <span>✍️</span>
                <span className="truncate">{profile.dailyQuoteAuthor ? `${profile.dailyQuoteAuthor}` : 'Ceren & Tahir'}</span>
              </span>
              <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[11px] font-bold text-rose-600 bg-rose-200/50 px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full shrink-0">
                <span className="hidden sm:inline">Sonsuz Aşkla</span>
                <span>🌹</span>
                <span className="text-xs sm:text-sm font-black">∞</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
