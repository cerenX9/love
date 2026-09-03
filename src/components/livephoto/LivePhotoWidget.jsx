import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  Heart,
  Sparkles,
  Clock,
  Send,
  X,
  Maximize2,
  FolderHeart,
  Flame,
  Smile,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import { formatDateTurkish } from '../../utils/dateUtils';
import LightboxModal from '../timeline/LightboxModal';

const REACTIONS = ['❤️', '🔥', '😍', '💋', '🥺', '✨'];

const LivePhotoWidget = ({ onNavigateToArchive }) => {
  const { memories, addMemory, likeMemory, profile, activePersona } = useSharedData();
  const { playPop, playChime, playCameraShutter } = useSound();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [flyingReaction, setFlyingReaction] = useState(null);

  const fileInputRef = useRef(null);

  const isCeren = activePersona === 'partner1';
  const otherPersonaKey = isCeren ? 'partner2' : 'partner1';
  const otherPartner = isCeren ? profile.partner2 : profile.partner1;
  const currentPartner = isCeren ? profile.partner1 : profile.partner2;

  // Filter memories to find the latest photo sent strictly by the OTHER partner
  const otherPartnerPhotos = (memories || []).filter((m) => {
    if (m.senderRole) return m.senderRole === otherPersonaKey;
    if (m.createdByRole) return m.createdByRole === otherPersonaKey;
    if (m.createdBy) return m.createdBy === otherPartner?.name;
    if (m.author) return m.author === otherPartner?.name;
    if (m.title && m.title.includes(otherPartner?.name)) return true;
    return false;
  });

  const latestPhoto = otherPartnerPhotos.length > 0 ? otherPartnerPhotos[0] : null;

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      // Scale down image if needed for performance
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        setImagePreview(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Submit new live photo
  const handleSendPhoto = (e) => {
    e.preventDefault();
    if (!imagePreview) return;

    if (playCameraShutter) {
      playCameraShutter();
    } else {
      playChime();
    }

    addMemory({
      title: `${currentPartner.name}'in Anlık Fotoğrafı 📸`,
      caption: caption.trim() || 'Seni düşünürken çekilmiş anlık bir kare...',
      imageUrl: imagePreview,
      date: new Date().toISOString().substring(0, 10),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      tags: ['Anlık Foto', 'Locket'],
      senderRole: activePersona,
      senderName: currentPartner.name,
      senderAvatar: currentPartner.avatar,
      createdBy: currentPartner.name,
      createdByRole: activePersona,
    });

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fb7185', '#f43f5e', '#fda4af', '#f472b6'],
    });

    setImagePreview(null);
    setCaption('');
    setIsUploadOpen(false);
  };

  // Quick Reaction Pop
  const handleReact = (emoji) => {
    playPop();
    setFlyingReaction(emoji);
    if (latestPhoto) {
      likeMemory(latestPhoto.id);
    }
    setTimeout(() => setFlyingReaction(null), 1000);
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/80 shadow-xl relative overflow-hidden">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-200 animate-pulseGlow">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base sm:text-lg leading-tight">
              Anlık Fotoğraf & Locket 📸
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playPop();
              setIsUploadOpen(true);
            }}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-200 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Fotoğraf Gönder 📷</span>
          </button>

          {onNavigateToArchive && (
            <button
              onClick={() => {
                playPop();
                onNavigateToArchive();
              }}
              className="px-3.5 py-2 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200 text-slate-700 hover:text-rose-600 text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FolderHeart className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">Fotoğraf Arşivi</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Photo Display Card */}
      {latestPhoto ? (
        <div className="max-w-xl mx-auto">
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-200/90 bg-slate-900 group"
          >
            {/* Top Sender & Time Pill */}
            <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-lg pointer-events-auto">
                <span className="text-base">
                  {otherPartner?.avatar || '📸'}
                </span>
                <span>{otherPartner?.name || 'Sevgilin'}</span>
                <span className="text-[10px] text-rose-300 font-normal">
                  • {latestPhoto.time || formatDateTurkish(latestPhoto.date)}
                </span>
              </div>

              <button
                onClick={() => setIsLightboxOpen(true)}
                className="p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white shadow-lg pointer-events-auto cursor-pointer transition-colors"
                title="Büyüt"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Photo */}
            <div className="w-full aspect-4/3 sm:aspect-16/10 relative overflow-hidden bg-slate-950 flex items-center justify-center">
              <img
                src={typeof latestPhoto.imageUrl === 'string' ? latestPhoto.imageUrl : ''}
                alt="En Son Anlık Fotoğraf"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />

              {/* Floating Reaction Animation */}
              <AnimatePresence>
                {flyingReaction && (
                  <motion.div
                    initial={{ scale: 0.5, y: 30, opacity: 0 }}
                    animate={{ scale: 2.2, y: -40, opacity: 1 }}
                    exit={{ scale: 3, y: -80, opacity: 0 }}
                    className="absolute z-30 text-5xl pointer-events-none filter drop-shadow-lg"
                  >
                    {flyingReaction}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Caption & Live Reactions Bar */}
            <div className="p-4 sm:p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white absolute bottom-0 inset-x-0 space-y-2">
              {latestPhoto.caption && (
                <p className="font-romantic text-sm sm:text-base text-rose-100 italic leading-snug drop-shadow-md">
                  "{latestPhoto.caption}"
                </p>
              )}

              {/* Reactions Bar */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
                  Tepki Bırak:
                </span>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReact(emoji)}
                      className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-sm sm:text-base transition-all hover:scale-120 active:scale-90 cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-xs text-rose-300 font-bold bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>{latestPhoto.likes || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-3xl p-8 sm:p-10 text-center border border-rose-200/80 text-slate-500 space-y-3 max-w-lg mx-auto bg-rose-50/40">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400 to-rose-500 text-white flex items-center justify-center mx-auto text-3xl shadow-lg shadow-rose-200 animate-bounce">
            {otherPartner?.avatar || '📸'}
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-base sm:text-lg">
              {otherPartner?.name} henüz sana anlık fotoğraf göndermedi 🕊️
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {otherPartner?.name} anlık bir fotoğraf çektiğinde burada sana özel olarak canlı görünecek. İstersen ilk kareyi sen gönder! 📷✨
            </p>
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-200 flex items-center gap-2 mx-auto cursor-pointer transition-all active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>{otherPartner?.name}'e Fotoğraf Gönder 💖</span>
          </button>
        </div>
      )}

      {/* Quick Upload Modal */}
      {isUploadOpen &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsUploadOpen(false);
                setImagePreview(null);
              }
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md cursor-pointer"
            style={{ zIndex: 99999 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 relative shadow-2xl border border-rose-200 space-y-4 cursor-default"
              style={{ zIndex: 100000 }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
                    <Camera className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-800">
                    Anlık Fotoğraf Gönder 📸
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsUploadOpen(false);
                    setImagePreview(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-rose-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendPhoto} className="space-y-4">
                {/* Photo Picker Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full min-h-[180px] rounded-2xl border-2 border-dashed border-rose-300 hover:border-rose-400 bg-rose-50/50 hover:bg-rose-50 transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer relative overflow-hidden"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {imagePreview ? (
                    <div className="w-full h-52 flex items-center justify-center relative">
                      <img
                        src={imagePreview}
                        alt="Önizleme"
                        className="max-h-full max-w-full rounded-xl object-contain shadow-sm"
                      />
                      <span className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/60 text-white rounded-lg text-[10px] font-semibold">
                        Fotoğrafı Değiştir 🔄
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1 text-slate-500">
                      <Upload className="w-8 h-8 mx-auto text-rose-400 mb-1" />
                      <p className="font-bold text-slate-700 text-xs">
                        Kameradan Çek veya Galeriden Seç
                      </p>
                      <p className="text-[10px] text-slate-400">
                        PNG, JPG, WEBP desteklenir
                      </p>
                    </div>
                  )}
                </div>

                {/* Caption */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">
                    Anlık Not / Aşk Cümlesi:
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Şu an seni düşünürken gülümsüyorum... ☕❤️"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800"
                  />
                </div>

                {/* Submit button */}
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadOpen(false);
                      setImagePreview(null);
                    }}
                    className="px-4 py-2 text-xs rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={!imagePreview}
                    className="px-5 py-2 text-xs rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold shadow-md shadow-rose-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Anında Paylaş 📸</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>,
          document.body
        )}

      {/* Lightbox Modal for Enlarge */}
      {isLightboxOpen && latestPhoto && (
        <LightboxModal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          memory={latestPhoto}
          onNext={() => {}}
          onPrev={() => {}}
          hasNext={false}
          hasPrev={false}
        />
      )}
    </div>
  );
};

export default LivePhotoWidget;
