import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Calendar, Lock, Sparkles, Heart } from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

const CATEGORIES = [
  { id: 'anniversary', name: 'Yıldönümü', icon: '💖', color: 'rose' },
  { id: 'birthday', name: 'Doğum Günü', icon: '🎂', color: 'pink' },
  { id: 'date', name: 'Randevu / Buluşma', icon: '🍷', color: 'purple' },
  { id: 'travel', name: 'Geliyorum', icon: '✈️', color: 'sky' },
  { id: 'pasta', name: 'MAKARNA!', icon: '🍝', color: 'orange' },
  { id: 'class', name: 'Dersi Var', icon: '📚', color: 'blue' },
  { id: 'exam', name: 'Sınavım Var', icon: '✍️', color: 'emerald' },
  { id: 'other_person', name: 'Başkasıyla Buluşcam', icon: '🤡', color: 'amber' },
  { id: 'milestone', name: 'Özel An / Hatıra', icon: '⭐', color: 'amber' },
  { id: 'capsule', name: 'Zaman Kapsülü', icon: '🔒', color: 'indigo' },
];

const EventModal = ({ isOpen, onClose, selectedDate = '' }) => {
  const { addEvent } = useSharedData();
  const { playPop, playChime } = useSound();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(selectedDate || new Date().toISOString().substring(0, 10));
  const [category, setCategory] = useState('date');
  const [description, setDescription] = useState('');
  const [isTimeCapsule, setIsTimeCapsule] = useState(false);
  const [secretMessage, setSecretMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const catObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

    playChime();
    addEvent({
      title: title.trim(),
      date,
      category,
      icon: catObj.icon,
      description: description.trim(),
      isTimeCapsule,
      secretMessage: isTimeCapsule ? secretMessage.trim() : null,
    });

    onClose();
  };

  const handleCategorySelect = (catId) => {
    playPop();
    setCategory(catId);
    if (catId === 'capsule') {
      setIsTimeCapsule(true);
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
        className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 relative shadow-2xl border border-rose-200 max-h-[90vh] overflow-y-auto"
        style={{ zIndex: 100000 }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">Özel Gün / Kapsül Ekle</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-rose-100/60 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Category Selector */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5 text-xs">Kategori Seçin</label>
            <div className="grid grid-cols-3 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`p-2 rounded-xl text-center border text-xs font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    category === cat.id
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200'
                      : 'bg-white/80 hover:bg-rose-50 text-slate-700 border-rose-100'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="truncate w-full">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1 text-xs">Etkinlik Başlığı</label>
            <input
              type="text"
              required
              placeholder="Örn: 2. Yıldönümü Yemeğimiz 🍷"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Date */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1 text-xs">Tarih</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1 text-xs">Açıklama / Not</label>
            <input
              type="text"
              placeholder="Detaylar, yer veya hatırlatıcı..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Time Capsule Toggle */}
          <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200/70">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isTimeCapsule || category === 'capsule'}
                onChange={(e) => setIsTimeCapsule(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-400"
              />
              <span className="font-bold text-purple-900 text-xs flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                Geleceğe Kilitli Not (Time Capsule) Yap
              </span>
            </label>

            {(isTimeCapsule || category === 'capsule') && (
              <div className="mt-2.5">
                <label className="block text-[11px] font-semibold text-purple-800 mb-1">
                  🔒 Kilitli Gizli Mesaj (Yalnızca o gün açılacak):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Sevgiline o gün ulaştığında açılacak sürpriz mektubunu buraya yaz..."
                  value={secretMessage}
                  onChange={(e) => setSecretMessage(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-white border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 cursor-pointer"
          >
            Kaydet 💖
          </button>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default EventModal;
