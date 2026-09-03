import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Eraser,
  RotateCcw,
  Trash2,
  Save,
  Download,
  Send,
  Sparkles,
  Check,
} from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import DrawingGallery from './DrawingGallery';

const COLOR_PALETTE = [
  '#f43f5e', // rose-500
  '#ec4899', // pink-500
  '#be123c', // rose-700
  '#a855f7', // purple-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#0ea5e9', // sky-500
  '#334155', // slate-700
  '#ffffff', // white
];

const STAMPS = ['❤️', '💖', '⭐', '🌸', '💋', '🧸', '✨', '🐾'];

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const { saveDrawing, addNote, profile, activePersona } = useSharedData();
  const { playPop, playChime } = useSound();

  const [brushColor, setBrushColor] = useState('#f43f5e');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState(null);
  const [drawingTitle, setDrawingTitle] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [successNotice, setSuccessNotice] = useState('');

  const currentPartner = activePersona === 'partner1' ? profile.partner1 : profile.partner2;

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set white background by default
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(data);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      playPop();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const prevStep = historyStep - 1;
      const img = new Image();
      img.src = history[prevStep];
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHistoryStep(prevStep);
      };
    }
  };

  const handleClear = () => {
    if (window.confirm('Tüm tuval temizlensin mi?')) {
      playPop();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    }
  };

  // Get coordinates with high precision
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (selectedStamp) {
      // Place Stamp
      playPop();
      ctx.font = `${brushSize * 4 + 20}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedStamp, coords.x, coords.y);
      saveState();
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#ffffff' : brushColor;
    ctx.lineWidth = isEraser ? brushSize * 2 : brushSize;
  };

  const draw = (e) => {
    if (!isDrawing || selectedStamp) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.closePath();
      setIsDrawing(false);
      saveState();
    }
  };

  // Save to Gallery
  const handleSaveToGallery = () => {
    playChime();
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');

    saveDrawing({
      title: drawingTitle.trim() || 'Aşk Çizimi ❤️',
      dataUrl,
    });

    setSuccessNotice('Çizim galeriye kaydedildi! 🎨✨');
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  // Send as Note
  const handleSendAsNote = () => {
    playChime();
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');

    // Save drawing to shared drawings and create a linked love note
    saveDrawing({
      title: drawingTitle.trim() || 'Sana Özel Çizimim 🎨',
      dataUrl,
    });

    addNote(
      `Sana özel bir aşk çizimi bıraktım! 🎨✨ "${drawingTitle.trim() || 'Seni Seviyorum'}"`,
      'mint'
    );

    setSuccessNotice('Çizim sevgi notu olarak panoya gönderildi! 💌');
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  // Download as PNG
  const handleDownloadPNG = () => {
    playPop();
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `love-doodle-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Canvas Tool Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/70 shadow-xl space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-rose-300">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Canlı Aşk Çizim Tahtası (Doodle Board)
              </h2>
              <p className="text-xs text-slate-500">
                Birbirinize özel tatlı resimler ve mesajlar çizin 💕
              </p>
            </div>
          </div>

          <input
            type="text"
            placeholder="Çizime bir başlık ver (İsteğe bağlı)..."
            value={drawingTitle}
            onChange={(e) => setDrawingTitle(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-rose-50/70 rounded-2xl border border-rose-100">
          {/* Colors */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color}
                onClick={() => {
                  playPop();
                  setBrushColor(color);
                  setIsEraser(false);
                  setSelectedStamp(null);
                }}
                className={`w-6 h-6 rounded-full border border-slate-300 transition-transform cursor-pointer ${
                  !isEraser && !selectedStamp && brushColor === color
                    ? 'scale-125 ring-2 ring-rose-500 shadow-sm'
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Stamps */}
          <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-xl border border-rose-100">
            <span className="text-[10px] font-bold text-rose-500 mr-1 hidden sm:inline">Damga:</span>
            {STAMPS.map((stamp) => (
              <button
                key={stamp}
                onClick={() => {
                  playPop();
                  setSelectedStamp(selectedStamp === stamp ? null : stamp);
                  setIsEraser(false);
                }}
                className={`p-1 rounded-lg text-sm sm:text-base transition-transform cursor-pointer ${
                  selectedStamp === stamp ? 'bg-rose-200 scale-125 shadow-xs' : 'hover:scale-115'
                }`}
              >
                {stamp}
              </button>
            ))}
          </div>

          {/* Brush Size Slider */}
          <div className="flex items-center gap-2 bg-white/90 px-3 py-1 rounded-xl border border-rose-100">
            <span className="text-[11px] text-slate-500 font-semibold">Boyut:</span>
            <input
              type="range"
              min="2"
              max="28"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-20 h-1 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <span className="text-[11px] font-mono text-rose-600 font-bold">{brushSize}px</span>
          </div>

          {/* Eraser, Undo, Clear */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => {
                playPop();
                setIsEraser(!isEraser);
                setSelectedStamp(null);
              }}
              title="Silgi"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isEraser
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white hover:bg-rose-50 text-slate-600 border border-rose-100'
              }`}
            >
              <Eraser className="w-4 h-4" />
            </button>
            <button
              onClick={handleUndo}
              disabled={historyStep <= 0}
              title="Geri Al"
              className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-600 border border-rose-100 disabled:opacity-40 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleClear}
              title="Tuvali Temizle"
              className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-600 border border-rose-100 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* HTML5 Canvas Container */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-rose-200/90 shadow-inner bg-white flex justify-center items-center">
          <canvas
            ref={canvasRef}
            width={800}
            height={480}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full max-w-full h-auto touch-none cursor-crosshair block bg-white"
          />
        </div>

        {/* Feedback notice */}
        {successNotice && (
          <div className="p-3 bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 shadow-sm">
            <Check className="w-4 h-4" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
          <button
            onClick={handleDownloadPNG}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-rose-50 border border-rose-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PNG İndir</span>
          </button>

          <button
            onClick={handleSendAsNote}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 text-white text-xs font-bold shadow-md shadow-purple-200 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Sevgi Notu Olarak Gönder</span>
          </button>

          <button
            onClick={handleSaveToGallery}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Galeriye Kaydet</span>
          </button>
        </div>
      </div>

      {/* Shared Drawing Gallery */}
      <DrawingGallery />
    </div>
  );
};

export default DrawingCanvas;
