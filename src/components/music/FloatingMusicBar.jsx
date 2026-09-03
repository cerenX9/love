import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, Volume2, VolumeX, X, Disc3, Sparkles } from 'lucide-react';
import { useSound } from '../../context/SoundContext';

const FloatingMusicBar = ({ onOpenFullPlayer }) => {
  const { isPlayingAmbient, ambientMode, toggleMusic, volume, isMuted, toggleMute, playPop } =
    useSound();
  const [isMinimized, setIsMinimized] = useState(false);

  const getModeLabel = () => {
    switch (ambientMode) {
      case 'rain':
        return 'Yağmur Ambiyansı 🌧️';
      case 'heartbeat':
        return 'Kalp Atışı Ritmi 💓';
      case 'custom':
        return 'Özel Şarkınız 🎵';
      default:
        return 'Lofi Piyano 🎹';
    }
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-40">
      <AnimatePresence>
        {!isMinimized ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className={`p-2.5 sm:p-3 rounded-2xl shadow-xl backdrop-blur-md border flex items-center gap-2.5 transition-all ${
              isPlayingAmbient
                ? 'bg-slate-900/90 text-white border-rose-500/50 shadow-rose-500/20'
                : 'bg-white/90 text-slate-800 border-slate-200'
            }`}
          >
            {/* Rotating Disc Icon */}
            <button
              onClick={() => {
                playPop();
                if (onOpenFullPlayer) onOpenFullPlayer();
              }}
              className="flex items-center gap-2 cursor-pointer text-left"
              title="Müzik Çaları Aç"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${
                  isPlayingAmbient
                    ? 'bg-gradient-to-tr from-rose-500 to-pink-500 animate-spin-slow shadow-xs'
                    : 'bg-slate-400'
                }`}
              >
                <Music className="w-4 h-4" />
              </div>
              <div className="max-w-[120px] sm:max-w-[150px]">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <span>Aşk Melodisi</span>
                  {isPlayingAmbient && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </p>
                <p className="text-xs font-bold truncate">
                  {isPlayingAmbient ? getModeLabel() : 'Müzik Durduruldu'}
                </p>
              </div>
            </button>

            {/* Controls */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-700/30">
              <button
                onClick={() => {
                  playPop();
                  toggleMusic();
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isPlayingAmbient
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-slate-100 hover:bg-rose-50 text-slate-700'
                }`}
                title={isPlayingAmbient ? 'Durdur' : 'Oynat'}
              >
                {isPlayingAmbient ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  playPop();
                  toggleMute();
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Sessize Al"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Simge Durumuna Küçült"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            onClick={() => setIsMinimized(false)}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-xl cursor-pointer transition-all ${
              isPlayingAmbient
                ? 'bg-gradient-to-tr from-rose-500 to-purple-600 animate-spin-slow ring-2 ring-rose-300'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
            title="Müzik Çaları Göster"
          >
            <Disc3 className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingMusicBar;
