import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Droplet,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Heart,
  Bell,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Target,
  Lock,
  Edit3,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

const PRESET_TARGETS = [6, 8, 10, 12];

const WaterTracker = () => {
  const { waterData, updateWater, resetWater, updateWaterTarget, activePersona, profile } =
    useSharedData();
  const { playPop, playChime } = useSound();

  const todayStr = new Date().toISOString().substring(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [nudgeMessage, setNudgeMessage] = useState('');
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  const dailyTarget = waterData?.dailyTarget || 8;

  const dayData = waterData[selectedDate] || { partner1: 0, partner2: 0 };
  const cerenGlasses = dayData.partner1 || 0;
  const tahirGlasses = dayData.partner2 || 0;

  const isCeren = activePersona === 'partner1';
  const partnerName = isCeren ? profile.partner2?.name : profile.partner1?.name;
  const myName = isCeren ? profile.partner1?.name : profile.partner2?.name;

  const cerenPercent = Math.min(100, Math.round((cerenGlasses / dailyTarget) * 100));
  const tahirPercent = Math.min(100, Math.round((tahirGlasses / dailyTarget) * 100));

  const handleAddGlass = (partnerKey) => {
    // Only allow editing own glass
    if (partnerKey === 'partner1' && !isCeren) return;
    if (partnerKey === 'partner2' && isCeren) return;

    playPop();
    const current = dayData[partnerKey] || 0;
    updateWater(selectedDate, partnerKey, 1);

    if (current + 1 === dailyTarget) {
      playChime();
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#0284c7', '#60a5fa'],
      });
    }
  };

  const handleMinusGlass = (partnerKey) => {
    // Only allow editing own glass
    if (partnerKey === 'partner1' && !isCeren) return;
    if (partnerKey === 'partner2' && isCeren) return;

    playPop();
    updateWater(selectedDate, partnerKey, -1);
  };

  const handleNudgePartner = () => {
    playChime();
    setNudgeMessage(
      `💦 ${partnerName}'e tatlı bir aşk bildirimi gitti: "Sevgilim, sağlığın için 1 bardak su içer misin? Seni çok seviyorum!" 💌`
    );
    setTimeout(() => setNudgeMessage(''), 5000);
  };

  // Date steppers
  const handleDayChange = (deltaDays) => {
    playPop();
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + deltaDays);
    setSelectedDate(d.toISOString().substring(0, 10));
  };

  const isToday = selectedDate === todayStr;

  return (
    <div className="space-y-6">
      {/* Date Header & Target Strip */}
      <div className="p-4 sm:p-5 glass-card rounded-3xl border border-sky-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 text-white flex items-center justify-center shadow-md shadow-sky-200">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-800 text-base sm:text-lg leading-tight">
              Ortak Su Takibi 💧
            </h2>
            <p className="text-xs text-sky-600 font-semibold">
              Günde {dailyTarget} bardak ({dailyTarget * 250} ml) hedefi • Herkes sadece kendi bardağını güncelleyebilir! ✨
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Target Changer Pill */}
          <div className="flex items-center gap-1.5 bg-white/90 p-1.5 rounded-2xl border border-sky-200 shadow-2xs">
            <Target className="w-3.5 h-3.5 text-sky-500 ml-1" />
            <span className="text-[11px] font-bold text-slate-600">Hedef:</span>
            <div className="flex gap-1">
              {PRESET_TARGETS.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    playPop();
                    updateWaterTarget(t);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    dailyTarget === t
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-sky-50'
                  }`}
                  title={`${t * 250} ml`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-0.5 pl-1 border-l border-sky-100">
              <button
                onClick={() => {
                  playPop();
                  updateWaterTarget(Math.max(4, dailyTarget - 1));
                }}
                className="w-5 h-5 rounded hover:bg-sky-100 text-slate-600 text-xs font-bold flex items-center justify-center cursor-pointer"
                title="1 Bardak Azalt"
              >
                -
              </button>
              <button
                onClick={() => {
                  playPop();
                  updateWaterTarget(Math.min(20, dailyTarget + 1));
                }}
                className="w-5 h-5 rounded hover:bg-sky-100 text-slate-600 text-xs font-bold flex items-center justify-center cursor-pointer"
                title="1 Bardak Artır"
              >
                +
              </button>
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex items-center gap-1.5 bg-sky-50/80 p-1.5 rounded-2xl border border-sky-100">
            <button
              onClick={() => handleDayChange(-1)}
              className="p-1 rounded-xl hover:bg-sky-100 text-slate-600 transition-colors cursor-pointer"
              title="Önceki Gün"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700 px-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-500" />
              {isToday ? 'Bugün' : selectedDate}
            </span>
            <button
              onClick={() => handleDayChange(1)}
              className="p-1 rounded-xl hover:bg-sky-100 text-slate-600 transition-colors cursor-pointer"
              title="Sonraki Gün"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {!isToday && (
              <button
                onClick={() => setSelectedDate(todayStr)}
                className="text-[10px] font-bold text-sky-600 bg-white px-2 py-0.5 rounded-lg border border-sky-200 hover:bg-sky-50 cursor-pointer"
              >
                Bugüne Dön
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sweet Nudge Popup/Banner */}
      {nudgeMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl text-white text-xs font-bold shadow-md text-center flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>{nudgeMessage}</span>
        </motion.div>
      )}

      {/* Side-by-Side Water Bottles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ceren's Water Column */}
        <div
          className={`glass-card rounded-3xl p-5 sm:p-6 border shadow-xl flex flex-col justify-between transition-all ${
            isCeren ? 'border-rose-300 ring-2 ring-rose-300/30' : 'border-rose-200/70'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{profile.partner1?.avatar || '👱🏻‍♀️'}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-slate-800">{profile.partner1?.name}'in Suyu</h3>
                  {isCeren && (
                    <span className="text-[9px] font-extrabold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">
                      Senin Bardağın 💖
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">
                  Hedef: {dailyTarget} Bardak ({dailyTarget * 250} ml)
                </span>
              </div>
            </div>
            {cerenGlasses >= dailyTarget && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Hedef Tamam! 🎉
              </span>
            )}
          </div>

          {/* Visual Glass & Wave Animation */}
          <div className="flex items-center justify-center gap-6 my-4">
            <div className="relative w-28 h-52 rounded-3xl border-4 border-rose-300/80 bg-rose-50/40 overflow-hidden shadow-inner flex flex-col justify-end p-1">
              {/* Water Level Fill */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${cerenPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full bg-gradient-to-t from-pink-500 via-rose-400 to-sky-300 rounded-2xl relative shadow-md"
              >
                {/* Surface Shine */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-white/50 rounded-full blur-[1px]" />
              </motion.div>

              {/* Water Glass percentage overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-800">
                <span className="text-3xl font-black drop-shadow-sm text-slate-800">
                  {cerenGlasses}
                </span>
                <span className="text-[10px] font-bold text-slate-600 uppercase">
                  / {dailyTarget} Bardak
                </span>
                <span className="text-xs font-bold text-rose-700 mt-1">{cerenGlasses * 250} ml</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                <p className="text-[10px] text-slate-400">İlerleme</p>
                <p className="font-extrabold text-sm text-rose-700">%{cerenPercent}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                <p className="text-[10px] text-slate-400">Kalan</p>
                <p className="font-extrabold text-sm text-sky-600">
                  {Math.max(0, dailyTarget - cerenGlasses)} Bardak
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons: ONLY CEREN CAN EDIT */}
          {isCeren ? (
            <div className="pt-4 border-t border-rose-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleMinusGlass('partner1')}
                disabled={cerenGlasses <= 0}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="1 Bardak Azalt"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleAddGlass('partner1')}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs shadow-md shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+1 Bardak Su İçtim (250 ml) 💧</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-rose-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-rose-50/70 px-3 py-2 rounded-xl border border-rose-100 flex-1">
                <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Ceren'in bardağını sadece Ceren işaretleyebilir</span>
              </div>
              <button
                onClick={handleNudgePartner}
                className="px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                title="Ceren'e su içmesini hatırlat"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Hatırlat 💦</span>
              </button>
            </div>
          )}
        </div>

        {/* Tahir's Water Column */}
        <div
          className={`glass-card rounded-3xl p-5 sm:p-6 border shadow-xl flex flex-col justify-between transition-all ${
            !isCeren ? 'border-blue-300 ring-2 ring-blue-300/30' : 'border-blue-200/70'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-blue-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{profile.partner2?.avatar || '👨🏻'}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-slate-800">{profile.partner2?.name}'in Suyu</h3>
                  {!isCeren && (
                    <span className="text-[9px] font-extrabold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                      Senin Bardağın 💙
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">
                  Hedef: {dailyTarget} Bardak ({dailyTarget * 250} ml)
                </span>
              </div>
            </div>
            {tahirGlasses >= dailyTarget && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Hedef Tamam! 🎉
              </span>
            )}
          </div>

          {/* Visual Glass & Wave Animation */}
          <div className="flex items-center justify-center gap-6 my-4">
            <div className="relative w-28 h-52 rounded-3xl border-4 border-blue-300/80 bg-blue-50/40 overflow-hidden shadow-inner flex flex-col justify-end p-1">
              {/* Water Level Fill */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${tahirPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full bg-gradient-to-t from-blue-600 via-sky-500 to-cyan-300 rounded-2xl relative shadow-md"
              >
                {/* Surface Shine */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-white/50 rounded-full blur-[1px]" />
              </motion.div>

              {/* Water Glass percentage overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-800">
                <span className="text-3xl font-black drop-shadow-sm text-slate-800">
                  {tahirGlasses}
                </span>
                <span className="text-[10px] font-bold text-slate-600 uppercase">
                  / {dailyTarget} Bardak
                </span>
                <span className="text-xs font-bold text-blue-700 mt-1">{tahirGlasses * 250} ml</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-[10px] text-slate-400">İlerleme</p>
                <p className="font-extrabold text-sm text-blue-700">%{tahirPercent}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                <p className="text-[10px] text-slate-400">Kalan</p>
                <p className="font-extrabold text-sm text-sky-600">
                  {Math.max(0, dailyTarget - tahirGlasses)} Bardak
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons: ONLY TAHIR CAN EDIT */}
          {!isCeren ? (
            <div className="pt-4 border-t border-blue-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleMinusGlass('partner2')}
                disabled={tahirGlasses <= 0}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="1 Bardak Azalt"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleAddGlass('partner2')}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-extrabold text-xs shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+1 Bardak Su İçtim (250 ml) 💧</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-blue-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-blue-50/70 px-3 py-2 rounded-xl border border-blue-100 flex-1">
                <Lock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Tahir'in bardağını sadece Tahir işaretleyebilir</span>
              </div>
              <button
                onClick={handleNudgePartner}
                className="px-3 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                title="Tahir'e su içmesini hatırlat"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Hatırlat 💦</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sweet Hydration Footer */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 border border-sky-100 shadow-md flex items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="font-medium text-slate-700">
            Artık bana bugün çok az su içtin. cart curt demene gerek yok. ne kadar içtiğimi burdan kontrol edebilirsinn 💧
          </span>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
