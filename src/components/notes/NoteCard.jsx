import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Pin, Trash2, Clock, Lock, Sparkles } from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import { formatTimeAgo, formatDateTurkish } from '../../utils/dateUtils';

const COLOR_CLASSES = {
  rose: 'bg-rose-50/90 border-rose-200/80 text-rose-950',
  peach: 'bg-orange-50/90 border-orange-200/80 text-orange-950',
  lavender: 'bg-purple-50/90 border-purple-200/80 text-purple-950',
  mint: 'bg-emerald-50/90 border-emerald-200/80 text-emerald-950',
  yellow: 'bg-amber-50/90 border-amber-200/80 text-amber-950',
};

const NoteCard = ({ note }) => {
  const { deleteNote, togglePinNote, likeNote, activePersona, profile } = useSharedData();
  const { playPop, playLock } = useSound();
  const [isLiking, setIsLiking] = useState(false);

  const isUnlocked = !note.unlockDate || new Date(note.unlockDate) <= new Date();
  const isAuthor =
    !note.authorRole ||
    note.authorRole === activePersona ||
    note.author === (activePersona === 'partner1' ? profile.partner1?.name : profile.partner2?.name);

  const canDelete = !note.isLocked || isUnlocked || isAuthor;

  const handleLike = () => {
    playPop();
    setIsLiking(true);
    likeNote(note.id);
    setTimeout(() => setIsLiking(false), 400);
  };

  const handlePin = () => {
    playPop();
    togglePinNote(note.id);
  };

  const handleDelete = () => {
    if (note.isLocked && !isUnlocked && !isAuthor) {
      playLock();
      alert(`🔒 Geleceğe kilitli bu notu yalnızca notu yazan kişi (${note.author}) silebilir!`);
      return;
    }

    if (window.confirm('Bu sevgi notunu silmek istediğinize emin misiniz?')) {
      playPop();
      deleteNote(note.id);
    }
  };

  const colorClass = COLOR_CLASSES[note.color] || COLOR_CLASSES.rose;

  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ y: -4 }}
      className={`p-4 sm:p-5 rounded-3xl border shadow-md relative flex flex-col justify-between transition-shadow hover:shadow-xl ${colorClass}`}
    >
      {/* Pinned Badge */}
      {note.pinned && (
        <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-sm flex items-center gap-1">
          <Pin className="w-2.5 h-2.5 fill-white" />
          <span>Sabitlendi</span>
        </div>
      )}

      {/* Note Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl filter drop-shadow-xs">{note.avatar || '💖'}</span>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 leading-tight">
              {note.author}
            </h4>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {formatTimeAgo(note.createdAt)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePin}
            title={note.pinned ? 'Sabitlemeyi Kaldır' : 'Başa Sabitle'}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              note.pinned
                ? 'bg-rose-200/80 text-rose-700'
                : 'hover:bg-black/5 text-slate-400 hover:text-slate-700'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
          {canDelete ? (
            <button
              onClick={handleDelete}
              title="Notu Sil"
              className="p-1.5 rounded-xl hover:bg-rose-200/60 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span
              className="p-1.5 text-purple-400 cursor-not-allowed"
              title={`🔒 Geleceğe kilitli bu notu yalnızca ${note.author} silebilir`}
            >
              <Lock className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      {/* Note Content */}
      {note.isLocked && !isUnlocked ? (
        <div className="my-3 p-3 rounded-2xl bg-white/70 border border-dashed border-purple-300 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-purple-700 font-extrabold text-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>Geleceğe Kilitli Sevgi Notu 🔒</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {isAuthor
              ? `(Senin kilitlediğin not: "${note.content}") • ${formatDateTurkish(note.unlockDate)} tarihinde partnerine açılacak.`
              : `Bu not ${formatDateTurkish(note.unlockDate)} tarihinde açılacak! Geri sayım sürüyor 🎁`}
          </p>
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-slate-700 font-medium whitespace-pre-wrap leading-relaxed my-2 font-sans">
          {note.content}
        </p>
      )}

      {/* Note Footer / Heart Like */}
      <div className="pt-3 mt-2 border-t border-black/5 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 italic">Sevgiyle yazıldı ✨</span>

        <motion.button
          onClick={handleLike}
          animate={{ scale: isLiking ? 1.3 : 1 }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 hover:bg-white border border-rose-200 text-rose-600 text-xs font-bold shadow-xs active:scale-90 transition-transform cursor-pointer"
        >
          <Heart className={`w-3.5 h-3.5 ${note.likes > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{note.likes || 0}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NoteCard;
