import React from 'react';
import {
  Menu,
  Heart,
  Settings,
  Music,
  Volume2,
  VolumeX,
  Lock,
  Sparkles,
  RefreshCw,
  Home,
  ChevronLeft,
} from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

const Navbar = ({ onOpenMenu, onOpenSettings, onOpenPinModal, activeTab: propActiveTab, onSelectTab }) => {
  const { profile, activePersona, setActivePersona, isLocked, setIsLocked, activeTab: contextActiveTab, navigateTo } = useSharedData();
  const { isPlayingAmbient, toggleMusic, isMuted, toggleMute, playPop } = useSound();

  const activeTab = propActiveTab || contextActiveTab;

  const handleGoHome = () => {
    try {
      playPop();
    } catch (e) {}
    if (onSelectTab) {
      onSelectTab('home');
    } else {
      navigateTo('home');
    }
  };

  const handlePersonaSwitch = () => {
    playPop();
    const nextPersona = activePersona === 'partner1' ? 'partner2' : 'partner1';
    setActivePersona(nextPersona);
  };

  const handleLockClick = () => {
    if (profile.pinCode && profile.pinCode.length === 4) {
      setIsLocked(true);
    } else {
      onOpenPinModal();
    }
  };

  const currentPartner = activePersona === 'partner1' ? profile.partner1 : profile.partner2;

  return (
    <header
      className="sticky z-40 px-2 sm:px-4 md:px-6 max-w-6xl mx-auto w-full transition-all duration-300 mb-2 sm:mb-4"
      style={{
        top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingTop: 'max(env(safe-area-inset-top, 0px), 8px)',
      }}
    >
      <nav className="glass-pill px-2.5 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full shadow-lg shadow-rose-200/40 flex items-center justify-between gap-1 sm:gap-2 md:gap-3 transition-all duration-300 w-full overflow-hidden">
        {/* Left: Side Menu Hamburger Button & Brand */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink">
          <button
            type="button"
            onClick={() => {
              playPop();
              onOpenMenu();
            }}
            title="Menüyü Aç"
            className="p-1.5 sm:p-2 sm:px-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          >
            <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs font-bold hidden sm:inline">Menü</span>
          </button>

          {/* Home / Brand Trigger */}
          <button
            type="button"
            onClick={handleGoHome}
            className="flex items-center gap-1.5 sm:gap-2 hover:opacity-90 transition-opacity cursor-pointer text-left shrink-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 shadow-xs shrink-0">
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-rose-500" />
            </div>
            <div>
              <h1 className="font-extrabold text-xs sm:text-sm md:text-base bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-none whitespace-nowrap">
                {profile.relationshipTitle || 'Ceren & Tahir'}
              </h1>
            </div>
          </button>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">

          {/* Persona Switcher Pill */}
          <button
            onClick={handlePersonaSwitch}
            title="Kullanıcı profilini değiştir (Ceren / Tahir)"
            className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-rose-50/90 hover:bg-rose-100 border border-rose-200/70 text-xs font-semibold text-rose-700 transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
          >
            <span className="text-sm sm:text-base">{currentPartner.avatar}</span>
            <span className="font-bold hidden md:inline">{currentPartner.name}</span>
            <RefreshCw className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400" />
          </button>

          {/* Mini Music Player Trigger */}
          <button
            onClick={toggleMusic}
            title={isPlayingAmbient ? 'Romantik Müziği Durdur' : 'Romantik Müziği Başlat'}
            className={`p-1.5 sm:p-2 rounded-full transition-all cursor-pointer shrink-0 ${
              isPlayingAmbient
                ? 'bg-rose-500 text-white shadow-md shadow-rose-300 animate-pulse'
                : 'bg-white/80 hover:bg-rose-50 text-slate-600 border border-rose-200/60'
            }`}
          >
            <Music className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isPlayingAmbient ? 'animate-spin-slow' : ''}`} />
          </button>

          {/* Mute SFX Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'Ses Efektlerini Aç' : 'Ses Efektlerini Kapat'}
            className="p-1.5 sm:p-2 rounded-full bg-white/80 hover:bg-rose-50 text-slate-600 border border-rose-200/60 transition-all cursor-pointer shrink-0"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />}
          </button>

          {/* Privacy Lock Trigger */}
          <button
            onClick={handleLockClick}
            title={profile.pinCode ? 'Uygulamayı Kilitle' : 'PIN Kodu Belirle'}
            className={`p-1.5 sm:p-2 rounded-full transition-all cursor-pointer shrink-0 ${
              profile.pinCode
                ? 'bg-purple-100/80 hover:bg-purple-200 text-purple-700 border border-purple-200'
                : 'bg-white/80 hover:bg-rose-50 text-slate-600 border border-rose-200/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            title="Ayarlar & Özelleştirme"
            className="p-1.5 sm:p-2 rounded-full bg-white/80 hover:bg-rose-50 text-slate-600 border border-rose-200/60 transition-all cursor-pointer shrink-0"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 hover:rotate-45 transition-transform" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
