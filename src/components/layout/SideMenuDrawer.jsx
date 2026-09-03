import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Calendar,
  Gamepad2,
  MessageSquareHeart,
  Palette,
  Camera,
  HeartHandshake,
  Ticket,
  X,
  Heart,
  Settings,
  Lock,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Activity,
  Droplets,
  Clock,
  Shirt,
  Compass,
  Music,
  Smartphone,
} from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

export const MENU_ITEMS = [
  {
    id: 'home',
    name: 'Ana Sayfa',
    desc: 'Sayaç, Müzik Çalar & Anlık Fotoğraf',
    icon: Home,
    color: 'from-rose-500 to-pink-500',
    badge: '🏠',
  },
  {
    id: 'heartbeat',
    name: 'Kalp Atışı Senkronu',
    desc: 'Haptic touch ile aynı anda atan kalplerimiz',
    icon: Activity,
    color: 'from-rose-600 via-pink-600 to-red-500',
    badge: '💓 Haptic',
  },
  {
    id: 'cycle',
    name: "Ceren'in Döngü Takvimi",
    desc: 'Regl, ovülasyon & Tahir için aşk rehberi',
    icon: Sparkles,
    color: 'from-rose-500 via-pink-500 to-purple-500',
    badge: '🌸 Özel',
  },
  {
    id: 'fitcheck',
    name: 'Günün FitCheck’i',
    desc: '24 saatlik kombin hikayeleri & arşiv',
    icon: Shirt,
    color: 'from-purple-500 to-pink-500',
    badge: '👗 Canlı',
  },
  {
    id: 'water',
    name: 'Ortak Su Takibi',
    desc: 'Günde 8 bardak hedefiyle yan yana hidrasyon',
    icon: Droplets,
    color: 'from-sky-500 to-blue-500',
    badge: '💧 Sağlık',
  },
  {
    id: 'schedule',
    name: 'Saatlik Programımız',
    desc: 'Günün her saatinde nerede olduğumuz',
    icon: Clock,
    color: 'from-amber-500 to-rose-500',
    badge: '⏰ Çizelge',
  },
  {
    id: 'radar',
    name: 'Aşk Radarı & Harita',
    desc: 'Canlı konum, mesafe sayacı & harita rotası',
    icon: Compass,
    color: 'from-emerald-500 via-teal-500 to-sky-500',
    badge: '📍 Canlı',
  },
  {
    id: 'music',
    name: 'Canlı Müzik Çalar',
    desc: 'Lofi, yağmur, kalp atışı & MP3 çalar',
    icon: Music,
    color: 'from-rose-500 via-purple-500 to-indigo-500',
    badge: '🎵 Melodi',
  },
  {
    id: 'moments',
    name: 'Fotoğraf Arşivi',
    desc: 'Anlık fotoğraflar albümü & zaman tüneli',
    icon: Camera,
    color: 'from-emerald-500 to-teal-500',
    badge: '📸',
  },
  {
    id: 'calendar',
    name: 'Takvim & Kapsüller',
    desc: 'Ay dönümleri, doğum günleri & kapsüller',
    icon: Calendar,
    color: 'from-pink-500 to-rose-400',
    badge: '📅',
  },
  {
    id: 'games',
    name: 'Oyunlar & Eğlence',
    desc: 'Çarkıfelek, Aşk Testi, Kazı Kazan & Sözlük',
    icon: Gamepad2,
    color: 'from-purple-500 to-pink-500',
    badge: '🎡',
  },
  {
    id: 'notes',
    name: 'Sevgi Notları',
    desc: 'Post-it aşk notları panosu',
    icon: MessageSquareHeart,
    color: 'from-pink-500 to-rose-500',
    badge: '💌',
  },
  {
    id: 'canvas',
    name: 'Çizim Tahtası',
    desc: 'Birlikte çizim yapın & galeriye kaydedin',
    icon: Palette,
    color: 'from-indigo-500 to-purple-500',
    badge: '🎨',
  },
  {
    id: 'sos',
    name: 'Acil Sevgi (SOS)',
    desc: 'Kötü hissettiğinde açılan özel mektuplar',
    icon: HeartHandshake,
    color: 'from-red-500 to-rose-500',
    badge: '🫂',
  },
  {
    id: 'coupons',
    name: 'Kuponlar & 100 Neden',
    desc: 'Aşk kuponları & Seni sevmemin nedenleri',
    icon: Ticket,
    color: 'from-amber-500 to-orange-500',
    badge: '🎟️',
  },
];

const SideMenuDrawer = ({ isOpen, onClose, activeTab, onSelectTab, onOpenSettings, onOpenPinModal, onOpenPwaModal }) => {
  const { profile, activePersona, setActivePersona, memories } = useSharedData();
  const { playPop, playChime } = useSound();

  const currentPartner = activePersona === 'partner1' ? profile.partner1 : profile.partner2;

  const handleSelect = (tabId) => {
    playPop();
    onSelectTab(tabId);
    onClose();
  };

  const handleSwitchPersona = () => {
    playPop();
    const next = activePersona === 'partner1' ? 'partner2' : 'partner1';
    setActivePersona(next);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10 sm:pr-16">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-sm sm:max-w-md bg-gradient-to-b from-rose-50/95 via-white/95 to-pink-50/95 backdrop-blur-xl border-r border-rose-200/80 shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-rose-100/90 relative">
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 p-2 rounded-full bg-white/80 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors shadow-xs cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-lg shadow-rose-200 animate-pulseGlow">
                    <Heart className="w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-lg sm:text-xl text-slate-800 leading-tight">
                      {profile.relationshipTitle || 'Ceren & Tahir'}
                    </h2>
                    <span className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> 05.02.2026'dan Beri Sonsuz Aşk
                    </span>
                  </div>
                </div>

                {/* Quick Persona & Photos Count Strip */}
                <div className="mt-4 flex items-center justify-between p-2.5 bg-white/80 rounded-2xl border border-rose-100 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{currentPartner.avatar}</span>
                    <div className="text-left">
                      <p className="text-[10px] text-slate-400 leading-none">Aktif Profil</p>
                      <p className="text-xs font-bold text-slate-800">{currentPartner.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                      📸 {memories.length} Fotoğraf
                    </span>
                    <button
                      onClick={handleSwitchPersona}
                      title="Profili Değiştir"
                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation Menu List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2 no-scrollbar">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
                  Aşk Alanı Modülleri
                </p>

                {MENU_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full p-3 sm:p-3.5 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200'
                          : 'bg-white/70 hover:bg-white text-slate-700 hover:text-rose-600 border border-rose-100/60 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-rose-50 text-rose-500 group-hover:bg-rose-100'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm">{item.name}</span>
                          </div>
                          <p
                            className={`text-[10px] sm:text-[11px] line-clamp-1 ${
                              isActive ? 'text-rose-100' : 'text-slate-400 group-hover:text-slate-500'
                            }`}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive ? 'text-white' : 'text-slate-300 group-hover:text-rose-400 group-hover:translate-x-0.5'
                        }`}
                      />
                    </motion.button>
                  );
                })}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 sm:p-5 border-t border-rose-100/90 bg-white/60 space-y-2">
                <button
                  onClick={() => {
                    playPop();
                    onClose();
                    if (onOpenPwaModal) onOpenPwaModal();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>📲 Telefona Yükle (Mobil Uygulama)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      playPop();
                      onClose();
                      onOpenSettings();
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold border border-slate-200/80 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Ayarlar</span>
                  </button>

                  <button
                    onClick={() => {
                      playPop();
                      onClose();
                      onOpenPinModal();
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-600 text-xs font-bold border border-slate-200/80 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>PIN & Kilit</span>
                  </button>
                </div>

                <p className="text-[10px] text-center text-slate-400 pt-1">
                  Our Love Hub • Ceren & Tahir Özel Sürümü 💖
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SideMenuDrawer;
