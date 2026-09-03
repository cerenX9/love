import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Gift,
  Sparkles,
  Heart,
  Infinity,
  Layers,
  Ticket,
  RotateCcw,
  Pencil,
} from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

const GRADIENTS = [
  { id: 'rose', value: 'from-rose-400 to-pink-500', name: 'Gül Pembesi' },
  { id: 'amber', value: 'from-amber-400 to-orange-500', name: 'Sıcak Turuncu' },
  { id: 'purple', value: 'from-purple-400 to-indigo-500', name: 'Mor Rüyası' },
  { id: 'emerald', value: 'from-emerald-400 to-teal-500', name: 'Zümrüt Yeşili' },
  { id: 'sky', value: 'from-sky-400 to-blue-500', name: 'Gök Mavisi' },
];

const AddCouponModal = ({ isOpen, onClose, couponToEdit = null }) => {
  const { addCoupon, updateCoupon } = useSharedData();
  const { playChime, playPop } = useSound();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0].value);
  const [usageType, setUsageType] = useState('single'); // 'single' | 'custom' | 'infinite'
  const [customUses, setCustomUses] = useState(3);
  const [resetUsage, setResetUsage] = useState(false);

  useEffect(() => {
    if (couponToEdit) {
      setTitle(couponToEdit.title || '');
      setDescription(couponToEdit.description || '');
      setSelectedGradient(couponToEdit.color || GRADIENTS[0].value);

      if (couponToEdit.isInfinite) {
        setUsageType('infinite');
        setCustomUses(3);
      } else if (couponToEdit.maxUses && Number(couponToEdit.maxUses) > 1) {
        setUsageType('custom');
        setCustomUses(Number(couponToEdit.maxUses));
      } else {
        setUsageType('single');
        setCustomUses(3);
      }
      setResetUsage(false);
    } else {
      setTitle('');
      setDescription('');
      setSelectedGradient(GRADIENTS[0].value);
      setUsageType('single');
      setCustomUses(3);
      setResetUsage(false);
    }
  }, [couponToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    playChime();

    const isInfinite = usageType === 'infinite';
    const maxUses = isInfinite ? null : usageType === 'custom' ? Math.max(2, Number(customUses) || 2) : 1;

    if (couponToEdit) {
      updateCoupon(couponToEdit.id, {
        title: title.trim(),
        description: description.trim() || 'Aşk kuponu.',
        color: selectedGradient,
        isInfinite,
        maxUses,
        ...(resetUsage
          ? { usedCount: 0, isRedeemed: false, redeemedAt: null, redeemedBy: null }
          : {}),
      });
    } else {
      addCoupon({
        title: title.trim(),
        description: description.trim() || 'Aşk kuponu.',
        category: 'custom',
        color: selectedGradient,
        isInfinite,
        maxUses,
      });
    }

    onClose();
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
        className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 relative shadow-2xl border border-rose-200 max-h-[90vh] overflow-y-auto"
        style={{ zIndex: 100000 }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
              {couponToEdit ? <Pencil className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
            </div>
            <h3 className="font-bold text-lg text-slate-800">
              {couponToEdit ? 'Aşk Kuponunu Düzenle' : 'Yeni Aşk Kuponu Oluştur'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-rose-100/60 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="font-semibold text-slate-700 block mb-1 text-xs">Kupon Başlığı</label>
            <input
              type="text"
              required
              placeholder="Örn: 1 Gün Boyunca Tüm İnatlar Serbest 🎀"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1 text-xs">
              Kuponun Açıklaması / Şartı
            </label>
            <textarea
              rows={2}
              placeholder="Bu kupon ne zaman ve nasıl kullanılabilir..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Kullanım Hakkı Seçimi (Tek Seferlik, Çoklu, Sonsuz) */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5 text-xs">
              Kullanım Hakkı
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setUsageType('single');
                }}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  usageType === 'single'
                    ? 'bg-rose-50 border-rose-400 text-rose-700 font-bold shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-rose-50/50'
                }`}
              >
                <Ticket className="w-4 h-4 text-rose-500" />
                <span className="text-xs">Tek Seferlik</span>
                <span className="text-[10px] text-slate-400 font-normal">1 kez</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPop();
                  setUsageType('custom');
                }}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  usageType === 'custom'
                    ? 'bg-amber-50 border-amber-400 text-amber-800 font-bold shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-rose-50/50'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-500" />
                <span className="text-xs">Çoklu Kullanım</span>
                <span className="text-[10px] text-slate-400 font-normal">{customUses} kez</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPop();
                  setUsageType('infinite');
                }}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  usageType === 'infinite'
                    ? 'bg-rose-50 border-rose-400 text-rose-700 font-bold shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 text-slate-600 hover:bg-rose-50/50'
                }`}
              >
                <Infinity className="w-4 h-4 text-rose-500" />
                <span className="text-xs">Sonsuz Kullanım</span>
                <span className="text-[10px] text-slate-400 font-normal">Sınırsız ♾️</span>
              </button>
            </div>

            {/* Çoklu Kullanım Sayı Belirleme */}
            <AnimatePresence>
              {usageType === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-wrap items-center justify-between gap-2"
                >
                  <span className="text-xs font-semibold text-amber-950">
                    Kaç kez kullanılabilsin?
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[2, 3, 5, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          playPop();
                          setCustomUses(num);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          customUses === num
                            ? 'bg-amber-500 text-white shadow-xs scale-105'
                            : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <div className="flex items-center border border-amber-300 rounded-xl bg-white overflow-hidden ml-1">
                      <button
                        type="button"
                        onClick={() => {
                          playPop();
                          setCustomUses((prev) => Math.max(2, prev - 1));
                        }}
                        className="px-2 py-1 hover:bg-amber-100 text-amber-800 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={2}
                        max={99}
                        value={customUses}
                        onChange={(e) =>
                          setCustomUses(Math.max(2, Math.min(99, parseInt(e.target.value) || 2)))
                        }
                        className="w-9 text-center font-bold text-xs text-amber-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          playPop();
                          setCustomUses((prev) => Math.min(99, prev + 1));
                        }}
                        className="px-2 py-1 hover:bg-amber-100 text-amber-800 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {usageType === 'infinite' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 px-3 py-2 rounded-xl bg-rose-50/70 border border-rose-200/60 text-[11px] text-rose-700 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Bu kupon hiç tükenmez, istediğiniz zaman dilediğinizce kullanabilirsiniz! ✨</span>
              </motion.div>
            )}
          </div>

          {/* Edit Modunda Kullanım Sıfırlama Opsiyonu */}
          {couponToEdit && ((couponToEdit.usedCount || 0) > 0 || couponToEdit.isRedeemed) && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-700">Kullanımları Sıfırla</p>
                <p className="text-[10px] text-slate-500">
                  Şu ana kadar {couponToEdit.usedCount || 1} kez kullanılmış
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={resetUsage}
                  onChange={(e) => setResetUsage(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
              </label>
            </div>
          )}

          {/* Color Gradient Selection */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5 text-xs">Kart Rengi</label>
            <div className="flex gap-2">
              {GRADIENTS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    playPop();
                    setSelectedGradient(g.value);
                  }}
                  className={`flex-1 h-8 rounded-xl bg-gradient-to-r ${g.value} transition-transform cursor-pointer ${
                    selectedGradient === g.value ? 'ring-2 ring-rose-500 scale-110 shadow-sm' : 'opacity-80'
                  }`}
                  title={g.name}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 cursor-pointer transition-all"
          >
            {couponToEdit ? 'Değişiklikleri Kaydet ✨' : 'Kuponu Kaydet 🎟️'}
          </button>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default AddCouponModal;
