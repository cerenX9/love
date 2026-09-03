import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Gamepad2,
  MessageSquareHeart,
  Palette,
  Camera,
  HeartHandshake,
  Ticket,
  Sparkles,
  ArrowRight,
  Heart,
  FolderHeart,
  Activity,
  Droplets,
  Clock,
  Shirt,
  Bell,
  MapPin,
  Compass,
  Music,
} from 'lucide-react';
import HeroSection from '../hero/HeroSection';
import LivePhotoWidget from '../livephoto/LivePhotoWidget';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import { getCyclePhaseInfo } from '../cycle/MenstrualCycleTracker';
import {
  requestNotificationPermission,
  sendCycleNotificationToTahir,
  getNotificationPermission,
} from '../../utils/notificationUtils';

const DASHBOARD_CARDS = [
  {
    id: 'cycle',
    title: "Ceren'in Döngü Takvimi 🌸",
    desc: 'Regl ve ovülasyon takvimi, Tahir için anlık psikolojik tavsiyeler & aşk rehberi ✨',
    icon: Sparkles,
    color: 'from-rose-500 via-pink-500 to-purple-500',
    bg: 'bg-rose-50/90 hover:bg-rose-100/90 border-rose-300/90 shadow-rose-200/50',
    badge: '🌸 Özel Döngü',
  },
  {
    id: 'fitcheck',
    title: 'Günün FitCheck’i 👗',
    desc: '24 saatlik kombin hikayeleri, geri sayım ve otomatik fotoğraf arşivi 📸',
    icon: Shirt,
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/80 shadow-purple-200/40',
    badge: '👗 Canlı 24h',
  },
  {
    id: 'water',
    title: 'Ortak Su Takibi 💧',
    desc: 'Günde 8 bardak hedefiyle yan yana su içme sayacı ve aşkına hatırlatma 💦',
    icon: Droplets,
    color: 'from-sky-400 to-blue-500',
    bg: 'bg-sky-50/80 hover:bg-sky-100/80 border-sky-200/80 shadow-sky-200/40',
    badge: '💧 Sağlık',
  },
  {
    id: 'schedule',
    title: 'Saatlik Programımız ⏰',
    desc: 'Günün her saatinde Ceren ve Tahir nerede/ne yapıyor yan yana çizelge 📍',
    icon: Clock,
    color: 'from-amber-500 to-rose-500',
    bg: 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-200/80 shadow-amber-200/40',
    badge: '⏰ Çizelge',
  },
  {
    id: 'radar',
    title: 'Aşk Radarı & Harita 📍',
    desc: 'Canlı konum, aramızdaki anlık mesafe sayacı ve harita rotamız 🧭',
    icon: Compass,
    color: 'from-emerald-500 via-teal-500 to-sky-500',
    bg: 'bg-teal-50/80 hover:bg-teal-100/80 border-teal-200/80 shadow-teal-200/40',
    badge: '📍 Canlı Radar',
  },
  {
    id: 'music',
    title: 'Canlı Müzik Çalar 🎵',
    desc: 'Lofi piyano, gece yağmuru, kalp atışı ritmi & MP3 yükleyici 🎧',
    icon: Music,
    color: 'from-rose-500 via-purple-500 to-indigo-500',
    bg: 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200/80 shadow-purple-200/40',
    badge: '🎵 Melodi',
  },
  {
    id: 'heartbeat',
    title: 'Kalp Atışı Senkronu 💓',
    desc: 'Haptic touch ile ikiniz de aynı anda bastığınızda atan gerçek kalp ritmi ⚡',
    icon: Activity,
    color: 'from-rose-600 via-pink-600 to-red-500',
    bg: 'bg-rose-50/90 hover:bg-rose-100/90 border-rose-300/90 shadow-rose-200/50',
    badge: '💓 Haptic Touch',
  },
  {
    id: 'moments',
    title: 'Fotoğraf Arşivi 📸',
    desc: 'Anlık gönderilen tüm fotoğrafların ve hatıraların biriktiği albüm 🖼️',
    icon: Camera,
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50/70 hover:bg-emerald-100/70 border-emerald-200/80',
    badge: '📸 Arşiv',
  },
  {
    id: 'calendar',
    title: 'Takvim & Özel Günler',
    desc: 'Ay dönümleri, doğum günleri ve kilitli zaman kapsülleri 💖',
    icon: Calendar,
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-rose-50/70 hover:bg-rose-100/70 border-rose-200/80',
    badge: '📅 Takvim',
  },
  {
    id: 'games',
    title: 'Oyunlar & Eğlence Hub',
    desc: 'Bugün ne yapsak çarkı, aşk testi, kazı kazan ve sözlük 🎡',
    icon: Gamepad2,
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50/70 hover:bg-purple-100/70 border-purple-200/80',
    badge: '🎡 5 Mini Oyun',
  },
  {
    id: 'notes',
    title: 'Sevgi Notları Panosu',
    desc: 'Post-it aşk notları bırakın ve kalplerle süsleyin 💌',
    icon: MessageSquareHeart,
    color: 'from-pink-500 to-rose-400',
    bg: 'bg-pink-50/70 hover:bg-pink-100/70 border-pink-200/80',
    badge: '💌 Mesajlar',
  },
  {
    id: 'canvas',
    title: 'Ortak Çizim Tahtası',
    desc: 'Birlikte resimler çizin, imzalayın ve galeriye kaydedin 🎨',
    icon: Palette,
    color: 'from-indigo-500 to-purple-500',
    bg: 'bg-indigo-50/70 hover:bg-indigo-100/70 border-indigo-200/80',
    badge: '🎨 Tuval',
  },
  {
    id: 'sos',
    title: 'Acil Sevgi Kasası (SOS)',
    desc: 'Kötü hissettiğinde veya özlediğinde açabileceğin mektuplar 🫂',
    icon: HeartHandshake,
    color: 'from-red-500 to-rose-500',
    bg: 'bg-red-50/70 hover:bg-red-100/70 border-red-200/80',
    badge: '🫂 Acil Sevgi',
  },
  {
    id: 'coupons',
    title: 'Kupon Defteri & 100 Neden',
    desc: 'Romantik aşk kuponları ve "Neden Sen?" flip kartları 🎟️',
    icon: Ticket,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50/70 hover:bg-amber-100/70 border-amber-200/80',
    badge: '🎟️ Kuponlar',
  },
];

const HomePage = ({ onNavigate }) => {
  const { playPop } = useSound();
  const { activePersona, cycleData, profile, hourlySchedule, radarData } = useSharedData();
  const [notificationState, setNotificationState] = useState(() => getNotificationPermission());

  const isCeren = activePersona === 'partner1';
  const lastStart = new Date(cycleData?.lastPeriodStart || '2026-08-20');
  const today = new Date();
  const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.floor((todayZero.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24));
  const cycleLength = cycleData?.cycleLength || 28;
  const periodDuration = cycleData?.periodDuration || 5;
  const cycleDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
  const daysUntilNext = cycleLength - cycleDay + 1;
  const currentPhase = getCyclePhaseInfo(cycleDay, periodDuration, cycleLength);

  // Hourly schedule live data
  const currentHourNum = today.getHours();
  const currentHourFormatted = `${String(currentHourNum).padStart(2, '0')}:00`;
  const todayDateStr = today.toISOString().substring(0, 10);
  const currentCerenSlot = hourlySchedule?.[todayDateStr]?.[currentHourFormatted]?.partner1;
  const currentTahirSlot = hourlySchedule?.[todayDateStr]?.[currentHourFormatted]?.partner2;

  // Love radar live distance
  const cerenLat = radarData?.partner1?.lat || 40.9833;
  const cerenLng = radarData?.partner1?.lng || 29.0278;
  const tahirLat = radarData?.partner2?.lat || 41.0422;
  const tahirLng = radarData?.partner2?.lng || 29.0067;
  const cerenLocation = radarData?.partner1?.locationName || 'Kadıköy';
  const tahirLocation = radarData?.partner2?.locationName || 'Beşiktaş';

  const dLat = ((tahirLat - cerenLat) * Math.PI) / 180;
  const dLon = ((tahirLng - cerenLng) * Math.PI) / 180;
  const aDist =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((cerenLat * Math.PI) / 180) *
      Math.cos((tahirLat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const radarDistKm = 6371 * 2 * Math.atan2(Math.sqrt(aDist), Math.sqrt(1 - aDist));
  const isTogether = radarDistKm < 0.1;

  const handleCardClick = (id) => {
    playPop();
    onNavigate(id);
  };

  const handleEnableNotifications = async (e) => {
    e.stopPropagation();
    playPop();
    const granted = await requestNotificationPermission();
    setNotificationState(granted ? 'granted' : 'denied');
    if (granted) {
      sendCycleNotificationToTahir(currentPhase);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Hero Section with Live Counter, Music & Romantic Note */}
      <HeroSection />

      {/* 2. Anlık Fotoğraf Widget'ı (Hemen Şarkı & Sayacın Altında) */}
      <LivePhotoWidget onNavigateToArchive={() => onNavigate('moments')} />

      {/* 3. Şu An Neredeyiz? (Canlı Saatlik Durum Widget'ı) */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        onClick={() => handleCardClick('schedule')}
        className="p-4 sm:p-5 glass-card rounded-3xl border border-amber-200/90 shadow-lg relative overflow-hidden cursor-pointer"
      >
        <div className="flex items-center justify-between pb-3 border-b border-amber-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-800">Şu An Neredeyiz?</span>
                <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {currentHourFormatted}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Canlı günlük çizelge • Dokunarak incele veya durumunu güncelle</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-0.5">
            <span>Tüm Çizelge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Ceren Status Card */}
          <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{profile.partner1?.avatar || '👱🏻‍♀️'}</span>
              <div>
                <p className="text-xs font-bold text-slate-800">{profile.partner1?.name}</p>
                <p className="text-xs font-extrabold text-rose-700">
                  {currentCerenSlot?.statusLabel || 'Henüz durum girilmedi 🕊️'}
                </p>
                {currentCerenSlot?.location && (
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <span className="truncate">{currentCerenSlot.location}</span>
                  </p>
                )}
              </div>
            </div>
            {isCeren && (
              <span className="text-[10px] bg-white px-2 py-1 rounded-lg font-bold text-rose-600 border border-rose-200 shadow-2xs">
                Güncelle ✏️
              </span>
            )}
          </div>

          {/* Tahir Status Card */}
          <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{profile.partner2?.avatar || '👨🏻'}</span>
              <div>
                <p className="text-xs font-bold text-slate-800">{profile.partner2?.name}</p>
                <p className="text-xs font-extrabold text-blue-700">
                  {currentTahirSlot?.statusLabel || 'Henüz durum girilmedi 🕊️'}
                </p>
                {currentTahirSlot?.location && (
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <span className="truncate">{currentTahirSlot.location}</span>
                  </p>
                )}
              </div>
            </div>
            {!isCeren && (
              <span className="text-[10px] bg-white px-2 py-1 rounded-lg font-bold text-blue-600 border border-blue-200 shadow-2xs">
                Güncelle ✏️
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* 3. Canlı Aşk Radarı & Mesafe Widget'ı */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        onClick={() => handleCardClick('radar')}
        className="p-4 sm:p-5 glass-card rounded-3xl border border-teal-200/90 shadow-lg relative overflow-hidden cursor-pointer bg-gradient-to-r from-teal-50/70 via-emerald-50/50 to-sky-50/70"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-teal-100/80 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-800">Aşk Radarı & Canlı Mesafe</span>
                <span className="text-[10px] font-black bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {isTogether ? 'Yan Yanasınız 💖' : `${radarDistKm.toFixed(1)} km`}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                {isTogether
                  ? 'Şu anda yan yanasınız, hemen sımsıkı sarılın! 🫂'
                  : `Ceren: ${cerenLocation} ↔ Tahir: ${tahirLocation}`}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-0.5">
            <span>Haritayı Aç</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs bg-white/80 p-3 rounded-2xl border border-teal-100/90 shadow-2xs">
          <div className="flex items-center gap-2 truncate flex-1">
            <span className="text-xl">{profile.partner1?.avatar || '👱🏻‍♀️'}</span>
            <div className="truncate">
              <p className="text-[10px] text-slate-400 font-bold">{profile.partner1?.name}</p>
              <p className="font-extrabold text-slate-700 truncate">{cerenLocation}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-600 font-black shrink-0 shadow-2xs">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            <span>{isTogether ? '0 km' : `${radarDistKm.toFixed(1)} km`}</span>
          </div>

          <div className="flex items-center gap-2 truncate flex-1 justify-end text-right">
            <div className="truncate">
              <p className="text-[10px] text-slate-400 font-bold">{profile.partner2?.name}</p>
              <p className="font-extrabold text-slate-700 truncate">{tahirLocation}</p>
            </div>
            <span className="text-xl">{profile.partner2?.avatar || '👨🏻'}</span>
          </div>
        </div>
      </motion.div>

      {/* 4. Döngü Takvimi / Tahir İçin Tavsiye Canlı Bannerı */}
      {!isCeren ? (
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => handleCardClick('cycle')}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-sm text-2xl">
              {currentPhase.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-extrabold uppercase tracking-wider">
                  Tahir İçin Özel Bildirim 🔔
                </span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  {currentPhase.name}
                </span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base mt-1">
                {currentPhase.actionBadge}
              </h4>
              <p className="text-xs text-white/90 line-clamp-1 max-w-xl">
                {currentPhase.tahirTip}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {notificationState !== 'granted' ? (
              <button
                type="button"
                onClick={handleEnableNotifications}
                className="px-3 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1 border border-white/30 cursor-pointer"
                title="Telefona bildirim düşmesini sağla"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Bildirimleri Aç 📲</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sendCycleNotificationToTahir(currentPhase);
                }}
                className="px-3 py-2 rounded-2xl bg-emerald-500/80 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Telefonuna bildirim testi gönder"
              >
                <span>Bildirim Gönder 📲</span>
              </button>
            )}

            <button
              type="button"
              className="px-4 py-2 rounded-2xl bg-white text-rose-600 text-xs font-black shadow-md hover:bg-rose-50 transition-all cursor-pointer"
            >
              Tavsiyeler 💖
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => handleCardClick('cycle')}
          className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 border border-rose-200/80 shadow-md flex items-center justify-between gap-3 cursor-pointer text-xs text-slate-700"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentPhase.emoji}</span>
            <div>
              <p className="font-extrabold text-rose-700 text-xs sm:text-sm">
                Ceren'in Döngüsü: {currentPhase.name} ({cycleDay}. Gün)
              </p>
              <p className="text-[11px] text-slate-500">
                Gelecek regle {daysUntilNext} gün kaldı. Semptom kaydetmek veya incelemek için dokun!
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-white px-3 py-1.5 rounded-xl border border-rose-200 shadow-2xs shrink-0">
            Takvimi Aç 🌸
          </span>
        </motion.div>
      )}

      {/* 5. Quick Access Modules Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-800">
                Aşk Alanı Modülleri
              </h3>
              <p className="text-xs text-slate-500">
                Açmak istediğin modüle tıkla veya yandaki menüden hızlıca geçiş yap! ✨
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {DASHBOARD_CARDS.map((card) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.id}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(card.id)}
                className={`p-4 sm:p-5 rounded-3xl border ${card.bg} shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between min-h-[140px] group relative overflow-hidden backdrop-blur-md`}
              >
                {/* Top Row: Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-md shadow-rose-200 group-hover:rotate-6 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[11px] font-bold text-slate-600 bg-white/90 px-2.5 py-1 rounded-full border border-rose-100 shadow-2xs">
                    {card.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-3">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-800 group-hover:text-rose-600 transition-colors flex items-center justify-between">
                    <span>{card.title}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
