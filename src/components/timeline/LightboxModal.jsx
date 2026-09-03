import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MapPin, Calendar, Trash2, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import { formatDateTurkish } from '../../utils/dateUtils';

const LightboxModal = ({ memory, isOpen, onClose, onNext, onPrev }) => {
  const { deleteMemory, likeMemory } = useSharedData();
  const { playPop } = useSound();

  if (!isOpen || !memory) return null;

  const handleLike = () => {
    playPop();
    likeMemory(memory.id);
  };

  const handleDelete = () => {
    if (window.confirm('Bu anıyı silmek istediğinize emin misiniz?')) {
      playPop();
      deleteMemory(memory.id);
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md"
      style={{ zIndex: 99999 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl bg-white rounded-3xl p-4 sm:p-6 shadow-2xl relative border border-rose-100 flex flex-col max-h-[95vh] overflow-y-auto"
        style={{ zIndex: 100000 }}
      >
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📸</span>
            <h3 className="font-bold text-base sm:text-lg text-slate-800">{memory.title}</h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDelete}
              title="Anıyı Sil"
              className="p-2 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Polaroid Card Area */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-100 shadow-inner flex items-center justify-center min-h-[260px] max-h-[55vh]">
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="w-full h-full object-contain max-h-[55vh]"
          />

          {/* Nav arrows */}
          {onPrev && (
            <button
              onClick={onPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Details & Caption */}
        <div className="pt-4 space-y-3">
          {/* Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-rose-600">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateTurkish(memory.date)}
              </span>
              {memory.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {memory.location}
                </span>
              )}
            </div>

            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold transition-transform active:scale-90 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>{memory.likes || 0} Beğeni</span>
            </button>
          </div>

          {/* Caption */}
          {memory.caption && (
            <p className="font-romantic text-lg sm:text-xl text-slate-800 italic bg-rose-50/50 p-3.5 rounded-2xl border border-rose-100">
              "{memory.caption}"
            </p>
          )}

          {/* Tags */}
          {memory.tags && memory.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {memory.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default LightboxModal;
