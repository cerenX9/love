import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Shuffle, Plus, HelpCircle, Check, Search } from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

const ReasonsFlipCards = () => {
  const { reasons, addReason } = useSharedData();
  const { playPop, playChime } = useSound();

  const [flippedCardIds, setFlippedCardIds] = useState({});
  const [randomModalReason, setRandomModalReason] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFlip = (id) => {
    playPop();
    setFlippedCardIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRandomPick = () => {
    if (reasons.length === 0) return;
    playChime();
    const randomIndex = Math.floor(Math.random() * reasons.length);
    setRandomModalReason(reasons[randomIndex]);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;

    playChime();
    addReason(newTitle.trim(), newText.trim());
    setNewTitle('');
    setNewText('');
    setShowAddForm(false);
  };

  const filteredReasons = reasons.filter((r) => {
    if (!searchQuery.trim()) return true;
    return (
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/70 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-rose-300">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Seni Sevmemin 100 Nedeni ("Neden Sen?")
              </h2>
              <p className="text-xs text-slate-500">
                Kartlara tıklayarak arkasındaki romantik nedenleri keşfet 💕
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomPick}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-purple-200 transition-all active:scale-95 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Günün Nedeni</span>
            </button>

            <button
              onClick={() => {
                playPop();
                setShowAddForm(!showAddForm);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Neden Ekle</span>
            </button>
          </div>
        </div>

        {/* Add Reason Form Drawer */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddSubmit}
              className="mt-4 pt-4 border-t border-rose-100 space-y-3 overflow-hidden"
            >
              <h4 className="text-xs font-bold text-rose-800">Yeni Bir Aşk Nedeni Yaz</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Başlık (Örn: Gülüşün)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <input
                  type="text"
                  required
                  placeholder="Açıklama (Neden seviyorsun?)"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-xs"
                >
                  Kaydet
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* 3D Flip Cards Grid */}
      {filteredReasons.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 sm:p-10 text-center border border-rose-100 text-slate-500 space-y-3">
          <p className="text-4xl">💖</p>
          <h4 className="font-bold text-slate-800 text-sm sm:text-base">Henüz "Neden Sen?" Maddesi Eklenmedi</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Partnerini neden her şeyden çok sevdiğine dair ilk özel sebebi yukarıdaki "Yeni Neden Ekle" butonuna basarak yazabilirsin!
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-200 cursor-pointer"
          >
            İlk Sebebi Ekle 💖
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredReasons.map((item) => {
            const isFlipped = Boolean(flippedCardIds[item.id]);

          return (
            <div
              key={item.id}
              onClick={() => toggleFlip(item.id)}
              className="h-48 perspective-1000 cursor-pointer select-none"
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', damping: 14 }}
                className="w-full h-full relative transform-style-3d rounded-3xl shadow-md hover:shadow-xl transition-shadow"
              >
                {/* FRONT OF CARD */}
                <div className="absolute inset-0 backface-hidden glass-card rounded-3xl p-5 border-2 border-rose-200/80 flex flex-col justify-between items-center text-center bg-gradient-to-br from-white/90 to-rose-50/90">
                  <span className="text-[11px] font-bold text-rose-400 tracking-wider uppercase">
                    Neden #{item.id}
                  </span>

                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shadow-inner">
                    <Heart className="w-6 h-6 fill-rose-500" />
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-2">{item.title}</h4>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Arkası için tıkla 🔄
                    </span>
                  </div>
                </div>

                {/* BACK OF CARD */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-5 border-2 border-rose-400 flex flex-col justify-between text-center bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-xl">
                  <span className="text-[10px] font-bold text-rose-200 uppercase tracking-widest">
                    #{item.id} • {item.title}
                  </span>

                  <p className="font-romantic text-base sm:text-lg leading-snug italic px-1">
                    "{item.text}"
                  </p>

                  <span className="text-[10px] text-rose-200 font-medium">
                    Seni çok seviyorum ❤️
                  </span>
                </div>
              </motion.div>
            </div>
          );
        })}
        </div>
      )}

      {/* Random Reason Modal */}
      {randomModalReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm glass-card rounded-3xl p-6 sm:p-8 relative shadow-2xl border border-rose-200 text-center space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-200 animate-pulseGlow">
              <Sparkles className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
              Günün Romantik Nedeni #{randomModalReason.id}
            </span>

            <h3 className="text-lg font-bold text-slate-800">{randomModalReason.title}</h3>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-slate-800 font-romantic text-lg italic">
              "{randomModalReason.text}"
            </div>

            <button
              onClick={() => setRandomModalReason(null)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-rose-200 cursor-pointer"
            >
              Harika! Kalbime Not Ettim 💖
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReasonsFlipCards;
