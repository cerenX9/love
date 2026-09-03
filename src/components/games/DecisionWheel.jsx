import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Sparkles,
  Plus,
  Trash2,
  Trophy,
  Utensils,
  Film,
  Compass,
  Edit2,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

const DecisionWheel = () => {
  const { wheelConfig, updateWheelConfig, awardXP } = useSharedData();
  const { playPop, playChime } = useSound();

  const [activeCategory, setActiveCategory] = useState(wheelConfig.currentCategory || 'food');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [winner, setWinner] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newOptionText, setNewOptionText] = useState('');

  const currentCategoryData =
    wheelConfig.categories?.[activeCategory] || wheelConfig.categories?.food;
  const options = currentCategoryData?.options || [];

  const PASTEL_COLORS = [
    '#fb7185',
    '#f43f5e',
    '#fb923c',
    '#facc15',
    '#34d399',
    '#38bdf8',
    '#818cf8',
    '#c084fc',
    '#f472b6',
  ];

  // Spin Wheel function
  const handleSpin = () => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setWinner(null);
    playPop();

    // Random extra rotations (5 to 8 full spins) + random slice target
    const totalSlices = options.length;
    const sliceAngle = 360 / totalSlices;
    const randomExtraDegree = Math.floor(Math.random() * 360);
    const totalDegree = rotationDegree + 1800 + randomExtraDegree;

    setRotationDegree(totalDegree);

    // Calculate winning index after spin stops (4 seconds)
    setTimeout(() => {
      setIsSpinning(false);
      const normalizedDegree = (totalDegree % 360 + 360) % 360;
      // Top indicator is at 270 deg / 90 deg offset
      const winningIndex =
        Math.floor((360 - (normalizedDegree % 360)) / sliceAngle) % totalSlices;
      const winningOption = options[winningIndex];

      setWinner(winningOption);
      playChime();
      awardXP(20);

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fb7185', '#f43f5e', '#fb923c', '#c084fc'],
      });
    }, 4200);
  };

  // Add Option
  const handleAddOption = (e) => {
    e.preventDefault();
    if (!newOptionText.trim()) return;

    const newOpt = {
      id: 'opt-' + Date.now(),
      text: newOptionText.trim(),
      color: PASTEL_COLORS[options.length % PASTEL_COLORS.length],
    };

    const updatedConfig = {
      ...wheelConfig,
      categories: {
        ...wheelConfig.categories,
        [activeCategory]: {
          ...currentCategoryData,
          options: [...options, newOpt],
        },
      },
    };

    updateWheelConfig(updatedConfig);
    setNewOptionText('');
  };

  // Delete Option
  const handleDeleteOption = (id) => {
    if (options.length <= 2) {
      alert('Çarkta en az 2 seçenek bulunmalıdır!');
      return;
    }
    const updatedConfig = {
      ...wheelConfig,
      categories: {
        ...wheelConfig.categories,
        [activeCategory]: {
          ...currentCategoryData,
          options: options.filter((o) => o.id !== id),
        },
      },
    };
    updateWheelConfig(updatedConfig);
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/80 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center shadow-md">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base leading-tight">
              "Bugün Ne Yapsak?" Çarkıfeleği 🎡
            </h3>
            <span className="text-[11px] text-rose-500 font-semibold">
              Kararsız kaldığınızda aşk çarkını çevirin! ✨
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 bg-rose-50/80 p-1 rounded-2xl border border-rose-100 overflow-x-auto">
          {Object.keys(wheelConfig.categories || {}).map((catKey) => {
            const cat = wheelConfig.categories[catKey];
            return (
              <button
                key={catKey}
                onClick={() => {
                  playPop();
                  setActiveCategory(catKey);
                  setWinner(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === catKey
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-rose-600'
                }`}
              >
                {cat.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wheel Area */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 my-4">
        {/* Wheel Canvas / SVG */}
        <div className="relative flex items-center justify-center">
          {/* Top Indicator Arrow Needle */}
          <div className="absolute -top-3 z-30 flex flex-col items-center">
            <div className="w-6 h-6 bg-gradient-to-b from-rose-600 to-pink-500 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">
              ▼
            </div>
          </div>

          {/* Spinning Wheel */}
          <div
            className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-rose-200/90 shadow-2xl relative overflow-hidden bg-white"
            style={{
              transform: `rotate(${rotationDegree}deg)`,
              transition: isSpinning
                ? 'transform 4.2s cubic-bezier(0.15, 0.9, 0.2, 1)'
                : 'none',
            }}
          >
            {options.map((option, idx) => {
              const total = options.length;
              const angle = 360 / total;
              const rotate = idx * angle;

              return (
                <div
                  key={option.id || idx}
                  className="absolute top-0 left-0 w-full h-full origin-center flex justify-center items-start pt-3 pointer-events-none"
                  style={{
                    transform: `rotate(${rotate + angle / 2}deg)`,
                    clipPath: `polygon(50% 50%, ${
                      50 + 50 * Math.tan(((angle / 2) * Math.PI) / 180)
                    }% 0%, ${
                      50 - 50 * Math.tan(((angle / 2) * Math.PI) / 180)
                    }% 0%)`,
                    backgroundColor: option.color || PASTEL_COLORS[idx % PASTEL_COLORS.length],
                  }}
                >
                  <span
                    className="text-[11px] sm:text-xs font-bold text-white filter drop-shadow pt-2 text-center max-w-[85px] truncate"
                    style={{
                      transform: 'rotate(0deg)',
                    }}
                  >
                    {option.text}
                  </span>
                </div>
              );
            })}

            {/* Wheel Center Hub */}
            <div className="absolute inset-0 m-auto w-14 h-14 bg-white rounded-full border-4 border-rose-300 shadow-md flex items-center justify-center z-20">
              <span className="text-xl">💖</span>
            </div>
          </div>
        </div>

        {/* Action & Results Panel */}
        <div className="flex-1 w-full max-w-md space-y-4">
          {/* Spin Trigger Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isSpinning
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-rose-300 active:scale-98'
            }`}
          >
            <RotateCcw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Çark Dönüyor...' : 'Çarkı Çevir! 🎯'}</span>
          </button>

          {/* Winner Result Card */}
          <AnimatePresence>
            {winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl text-white text-center shadow-lg space-y-1 relative overflow-hidden"
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-200">
                  <Trophy className="w-4 h-4" />
                  <span>KAZANAN SEÇENEK:</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-extrabold text-white">
                  "{winner.text}"
                </h4>
                <p className="text-[11px] text-rose-100">
                  Kader kararını verdi! Şimdi bunu uygulama zamanı 💖✨
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slices Editor Accordion */}
          <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Seçenekleri Düzenle ({options.length})
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-[11px] text-rose-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditing ? 'Gizle' : 'Yönet'}</span>
              </button>
            </div>

            {/* Add new slice */}
            <form onSubmit={handleAddOption} className="flex gap-2">
              <input
                type="text"
                value={newOptionText}
                onChange={(e) => setNewOptionText(e.target.value)}
                placeholder="Yeni seçenek yaz (Örn: Sinema)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ekle</span>
              </button>
            </form>

            {/* Options List */}
            {isEditing && (
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {options.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex items-center justify-between p-2 bg-white rounded-xl border border-rose-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: opt.color }}
                      />
                      <span className="font-medium text-slate-800">{opt.text}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteOption(opt.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionWheel;
