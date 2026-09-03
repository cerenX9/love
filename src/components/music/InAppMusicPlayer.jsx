import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  CloudRain,
  Heart,
  Upload,
  Radio,
  Sparkles,
  Sliders,
  ExternalLink,
  CheckCircle2,
  Disc3,
  Waves,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSound } from '../../context/SoundContext';
import { useSharedData } from '../../context/SharedDataContext';

const AMBIENT_MODES = [
  {
    id: 'lofi',
    title: 'Lofi Aşk Akorları 🎹',
    desc: 'Yumuşak, sıcak ve dinlendirici piyano akorları',
    icon: Music,
    color: 'from-amber-400 to-rose-500',
    bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900',
  },
  {
    id: 'rain',
    title: 'Huzurlu Yağmur & Gece 🌧️',
    desc: 'Birlikte uyurken veya dinlenirken rahatlatıcı yağmur sesi',
    icon: CloudRain,
    color: 'from-sky-400 to-indigo-500',
    bg: 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-900',
  },
  {
    id: 'heartbeat',
    title: 'Sakin Kalp Atışı 💓',
    desc: 'Derin ve ritmik sevgi nabzı ritmi',
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-900',
  },
  {
    id: 'custom',
    title: 'Özel Şarkı / MP3 Yükle 📂',
    desc: 'Kendi MP3 ses dosyanızı yükleyin ve arka planda çalın',
    icon: Upload,
    color: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-900',
  },
];

const InAppMusicPlayer = () => {
  const {
    isPlayingAmbient,
    ambientMode,
    toggleMusic,
    playMode,
    stopMusic,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    customAudioUrl,
    customAudioName,
    saveCustomAudio,
    playPop,
    playChime,
  } = useSound();

  const { profile } = useSharedData();
  const fileInputRef = useRef(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleModeClick = (modeId) => {
    playPop();
    if (modeId === 'custom' && !customAudioUrl) {
      if (fileInputRef.current) fileInputRef.current.click();
      return;
    }
    if (isPlayingAmbient && ambientMode === modeId) {
      stopMusic();
    } else {
      playMode(modeId);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      saveCustomAudio(dataUrl, file.name);
      playChime();
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      playMode('custom', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 glass-card rounded-3xl border border-rose-200/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-3.5 relative z-10">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all ${
              isPlayingAmbient
                ? 'bg-gradient-to-tr from-rose-500 to-purple-600 animate-spin-slow'
                : 'bg-gradient-to-tr from-rose-400 to-pink-500'
            }`}
          >
            <Disc3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-800 text-base sm:text-lg">
                Canlı Müzik & Ambiyans Çalar
              </h2>
              {isPlayingAmbient && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider animate-pulse">
                  Çalıyor 🎵
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Uygulama içinde gezinirken arka planda çalan romantik melodiler ve sesler ✨
            </p>
          </div>
        </div>

        {/* Master Play/Pause & Volume */}
        <div className="flex items-center gap-3 bg-white/80 p-2 rounded-2xl border border-rose-200/70 shadow-sm relative z-10">
          <button
            onClick={() => {
              playPop();
              toggleMusic();
            }}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isPlayingAmbient
                ? 'bg-rose-500 text-white shadow-rose-200 animate-pulse'
                : 'bg-slate-100 hover:bg-rose-50 text-slate-700'
            }`}
          >
            {isPlayingAmbient ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlayingAmbient ? 'Müziği Durdur' : 'Müziği Başlat'}</span>
          </button>

          <div className="flex items-center gap-1.5 px-2">
            <button
              onClick={() => {
                playPop();
                toggleMute();
              }}
              className="text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 sm:w-20 accent-rose-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Visualizer Wave when active */}
      {isPlayingAmbient && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white flex items-center justify-between shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-end gap-1 h-6">
              {[40, 80, 60, 100, 50, 90, 70, 40, 85, 65].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['20%', `${h}%`, '30%'] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8 + (i % 3) * 0.2,
                    ease: 'easeInOut',
                  }}
                  className="w-1 bg-white rounded-full"
                />
              ))}
            </div>
            <div>
              <p className="text-xs font-black">
                Şu An Çalıyor: {AMBIENT_MODES.find((m) => m.id === ambientMode)?.title}
              </p>
              <p className="text-[10px] text-rose-100">
                Uygulamanın tüm sayfalarında kesintisiz devam eder
              </p>
            </div>
          </div>

          <span className="text-xs bg-white/20 px-3 py-1 rounded-xl font-bold">
            %{Math.round(volume * 100)} Ses
          </span>
        </motion.div>
      )}

      {/* Ambient Modes Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AMBIENT_MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = isPlayingAmbient && ambientMode === mode.id;

          return (
            <motion.div
              key={mode.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => handleModeClick(mode.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between shadow-sm ${
                isActive
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white border-rose-600 ring-2 ring-rose-300 shadow-md'
                  : `${mode.bg}`
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${
                    isActive ? 'bg-white/25' : `bg-gradient-to-tr ${mode.color}`
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">{mode.title}</h4>
                  <p
                    className={`text-xs mt-0.5 max-w-xs ${
                      isActive ? 'text-white/90' : 'text-slate-500'
                    }`}
                  >
                    {mode.id === 'custom' && customAudioName ? customAudioName : mode.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                <button
                  type="button"
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-white text-rose-600 shadow-md'
                      : 'bg-white text-slate-700 shadow-2xs hover:bg-rose-50'
                  }`}
                >
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Custom MP3 File Uploader Drawer */}
      <div className="p-5 glass-card rounded-3xl border border-purple-200/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800">
              Kendi Şarkınızı Yükleyin 🎵
            </h4>
            <p className="text-xs text-slate-500">
              Cihazınızdaki MP3/WAV ses dosyasını seçerek arka planda otomatik döngüde dinleyebilirsiniz.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
          <button
            onClick={() => {
              playPop();
              if (fileInputRef.current) fileInputRef.current.click();
            }}
            className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md shadow-purple-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{customAudioUrl ? 'Başka MP3 Seç' : 'MP3 Dosyası Seç'}</span>
          </button>
        </div>
      </div>

      {/* Spotify & Radiohead Card */}
      <div className="p-5 glass-card rounded-3xl border border-emerald-200/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-xs sm:text-sm text-slate-800">
                Aşk Şarkımız: {profile.ourSong || 'Radiohead - Jigsaw Falling Into Place'}
              </h4>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                Spotify
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Spotify üzerinden tam parçayı dinlemek veya şarkınızı değiştirmek için tıklayın.
            </p>
          </div>
        </div>

        {profile.spotifyUrl && (
          <a
            href={profile.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-200 flex items-center gap-1.5 shrink-0"
          >
            <span>Spotify'da Dinle</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default InAppMusicPlayer;
