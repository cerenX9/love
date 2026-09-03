import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Sparkles, X, Calendar, Clock, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSound } from '../../context/SoundContext';
import { formatDateTurkish, getTimeRemaining, isDateReached } from '../../utils/dateUtils';

const TimeCapsuleModal = ({ event, isOpen, onClose }) => {
  const { playPop, playLock, playChime } = useSound();
  const [isWiggling, setIsWiggling] = useState(false);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);

  if (!isOpen || !event) return null;

  const isUnlocked = isDateReached(event.date);
  const remaining = getTimeRemaining(event.date);

  const handleLockedClick = () => {
    playLock();
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 500);
  };

  const handleUnlockedOpen = () => {
    if (!hasTriggeredConfetti) {
      playChime();
      confetti({
        particleCount: 75,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#fb7185', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981'],
      });
      setHasTriggeredConfetti(true);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md"
      style={{ zIndex: 99999 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 relative shadow-2xl border border-rose-200 text-center"
        style={{ zIndex: 100000 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-rose-100/60 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isUnlocked ? (
          // UNLOCKED CAPSULE VIEW
          <div onMouseEnter={handleUnlockedOpen} className="space-y-4">
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-amber-200"
            >
              <Unlock className="w-8 h-8" />
            </motion.div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zaman Kapsülü Açıldı! 🎉</span>
            </div>

            <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
            <p className="text-xs text-slate-500">{formatDateTurkish(event.date)} tarihinde mühürlenmişti</p>

            {/* Secret Message Letter */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-inner text-left relative overflow-hidden my-4"
            >
              <span className="absolute top-2 right-2 text-2xl opacity-20">💌</span>
              <p className="font-romantic text-lg sm:text-xl text-slate-800 leading-relaxed italic">
                "{event.secretMessage || event.description || 'Geleceğe bırakılan sıcacık bir sevgi notu...'}"
              </p>
              <div className="mt-3 text-right">
                <span className="text-xs font-bold text-rose-500">Sonsuz Sevgiyle ❤️</span>
              </div>
            </motion.div>

            <button
              onClick={() => {
                handleUnlockedOpen();
                onClose();
              }}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 cursor-pointer"
            >
              Kapsülü Kapat 💖
            </button>
          </div>
        ) : (
          // LOCKED CAPSULE VIEW
          <div className="space-y-4">
            <motion.div
              animate={{
                rotate: isWiggling ? [-10, 10, -10, 10, 0] : 0,
                scale: isWiggling ? 1.15 : 1,
              }}
              transition={{ duration: 0.4 }}
              onClick={handleLockedClick}
              className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-purple-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-purple-200 cursor-pointer"
            >
              <Lock className="w-8 h-8" />
            </motion.div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
              <Lock className="w-3 h-3" />
              <span>Geleceğe Kilitli Not 🔒</span>
            </div>

            <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>

            <p className="text-xs text-rose-600 font-semibold">
              Bu not {formatDateTurkish(event.date)} tarihinde açılacak!
            </p>

            {/* Locked Box Graphic */}
            <div
              onClick={handleLockedClick}
              className="p-5 rounded-2xl bg-rose-50/70 border border-dashed border-rose-300 text-center my-4 cursor-pointer hover:bg-rose-100/50 transition-colors"
            >
              <span className="text-4xl block mb-2">🎁🔒</span>
              <p className="text-xs font-medium text-slate-600">
                Kapsül henüz mühürlü. Kilidin açılması için geri sayım devam ediyor!
              </p>
            </div>

            {/* Countdown Grid */}
            <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto text-center">
              <div className="bg-white/80 p-2 rounded-xl border border-purple-100">
                <span className="text-lg font-bold text-purple-800 font-mono">{remaining.days}</span>
                <span className="block text-[10px] text-purple-600 font-semibold">Gün</span>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-purple-100">
                <span className="text-lg font-bold text-purple-800 font-mono">{remaining.hours}</span>
                <span className="block text-[10px] text-purple-600 font-semibold">Saat</span>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-purple-100">
                <span className="text-lg font-bold text-purple-800 font-mono">{remaining.minutes}</span>
                <span className="block text-[10px] text-purple-600 font-semibold">Dakika</span>
              </div>
            </div>

            <button
              onClick={handleLockedClick}
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Kilidi Zorla 🔒
            </button>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
};

export default TimeCapsuleModal;
