import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Lock,
  Unlock,
  Trash2,
  Sparkles,
  Heart,
} from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import { MONTH_NAMES_TR, formatDateTurkish, isDateReached } from '../../utils/dateUtils';
import EventModal from './EventModal';
import TimeCapsuleModal from './TimeCapsuleModal';

const DAY_LABELS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const CalendarView = () => {
  const { events, deleteEvent, activePersona, profile } = useSharedData();
  const { playPop, playChime } = useSound();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDateForNew, setSelectedDateForNew] = useState('');
  const [activeCapsuleEvent, setActiveCapsuleEvent] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation
  const prevMonth = () => {
    playPop();
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    playPop();
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const goToToday = () => {
    playPop();
    setCurrentDate(new Date());
  };

  // Calendar Calculation
  const firstDayOfMonth = new Date(year, month, 1);
  // In JS, Sunday is 0. Convert to Monday = 0
  const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  for (let i = 0; i < startingDayIndex; i++) {
    daysArray.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    daysArray.push(day);
  }

  // Filter events
  const filteredEvents = events.filter((ev) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'capsule') return ev.isTimeCapsule || ev.category === 'capsule';
    return ev.category === selectedCategory;
  });

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.filter((ev) => ev.date && ev.date.substring(0, 10) === dateStr);
  };

  const handleDayClick = (day) => {
    if (!day) return;
    playPop();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateForNew(dateStr);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (e, event) => {
    e.stopPropagation();
    if (event.isTimeCapsule || event.category === 'capsule') {
      playPop();
      setActiveCapsuleEvent(event);
    }
  };

  const handleDeleteEvent = (e, event) => {
    e.stopPropagation();
    const isCapsule = event.isTimeCapsule || event.category === 'capsule';
    const unlocked = isDateReached(event.date);

    // If it's a future-locked capsule / note
    if (isCapsule && !unlocked) {
      const isCreator =
        !event.createdByRole ||
        event.createdByRole === activePersona ||
        event.createdBy ===
          (activePersona === 'partner1' ? profile.partner1?.name : profile.partner2?.name);

      if (!isCreator) {
        const creatorName =
          event.createdBy ||
          (event.createdByRole === 'partner1' ? profile.partner1?.name : profile.partner2?.name) ||
          'notu ekleyen kişi';
        alert(`🔒 Geleceğe kilitli bu notu yalnızca notu yazan kişi (${creatorName}) silebilir!`);
        return;
      }
    }

    if (window.confirm('Bu etkinliği/kapsülü silmek istediğinize emin misiniz?')) {
      playPop();
      deleteEvent(event.id);
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header & Controls */}
      <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/70 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-rose-300">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                {MONTH_NAMES_TR[month]} {year}
              </h2>
              <p className="text-xs text-slate-500">Ortak Takvimimiz & Zaman Kapsülleri</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-slate-600 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 transition-all cursor-pointer"
            >
              Bugün
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-slate-600 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                playPop();
                setSelectedDateForNew(new Date().toISOString().substring(0, 10));
                setIsEventModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all cursor-pointer ml-1"
            >
              <Plus className="w-4 h-4" />
              <span>Etkinlik Ekle</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar text-xs">
          <button
            onClick={() => {
              playPop();
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/80 hover:bg-rose-50 text-slate-600 border border-rose-100'
            }`}
          >
            Tümü ✨
          </button>
          <button
            onClick={() => {
              playPop();
              setSelectedCategory('anniversary');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'anniversary'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/80 hover:bg-rose-50 text-slate-600 border border-rose-100'
            }`}
          >
            💖 Yıldönümleri
          </button>
          <button
            onClick={() => {
              playPop();
              setSelectedCategory('capsule');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'capsule'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white/80 hover:bg-purple-50 text-slate-600 border border-purple-100'
            }`}
          >
            🔒 Zaman Kapsülleri
          </button>
          <button
            onClick={() => {
              playPop();
              setSelectedCategory('birthday');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'birthday'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'bg-white/80 hover:bg-pink-50 text-slate-600 border border-pink-100'
            }`}
          >
            🎂 Doğum Günleri
          </button>
          <button
            onClick={() => {
              playPop();
              setSelectedCategory('date');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'date'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/80 hover:bg-rose-50 text-slate-600 border border-rose-100'
            }`}
          >
            🍷 Buluşmalar
          </button>
          <button
            onClick={() => {
              playPop();
              setSelectedCategory('travel');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'travel'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white/80 hover:bg-sky-50 text-slate-600 border border-sky-100'
            }`}
          >
            ✈️ Geliyorum
          </button>
          <button
            onClick={() => {
              playPop();
              setSelectedCategory('pasta');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'pasta'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white/80 hover:bg-orange-50 text-slate-600 border border-orange-100'
            }`}
          >
            🍝 MAKARNA!
          </button>
          <button
            onClick={() => {
              playPop();
              setSelectedCategory('class');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'class'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white/80 hover:bg-blue-50 text-slate-600 border border-blue-100'
            }`}
          >
            📚 Dersi Var
          </button>
          <button
            onClick={() => {
              playPop();
              setSelectedCategory('exam');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'exam'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-white/80 hover:bg-emerald-50 text-slate-600 border border-emerald-100'
            }`}
          >
            ✍️ Sınavım Var
          </button>
          <button
            onClick={() => {
              playPop();
              setSelectedCategory('other_person');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'other_person'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white/80 hover:bg-amber-50 text-slate-600 border border-amber-100'
            }`}
          >
            🤡 Başkasıyla Buluşcam
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-500 mb-2">
          {DAY_LABELS.map((dayLabel, idx) => (
            <div key={idx} className="py-1">
              {dayLabel}
            </div>
          ))}
        </div>

        {/* Month Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {daysArray.map((day, index) => {
            if (!day) {
              return <div key={index} className="min-h-[64px] sm:min-h-[90px] rounded-2xl bg-slate-50/30" />;
            }

            const dayEvents = getEventsForDay(day);
            const isCurrentDay = isToday(day);

            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleDayClick(day)}
                className={`min-h-[64px] sm:min-h-[90px] p-1.5 sm:p-2 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                  isCurrentDay
                    ? 'bg-rose-100/90 border-rose-400 shadow-md shadow-rose-200/50'
                    : dayEvents.length > 0
                    ? 'bg-white/95 border-rose-200 hover:border-rose-300'
                    : 'bg-white/60 hover:bg-white border-rose-100/80'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isCurrentDay
                        ? 'w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center'
                        : 'text-slate-700'
                    }`}
                  >
                    {day}
                  </span>
                  {isCurrentDay && <span className="text-[10px]">✨</span>}
                </div>

                {/* Day Events Badges */}
                <div className="space-y-1 my-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((ev) => {
                    const isCapsule = ev.isTimeCapsule || ev.category === 'capsule';
                    const unlocked = isDateReached(ev.date);

                    return (
                      <div
                        key={ev.id}
                        onClick={(e) => handleEventClick(e, ev)}
                        title={ev.title}
                        className={`px-1.5 py-0.5 rounded-lg text-[10px] font-semibold truncate flex items-center gap-1 shadow-xs transition-transform active:scale-95 ${
                          isCapsule
                            ? unlocked
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-purple-100 text-purple-900 border border-purple-300'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        <span>{ev.icon || '💖'}</span>
                        <span className="truncate hidden sm:inline">{ev.title}</span>
                      </div>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <span className="text-[9px] font-bold text-rose-500 pl-1">
                      +{dayEvents.length - 2} daha
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events & Timeline Preview */}
      <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/70 shadow-lg">
        <h3 className="font-bold text-base sm:text-lg text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-500" />
          <span>Tüm Özel Günler & Zaman Kapsülleri ({filteredEvents.length})</span>
        </h3>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Bu kategoride henüz bir etkinlik yok. Yeni bir anı veya kapsül eklemek için takvime tıklayın! 💕
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredEvents.map((ev) => {
              const isCapsule = ev.isTimeCapsule || ev.category === 'capsule';
              const unlocked = isDateReached(ev.date);

              return (
                <div
                  key={ev.id}
                  onClick={() => {
                    if (isCapsule) {
                      playPop();
                      setActiveCapsuleEvent(ev);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    isCapsule ? 'cursor-pointer hover:shadow-md' : ''
                  } ${
                    isCapsule
                      ? unlocked
                        ? 'bg-amber-50/80 border-amber-200'
                        : 'bg-purple-50/80 border-purple-200'
                      : 'bg-white/80 border-rose-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xl">{ev.icon || '💖'}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500">
                          {formatDateTurkish(ev.date)}
                        </span>
                        {(!isCapsule || unlocked || !ev.createdByRole || ev.createdByRole === activePersona || ev.createdBy === (activePersona === 'partner1' ? profile.partner1?.name : profile.partner2?.name)) ? (
                          <button
                            onClick={(e) => handleDeleteEvent(e, ev)}
                            className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span
                            className="p-1 text-purple-400 cursor-not-allowed"
                            title={`🔒 Geleceğe kilitli bu notu yalnızca ${ev.createdBy || 'yazan kişi'} silebilir`}
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-slate-800">{ev.title}</h4>
                    {ev.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ev.description}</p>
                    )}
                  </div>

                  {isCapsule && (
                    <div className="mt-3 pt-2 border-t border-purple-200/50 flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-700 flex items-center gap-1">
                        {unlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        {unlocked ? 'Kapsül Açıldı! (Tıkla Gör)' : 'Geleceğe Kilitli (Tıkla)'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        selectedDate={selectedDateForNew}
      />

      <TimeCapsuleModal
        event={activeCapsuleEvent}
        isOpen={Boolean(activeCapsuleEvent)}
        onClose={() => setActiveCapsuleEvent(null)}
      />
    </div>
  );
};

export default CalendarView;
