import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareHeart, Send, Sparkles, Filter, Pin, Search, Smile, Lock, Calendar } from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import NoteCard from './NoteCard';

const COLOR_OPTIONS = [
  { id: 'rose', bg: 'bg-rose-100 border-rose-300', name: 'Gül Pembesi' },
  { id: 'peach', bg: 'bg-orange-100 border-orange-300', name: 'Tatlı Şeftali' },
  { id: 'lavender', bg: 'bg-purple-100 border-purple-300', name: 'Lavanta Rüyası' },
  { id: 'mint', bg: 'bg-emerald-100 border-emerald-300', name: 'Taze Nane' },
  { id: 'yellow', bg: 'bg-amber-100 border-amber-300', name: 'Güneş Sarısı' },
];

const EMOJI_SHORTCUTS = ['❤️', '💖', '🥰', '🌸', '✨', '☕', '💋', '🧸'];

const LoveNotesBoard = () => {
  const { notes, addNote, profile, activePersona } = useSharedData();
  const { playPop, playChime } = useSound();

  const [newNoteText, setNewNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState('rose');
  const [filterAuthor, setFilterAuthor] = useState('all'); // 'all' | 'partner1' | 'partner2' | 'pinned'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLockedNote, setIsLockedNote] = useState(false);
  const [unlockDate, setUnlockDate] = useState('');

  const currentPartner = activePersona === 'partner1' ? profile.partner1 : profile.partner2;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    playChime();
    addNote(newNoteText.trim(), selectedColor, {
      isLocked: isLockedNote,
      unlockDate: isLockedNote && unlockDate ? unlockDate : null,
    });
    setNewNoteText('');
    setIsLockedNote(false);
    setUnlockDate('');
  };

  const handleEmojiClick = (emoji) => {
    playPop();
    setNewNoteText((prev) => prev + emoji);
  };

  // Filtering
  const filteredNotes = notes.filter((n) => {
    // Author filter
    if (filterAuthor === 'partner1' && n.author !== profile.partner1?.name) return false;
    if (filterAuthor === 'partner2' && n.author !== profile.partner2?.name) return false;
    if (filterAuthor === 'pinned' && !n.pinned) return false;

    // Search query
    if (searchQuery.trim()) {
      return n.content.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  // Sort pinned first
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="space-y-6">
      {/* Post-it Creation Box */}
      <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/70 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-rose-300">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              Günlük Sevgi Notları & Mesaj Panosu
            </h2>
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-rose-600">{currentPartner.name}</span> olarak sevgi notu bırak
            </p>
          </div>
        </div>

        <form onSubmit={handleAddNote} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              required
              placeholder="Bugün kalbinden geçen güzel bir düşünceyi buraya yaz..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              className="w-full p-4 text-sm rounded-2xl bg-white/90 border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-inner placeholder:text-slate-400"
            />
          </div>

          {/* Quick Emoji Bar & Color Picker */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Emojis */}
            <div className="flex items-center gap-1 bg-white/80 px-2 py-1 rounded-xl border border-rose-100">
              <Smile className="w-3.5 h-3.5 text-rose-400 mr-0.5" />
              {EMOJI_SHORTCUTS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleEmojiClick(emoji)}
                  className="hover:scale-125 transition-transform text-sm sm:text-base cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Note Color Palette */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Renk:</span>
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    playPop();
                    setSelectedColor(c.id);
                  }}
                  title={c.name}
                  className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${c.bg} ${
                    selectedColor === c.id ? 'scale-125 ring-2 ring-rose-400 shadow-sm' : 'opacity-80'
                  }`}
                />
              ))}
            </div>

            {/* Future Lock Option */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-purple-700 font-semibold cursor-pointer bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200">
                <input
                  type="checkbox"
                  checked={isLockedNote}
                  onChange={(e) => {
                    setIsLockedNote(e.target.checked);
                    if (e.target.checked && !unlockDate) {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 7);
                      setUnlockDate(tomorrow.toISOString().substring(0, 10));
                    }
                  }}
                  className="rounded text-purple-600 focus:ring-purple-400 cursor-pointer"
                />
                <Lock className="w-3 h-3" />
                <span>Geleceğe Kilitle 🔒</span>
              </label>

              {isLockedNote && (
                <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-xl border border-purple-200 text-xs">
                  <Calendar className="w-3 h-3 text-purple-500" />
                  <input
                    type="date"
                    required={isLockedNote}
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    className="text-xs text-slate-700 bg-transparent focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!newNoteText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all disabled:opacity-50 cursor-pointer ml-auto"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isLockedNote ? 'Kilitli Notu Gönder 🔒' : 'Notu Gönder'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-pill px-4 py-3 rounded-2xl border border-rose-100 shadow-sm">
        {/* Author Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar text-xs">
          <button
            onClick={() => {
              playPop();
              setFilterAuthor('all');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              filterAuthor === 'all'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white hover:bg-rose-50 text-slate-600 border border-rose-100'
            }`}
          >
            Tüm Notlar ({notes.length})
          </button>
          <button
            onClick={() => {
              playPop();
              setFilterAuthor('pinned');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              filterAuthor === 'pinned'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white hover:bg-rose-50 text-slate-600 border border-rose-100'
            }`}
          >
            <Pin className="w-3 h-3" />
            Sabitlenenler
          </button>
          <button
            onClick={() => {
              playPop();
              setFilterAuthor('partner1');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              filterAuthor === 'partner1'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white hover:bg-rose-50 text-slate-600 border border-rose-100'
            }`}
          >
            {profile.partner1?.avatar} {profile.partner1?.name}'in Notları
          </button>
          <button
            onClick={() => {
              playPop();
              setFilterAuthor('partner2');
            }}
            className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer ${
              filterAuthor === 'partner2'
                ? 'bg-blue-500 text-white shadow-xs'
                : 'bg-white hover:bg-blue-50 text-slate-600 border border-blue-100'
            }`}
          >
            {profile.partner2?.avatar} {profile.partner2?.name}'in Notları
          </button>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Notlarda ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
      </div>

      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center border border-rose-100 text-slate-400 text-xs sm:text-sm">
          <p className="text-3xl mb-2">💌</p>
          <p>Henüz bu filtreye uygun sevgi notu bulunmuyor.</p>
          <p className="text-[11px] text-slate-400 mt-1">Hemen yukarıdan ilk romantik notunu bırak!</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {sortedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default LoveNotesBoard;
