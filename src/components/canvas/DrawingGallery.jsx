import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Palette, Clock, Maximize2, X } from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import { formatDateTurkish, formatTimeAgo } from '../../utils/dateUtils';

const DrawingGallery = () => {
  const { drawings, deleteDrawing } = useSharedData();
  const { playPop } = useSound();
  const [activeEnlargeDrawing, setActiveEnlargeDrawing] = useState(null);

  const getDrawingSrc = (draw) => {
    if (!draw || !draw.dataUrl) return '';
    if (typeof draw.dataUrl === 'string') return draw.dataUrl;
    if (typeof draw.dataUrl === 'object' && typeof draw.dataUrl.dataUrl === 'string') {
      return draw.dataUrl.dataUrl;
    }
    return '';
  };

  const handleDownload = (drawing) => {
    playPop();
    const src = getDrawingSrc(drawing);
    if (!src) return;
    const link = document.createElement('a');
    link.href = src;
    link.download = `love-doodle-${drawing.author || 'drawing'}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu çizimi silmek istediğinize emin misiniz?')) {
      playPop();
      deleteDrawing(id);
    }
  };

  if (drawings.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center border border-rose-100 text-slate-400 text-xs">
        <Palette className="w-8 h-8 mx-auto mb-2 text-rose-300" />
        <p>Henüz kaydedilmiş bir çizim yok. Çizim tahtasında ilk aşk resminizi çizin! 🎨✨</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2">
        <Palette className="w-4 h-4 text-rose-500" />
        <span>Ortak Çizim Galerimiz ({drawings.length})</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {drawings.map((draw) => {
          const src = getDrawingSrc(draw);

          return (
            <motion.div
              key={draw.id}
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-card p-3.5 rounded-2xl border border-rose-100 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              {/* Drawing Preview Image */}
              <div
                onClick={() => {
                  playPop();
                  setActiveEnlargeDrawing(draw);
                }}
                className="rounded-xl overflow-hidden bg-white border border-rose-100 p-2 flex items-center justify-center min-h-[160px] aspect-4/3 cursor-pointer relative"
              >
                {src ? (
                  <img
                    src={src}
                    alt={draw.title || 'Çizim'}
                    className="max-h-full max-w-full object-contain group-hover:scale-103 transition-transform"
                  />
                ) : (
                  <span className="text-4xl">🎨❤️</span>
                )}

                <span className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Info and Actions */}
              <div className="pt-2.5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-800 truncate">
                    {draw.title || `${draw.author || 'Aşk'}'in Çizimi`}
                  </h4>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {formatTimeAgo(draw.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDownload(draw)}
                    title="PNG Olarak İndir"
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(draw.id)}
                    title="Çizimi Sil"
                    className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Enlarge Modal */}
      {activeEnlargeDrawing &&
        createPortal(
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-white rounded-3xl p-5 relative shadow-2xl border border-rose-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                <div>
                  <h3 className="font-bold text-base text-slate-800">
                    {activeEnlargeDrawing.title || 'Aşk Çizimi'}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Çizen: {activeEnlargeDrawing.author || 'Ceren & Tahir'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveEnlargeDrawing(null)}
                  className="p-1.5 rounded-full hover:bg-rose-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden bg-white border border-rose-100 p-2 flex items-center justify-center max-h-[70vh]">
                <img
                  src={getDrawingSrc(activeEnlargeDrawing)}
                  alt="Büyük Çizim"
                  className="max-h-[65vh] max-w-full object-contain"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleDownload(activeEnlargeDrawing)}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PNG İndir</span>
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default DrawingGallery;
