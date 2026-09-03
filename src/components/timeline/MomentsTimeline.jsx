import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Plus,
  Heart,
  Calendar,
  MapPin,
  Sparkles,
  LayoutGrid,
  GitCommit,
  Tag,
} from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import { formatDateTurkish } from '../../utils/dateUtils';
import PhotoUploadModal from './PhotoUploadModal';
import LightboxModal from './LightboxModal';

const MomentsTimeline = () => {
  const { memories, likeMemory } = useSharedData();
  const { playPop, playChime } = useSound();

  const [viewMode, setViewMode] = useState('polaroid'); // 'polaroid' | 'timeline'
  const [selectedTag, setSelectedTag] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  // Extract unique tags
  const allTags = Array.from(
    new Set(memories.flatMap((m) => m.tags || []).filter(Boolean))
  );

  const filteredMemories = memories.filter((m) => {
    if (selectedTag === 'all') return true;
    return m.tags && m.tags.includes(selectedTag);
  });

  const handleOpenLightbox = (index) => {
    playPop();
    setActiveLightboxIndex(index);
  };

  const handleLike = (e, id) => {
    e.stopPropagation();
    playPop();
    likeMemory(id);
  };

  const handleNextPhoto = () => {
    if (activeLightboxIndex !== null && activeLightboxIndex < filteredMemories.length - 1) {
      setActiveLightboxIndex(activeLightboxIndex + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (activeLightboxIndex !== null && activeLightboxIndex > 0) {
      setActiveLightboxIndex(activeLightboxIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/70 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-rose-300">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Fotoğraf Arşivi & Zaman Tüneli 📸
              </h2>
              <p className="text-xs text-slate-500">
                Anlık fotoğrafların ve en güzel anılarımızın biriktiği sonsuz aşk albümümüz 💕
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-rose-50 p-1 rounded-2xl border border-rose-100">
              <button
                onClick={() => {
                  playPop();
                  setViewMode('polaroid');
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'polaroid'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Polaroid</span>
              </button>
              <button
                onClick={() => {
                  playPop();
                  setViewMode('timeline');
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-white text-rose-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <GitCommit className="w-3.5 h-3.5" />
                <span>Zaman Tüneli</span>
              </button>
            </div>

            {/* Upload Button */}
            <button
              onClick={() => {
                playPop();
                setIsUploadOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Fotoğraf Yükle</span>
            </button>
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 no-scrollbar text-xs">
            <button
              onClick={() => {
                playPop();
                setSelectedTag('all');
              }}
              className={`px-3 py-1 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
                selectedTag === 'all'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white hover:bg-rose-50 text-slate-600 border border-rose-100'
              }`}
            >
              Tüm Anılar ({memories.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  playPop();
                  setSelectedTag(tag);
                }}
                className={`px-3 py-1 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-white hover:bg-rose-50 text-slate-600 border border-rose-100'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content: Polaroid vs Timeline */}
      {filteredMemories.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center border border-rose-100 text-slate-400 text-xs sm:text-sm">
          <p className="text-3xl mb-2">📷</p>
          <p>Henüz fotoğraf yüklenmedi.</p>
          <p className="text-[11px] text-slate-400 mt-1">İlk romantik hatıranızı yüklemek için yukarıdaki butona tıklayın!</p>
        </div>
      ) : viewMode === 'polaroid' ? (
        // POLAROID GRID VIEW
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredMemories.map((mem, index) => {
              // slight random tilt
              const tilts = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', 'rotate-0'];
              const tiltClass = tilts[index % tilts.length];

              return (
                <motion.div
                  key={mem.id}
                  layout
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1.03, rotate: 0 }}
                  onClick={() => handleOpenLightbox(index)}
                  className={`bg-white p-3.5 pb-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-rose-100/80 relative flex flex-col justify-between ${tiltClass}`}
                >
                  {/* Masking Tape Decor */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-rose-200/60 backdrop-blur-xs transform -rotate-2 border border-rose-300/40 rounded-xs shadow-xs" />

                  {/* Photo Container */}
                  <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 mb-3 shadow-inner relative">
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button
                      onClick={(e) => handleLike(e, mem.id)}
                      className="absolute bottom-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white text-rose-500 shadow-md backdrop-blur-xs active:scale-90 transition-transform"
                    >
                      <Heart className={`w-3.5 h-3.5 ${mem.likes > 0 ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Polaroid Handwritten Caption */}
                  <div className="px-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                        {mem.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {formatDateTurkish(mem.date)}
                      </span>
                    </div>

                    {mem.caption && (
                      <p className="font-romantic text-sm sm:text-base text-slate-700 italic truncate">
                        "{mem.caption}"
                      </p>
                    )}

                    {mem.location && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        {mem.location}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        // TIMELINE ROAD VIEW
        <div className="relative pl-6 sm:pl-8 border-l-2 border-rose-300/80 space-y-8 my-4">
          {filteredMemories.map((mem, index) => (
            <motion.div
              key={mem.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleOpenLightbox(index)}
              className="relative glass-card p-4 sm:p-5 rounded-3xl border border-rose-200 shadow-md hover:shadow-xl transition-all cursor-pointer"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-5 h-5 rounded-full bg-rose-500 border-4 border-white shadow-md flex items-center justify-center" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {/* Photo */}
                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-bold">
                      <Calendar className="w-3 h-3" />
                      {formatDateTurkish(mem.date)}
                    </span>
                    <button
                      onClick={(e) => handleLike(e, mem.id)}
                      className="flex items-center gap-1 text-xs text-rose-600 font-bold"
                    >
                      <Heart className={`w-3.5 h-3.5 ${mem.likes > 0 ? 'fill-rose-500' : ''}`} />
                      <span>{mem.likes || 0}</span>
                    </button>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-800">{mem.title}</h3>

                  {mem.caption && (
                    <p className="font-romantic text-base text-slate-700 italic">
                      "{mem.caption}"
                    </p>
                  )}

                  {mem.location && (
                    <span className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {mem.location}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <PhotoUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      <LightboxModal
        memory={activeLightboxIndex !== null ? filteredMemories[activeLightboxIndex] : null}
        isOpen={activeLightboxIndex !== null}
        onClose={() => setActiveLightboxIndex(null)}
        onNext={activeLightboxIndex < filteredMemories.length - 1 ? handleNextPhoto : null}
        onPrev={activeLightboxIndex > 0 ? handlePrevPhoto : null}
      />
    </div>
  );
};

export default MomentsTimeline;
