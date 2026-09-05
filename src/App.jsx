import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Gamepad2,
  MessageSquareHeart,
  Palette,
  Camera,
  HeartHandshake,
  Ticket,
  Heart,
  Sparkles,
  ChevronLeft,
  Menu,
  Home,
} from 'lucide-react';
import { SharedDataProvider, useSharedData } from './context/SharedDataContext';
import { SoundProvider, useSound } from './context/SoundContext';
import Navbar from './components/layout/Navbar';
import FloatingHearts from './components/layout/FloatingHearts';
import PinLockModal from './components/layout/PinLockModal';
import SettingsModal from './components/layout/SettingsModal';
import PwaInstallModal from './components/layout/PwaInstallModal';
import SideMenuDrawer, { MENU_ITEMS } from './components/layout/SideMenuDrawer';
import HomePage from './components/home/HomePage';
import CalendarView from './components/calendar/CalendarView';
import GamesHub from './components/games/GamesHub';
import LoveNotesBoard from './components/notes/LoveNotesBoard';
import DrawingCanvas from './components/canvas/DrawingCanvas';
import MomentsTimeline from './components/timeline/MomentsTimeline';
import SOSLoveVault from './components/vault/SOSLoveVault';
import CouponBook from './components/coupons/CouponBook';
import HeartbeatSync from './components/heartbeat/HeartbeatSync';
import MenstrualCycleTracker from './components/cycle/MenstrualCycleTracker';
import FitCheckModule from './components/fitcheck/FitCheckModule';
import WaterTracker from './components/water/WaterTracker';
import HourlySchedule from './components/schedule/HourlySchedule';
import LoveRadar from './components/radar/LoveRadar';
import InAppMusicPlayer from './components/music/InAppMusicPlayer';
import FloatingMusicBar from './components/music/FloatingMusicBar';

const MainContent = () => {
  const { isLocked, profile, activeTab, navigateTo } = useSharedData();
  const { playPop } = useSound();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  const handleTabChange = (tabId) => {
    try {
      playPop();
    } catch (e) {}
    navigateTo(tabId);
  };

  const currentTabMeta = MENU_ITEMS.find((m) => m.id === activeTab) || MENU_ITEMS[0];

  return (
    <div
      className="min-h-screen flex flex-col relative z-10"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)',
      }}
    >
      {/* Background Floating Hearts */}
      <FloatingHearts />

      {/* Side Menu Drawer */}
      <SideMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
      />

      {/* PIN Lock Screen Overlay if locked */}
      <PinLockModal
        isOpen={isPinModalOpen || isLocked}
        onClose={() => setIsPinModalOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenPinModal={() => setIsPinModalOpen(true)}
      />

      {/* PWA Install Guide Modal */}
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />

      {/* Top Navbar */}
      <Navbar
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={handleTabChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-4 space-y-6">
        {/* If in Sub-Page: Show Top Breadcrumb & Back to Home bar */}
        {activeTab !== 'home' && (
          <div className="flex items-center justify-between gap-2 p-2 sm:p-3 glass-card rounded-2xl border border-rose-200/80 shadow-sm animate-fadeIn">
            <button
              onClick={() => handleTabChange('home')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Ana Sayfaya Dön</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xs">
                {React.createElement(currentTabMeta.icon, { className: 'w-4 h-4' })}
              </div>
              <div className="text-left hidden sm:block">
                <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-tight">
                  {currentTabMeta.name}
                </h2>
                <p className="text-[10px] text-slate-400">{currentTabMeta.desc}</p>
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 border border-rose-200 transition-all cursor-pointer active:scale-95"
            >
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline">Tüm Modüller</span>
            </button>
          </div>
        )}

        {/* Dynamic Page Views */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="pb-12"
          >
            {activeTab === 'home' && <HomePage onNavigate={handleTabChange} />}
            {activeTab === 'heartbeat' && <HeartbeatSync />}
            {activeTab === 'cycle' && <MenstrualCycleTracker />}
            {activeTab === 'fitcheck' && <FitCheckModule />}
            {activeTab === 'water' && <WaterTracker />}
            {activeTab === 'schedule' && <HourlySchedule />}
            {activeTab === 'radar' && <LoveRadar />}
            {activeTab === 'music' && <InAppMusicPlayer />}
            {activeTab === 'calendar' && <CalendarView />}
            {activeTab === 'games' && <GamesHub />}
            {activeTab === 'notes' && <LoveNotesBoard />}
            {activeTab === 'canvas' && <DrawingCanvas />}
            {activeTab === 'moments' && <MomentsTimeline />}
            {activeTab === 'sos' && <SOSLoveVault />}
            {activeTab === 'coupons' && <CouponBook />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Mini Music Bar */}
      <FloatingMusicBar onOpenFullPlayer={() => handleTabChange('music')} />

      {/* Romantic Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-rose-200/40 relative z-10 glass-card mt-auto">
        <div className="flex items-center justify-center gap-1.5 font-medium">
          <span>{profile.relationshipTitle || 'Ceren & Tahir'} için sonsuz sevgiyle tasarlandı</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Our Love Hub • Her Gün İlk Günkü Gibi</p>
      </footer>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught:', error, errorInfo);
  }

  handleHardRefresh = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }
      }
    } catch (e) {}
    window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-rose-50">
          <div className="glass-card p-6 sm:p-8 rounded-3xl max-w-md w-full border border-rose-200 shadow-xl space-y-4">
            <span className="text-4xl block animate-bounce">💖</span>
            <h3 className="font-bold text-lg text-slate-800">Ceren ❤️ Tahir</h3>
            <p className="text-xs text-slate-600">
              Yeni özellikler ve güncellemeler yüklendi! Canlı aşk alanınıza geçmek için butona dokunun:
            </p>

            <button
              onClick={this.handleHardRefresh}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 cursor-pointer active:scale-98 transition-all"
            >
              Uygulamayı Canlıya Yenile ✨
            </button>

            {this.state.error?.message && (
              <details className="text-left mt-2">
                <summary className="text-[10px] text-slate-400 cursor-pointer">Teknik Detay</summary>
                <p className="text-[10px] text-rose-700 bg-rose-100/70 p-2 rounded-xl mt-1 font-mono break-all">
                  {this.state.error.message}
                </p>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <SharedDataProvider>
        <SoundProvider>
          <MainContent />
        </SoundProvider>
      </SharedDataProvider>
    </ErrorBoundary>
  );
}

export default App;
