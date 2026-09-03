import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Sparkles,
  Heart,
  X,
  Lock,
  Navigation,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

export const PRESET_STATUSES = [
  { id: 'home', label: 'Evde 🏠', icon: '🏠', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { id: 'work', label: 'İşte / Ofiste 💼', icon: '💼', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  { id: 'school', label: 'Derste / Okulda 🎓', icon: '🎓', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  { id: 'together', label: 'Birlikteyiz 💖', icon: '💖', color: 'bg-rose-100 text-rose-800 border-rose-300 font-bold' },
  { id: 'road', label: 'Yolda / Trafikte 🚗', icon: '🚗', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'cafe', label: 'Kafede / Dışarıda ☕', icon: '☕', color: 'bg-orange-50 text-orange-800 border-orange-200' },
  { id: 'gym', label: 'Sporda 🏋️', icon: '🏋️', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  { id: 'shopping', label: 'Alışverişte 🛒', icon: '🛒', color: 'bg-pink-50 text-pink-800 border-pink-200' },
  { id: 'sleep', label: 'Dinleniyor / Uyuyor 😴', icon: '😴', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
];

export const HOURS = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
  '00:00',
];

const HourlySchedule = () => {
  const { hourlySchedule, updateScheduleSlot, clearScheduleSlot, activePersona, profile } =
    useSharedData();
  const { playPop, playChime } = useSound();

  const todayStr = new Date().toISOString().substring(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Edit Modal State
  const [editingSlot, setEditingSlot] = useState(null); // { hour, partnerKey }
  const [slotStatus, setSlotStatus] = useState('home');
  const [slotLocation, setSlotLocation] = useState('');
  const [slotNote, setSlotNote] = useState('');

  const isCeren = activePersona === 'partner1';

  const currentHourNum = new Date().getHours();
  const currentHourFormatted = `${String(currentHourNum).padStart(2, '0')}:00`;

  const daySchedule = hourlySchedule[selectedDate] || {};

  const handleOpenEdit = (hour, partnerKey) => {
    // Only allow editing own slot
    if (partnerKey === 'partner1' && !isCeren) {
      alert(`Bu sütunu yalnızca ${profile.partner1?.name} güncelleyebilir! 🔒`);
      return;
    }
    if (partnerKey === 'partner2' && isCeren) {
      alert(`Bu sütunu yalnızca ${profile.partner2?.name} güncelleyebilir! 🔒`);
      return;
    }

    playPop();
    const existing = daySchedule[hour]?.[partnerKey];
    setSlotStatus(existing?.status || 'home');
    setSlotLocation(existing?.location || '');
    setSlotNote(existing?.note || '');
    setEditingSlot({ hour, partnerKey });
  };

  const handleSaveSlot = (e) => {
    e.preventDefault();
    if (!editingSlot) return;

    playChime();
    const preset = PRESET_STATUSES.find((p) => p.id === slotStatus);
    updateScheduleSlot(selectedDate, editingSlot.hour, editingSlot.partnerKey, {
      status: slotStatus,
      statusLabel: preset ? preset.label : 'Evde 🏠',
      location: slotLocation.trim(),
      note: slotNote.trim(),
      updatedAt: new Date().toISOString(),
    });

    setEditingSlot(null);
  };

  const handleClear = (hour, partnerKey) => {
    playPop();
    clearScheduleSlot(selectedDate, hour, partnerKey);
    setEditingSlot(null);
  };

  const handleDayChange = (delta) => {
    playPop();
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().substring(0, 10));
  };

  const scrollToCurrentHour = () => {
    const el = document.getElementById(`hour-row-${currentHourFormatted}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const isToday = selectedDate === todayStr;

  // Current hour statuses
  const currentCerenSlot = daySchedule[currentHourFormatted]?.partner1;
  const currentTahirSlot = daySchedule[currentHourFormatted]?.partner2;

  return (
    <div className="space-y-6">
      {/* Aesthetic Header */}
      <div className="p-4 sm:p-6 glass-card rounded-3xl border border-rose-200/80 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-200 animate-pulseGlow">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-800 text-base sm:text-lg leading-tight flex items-center gap-2">
              <span>Saat Saat Günlük Program</span>
              <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                Ortak Çizelge
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              İkiniz için günün 24 saati yan yana • Herkes kendi durumunu işaretler ✨
            </p>
          </div>
        </div>

        {/* Date Selector & Jump to Current Hour */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          {isToday && (
            <button
              onClick={scrollToCurrentHour}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-sm hover:from-rose-600 hover:to-pink-600 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Şu An ({currentHourFormatted})</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-white/90 p-1.5 rounded-2xl border border-rose-200 shadow-2xs">
            <button
              onClick={() => handleDayChange(-1)}
              className="p-1 rounded-xl hover:bg-rose-50 text-slate-600 transition-colors cursor-pointer"
              title="Önceki Gün"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-800 px-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              {isToday ? 'Bugün' : selectedDate}
            </span>
            <button
              onClick={() => handleDayChange(1)}
              className="p-1 rounded-xl hover:bg-rose-50 text-slate-600 transition-colors cursor-pointer"
              title="Sonraki Gün"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {!isToday && (
              <button
                onClick={() => setSelectedDate(todayStr)}
                className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 hover:bg-rose-100 cursor-pointer"
              >
                Bugüne Dön
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero: Right Now Live Status Card (Şu An Neredeyiz?) */}
      {isToday && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-white/20 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider">
                Şu An Neredeyiz? ({currentHourFormatted})
              </span>
            </div>
            <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">
              Canlı Durum
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Ceren Live Status */}
            <div
              onClick={() => isCeren && handleOpenEdit(currentHourFormatted, 'partner1')}
              className={`p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-between transition-all ${
                isCeren ? 'cursor-pointer hover:bg-white/25' : ''
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{profile.partner1?.avatar || '👱🏻‍♀️'}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-extrabold">{profile.partner1?.name}</p>
                    {isCeren && <span className="text-[9px] bg-white/30 px-1.5 rounded">Sen</span>}
                  </div>
                  <p className="text-xs font-semibold text-rose-100">
                    {currentCerenSlot?.statusLabel || 'Durum belirtilmedi'}
                  </p>
                  {currentCerenSlot?.location && (
                    <p className="text-[10px] text-white/80 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{currentCerenSlot.location}</span>
                    </p>
                  )}
                </div>
              </div>
              {isCeren && <Edit3 className="w-3.5 h-3.5 text-white/70" />}
            </div>

            {/* Tahir Live Status */}
            <div
              onClick={() => !isCeren && handleOpenEdit(currentHourFormatted, 'partner2')}
              className={`p-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-between transition-all ${
                !isCeren ? 'cursor-pointer hover:bg-white/25' : ''
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{profile.partner2?.avatar || '👨🏻'}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-extrabold">{profile.partner2?.name}</p>
                    {!isCeren && <span className="text-[9px] bg-white/30 px-1.5 rounded">Sen</span>}
                  </div>
                  <p className="text-xs font-semibold text-blue-100">
                    {currentTahirSlot?.statusLabel || 'Durum belirtilmedi'}
                  </p>
                  {currentTahirSlot?.location && (
                    <p className="text-[10px] text-white/80 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{currentTahirSlot.location}</span>
                    </p>
                  )}
                </div>
              </div>
              {!isCeren && <Edit3 className="w-3.5 h-3.5 text-white/70" />}
            </div>
          </div>
        </div>
      )}

      {/* Hourly Schedule Cards Container */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 border border-rose-200/80 shadow-xl space-y-3">
        {/* Table Column Headers */}
        <div className="grid grid-cols-12 gap-2 pb-3 border-b border-rose-100/80 text-xs font-extrabold text-slate-500 items-center">
          <div className="col-span-2 sm:col-span-2 text-center text-slate-700">Saat</div>
          <div className="col-span-5 sm:col-span-5 flex items-center justify-center gap-1.5 text-rose-700 bg-rose-50/80 py-1.5 rounded-xl border border-rose-200/70">
            <span>{profile.partner1?.avatar || '👱🏻‍♀️'}</span>
            <span className="truncate">{profile.partner1?.name}</span>
            {isCeren && <span className="text-[9px] bg-rose-200 text-rose-800 px-1 rounded">Sen</span>}
          </div>
          <div className="col-span-5 sm:col-span-5 flex items-center justify-center gap-1.5 text-blue-700 bg-blue-50/80 py-1.5 rounded-xl border border-blue-200/70">
            <span>{profile.partner2?.avatar || '👨🏻'}</span>
            <span className="truncate">{profile.partner2?.name}</span>
            {!isCeren && <span className="text-[9px] bg-blue-200 text-blue-800 px-1 rounded">Sen</span>}
          </div>
        </div>

        {/* Rows */}
        <div className="space-y-2.5">
          {HOURS.map((hour) => {
            const isCurrentHour = isToday && hour === currentHourFormatted;
            const cerenSlot = daySchedule[hour]?.partner1;
            const tahirSlot = daySchedule[hour]?.partner2;

            const cerenPreset = PRESET_STATUSES.find((p) => p.id === cerenSlot?.status);
            const tahirPreset = PRESET_STATUSES.find((p) => p.id === tahirSlot?.status);

            return (
              <motion.div
                key={hour}
                id={`hour-row-${hour}`}
                whileHover={{ scale: 1.005 }}
                className={`grid grid-cols-12 gap-2 p-2 sm:p-2.5 rounded-2xl border transition-all items-center relative ${
                  isCurrentHour
                    ? 'bg-gradient-to-r from-rose-50/90 via-pink-50/80 to-blue-50/90 border-rose-400 ring-2 ring-rose-400/40 shadow-md'
                    : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-2xs'
                }`}
              >
                {/* Hour Badge */}
                <div className="col-span-2 flex flex-col items-center justify-center">
                  <span
                    className={`font-mono text-xs font-black ${
                      isCurrentHour ? 'text-rose-600 text-sm' : 'text-slate-600'
                    }`}
                  >
                    {hour}
                  </span>
                  {isCurrentHour && (
                    <span className="text-[8px] font-black text-white bg-rose-500 px-1.5 py-0.2 rounded-full uppercase tracking-tighter animate-pulse mt-0.5">
                      Şu An
                    </span>
                  )}
                </div>

                {/* Ceren Slot Card */}
                <div className="col-span-5">
                  {cerenSlot ? (
                    <button
                      onClick={() => handleOpenEdit(hour, 'partner1')}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer hover:shadow-xs flex flex-col justify-between min-h-[56px] ${
                        cerenPreset?.color || 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-extrabold truncate">
                          {cerenSlot.statusLabel || cerenPreset?.label}
                        </span>
                        {isCeren && <Edit3 className="w-3 h-3 opacity-40 hover:opacity-100 shrink-0" />}
                      </div>
                      {cerenSlot.location && (
                        <p className="text-[10px] font-semibold flex items-center gap-1 mt-0.5 opacity-90 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{cerenSlot.location}</span>
                        </p>
                      )}
                      {cerenSlot.note && (
                        <p className="text-[9px] opacity-75 italic truncate mt-0.5">
                          "{cerenSlot.note}"
                        </p>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenEdit(hour, 'partner1')}
                      className={`w-full h-[56px] px-2 rounded-xl border border-dashed transition-all text-center flex items-center justify-center gap-1 text-[11px] font-semibold cursor-pointer ${
                        isCeren
                          ? 'border-rose-200 hover:border-rose-400 bg-rose-50/30 hover:bg-rose-50/70 text-slate-400 hover:text-rose-600'
                          : 'border-slate-200 bg-slate-50/40 text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {isCeren ? (
                        <>
                          <Plus className="w-3 h-3 text-rose-500" />
                          <span className="text-slate-500 hover:text-rose-600">Durum Ekle</span>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Belirtilmedi</span>
                      )}
                    </button>
                  )}
                </div>

                {/* Tahir Slot Card */}
                <div className="col-span-5">
                  {tahirSlot ? (
                    <button
                      onClick={() => handleOpenEdit(hour, 'partner2')}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer hover:shadow-xs flex flex-col justify-between min-h-[56px] ${
                        tahirPreset?.color || 'bg-blue-50 border-blue-200 text-blue-800'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-extrabold truncate">
                          {tahirSlot.statusLabel || tahirPreset?.label}
                        </span>
                        {!isCeren && <Edit3 className="w-3 h-3 opacity-40 hover:opacity-100 shrink-0" />}
                      </div>
                      {tahirSlot.location && (
                        <p className="text-[10px] font-semibold flex items-center gap-1 mt-0.5 opacity-90 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{tahirSlot.location}</span>
                        </p>
                      )}
                      {tahirSlot.note && (
                        <p className="text-[9px] opacity-75 italic truncate mt-0.5">
                          "{tahirSlot.note}"
                        </p>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenEdit(hour, 'partner2')}
                      className={`w-full h-[56px] px-2 rounded-xl border border-dashed transition-all text-center flex items-center justify-center gap-1 text-[11px] font-semibold cursor-pointer ${
                        !isCeren
                          ? 'border-blue-200 hover:border-blue-400 bg-blue-50/30 hover:bg-blue-50/70 text-slate-400 hover:text-blue-600'
                          : 'border-slate-200 bg-slate-50/40 text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {!isCeren ? (
                        <>
                          <Plus className="w-3 h-3 text-blue-500" />
                          <span className="text-slate-500 hover:text-blue-600">Durum Ekle</span>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Belirtilmedi</span>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Edit Slot Modal */}
      <AnimatePresence>
        {editingSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 relative shadow-2xl border border-rose-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {editingSlot.partnerKey === 'partner1' ? profile.partner1?.avatar : profile.partner2?.avatar}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
                      {editingSlot.partnerKey === 'partner1' ? profile.partner1?.name : profile.partner2?.name} • {editingSlot.hour}
                    </h3>
                    <p className="text-[10px] text-slate-400">Neredesin ve ne yapıyorsun?</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingSlot(null)}
                  className="p-1.5 rounded-full hover:bg-rose-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveSlot} className="space-y-3.5 text-xs">
                {/* Status Presets */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">Durumunu Seç:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {PRESET_STATUSES.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          playPop();
                          setSlotStatus(preset.id);
                        }}
                        className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                          slotStatus === preset.id
                            ? 'bg-rose-500 text-white shadow-xs border-rose-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50/50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Input */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Konum / Yer (Opsiyonel)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={slotLocation}
                      onChange={(e) => setSlotLocation(e.target.value)}
                      placeholder="Örn: Kadıköy Moda Sahil, Ofis 3. Kat, Evde salonda"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </div>

                {/* Note Input */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Küçük Not (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={slotNote}
                    onChange={(e) => setSlotNote(e.target.value)}
                    placeholder="Örn: Toplantıdayım, 15:30 gibi bitecek 💖"
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {daySchedule[editingSlot.hour]?.[editingSlot.partnerKey] && (
                    <button
                      type="button"
                      onClick={() => handleClear(editingSlot.hour, editingSlot.partnerKey)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Sil
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 cursor-pointer"
                  >
                    Kaydet ✨
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HourlySchedule;
