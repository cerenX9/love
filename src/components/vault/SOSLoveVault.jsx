import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  HeartHandshake,
  Heart,
  Volume2,
  X,
  Plus,
  Sparkles,
  Send,
  Smile,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

const SOSLoveVault = () => {
  const { sosVault, addSOSMessage, currentPartner, addNote, awardXP } = useSharedData();
  const { playPop, playChime } = useSound();

  const [activeSOS, setActiveSOS] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New SOS Card Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newIcon, setNewIcon] = useState('💖');

  // Open SOS Letter Modal
  const handleOpenLetter = (item) => {
    playChime();
    setActiveSOS(item);
    awardXP(15);
  };

  // Send Hug / Love Reaction
  const handleSendComfort = () => {
    playPop();
    addNote(
      `💌 Acil Sevgi Kasası'ndan sana sıcacık bir sarılma gönderdim! Seni her şeyden çok seviyorum, hep yanındayım. (${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })})`,
      'rose'
    );
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fb7185', '#f43f5e', '#fda4af', '#c084fc'],
    });
    alert('Sımsıcak bir teselli & sevgi notu panoya iletildi! ❤️✨');
  };

  // Submit New SOS Card
  const handleCreateSOS = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    playChime();
    addSOSMessage({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Aşkımızın özel sığınağı...',
      message: newMessage.trim(),
      icon: newIcon,
      color: 'from-rose-400 to-pink-500',
    });

    setNewTitle('');
    setNewSubtitle('');
    setNewMessage('');
    setIsAddingNew(false);
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/80 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shadow-md">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base leading-tight">
              SOS Acil Sevgi Kasası 🫂💖
            </h3>
            <span className="text-[11px] text-rose-500 font-semibold">
              Kötü hissettiğinde, yalnız kaldığında veya beni özlediğinde aç!
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            playPop();
            setIsAddingNew(!isAddingNew);
          }}
          className="px-3.5 py-1.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-200 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yeni Durum Ekle</span>
        </button>
      </div>

      {/* Add New SOS Form */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateSOS}
            className="mb-6 p-4 sm:p-5 bg-rose-50/80 rounded-2xl border border-rose-200 space-y-3"
          >
            <h4 className="font-bold text-xs text-rose-900">Partnerin İçin Yeni Bir Teselli Mektubu Hazırla:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <label className="text-[11px] text-slate-600 block mb-1">Durum Başlığı:</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Moralim çok bozuk olduğunda..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">İkon:</label>
                <select
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none text-base"
                >
                  <option value="🥺">🥺 Kırgın / Üzgün</option>
                  <option value="😂">😂 Gülmeye İhtiyaç</option>
                  <option value="❤️">❤️ Çok Özlediğimde</option>
                  <option value="🌙">🌙 Gece & Uyku</option>
                  <option value="💆‍♀️">💆‍♀️ Stresli</option>
                  <option value="✈️">✈️ Geliyorum</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 block mb-1">Teselli & Sevgi Mektubu:</label>
              <textarea
                rows={3}
                required
                placeholder="Partnerin bu butona bastığında okuyacağı sıcacık mektup..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
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
                Kasaya Kaydet 🔒
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* SOS Cards Grid */}
      {sosVault.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 sm:p-10 text-center border border-rose-100 text-slate-500 space-y-3">
          <p className="text-4xl">🫂</p>
          <h4 className="font-bold text-slate-800 text-sm sm:text-base">Henüz Acil Sevgi Kasasına Mektup Eklenmedi</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Partnerin üzgün olduğunda, seni özlediğinde veya güvende hissetmek istediğinde okuyacağı ilk teselli mektubunu yaz!
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-200 cursor-pointer"
          >
            İlk Durumu Ekle 🫂
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {sosVault.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenLetter(item)}
              className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-white/90 to-rose-50/60 border border-rose-200/80 shadow-md hover:shadow-lg hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between min-h-[140px] group"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl filter drop-shadow">{item.icon || '💖'}</span>
                <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                  Aç 💌
                </span>
              </div>

              <div className="mt-2">
                <h4 className="font-extrabold text-sm sm:text-base text-slate-800 group-hover:text-rose-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {item.subtitle || 'Sımsıcak aşk mektubu seni bekliyor...'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Active SOS Modal / Letter Reader */}
      {activeSOS &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md"
            style={{ zIndex: 99999 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 relative shadow-2xl border border-rose-200"
              style={{ zIndex: 100000 }}
            >
              <button
                onClick={() => setActiveSOS(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-rose-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center mx-auto text-3xl shadow-lg shadow-rose-200">
                  {activeSOS.icon || '💖'}
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                  {activeSOS.title}
                </h3>
              </div>

              {/* Romantic Letter Content */}
              <div className="my-6 p-5 rounded-2xl bg-gradient-to-b from-rose-50/80 to-pink-50/40 border border-rose-200/80 shadow-inner">
                <p className="font-romantic text-base sm:text-lg text-slate-800 leading-relaxed italic">
                  "{activeSOS.message}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleSendComfort}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Sımsıkı Sarılma Gönder 🤗</span>
                </button>

                <button
                  onClick={() => setActiveSOS(null)}
                  className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default SOSLoveVault;
