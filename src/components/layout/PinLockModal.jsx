import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, KeyRound, HelpCircle, X } from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

const PinLockModal = ({ isOpen, onClose }) => {
  const { profile, updateProfile, isLocked, setIsLocked } = useSharedData();
  const { playPop, playLock, playChime } = useSound();

  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionAnswer, setQuestionAnswer] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Mode: if user is locked out, or if user is configuring a new PIN in settings
  const isLockScreen = isLocked;
  const hasExistingPin = Boolean(profile.pinCode && profile.pinCode.length === 4);

  const normalizeTurkish = (str) =>
    (str || '')
      .trim()
      .toLocaleLowerCase('tr-TR')
      .replace(/[\s\-_.,]/g, '');

  const handleDigitPress = (digit) => {
    if (lockoutSeconds > 0) return;
    if (enteredPin.length >= 4) return;
    playPop();
    setErrorMsg('');
    const newPin = enteredPin + digit;
    setEnteredPin(newPin);

    if (newPin.length === 4) {
      if (isLockScreen) {
        // Verify PIN
        if (newPin === profile.pinCode) {
          playChime();
          setIsLocked(false);
          setEnteredPin('');
          setFailedAttempts(0);
          if (onClose) onClose();
        } else {
          playLock();
          setIsShaking(true);
          const nextAttempts = failedAttempts + 1;
          setFailedAttempts(nextAttempts);

          if (nextAttempts >= 5) {
            setLockoutSeconds(30);
            setErrorMsg('5 hatalı deneme! Lütfen 30 saniye bekleyin veya gizli soruyu yanıtlayın 🔒');
          } else {
            setErrorMsg(`Hatalı PIN kodu (${nextAttempts}/5), tekrar dene 🔒`);
          }

          setTimeout(() => {
            setIsShaking(false);
            setEnteredPin('');
          }, 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    playPop();
    setEnteredPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    playPop();
    setEnteredPin('');
    setErrorMsg('');
  };

  // Configure new PIN
  const handleSaveNewPin = () => {
    if (enteredPin.length !== 4) {
      setErrorMsg('Lütfen 4 haneli bir PIN girin');
      return;
    }
    updateProfile({
      ...profile,
      pinCode: enteredPin,
    });
    playChime();
    setEnteredPin('');
    if (onClose) onClose();
  };

  // Disable PIN
  const handleRemovePin = () => {
    updateProfile({
      ...profile,
      pinCode: '',
    });
    playPop();
    setIsLocked(false);
    if (onClose) onClose();
  };

  // Answer secret question
  const handleSecretQuestionSubmit = (e) => {
    e.preventDefault();
    if (
      profile.pinAnswer &&
      normalizeTurkish(questionAnswer) === normalizeTurkish(profile.pinAnswer)
    ) {
      playChime();
      setIsLocked(false);
      setShowQuestion(false);
      setQuestionAnswer('');
      setFailedAttempts(0);
      setLockoutSeconds(0);
      setErrorMsg('');
      if (onClose) onClose();
    } else {
      playLock();
      setErrorMsg('Cevap doğru değil, tekrar dene 💕');
    }
  };

  // Keyboard support for direct typing
  useEffect(() => {
    if (!isOpen && !isLockScreen) return;
    const handleKeyDown = (e) => {
      if (showQuestion) return;
      if (/^[0-9]$/.test(e.key)) {
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' && !isLockScreen) {
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLockScreen, showQuestion, enteredPin, lockoutSeconds]);

  if (!isLockScreen && !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-lg"
      style={{ zIndex: 99999 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          x: isShaking ? [-10, 10, -10, 10, 0] : 0,
        }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 relative shadow-2xl border border-rose-200 text-center"
        style={{ zIndex: 100000 }}
      >
        {!isLockScreen && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-rose-100/60 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Romantic Couple Header */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl animate-bounce">👱🏼‍♀️</span>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-300 ring-2 ring-rose-200">
            {isLockScreen ? <Lock className="w-5 h-5" /> : <KeyRound className="w-5 h-5" />}
          </div>
          <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>👨🏻‍🦰</span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-800 mb-0.5">
          {profile.relationshipTitle || 'Ceren ❤️ Tahir'}
        </h3>
        <p className="text-xs text-rose-500 font-semibold mb-4">
          {isLockScreen
            ? 'Özel Aşk Alanı Girişi 🔒'
            : '4 Haneli Güvenlik PIN Kodu'}
        </p>

        {/* Secret Question View */}
        {showQuestion ? (
          <form onSubmit={handleSecretQuestionSubmit} className="space-y-4">
            <div className="text-left bg-rose-50/90 p-3.5 rounded-2xl border border-rose-200 text-xs">
              <span className="font-bold text-rose-700 block mb-1">Gizli Sorumuz:</span>
              <p className="text-slate-700 font-medium">{profile.pinQuestion || 'İlk buluştuğumuz gün neredeydik?'}</p>
            </div>

            <input
              type="text"
              placeholder="Cevabınız..."
              value={questionAnswer}
              onChange={(e) => setQuestionAnswer(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-rose-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white shadow-inner"
              autoFocus
            />

            {errorMsg && <p className="text-xs text-rose-600 font-bold">{errorMsg}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowQuestion(false);
                  setErrorMsg('');
                }}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
              >
                PIN ile Gir
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-rose-200 cursor-pointer"
              >
                Giriş Yap 💖
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* PIN Dots */}
            <div className="flex justify-center items-center gap-3 mb-5">
              {[0, 1, 2, 3].map((index) => {
                const filled = index < enteredPin.length;
                return (
                  <motion.div
                    key={index}
                    animate={{ scale: filled ? 1.25 : 1 }}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      filled
                        ? 'bg-gradient-to-tr from-rose-500 to-pink-500 shadow-md shadow-rose-300 ring-2 ring-rose-200'
                        : 'bg-rose-100 border border-rose-300'
                    }`}
                  />
                );
              })}
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-bold mb-3 animate-bounce">
                {errorMsg}
              </p>
            )}

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleDigitPress(String(num))}
                  className="w-16 h-12 rounded-2xl bg-white hover:bg-rose-50 active:scale-90 border border-rose-200/80 text-lg font-bold text-slate-800 shadow-xs transition-all flex items-center justify-center cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="w-16 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-90 border border-slate-200 text-xs font-medium text-slate-500 transition-all flex items-center justify-center cursor-pointer"
              >
                Sil
              </button>
              <button
                type="button"
                onClick={() => handleDigitPress('0')}
                className="w-16 h-12 rounded-2xl bg-white hover:bg-rose-50 active:scale-90 border border-rose-200/80 text-lg font-bold text-slate-800 shadow-xs transition-all flex items-center justify-center cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="w-16 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 active:scale-90 border border-slate-200 text-xs font-medium text-slate-500 transition-all flex items-center justify-center cursor-pointer"
              >
                ⌫
              </button>
            </div>

            {/* Action options */}
            <div className="space-y-2 text-xs">
              {!isLockScreen && (
                <div className="flex gap-2">
                  {hasExistingPin && (
                    <button
                      type="button"
                      onClick={handleRemovePin}
                      className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold"
                    >
                      PIN'i Kaldır
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveNewPin}
                    disabled={enteredPin.length !== 4}
                    className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-md shadow-rose-200 disabled:opacity-50"
                  >
                    PIN'i Kaydet
                  </button>
                </div>
              )}

              {isLockScreen && profile.pinQuestion && (
                <button
                  type="button"
                  onClick={() => setShowQuestion(true)}
                  className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium mt-2"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Şifremi Unuttum (Gizli Soru)
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>,
    document.body
  );
};

export default PinLockModal;
