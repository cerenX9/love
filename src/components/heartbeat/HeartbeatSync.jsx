import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Sparkles,
  Smartphone,
  Flame,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Activity,
  Users,
  Radio,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

const HEARTBEAT_CHANNEL_NAME = 'our_love_heartbeat_sync';
const STORAGE_HEARTBEAT_KEY = 'our_love_live_heartbeat';

const HeartbeatSync = ({ isCompact = false }) => {
  const { profile, activePersona, useFirebase, awardXP } = useSharedData();
  const { playHeartbeat, playChime, playPop } = useSound();

  const [isSelfTouching, setIsSelfTouching] = useState(false);
  const [isPartnerTouching, setIsPartnerTouching] = useState(false);
  const [partnerSimulated, setPartnerSimulated] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [syncDuration, setSyncDuration] = useState(0);
  const [bpm, setBpm] = useState(76);
  const [particles, setParticles] = useState([]);

  const channelRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const syncTimerRef = useRef(null);
  const lastTouchTimeRef = useRef(0);

  const currentPartner = activePersona === 'partner1' ? profile.partner1 : profile.partner2;
  const otherPartner = activePersona === 'partner1' ? profile.partner2 : profile.partner1;

  const isBothTouching = isSelfTouching && (isPartnerTouching || partnerSimulated);

  // Initialize BroadcastChannel & Storage listener for real-time multi-tab / multi-device sync
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel(HEARTBEAT_CHANNEL_NAME);
        channelRef.current = channel;

        channel.onmessage = (event) => {
          const data = event.data;
          if (data && data.persona !== activePersona) {
            setIsPartnerTouching(Boolean(data.touching));
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported:', e);
    }

    const handleStorageChange = (e) => {
      if (e.key === STORAGE_HEARTBEAT_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.persona !== activePersona) {
            // Check if touch is recent (within 4 seconds)
            const isRecent = Date.now() - parsed.timestamp < 4000;
            setIsPartnerTouching(Boolean(parsed.touching && isRecent));
          }
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, [activePersona]);

  // Broadcast own touch status
  const broadcastTouch = useCallback(
    (touching) => {
      const payload = {
        persona: activePersona,
        touching,
        timestamp: Date.now(),
      };

      if (channelRef.current) {
        channelRef.current.postMessage(payload);
      }

      try {
        localStorage.setItem(STORAGE_HEARTBEAT_KEY, JSON.stringify(payload));
      } catch (e) {}
    },
    [activePersona]
  );

  // Haptic feedback & sound trigger on beat
  const triggerBeat = useCallback(() => {
    // 1. Web Audio sub-bass heartbeat sound
    try {
      playHeartbeat();
    } catch (e) {}

    // 2. Mobile Device Vibration (Lub-Dub pattern: 70ms pulse, 100ms pause, 70ms pulse)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([70, 90, 70]);
      } catch (e) {}
    }

    // 3. Spawn floating heart particles
    const id = Date.now() + Math.random();
    setParticles((prev) => [
      ...prev.slice(-12),
      {
        id,
        x: (Math.random() - 0.5) * 160,
        y: (Math.random() - 0.5) * 160,
        scale: Math.random() * 0.6 + 0.8,
      },
    ]);
  }, [playHeartbeat]);

  // Handle Touch Start
  const handleTouchStart = (e) => {
    if (e) e.preventDefault();
    if (isSelfTouching) return;

    setIsSelfTouching(true);
    lastTouchTimeRef.current = Date.now();
    broadcastTouch(true);
    triggerBeat();
  };

  // Handle Touch End
  const handleTouchEnd = (e) => {
    if (e) e.preventDefault();
    setIsSelfTouching(false);
    broadcastTouch(false);
  };

  // Heartbeat loop when touching (Single or Dual)
  useEffect(() => {
    if (isSelfTouching) {
      // Faster BPM if both are touching!
      const currentBpm = isBothTouching ? 84 : 68;
      setBpm(currentBpm);
      const intervalMs = (60 / currentBpm) * 1000;

      heartbeatIntervalRef.current = setInterval(() => {
        triggerBeat();
      }, intervalMs);
    } else {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    }

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [isSelfTouching, isBothTouching, triggerBeat]);

  // Sync Duration Timer & Celebration
  useEffect(() => {
    if (isBothTouching) {
      // Celebrate synchronized connection
      playChime();
      awardXP(30);

      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#a855f7'],
      });

      syncTimerRef.current = setInterval(() => {
        setSyncDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current);
      }
      setSyncDuration(0);
    }

    return () => {
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current);
      }
    };
  }, [isBothTouching, playChime, awardXP]);

  // Format Sync Duration
  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`relative overflow-hidden transition-all duration-700 select-none ${
        isFullScreen
          ? 'fixed inset-0 z-[99999] flex flex-col items-center justify-between p-6 bg-slate-950 text-white'
          : 'glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/80 shadow-xl'
      } ${
        isBothTouching
          ? 'bg-gradient-to-b from-rose-950 via-pink-950 to-purple-950 text-white shadow-2xl shadow-rose-500/30'
          : ''
      }`}
    >
      {/* Background Pulsing Glow when Synced */}
      {isBothTouching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 60 / bpm, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-radial from-rose-600/30 via-pink-600/15 to-transparent pointer-events-none"
        />
      )}

      {/* Top Bar Header */}
      <div className="w-full flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-md transition-all ${
              isBothTouching
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/50'
                : 'bg-gradient-to-tr from-rose-500 to-pink-400 text-white'
            }`}
          >
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3
              className={`font-extrabold text-sm sm:text-base leading-tight ${
                isBothTouching || isFullScreen ? 'text-white' : 'text-slate-800'
              }`}
            >
              Kalp Atışı Senkronizasyonu 💓
            </h3>
            <p
              className={`text-[11px] ${
                isBothTouching || isFullScreen ? 'text-rose-200' : 'text-slate-500'
              }`}
            >
              Dokununca telefonunuz kalp ritmiyle titreşir
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Full Screen Toggle */}
          <button
            onClick={() => {
              playPop();
              setIsFullScreen(!isFullScreen);
            }}
            title={isFullScreen ? 'Küçült' : 'Tam Ekran Aşk Modu'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isBothTouching || isFullScreen
                ? 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                : 'bg-rose-50 text-slate-600 border-rose-200 hover:bg-rose-100'
            }`}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Touch & Sync Arena */}
      <div className="my-6 sm:my-8 flex flex-col items-center justify-center relative z-10 text-center">
        {/* Status Badge */}
        <motion.div
          animate={{ scale: isBothTouching ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold mb-6 shadow-sm ${
            isBothTouching
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/40 ring-4 ring-rose-400/30'
              : isSelfTouching
              ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
              : isBothTouching || isFullScreen
              ? 'bg-white/10 text-rose-300 border border-white/20'
              : 'bg-rose-50 text-rose-600 border border-rose-200'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isBothTouching
                ? 'bg-white animate-ping'
                : isSelfTouching
                ? 'bg-rose-500 animate-ping'
                : 'bg-rose-400'
            }`}
          />
          <span>
            {isBothTouching
              ? `🔥 KALPLERİNİZ SENKRONİZE! (${formatSeconds(syncDuration)})`
              : isSelfTouching
              ? `💓 ${otherPartner.name} bekleniyor... Parmağını basılı tut!`
              : `✨ İkiniz de aynı anda kalbe basılı tutun`}
          </span>
        </motion.div>

        {/* Pulsing Interactive Heart Button */}
        <div className="relative flex items-center justify-center">
          {/* Concentric Glow Rings */}
          <AnimatePresence>
            {isBothTouching && (
              <>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: [1, 2.2], opacity: [0.8, 0] }}
                  transition={{ duration: 60 / bpm, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute w-44 h-44 rounded-full bg-rose-500/30 blur-md pointer-events-none"
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                  transition={{
                    duration: 60 / bpm,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: 0.14,
                  }}
                  className="absolute w-44 h-44 rounded-full bg-pink-500/40 blur-sm pointer-events-none"
                />
              </>
            )}
          </AnimatePresence>

          {/* Floating Particles on Beats */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 0.5, opacity: 1 }}
              animate={{ x: p.x, y: p.y - 60, scale: p.scale, opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute text-2xl pointer-events-none select-none z-20"
            >
              💖
            </motion.div>
          ))}

          {/* Big Touch Heart */}
          <motion.button
            type="button"
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            whileTap={{ scale: 0.92 }}
            animate={
              isBothTouching
                ? {
                    scale: [1, 1.18, 1, 1.12, 1],
                  }
                : isSelfTouching
                ? {
                    scale: [1, 1.08, 1],
                  }
                : {
                    scale: [1, 1.03, 1],
                  }
            }
            transition={{
              duration: 60 / bpm,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl relative z-10 touch-none active:outline-none focus:outline-none ${
              isBothTouching
                ? 'bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 text-white shadow-rose-500/80 ring-8 ring-rose-400/50'
                : isSelfTouching
                ? 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-rose-400/60 ring-6 ring-rose-300/60'
                : 'bg-gradient-to-tr from-rose-400 to-pink-300 hover:from-rose-500 hover:to-pink-400 text-white shadow-rose-200'
            }`}
          >
            <Heart
              className={`w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-lg transition-transform ${
                isBothTouching ? 'fill-white animate-pulse' : isSelfTouching ? 'fill-white' : 'fill-white/80'
              }`}
            />
            <span className="text-[11px] sm:text-xs font-extrabold mt-1 tracking-wider uppercase">
              {isBothTouching ? 'SENKRONİZE' : isSelfTouching ? 'BASILI TUT' : 'DOKUN'}
            </span>
          </motion.button>
        </div>

        {/* Live Partner Avatars & Presence */}
        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-6 sm:gap-10">
          {/* Partner 1 (Ceren) */}
          <div
            className={`flex flex-col items-center gap-1 transition-all ${
              (activePersona === 'partner1' && isSelfTouching) ||
              (activePersona !== 'partner1' && (isPartnerTouching || partnerSimulated))
                ? 'scale-110 opacity-100'
                : 'opacity-60 scale-95'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 ${
                (activePersona === 'partner1' && isSelfTouching) ||
                (activePersona !== 'partner1' && (isPartnerTouching || partnerSimulated))
                  ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white border-white shadow-rose-300 ring-4 ring-pink-400/40'
                  : 'bg-white text-slate-800 border-rose-200'
              }`}
            >
              {profile.partner1.avatar}
            </div>
            <span
              className={`text-xs font-extrabold ${
                isBothTouching || isFullScreen ? 'text-white' : 'text-slate-700'
              }`}
            >
              {profile.partner1.name}
            </span>
            <span className="text-[10px] font-bold text-rose-400">
              {(activePersona === 'partner1' && isSelfTouching) ||
              (activePersona !== 'partner1' && (isPartnerTouching || partnerSimulated))
                ? '💓 Kalbe Basıyor'
                : 'Bekliyor'}
            </span>
          </div>

          {/* Center Connection Indicator */}
          <div className="flex flex-col items-center">
            <span className="text-2xl animate-pulse">
              {isBothTouching ? '⚡' : '🔗'}
            </span>
            <span
              className={`text-[10px] font-mono font-bold mt-1 ${
                isBothTouching ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {isBothTouching ? `${bpm} BPM` : 'Haptic Sync'}
            </span>
          </div>

          {/* Partner 2 (Tahir) */}
          <div
            className={`flex flex-col items-center gap-1 transition-all ${
              (activePersona === 'partner2' && isSelfTouching) ||
              (activePersona !== 'partner2' && (isPartnerTouching || partnerSimulated))
                ? 'scale-110 opacity-100'
                : 'opacity-60 scale-95'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 ${
                (activePersona === 'partner2' && isSelfTouching) ||
                (activePersona !== 'partner2' && (isPartnerTouching || partnerSimulated))
                  ? 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white border-white shadow-rose-300 ring-4 ring-rose-400/40'
                  : 'bg-white text-slate-800 border-rose-200'
              }`}
            >
              {profile.partner2.avatar}
            </div>
            <span
              className={`text-xs font-extrabold ${
                isBothTouching || isFullScreen ? 'text-white' : 'text-slate-700'
              }`}
            >
              {profile.partner2.name}
            </span>
            <span className="text-[10px] font-bold text-rose-400">
              {(activePersona === 'partner2' && isSelfTouching) ||
              (activePersona !== 'partner2' && (isPartnerTouching || partnerSimulated))
                ? '💓 Kalbe Basıyor'
                : 'Bekliyor'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info / Emotional Touch */}
      {isBothTouching && (
        <div
          className={`w-full text-center text-xs pt-2 border-t relative z-10 ${
            isBothTouching || isFullScreen
              ? 'border-white/10 text-rose-200'
              : 'border-rose-100 text-slate-500'
          }`}
        >
          <p className="font-romantic text-xs sm:text-sm italic">
            “Mesafe ne kadar olursa olsun, parmaklarımız kalpte buluştuğunda kalplerimiz aynı anda atar...”
          </p>
        </div>
      )}
    </div>
  );
};

export default HeartbeatSync;
