import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundManager } from '../utils/soundEffects';

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [isPlayingAmbient, setIsPlayingAmbient] = useState(false);
  const [ambientMode, setAmbientModeState] = useState('lofi'); // 'lofi' | 'rain' | 'heartbeat' | 'custom'
  const [customAudioUrl, setCustomAudioUrl] = useState(() => {
    return localStorage.getItem('lovehub_custom_audio_url') || '';
  });
  const [customAudioName, setCustomAudioName] = useState(() => {
    return localStorage.getItem('lovehub_custom_audio_name') || 'Yüklenen Şarkı';
  });
  const [volume, setVolumeState] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMusic = (mode = null, customUrl = null) => {
    const targetMode = mode || ambientMode;
    const targetUrl = customUrl || customAudioUrl;
    const playing = soundManager.toggleAmbientMusic(targetMode, targetUrl);
    setIsPlayingAmbient(playing);
    if (mode) setAmbientModeState(mode);
  };

  const playMode = (mode, customUrl = null) => {
    setAmbientModeState(mode);
    const targetUrl = customUrl || customAudioUrl;
    soundManager.startAmbientMusic(mode, targetUrl);
    setIsPlayingAmbient(true);
  };

  const stopMusic = () => {
    soundManager.stopAmbientMusic();
    setIsPlayingAmbient(false);
  };

  const setVolume = (val) => {
    setVolumeState(val);
    soundManager.setVolume(val);
  };

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const saveCustomAudio = (url, name) => {
    setCustomAudioUrl(url);
    setCustomAudioName(name);
    try {
      localStorage.setItem('lovehub_custom_audio_url', url);
      localStorage.setItem('lovehub_custom_audio_name', name);
    } catch (e) {
      console.warn('Storage quota exceeded for audio, kept in memory');
    }
  };

  const playPop = () => soundManager.playPop();
  const playStamp = () => soundManager.playStamp();
  const playChime = () => soundManager.playChime();
  const playLock = () => soundManager.playLock();
  const playHeartbeat = () => soundManager.playHeartbeat();

  return (
    <SoundContext.Provider
      value={{
        isPlayingAmbient,
        ambientMode,
        customAudioUrl,
        customAudioName,
        saveCustomAudio,
        toggleMusic,
        playMode,
        stopMusic,
        volume,
        setVolume,
        isMuted,
        toggleMute,
        playPop,
        playStamp,
        playChime,
        playLock,
        playHeartbeat,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    return {
      isPlayingAmbient: false,
      ambientMode: 'lofi',
      customAudioUrl: '',
      customAudioName: '',
      saveCustomAudio: () => {},
      toggleMusic: () => {},
      playMode: () => {},
      stopMusic: () => {},
      volume: 0.5,
      setVolume: () => {},
      isMuted: false,
      toggleMute: () => {},
      playPop: () => {},
      playStamp: () => {},
      playChime: () => {},
      playLock: () => {},
      playHeartbeat: () => {},
    };
  }
  return context;
};
