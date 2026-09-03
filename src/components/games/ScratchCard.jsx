import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  RotateCcw,
  Gift,
  Heart,
  Eye,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

const ScratchCard = () => {
  const { scratchCards, scratchCard, addScratchCard, deleteScratchCard, awardXP } = useSharedData();
  const { playPop, playChime } = useSound();

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleDeleteCard = (cardId) => {
    if (window.confirm('Bu kazı kazan kartını silmek istediğinize emin misiniz?')) {
      playPop();
      deleteScratchCard(cardId);
      if (activeCardIndex >= scratchCards.length - 1) {
        setActiveCardIndex((prev) => Math.max(0, prev - 1));
      }
    }
  };

  // New card form state
  const [newTitle, setNewTitle] = useState('');
  const [newSecretText, setNewSecretText] = useState('');
  const [newReward, setNewReward] = useState('');

  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  const currentCard = scratchCards[activeCardIndex] || scratchCards[0];

  // Initialize Canvas Overlay
  useEffect(() => {
    if (!currentCard) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = canvas.offsetWidth || 340);
    const height = (canvas.height = canvas.offsetHeight || 180);

    // Draw Pink-Silver Shimmer Background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#fda4af');
    grad.addColorStop(0.5, '#f472b6');
    grad.addColorStop(1, '#e879f9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw decorative stars & text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ KAZI & KEŞFET 💖', width / 2, height / 2 - 10);
    ctx.font = '11px sans-serif';
    ctx.fillText('Fare veya parmağınla üzerini kazı!', width / 2, height / 2 + 15);

    setIsRevealed(currentCard.isScratched || false);
    setScratchPercent(currentCard.isScratched ? 100 : 0);
  }, [activeCardIndex, currentCard]);

  // Scratch / Erase logic
  const handleScratch = (e) => {
    if (isRevealed || !currentCard) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2, false);
    ctx.fill();

    checkScratchProgress();
  };

  // Check progress percentage
  const checkScratchProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Sample pixels
    const imgData = ctx.getImageData(0, 0, width, height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 32) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const percent = Math.min(100, Math.round((transparentCount / (totalPixels / 8)) * 100));
    setScratchPercent(percent);

    if (percent > 45 && !isRevealed) {
      handleCompleteReveal();
    }
  };

  const handleCompleteReveal = () => {
    if (!currentCard) return;
    setIsRevealed(true);
    setScratchPercent(100);
    playChime();
    scratchCard(currentCard.id);
    awardXP(30);

    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#fb7185', '#f43f5e', '#fda4af', '#facc15'],
    });
  };

  const handleCreateCard = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSecretText.trim()) return;

    playChime();
    addScratchCard({
      title: newTitle.trim(),
      secretText: newSecretText.trim(),
      reward: newReward.trim() || null,
    });

    setNewTitle('');
    setNewSecretText('');
    setNewReward('');
    setIsAddingNew(false);
    setActiveCardIndex(0);
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/80 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-rose-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base leading-tight">
              Dijital Aşk Kazı Kazanı 🎟️
            </h3>
            <span className="text-[11px] text-pink-600 font-semibold">
              Gizli mesajları ve romantik ödülleri kazıyarak açığa çıkar! ✨
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Card Selector Pills */}
          {scratchCards.length > 0 && (
            <div className="flex gap-1 bg-rose-50/80 p-1 rounded-2xl border border-rose-100 overflow-x-auto">
              {scratchCards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => {
                    playPop();
                    setActiveCardIndex(idx);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeCardIndex === idx
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-rose-600'
                  }`}
                >
                  Kart {idx + 1}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playPop();
                setIsAddingNew(!isAddingNew);
              }}
              className="px-3 py-1.5 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Kart Ekle</span>
            </button>

            {currentCard && (
              <button
                onClick={() => handleDeleteCard(currentCard.id)}
                className="px-3 py-1.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                title="Aktif Kartı Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kartı Sil</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add New Scratch Card Form */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateCard}
            className="mb-5 p-4 bg-pink-50/80 rounded-2xl border border-pink-200 space-y-2.5 max-w-md mx-auto"
          >
            <h4 className="font-bold text-xs text-pink-900">Partnerine Sürpriz Kazı Kazan Kartı Hazırla:</h4>
            <div>
              <label className="text-[11px] text-slate-600 block mb-1">Kart Başlığı:</label>
              <input
                type="text"
                required
                placeholder="Örn: Günün Romantik Sürprizi"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block mb-1">Altındaki Gizli Mesaj:</label>
              <textarea
                rows={2}
                required
                placeholder="Kazındığında açılacak aşk sözü veya iltifat..."
                value={newSecretText}
                onChange={(e) => setNewSecretText(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-white border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block mb-1">Ödül (Opsiyonel):</label>
              <input
                type="text"
                placeholder="Örn: Sımsıkı Sarılma veya Özel Akşam Yemeği"
                value={newReward}
                onChange={(e) => setNewReward(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-pink-200 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1 text-xs rounded-lg bg-slate-100 text-slate-600"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-3.5 py-1 text-xs rounded-lg bg-pink-600 text-white font-bold hover:bg-pink-700 shadow-xs"
              >
                Kartı Kaydet 🎟️
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Main Scratch Card Area */}
      {currentCard ? (
        <div className="max-w-md mx-auto space-y-4">
          <div className="relative w-full h-48 sm:h-52 rounded-3xl overflow-hidden shadow-xl border-2 border-rose-300/80 select-none bg-gradient-to-br from-rose-50 via-white to-pink-50 flex flex-col items-center justify-center p-6 text-center">
            {/* Secret Content Underneath */}
            <div className="space-y-2 relative z-0">
              <div className="inline-flex items-center gap-1 text-xs font-extrabold text-rose-500 bg-rose-100/70 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentCard.title}</span>
              </div>
              <p className="text-xs sm:text-sm font-romantic text-slate-800 leading-snug">
                "{currentCard.secretText}"
              </p>
              {currentCard.reward && (
                <div className="inline-block mt-1 px-3 py-1 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] font-bold">
                  🎁 Ödül: {currentCard.reward}
                </div>
              )}
            </div>

            {/* Scratchable Canvas Overlay */}
            {!isRevealed && (
              <canvas
                ref={canvasRef}
                onMouseDown={() => (isDrawingRef.current = true)}
                onMouseUp={() => (isDrawingRef.current = false)}
                onMouseMove={(e) => {
                  if (isDrawingRef.current) handleScratch(e);
                }}
                onTouchStart={() => (isDrawingRef.current = true)}
                onTouchEnd={() => (isDrawingRef.current = false)}
                onTouchMove={(e) => handleScratch(e)}
                className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none"
              />
            )}
          </div>

          {/* Progress & Quick Reveal Button */}
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span>Kazınma: %{scratchPercent}</span>
              {isRevealed && (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Açıldı
                </span>
              )}
            </div>

            {!isRevealed && (
              <button
                onClick={handleCompleteReveal}
                className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Tümünü Aç</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-8 sm:p-10 text-center border border-rose-100 text-slate-500 space-y-3 max-w-md mx-auto">
          <p className="text-4xl">🎟️</p>
          <h4 className="font-bold text-slate-800 text-sm sm:text-base">Henüz Kazı Kazan Kartı Eklenmedi</h4>
          <p className="text-xs text-slate-500">
            Partnerine sürpriz bir iltifat, aşk mektubu veya hediye kuponu içeren ilk kazı kazan kartını oluştur!
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-pink-200 cursor-pointer"
          >
            İlk Kartı Oluştur 💖
          </button>
        </div>
      )}
    </div>
  );
};

export default ScratchCard;
