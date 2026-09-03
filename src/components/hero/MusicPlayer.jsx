import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Music,
  Volume2,
  Sparkles,
  Heart,
  Edit3,
  ExternalLink,
  Check,
  X,
  Radio,
} from 'lucide-react';
import { useSound } from '../../context/SoundContext';
import { useSharedData } from '../../context/SharedDataContext';
import { PRESET_SONGS } from '../../services/defaultData';

const getSpotifyEmbedUrl = (urlOrUri) => {
  if (!urlOrUri || typeof urlOrUri !== 'string') return null;
  const matchTrack = urlOrUri.match(/track[/:]([a-zA-Z0-9]+)/);
  if (matchTrack && matchTrack[1]) {
    return `https://open.spotify.com/embed/track/${matchTrack[1]}?utm_source=generator&theme=0`;
  }
  const matchPlaylist = urlOrUri.match(/playlist[/:]([a-zA-Z0-9]+)/);
  if (matchPlaylist && matchPlaylist[1]) {
    return `https://open.spotify.com/embed/playlist/${matchPlaylist[1]}?utm_source=generator&theme=0`;
  }
  const matchAlbum = urlOrUri.match(/album[/:]([a-zA-Z0-9]+)/);
  if (matchAlbum && matchAlbum[1]) {
    return `https://open.spotify.com/embed/album/${matchAlbum[1]}?utm_source=generator&theme=0`;
  }
  return null;
};

const MusicPlayer = () => {
  const { isPlayingAmbient, toggleMusic, volume, setVolume, playPop, playChime } = useSound();
  const { profile, updateSong } = useSharedData();

  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [songTitleInput, setSongTitleInput] = useState(
    profile.ourSong || 'Radiohead - Jigsaw Falling Into Place'
  );
  const [spotifyUrlInput, setSpotifyUrlInput] = useState(
    profile.spotifyUrl || 'https://open.spotify.com/track/0YJ9FWWHn9EfnN0lHwbzvV'
  );
  const [showSpotifyEmbed, setShowSpotifyEmbed] = useState(true);

  // Sync inputs when opening modal or profile changes
  useEffect(() => {
    setSongTitleInput(profile.ourSong || 'Radiohead - Jigsaw Falling Into Place');
    setSpotifyUrlInput(
      profile.spotifyUrl || 'https://open.spotify.com/track/0YJ9FWWHn9EfnN0lHwbzvV'
    );
  }, [profile.ourSong, profile.spotifyUrl, isSongModalOpen]);

  const spotifyEmbedUrl = getSpotifyEmbedUrl(profile.spotifyUrl || '');

  const handleToggle = () => {
    playPop();
    toggleMusic();
  };

  const handleOpenModal = () => {
    playPop();
    setIsSongModalOpen(true);
  };

  const handleSaveSong = (e) => {
    e.preventDefault();
    playChime();
    updateSong(songTitleInput.trim() || 'Aşk Şarkımız', spotifyUrlInput.trim());
    setIsSongModalOpen(false);
  };

  const handleSelectPreset = (preset) => {
    playPop();
    setSongTitleInput(`${preset.title} - ${preset.artist}`);
    setSpotifyUrlInput(preset.spotifyUrl);
  };

  return (
    <div className="space-y-2">
      {/* Player Bar */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 p-2 sm:p-3 bg-white/70 backdrop-blur-md rounded-2xl border border-rose-200/70 shadow-inner">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs transition-all ${
              isPlayingAmbient
                ? 'bg-gradient-to-tr from-rose-500 to-pink-500 animate-spin-slow'
                : 'bg-rose-400'
            }`}
          >
            <Music className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>

          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1">
              <span className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-wider text-rose-500 truncate">
                Şarkımız
              </span>
              {spotifyEmbedUrl && (
                <span className="text-[8px] sm:text-[9px] bg-emerald-50 text-emerald-600 font-bold px-1 sm:px-1.5 py-0.2 rounded-full border border-emerald-200">
                  Spotify
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-sm font-bold text-slate-800 truncate">
              {profile.ourSong || 'Aşk Şarkımız'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Edit Song Button */}
          <button
            onClick={handleOpenModal}
            title="Şarkımızı Değiştir / Düzenle"
            className="p-1.5 sm:p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer"
          >
            <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          {/* Lofi Ambient Synth Player Toggle */}
          <button
            onClick={handleToggle}
            title={isPlayingAmbient ? 'Lofi Ambiyansı Durdur' : 'Lofi Romantik Melodiyi Başlat'}
            className={`p-1.5 sm:p-2 rounded-full transition-all cursor-pointer ${
              isPlayingAmbient
                ? 'bg-rose-500 text-white shadow-md shadow-rose-300 animate-pulse'
                : 'bg-white hover:bg-rose-50 text-slate-600 border border-rose-200/80'
            }`}
          >
            {isPlayingAmbient ? (
              <Pause className="w-3 h-3 sm:w-4 sm:h-4 fill-white" />
            ) : (
              <Radio className="w-3 h-3 sm:w-4 sm:h-4 text-rose-500" />
            )}
          </button>
        </div>
      </div>

      {/* Spotify Player Container (Custom Mobile Mini-Card & Desktop Iframe) */}
      {spotifyEmbedUrl && showSpotifyEmbed && (
        <div className="rounded-2xl overflow-hidden border border-rose-200/80 shadow-md bg-[#121212]">
          {/* Mobile Sleek Native Spotify Card (Fits narrow mobile column with 0 scrollbars) */}
          <div className="flex sm:hidden items-center justify-between p-2 gap-2 bg-[#181818] text-white">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 via-rose-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-xs ring-1 ring-white/10">
                <Music className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 text-left">
                <h5 className="font-extrabold text-[11px] text-white truncate leading-tight">
                  {(profile.ourSong || 'Radiohead - Jigsaw Falling Into Place').includes(' - ')
                    ? (profile.ourSong || '').split(' - ').slice(1).join(' - ')
                    : profile.ourSong || 'Jigsaw Falling Into Place'}
                </h5>
                <p className="text-[9px] text-slate-400 font-semibold truncate leading-tight">
                  {(profile.ourSong || 'Radiohead - Jigsaw Falling Into Place').includes(' - ')
                    ? (profile.ourSong || '').split(' - ')[0]
                    : 'Radiohead'}
                </p>
              </div>
            </div>

            <a
              href={profile.spotifyUrl || 'https://open.spotify.com/track/0YJ9FWWHn9EfnN0lHwbzvV'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black shrink-0 transition-transform active:scale-95 shadow-md flex items-center justify-center cursor-pointer"
              title="Spotify'da Dinle 🎵"
            >
              <Play className="w-3.5 h-3.5 fill-black translate-x-0.2" />
            </a>
          </div>

          {/* Desktop & Tablet Full Embedded Iframe */}
          <div className="hidden sm:block">
            <iframe
              src={spotifyEmbedUrl}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
              loading="lazy"
              title="Spotify Love Song"
              className="block border-0 w-full"
              style={{ border: 0, overflow: 'hidden' }}
            />
          </div>
        </div>
      )}

      {/* Song Selection Modal Rendered via React Portal directly to document.body */}
      {isSongModalOpen &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsSongModalOpen(false);
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md cursor-pointer"
            style={{ zIndex: 99999 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 relative shadow-2xl border border-rose-200"
              style={{ zIndex: 100000 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-sm">
                    <Music className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-800">
                    Aşk Şarkımızı Seç 🎵
                  </h3>
                </div>
                <button
                  onClick={() => setIsSongModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-rose-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSaveSong} className="space-y-4 text-xs sm:text-sm">
                {/* Song Title */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">
                    Şarkı Adı & Sanatçı:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Perfect - Ed Sheeran"
                    value={songTitleInput}
                    onChange={(e) => setSongTitleInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs text-slate-800"
                  />
                </div>

                {/* Spotify URL */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs flex items-center justify-between">
                    <span>Spotify Şarkı / Çalma Listesi Linki:</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      🟢 Spotify Entegre
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://open.spotify.com/track/..."
                    value={spotifyUrlInput}
                    onChange={(e) => setSpotifyUrlInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono text-xs text-slate-800"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Spotify uygulamasından veya web'den herhangi bir şarkının "Bağlantıyı Kopyala" linkini yapıştırabilirsiniz.
                  </p>
                </div>

                {/* Preset Romantic Songs */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5 text-xs">
                    Popüler Romantik Şarkılardan Seç:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {PRESET_SONGS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className="p-2 rounded-xl text-left border border-rose-100 hover:border-rose-300 bg-rose-50/50 hover:bg-rose-100 transition-all text-xs font-semibold text-slate-700 flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate">{p.title}</span>
                        <span className="text-[10px] text-rose-500 font-bold shrink-0 ml-1">Seç</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSongModalOpen(false)}
                    className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all cursor-pointer"
                  >
                    Şarkıyı Kaydet 🎵
                  </button>
                </div>
              </form>
            </motion.div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default MusicPlayer;
