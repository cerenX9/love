import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Download, Share, PlusSquare, CheckCircle2, X, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSound } from '../../context/SoundContext';

const PwaInstallModal = ({ isOpen, onClose }) => {
  const { playPop, playChime } = useSound();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeOs, setActiveOs] = useState('ios'); // 'ios' | 'android'

  useEffect(() => {
    // Detect device OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/android/i.test(userAgent)) {
      setActiveOs('android');
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      setActiveOs('ios');
    }

    // Check if already installed / standalone
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    // Capture Android Chrome beforeinstallprompt event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    playPop();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        playChime();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md cursor-pointer"
      style={{ zIndex: 99999 }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 relative shadow-2xl border border-rose-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-rose-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-200">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg sm:text-xl text-slate-800 leading-tight">
              Telefona Yükle 📲
            </h3>
            <p className="text-xs text-rose-500 font-semibold">
              Tam Ekran Mobil Aşk Uygulaması
            </p>
          </div>
        </div>

        {/* OS Switcher Tabs */}
        <div className="flex rounded-2xl bg-rose-50 p-1 mb-5 border border-rose-100">
          <button
            onClick={() => {
              playPop();
              setActiveOs('ios');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeOs === 'ios'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-500 hover:text-rose-500'
            }`}
          >
            🍎 iPhone / iPad (iOS)
          </button>
          <button
            onClick={() => {
              playPop();
              setActiveOs('android');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeOs === 'android'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-500 hover:text-rose-500'
            }`}
          >
            🤖 Android (Chrome)
          </button>
        </div>

        {/* Instructions Content */}
        {activeOs === 'ios' ? (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
            <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                1
              </span>
              <p>
                Bu bağlantıyı <strong>Safari</strong> tarayıcısında açtığınızdan emin olun.
              </p>
            </div>

            <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                2
              </span>
              <p>
                Ekranın altındaki <strong>Paylaş <Share className="w-3.5 h-3.5 inline mx-1 text-rose-500" /></strong> simgesine dokunun.
              </p>
            </div>

            <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                3
              </span>
              <p>
                Aşağı kaydırıp <strong>"Ana Ekrana Ekle" <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-rose-500" /></strong> seçeneğine tıklayın.
              </p>
            </div>

            <p className="text-[11px] text-center text-emerald-600 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
              ✨ Artık ana ekranınızda logo oluşacak ve tarayıcı çubuğu olmadan tam ekran açılacak!
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
            {deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-sm shadow-lg shadow-rose-200 hover:from-rose-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>Tek Tıkla Telefona Yükle</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    1
                  </span>
                  <p>Chrome tarayıcısının sağ üstündeki <strong>üç nokta (⋮)</strong> menüsüne dokunun.</p>
                </div>

                <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    2
                  </span>
                  <p><strong>"Uygulamayı Yükle"</strong> veya <strong>"Ana Ekrana Ekle"</strong> seçeneğine tıklayın.</p>
                </div>
              </div>
            )}

            <p className="text-[11px] text-center text-emerald-600 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
              🎉 Tebrikler! Ceren & Tahir aşk uygulaması telefonunuzun ana ekranında yerini alacak!
            </p>
          </div>
        )}

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Tamam, Anladım ❤️
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default PwaInstallModal;
