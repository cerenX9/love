import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Droplets,
  Heart,
  Award,
  RefreshCw,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

const STAGES = [
  { level: 1, title: 'Minik Filiz 🌱', emoji: '🌱', desc: 'Aşkımızın ilk tohumu!' },
  { level: 2, title: 'Büyüyen Fidan 🌿', emoji: '🌿', desc: 'Her geçen gün daha da güçleniyor.' },
  { level: 3, title: 'Çiçek Açan Ağaç 🌸', emoji: '🌸', desc: 'Güzel hatıralarımızla çiçeklendi.' },
  { level: 4, title: 'Aşk Ağacımız 🌳💖', emoji: '🌳', desc: 'Kökleri sımsıkı ve yemyeşil!' },
  { level: 5, title: 'Büyülü Sevgi Ağacı 👑✨', emoji: '🎄', desc: 'Sonsuz ve ölümsüz bir aşk!' },
];

const PET_TYPES = [
  { id: 'tree', name: 'Aşk Ağacı 🌱', icons: ['🌱', '🌿', '🌸', '🌳', '🎄'] },
  { id: 'cat', name: 'Aşk Kedisi 🐱', icons: ['🐾', '🐱', '😻', '🐈‍⬛', '👑🐱'] },
  { id: 'bunny', name: 'Tatlı Tavşan 🐰', icons: ['🥕', '🐰', '🐇', '🥰🐰', '👑🐰'] },
];

const VirtualPetTree = () => {
  const { petData, interactPet } = useSharedData();
  const { playPop, playChime } = useSound();

  const [petType, setPetType] = useState(petData?.type || 'tree');
  const [animationEffect, setAnimationEffect] = useState(null);

  const level = petData?.level || 1;
  const xp = petData?.xp || 0;
  const currentLevelMaxXp = level * 100;
  const prevLevelXp = (level - 1) * 100;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((xp - prevLevelXp) / (currentLevelMaxXp - prevLevelXp)) * 100)
  );

  const selectedTypeObj = PET_TYPES.find((p) => p.id === petType) || PET_TYPES[0];
  const currentStageIndex = Math.min(level - 1, selectedTypeObj.icons.length - 1);
  const currentEmoji = selectedTypeObj.icons[currentStageIndex];

  // Water Interaction
  const handleWater = () => {
    playPop();
    setAnimationEffect('water');
    interactPet('water');
    setTimeout(() => setAnimationEffect(null), 1500);

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#60a5fa', '#93c5fd'],
    });
  };

  // Pet / Love Interaction
  const handlePet = () => {
    playChime();
    setAnimationEffect('love');
    interactPet('pet');
    setTimeout(() => setAnimationEffect(null), 1500);

    confetti({
      particleCount: 35,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#fb7185', '#f43f5e', '#fda4af'],
    });
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 border border-rose-200/80 shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-pink-300/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
              Aşk Ağacımız & Evcil Hayvanımız
            </h3>
            <span className="text-[10px] text-emerald-600 font-semibold">
              Birlikte büyüttüğümüz canlı sevgi 💖
            </span>
          </div>
        </div>

        {/* Character Switcher */}
        <div className="flex bg-rose-50 p-1 rounded-2xl border border-rose-100 text-xs">
          {PET_TYPES.map((pt) => (
            <button
              key={pt.id}
              onClick={() => {
                playPop();
                setPetType(pt.id);
              }}
              className={`px-2 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                petType === pt.id
                  ? 'bg-white text-rose-600 shadow-xs scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {pt.id === 'tree' ? '🌱 Ağaç' : pt.id === 'cat' ? '🐱 Kedi' : '🐰 Tavşan'}
            </button>
          ))}
        </div>
      </div>

      {/* Center Stage & Visual */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-3">
        {/* Animated Avatar / Tree Display */}
        <div className="relative flex flex-col items-center justify-center w-36 h-36 sm:w-44 sm:h-44 bg-gradient-to-b from-rose-50/80 to-white rounded-full border-2 border-rose-200/80 shadow-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${petType}-${level}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: [1, 1.08, 1],
                y: [0, -6, 0],
                opacity: 1,
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: 'easeInOut',
              }}
              className="text-6xl sm:text-7xl filter drop-shadow-md select-none cursor-pointer"
              onClick={handlePet}
            >
              {currentEmoji}
            </motion.div>
          </AnimatePresence>

          {/* Floating Effect Emojis */}
          {animationEffect === 'water' && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.5 }}
              animate={{ opacity: 1, y: -40, scale: 1.4 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 text-2xl pointer-events-none"
            >
              💧✨
            </motion.div>
          )}
          {animationEffect === 'love' && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.5 }}
              animate={{ opacity: 1, y: -40, scale: 1.5 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 text-2xl pointer-events-none"
            >
              💖🥰
            </motion.div>
          )}

          {/* Level Badge */}
          <div className="absolute -bottom-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold text-[11px] px-3 py-0.5 rounded-full shadow-md border border-white">
            Seviye {level}
          </div>
        </div>

        {/* Level Stats & Actions */}
        <div className="flex-1 w-full space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>{STAGES[Math.min(level - 1, STAGES.length - 1)].title}</span>
              <span className="text-rose-600">{xp} / {currentLevelMaxXp} XP</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3.5 bg-rose-100 rounded-full overflow-hidden p-0.5 border border-rose-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-emerald-400 rounded-full shadow-inner relative"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 italic">
              {STAGES[Math.min(level - 1, STAGES.length - 1)].desc}
            </p>
          </div>

          {/* Interaction Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleWater}
              className="py-2.5 px-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>Sula & Besle (+20 XP)</span>
            </button>

            <button
              onClick={handlePet}
              className="py-2.5 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-400" />
              <span>Sev & Okşa (+20 XP)</span>
            </button>
          </div>

          {/* Info hint */}
          <div className="p-2.5 bg-white/80 rounded-xl border border-rose-100 text-[11px] text-slate-600 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Not yazdıkça, fotoğraf yükledikçe ve test çözdükçe aşk ağacınız otomatik büyür! 🌱✨</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualPetTree;
