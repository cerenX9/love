import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Calendar as CalendarIcon,
  Sparkles,
  Info,
  Lock,
  ChevronLeft,
  ChevronRight,
  Settings,
  Coffee,
  Smile,
  AlertCircle,
  Bell,
  CheckCircle2,
  X,
  Droplet,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import {
  requestNotificationPermission,
  sendCycleNotificationToTahir,
  getNotificationPermission,
} from '../../utils/notificationUtils';

const SYMPTOM_OPTIONS = [
  { id: 'kramp', label: 'Karın / Kramp 😣' },
  { id: 'bel_agrisi', label: 'Bel & Sırt Ağrısı 🩹' },
  { id: 'bas_agrisi', label: 'Baş Ağrısı 🤕' },
  { id: 'yorgunluk', label: 'Halsizlik / Yorgunluk 🥱' },
  { id: 'tatli_krizi', label: 'Tatlı & Çikolata Krizi 🍫' },
  { id: 'siskinlik', label: 'Ödem / Şişkinlik 🎈' },
  { id: 'gogus_hassasiyeti', label: 'Göğüs Hassasiyeti 🌸' },
];

const MOOD_OPTIONS = [
  { id: 'mutlu', label: 'Neşeli & Mutlu 🥰' },
  { id: 'enerjik', label: 'Enerjik & Canlı ⚡' },
  { id: 'sakin', label: 'Huzurlu & Sakin 🕊️' },
  { id: 'duygusal', label: 'Aşırı Duygusal 🥺' },
  { id: 'hassas', label: 'Hassas / Alıngan 🌧️' },
  { id: 'gergin', label: 'Gergin / Sinirli ⚡' },
];

const FLOW_OPTIONS = [
  { id: 'light', label: 'Hafif 💧' },
  { id: 'medium', label: 'Orta 🩸' },
  { id: 'heavy', label: 'Yoğun 🌊' },
];

// Helper to get Phase Information
export const getCyclePhaseInfo = (cycleDay, periodDuration = 5, cycleLength = 28) => {
  if (cycleDay <= periodDuration) {
    return {
      phase: 'menstrual',
      name: 'Menstrüel Faz (Regl Günleri)',
      emoji: '🩸',
      color: 'rose',
      bgColor: 'bg-rose-50 border-rose-200 text-rose-800',
      pillColor: 'bg-rose-500 text-white',
      hormones: 'Östrojen ve Progesteron en alt seviyede',
      psychology: 'İçe çekilme, dinlenme isteği, fiziksel yorgunluk ve şefkat ihtiyacı.',
      tahirTip:
        'Ceren şu an regl döneminde. Karın ve sırt krampları, yorgunluk olabilir. Ona sıcak su torbası hazırla, sevdiği bitki çayını yap, sırtına masaj yap ve sıcacık sarıl. Asla yorma ve koşulsuz şefkat göster! ☕🫂',
      actionBadge: 'Sıcak Su Torbası & Masaj Hazırla ☕',
    };
  } else if (cycleDay <= cycleLength - 16) {
    return {
      phase: 'follicular',
      name: 'Foliküler Faz (Yenilenme & Canlılık)',
      emoji: '🌱',
      color: 'emerald',
      bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      pillColor: 'bg-emerald-500 text-white',
      hormones: 'Östrojen hızla yükseliyor, seratonin artıyor',
      psychology: 'Yüksek motivasyon, canlılık, cildin parlaması ve dışa dönük neşe.',
      tahirTip:
        'Ceren’in enerjisi ve neşesi tavan yapmış durumda! Birlikte romantik bir randevuya çıkın, yeni bir yer keşfedin veya eğlenceli bir aktivite planlayın! ✨💃',
      actionBadge: 'Romantik Randevu & Dışarı Çıkma Zamanı! ✨',
    };
  } else if (cycleDay <= cycleLength - 12) {
    return {
      phase: 'ovulation',
      name: 'Ovülasyon Fazı (Doğurganlık Zirvesi)',
      emoji: '🌸',
      color: 'purple',
      bgColor: 'bg-purple-50 border-purple-200 text-purple-800',
      pillColor: 'bg-purple-500 text-white',
      hormones: 'Östrojen ve LH (Lüteinleştirici hormon) zirvede',
      psychology: 'Çekicilik hissi, yüksek özgüven, tensel yakınlık ve romantizm arzusu.',
      tahirTip:
        'Ceren şu an ovülasyon döneminde! Kendini en çekici hissettiği, aşkı ve yakınlığı en derinden arzuladığı günler. Ona güzel iltifatlar et ve romantik sürprizler hazırla! 🌸💋',
      actionBadge: 'En Güzel İltifatlarını Hazırla 💖',
    };
  } else {
    return {
      phase: 'luteal',
      name: 'Luteal / PMS Fazı (Hassasiyet & Dinlenme)',
      emoji: '🍫',
      color: 'amber',
      bgColor: 'bg-amber-50 border-amber-200 text-amber-900',
      pillColor: 'bg-amber-500 text-white',
      hormones: 'Progesteron hızla düşüyor, hormon dalgalanması',
      psychology: 'Pre-menstrüel gerginlik (PMS): Ani alınganlık, sabırsızlık, tatlı aşermesi ve duygusal hassasiyet.',
      tahirTip:
        'Ceren PMS evresinde. Hormon dalgalanması sebebiyle duygusal ve hassas olabilir. Asla inatlaşma, çikolatasını hazır tut, sınırsız şefkat göster ve huzurlu bir sığınak ol! 🍫🫂',
      actionBadge: 'Çikolatasını Al & Sabırla Sarıl 🍫',
    };
  }
};

const MenstrualCycleTracker = () => {
  const { cycleData, updateCycleSettings, logCycleDay, deleteCycleLog, activePersona, profile } =
    useSharedData();
  const { playPop, playChime } = useSound();

  const isCeren = activePersona === 'partner1';

  // Calendar Date State (default to current month)
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDayDateStr, setSelectedDayDateStr] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings form states
  const [tempCycleLength, setTempCycleLength] = useState(cycleData.cycleLength || 28);
  const [tempPeriodDuration, setTempPeriodDuration] = useState(cycleData.periodDuration || 5);
  const [tempLastStart, setTempLastStart] = useState(cycleData.lastPeriodStart || '2026-08-20');

  // Day Log Modal States
  const [logIsPeriod, setLogIsPeriod] = useState(false);
  const [logFlow, setLogFlow] = useState('medium');
  const [logSymptoms, setLogSymptoms] = useState([]);
  const [logMood, setLogMood] = useState('sakin');
  const [logNote, setLogNote] = useState('');
  const [phoneNotificationSent, setPhoneNotificationSent] = useState(false);

  // Send notification to phone
  const handleSendPhoneNotification = async () => {
    playPop();
    const granted = await requestNotificationPermission();
    if (granted) {
      sendCycleNotificationToTahir(currentPhase);
      setPhoneNotificationSent(true);
      setTimeout(() => setPhoneNotificationSent(false), 4000);
    }
  };

  // Cycle Calculations
  const lastStart = new Date(cycleData.lastPeriodStart || '2026-08-20');
  const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffTime = todayZero.getTime() - lastStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const cycleLength = cycleData.cycleLength || 28;
  const periodDuration = cycleData.periodDuration || 5;

  const cycleDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
  const daysUntilNext = cycleLength - cycleDay + 1;

  const currentPhase = getCyclePhaseInfo(cycleDay, periodDuration, cycleLength);

  // Open Day Log
  const handleOpenDay = (dateStr) => {
    playPop();
    setSelectedDayDateStr(dateStr);
    const existingLog = cycleData.logs?.[dateStr];
    if (existingLog) {
      setLogIsPeriod(Boolean(existingLog.isPeriod));
      setLogFlow(existingLog.flow || 'medium');
      setLogSymptoms(existingLog.symptoms || []);
      setLogMood(existingLog.mood || 'sakin');
      setLogNote(existingLog.note || '');
    } else {
      setLogIsPeriod(false);
      setLogFlow('medium');
      setLogSymptoms([]);
      setLogMood('sakin');
      setLogNote('');
    }
  };

  // Save Day Log (Ceren only)
  const handleSaveDayLog = (e) => {
    e.preventDefault();
    if (!isCeren || !selectedDayDateStr) return;

    playChime();
    logCycleDay(selectedDayDateStr, {
      isPeriod: logIsPeriod,
      flow: logIsPeriod ? logFlow : null,
      symptoms: logSymptoms,
      mood: logMood,
      note: logNote.trim(),
    });

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#fb7185', '#fda4af', '#f43f5e'],
    });

    setSelectedDayDateStr(null);
  };

  // Save Cycle Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (!isCeren) return;
    playChime();
    updateCycleSettings({
      cycleLength: Number(tempCycleLength) || 28,
      periodDuration: Number(tempPeriodDuration) || 5,
      lastPeriodStart: tempLastStart,
    });
    setIsSettingsOpen(false);
  };

  // Month navigation
  const handlePrevMonth = () => {
    playPop();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    playPop();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // Generate Calendar Days for viewDate
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
  const adjustedFirstDay = (firstDayIndex + 6) % 7; // Monday = 0
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık',
  ];

  return (
    <div className="space-y-6">
      {/* Role Notice & Tahir Guide Banner */}
      {!isCeren ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-xl relative overflow-hidden"
        >
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-sm">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-[11px] font-extrabold uppercase tracking-wider">
                  Tahir İçin Özel Aşk Bildirimi 🔔
                </span>
                <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full font-bold">
                  {currentPhase.name}
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base leading-snug">
                {currentPhase.actionBadge}
              </h3>
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed pt-1">
                {currentPhase.tahirTip}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendPhoneNotification}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-rose-600 text-xs font-black shadow-md hover:bg-rose-50 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>
                    {phoneNotificationSent
                      ? 'Bildirim Gönderildi! 📲'
                      : 'Telefonuma Bildirim Gönder 📲'}
                  </span>
                </button>
                <span className="text-[10px] text-white/80">
                  (Cihazında bildirim iznini açarak anlık tavsiyeleri alabilirsin)
                </span>
              </div>
              <p className="text-[10px] text-rose-100 pt-1 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Bu takvim Ceren'e aittir. Yalnızca Ceren işaretleme yapabilir; Tahir aşk tavsiyelerini takip eder.</span>
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              Hoş geldin Ceren! Regl başlangıcı, semptom ve ruh halini takvimden işaretleyebilirsin.
            </span>
          </div>
          <button
            onClick={() => {
              playPop();
              setIsSettingsOpen(true);
            }}
            className="px-3 py-1 rounded-xl bg-white text-rose-600 font-bold border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Ayarlar</span>
          </button>
        </div>
      )}

      {/* Main Cycle Status Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/80 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Cycle Day & Phase Badge */}
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-500 p-1 flex items-center justify-center shadow-lg shadow-rose-200 animate-pulseGlow">
              <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center text-center p-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                  Döngü Günü
                </span>
                <span className="text-2xl font-black text-rose-600 leading-tight">
                  {cycleDay}
                </span>
                <span className="text-[9px] font-bold text-slate-500 leading-none">
                  / {cycleLength} Gün
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${currentPhase.pillColor}`}>
                  {currentPhase.emoji} {currentPhase.name}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">
                Gelecek Regle <span className="text-rose-600 font-black">{daysUntilNext} gün</span> kaldı
              </h2>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                {currentPhase.psychology}
              </p>
            </div>
          </div>

          {/* Right: Phase Legend Pills */}
          <div className="grid grid-cols-2 gap-2 text-[11px] w-full md:w-auto">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
              <div>
                <p className="font-bold text-rose-800">Regl (1-5)</p>
                <p className="text-[9px] text-rose-600">Dinlenme & Şefkat</p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <div>
                <p className="font-bold text-emerald-800">Foliküler (6-12)</p>
                <p className="text-[9px] text-emerald-600">Yüksek Enerji</p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-purple-500 shrink-0" />
              <div>
                <p className="font-bold text-purple-800">Ovülasyon (13-16)</p>
                <p className="text-[9px] text-purple-600">Aşk & Çekicilik</p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <div>
                <p className="font-bold text-amber-900">Luteal/PMS (17-28)</p>
                <p className="text-[9px] text-amber-700">Hassasiyet & Çikolata</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tahir Guidance Card Inside (always visible) */}
        <div className={`mt-5 p-4 rounded-2xl border flex items-start gap-3 ${currentPhase.bgColor}`}>
          <div className="p-2 rounded-xl bg-white shadow-xs shrink-0 text-lg">
            {currentPhase.emoji}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
              <span>Tahir İçin Aşk Tavsiyesi</span>
              <span className="text-[10px] font-normal opacity-80">(Psikolojik & Fiziksel Rehber)</span>
            </h4>
            <p className="text-xs mt-1 leading-relaxed opacity-90">
              {currentPhase.tahirTip}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Month Calendar */}
      <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/80 shadow-xl">
        {/* Calendar Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-800">
              {monthNames[month]} {year}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-rose-100 text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-rose-100 text-slate-600 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day Headers (Pzt, Sal, Çar, Per, Cum, Cmt, Paz) */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 mb-2">
          <span>Pzt</span>
          <span>Sal</span>
          <span>Çar</span>
          <span>Per</span>
          <span>Cum</span>
          <span>Cmt</span>
          <span>Paz</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty cells before month start */}
          {Array.from({ length: adjustedFirstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 sm:h-16 rounded-2xl bg-transparent" />
          ))}

          {/* Days of Month */}
          {Array.from({ length: totalDaysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateObj = new Date(year, month, dayNum);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday =
              dayNum === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            // Calculate cycle phase for this date
            const dayDiffFromStart = Math.floor(
              (dateObj.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24)
            );
            const dayInCycle = ((dayDiffFromStart % cycleLength) + cycleLength) % cycleLength + 1;
            const dayPhase = getCyclePhaseInfo(dayInCycle, periodDuration, cycleLength);

            const dayLog = cycleData.logs?.[dateStr];
            const hasPeriodLog = dayLog?.isPeriod;

            let badgeStyle = 'bg-white hover:bg-rose-50 border-slate-200 text-slate-700';
            if (hasPeriodLog || dayPhase.phase === 'menstrual') {
              badgeStyle = 'bg-rose-100/80 border-rose-300 text-rose-800 font-bold';
            } else if (dayPhase.phase === 'ovulation') {
              badgeStyle = 'bg-purple-50/90 border-purple-200 text-purple-800';
            } else if (dayPhase.phase === 'luteal') {
              badgeStyle = 'bg-amber-50/80 border-amber-200 text-amber-800';
            }

            return (
              <motion.button
                key={dateStr}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOpenDay(dateStr)}
                className={`h-14 sm:h-16 rounded-2xl border p-1 sm:p-1.5 flex flex-col justify-between text-left transition-all cursor-pointer relative overflow-hidden ${badgeStyle} ${
                  isToday ? 'ring-2 ring-rose-500 shadow-md' : 'shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-extrabold ${isToday ? 'text-rose-600' : ''}`}>
                    {dayNum}
                  </span>
                  {hasPeriodLog && <span className="text-[10px]">🩸</span>}
                  {dayPhase.phase === 'ovulation' && !hasPeriodLog && (
                    <span className="text-[10px]">🌸</span>
                  )}
                </div>

                <div className="flex items-center gap-0.5 overflow-hidden">
                  {dayLog?.symptoms && dayLog.symptoms.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Semptom kaydedildi" />
                  )}
                  {dayLog?.mood && (
                    <span className="text-[9px] truncate opacity-80">
                      {MOOD_OPTIONS.find((m) => m.id === dayLog.mood)?.label.slice(-2) || '✨'}
                    </span>
                  )}
                  {isToday && (
                    <span className="text-[9px] font-bold text-rose-600 bg-white/90 px-1 rounded ml-auto">
                      Bugün
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Day Log / Details Modal */}
      <AnimatePresence>
        {selectedDayDateStr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 relative shadow-2xl border border-rose-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                      {selectedDayDateStr} Günlüğü
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {isCeren ? 'Ceren İçin Döngü & Semptom Kaydı' : 'Tahir Salt Okunur İnceleme Modu'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDayDateStr(null)}
                  className="p-1.5 rounded-full hover:bg-rose-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isCeren ? (
                /* Ceren: Can Edit */
                <form onSubmit={handleSaveDayLog} className="space-y-4 text-xs sm:text-sm">
                  {/* Period Toggle */}
                  <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🩸</span>
                      <div>
                        <p className="font-bold text-slate-800">Regl Günü mü?</p>
                        <p className="text-[10px] text-slate-500">Bugün kanama/regl başlangıcı mı?</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={logIsPeriod}
                        onChange={(e) => setLogIsPeriod(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500"></div>
                    </label>
                  </div>

                  {/* Flow selection if period */}
                  {logIsPeriod && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1.5"
                    >
                      <label className="font-semibold text-slate-700 block text-xs">Kanama Yoğunluğu</label>
                      <div className="grid grid-cols-3 gap-2">
                        {FLOW_OPTIONS.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => {
                              playPop();
                              setLogFlow(f.id);
                            }}
                            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              logFlow === f.id
                                ? 'bg-rose-500 text-white shadow-xs'
                                : 'bg-white text-slate-600 border-rose-100 hover:bg-rose-50'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Symptoms Multi-Select */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block text-xs">
                      Hissedilen Semptomlar
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {SYMPTOM_OPTIONS.map((s) => {
                        const isSelected = logSymptoms.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              playPop();
                              setLogSymptoms((prev) =>
                                isSelected ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                              );
                            }}
                            className={`p-2 rounded-xl border text-left text-[11px] font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-rose-50/50'
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mood Selection */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block text-xs">Ruh Hali</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {MOOD_OPTIONS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            playPop();
                            setLogMood(m.id);
                          }}
                          className={`p-2 rounded-xl border text-left text-[11px] font-semibold transition-all cursor-pointer ${
                            logMood === m.id
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-rose-50/50'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="font-semibold text-slate-700 block text-xs mb-1">
                      Özel Not (Opsiyonel)
                    </label>
                    <textarea
                      rows={2}
                      value={logNote}
                      onChange={(e) => setLogNote(e.target.value)}
                      placeholder="Bugün nasıl hissettin..."
                      className="w-full p-2.5 rounded-xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    {cycleData.logs?.[selectedDayDateStr] && (
                      <button
                        type="button"
                        onClick={() => {
                          deleteCycleLog(selectedDayDateStr);
                          setSelectedDayDateStr(null);
                        }}
                        className="px-3 py-2.5 rounded-2xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Kaydı Sil
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 transition-all cursor-pointer"
                    >
                      Günlüğü Kaydet 💖
                    </button>
                  </div>
                </form>
              ) : (
                /* Tahir: Read-Only View */
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                    <p className="font-bold text-purple-900 text-sm">
                      🔒 Tahir İçin Bilgi Ekranı
                    </p>
                    <p className="text-slate-600">
                      Ceren'in bu tarihteki durumu:
                    </p>
                    {cycleData.logs?.[selectedDayDateStr] ? (
                      <div className="space-y-1.5 pt-2 border-t border-purple-200/60">
                        <p>
                          <strong>Regl Durumu:</strong>{' '}
                          {cycleData.logs[selectedDayDateStr].isPeriod
                            ? `Regl Günü 🩸 (${cycleData.logs[selectedDayDateStr].flow || 'Orta'})`
                            : 'Regl Değil 🕊️'}
                        </p>
                        {cycleData.logs[selectedDayDateStr].symptoms?.length > 0 && (
                          <p>
                            <strong>Semptomlar:</strong>{' '}
                            {cycleData.logs[selectedDayDateStr].symptoms
                              .map((s) => SYMPTOM_OPTIONS.find((opt) => opt.id === s)?.label || s)
                              .join(', ')}
                          </p>
                        )}
                        <p>
                          <strong>Ruh Hali:</strong>{' '}
                          {MOOD_OPTIONS.find((m) => m.id === cycleData.logs[selectedDayDateStr].mood)?.label ||
                            cycleData.logs[selectedDayDateStr].mood}
                        </p>
                        {cycleData.logs[selectedDayDateStr].note && (
                          <p className="italic text-slate-700 bg-white/80 p-2 rounded-lg">
                            "{cycleData.logs[selectedDayDateStr].note}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic pt-1">
                        Ceren bu gün için henüz semptom kaydetmemiş.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cycle Settings Modal (Ceren only) */}
      <AnimatePresence>
        {isSettingsOpen && isCeren && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 relative shadow-2xl border border-rose-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-rose-500" />
                  <span>Döngü Ayarları</span>
                </h3>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1 rounded-full hover:bg-rose-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Ortalama Döngü Süresi (Gün)
                  </label>
                  <input
                    type="number"
                    min={21}
                    max={45}
                    value={tempCycleLength}
                    onChange={(e) => setTempCycleLength(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <span className="text-[10px] text-slate-400">Genellikle 28 gündür.</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Regl Süresi (Gün)
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={10}
                    value={tempPeriodDuration}
                    onChange={(e) => setTempPeriodDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <span className="text-[10px] text-slate-400">Genellikle 5 gündür.</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Son Regl Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    value={tempLastStart}
                    onChange={(e) => setTempLastStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 cursor-pointer"
                >
                  Ayarları Güncelle ✨
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenstrualCycleTracker;
