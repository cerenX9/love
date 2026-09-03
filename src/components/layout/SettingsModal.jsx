import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  X,
  Heart,
  Save,
  Flame,
  Cloud,
  Database,
  Key,
  Shield,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
} from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import {
  INITIAL_COUPLE_PROFILE,
  INITIAL_NOTES,
  INITIAL_EVENTS,
  INITIAL_COUPONS,
  INITIAL_REASONS,
  INITIAL_MEMORIES,
  INITIAL_DRAWINGS,
  INITIAL_PET_DATA,
  INITIAL_DAILY_QUESTIONS,
  INITIAL_WHEEL_CONFIGS,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_SCRATCH_CARDS,
  INITIAL_INSIDE_JOKES,
  INITIAL_SOS_VAULT,
} from '../../services/defaultData';
import { STORAGE_KEYS, setLocalData } from '../../services/storageFallback';

const AVATAR_OPTIONS = [
  '👱🏼‍♀️',
  '👨🏻‍🦰',
  '👱🏻‍♀️',
  '👨🏻',
  '👨🏼',
  '👨🏽',
  '👱🏻‍♂️',
  '👸🏼',
  '🤴🏻',
  '👩🏻‍🦰',
  '👨🏽‍💻',
  '🌸',
  '🧸',
  '🐰',
  '🐱',
  '🐶',
  '💖',
  '✨',
  '🌹',
];

const SettingsModal = ({ isOpen, onClose, onOpenPinModal }) => {
  const { profile, updateProfile, useFirebase, setUseFirebase } = useSharedData();
  const { playPop, playChime } = useSound();

  const [formData, setFormData] = useState({
    partner1Name: profile.partner1?.name || 'Ceren',
    partner1Avatar: profile.partner1?.avatar || '👱🏼‍♀️',
    partner2Name: profile.partner2?.name || 'Tahir',
    partner2Avatar: profile.partner2?.avatar || '👨🏻‍🦰',
    anniversaryDate: profile.anniversaryDate
      ? profile.anniversaryDate.substring(0, 16)
      : '2026-02-05T00:00',
    relationshipTitle: profile.relationshipTitle || 'Ceren ❤️ Tahir',
    ourSong: profile.ourSong || 'Radiohead - Jigsaw Falling Into Place',
    spotifyUrl: profile.spotifyUrl || 'https://open.spotify.com/track/0YJ9FWWHn9EfnN0lHwbzvV',
    dailyQuote: profile.dailyQuote || 'Seninle geçen her saniye, hayatımın en güzel melodisi...',
    pinQuestion: profile.pinQuestion || 'İlk buluştuğumuz gün neredeydik?',
    pinAnswer: profile.pinAnswer || 'penguen',
  });

  // Firebase Live Key configuration state
  const [firebaseJson, setFirebaseJson] = useState(() => {
    return localStorage.getItem('lovehub_firebase_config') || '';
  });
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'firebase' | 'security'
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    playChime();

    updateProfile({
      ...profile,
      partner1: {
        ...profile.partner1,
        name: formData.partner1Name,
        avatar: formData.partner1Avatar,
      },
      partner2: {
        ...profile.partner2,
        name: formData.partner2Name,
        avatar: formData.partner2Avatar,
      },
      anniversaryDate: formData.anniversaryDate,
      relationshipTitle: formData.relationshipTitle,
      ourSong: formData.ourSong,
      spotifyUrl: formData.spotifyUrl,
      dailyQuote: formData.dailyQuote,
      pinQuestion: formData.pinQuestion,
      pinAnswer: formData.pinAnswer,
    });

    setStatusMsg('Ayarlar başarıyla kaydedildi! ✨');
    setTimeout(() => {
      setStatusMsg('');
      onClose();
    }, 1200);
  };

  const handleSaveFirebaseConfig = (e) => {
    e.preventDefault();
    try {
      if (!firebaseJson.trim()) {
        localStorage.removeItem('lovehub_firebase_config');
        setUseFirebase(false);
        setStatusMsg('Firebase ayarları sıfırlandı, Yerel Mod aktif.');
        return;
      }
      const parsed = JSON.parse(firebaseJson);
      if (!parsed.apiKey || !parsed.projectId) {
        throw new Error('Geçersiz JSON! "apiKey" ve "projectId" alanları zorunludur.');
      }
      localStorage.setItem('lovehub_firebase_config', JSON.stringify(parsed));
      setUseFirebase(true);
      playChime();
      setStatusMsg('Firebase başarıyla bağlandı! Sayfa yenileniyor...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      playPop();
      setStatusMsg('Hata: ' + err.message);
    }
  };

  const handleExportBackup = () => {
    playPop();
    const backupData = {
      profile: JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE) || '{}'),
      notes: JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '[]'),
      events: JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]'),
      coupons: JSON.parse(localStorage.getItem(STORAGE_KEYS.COUPONS) || '[]'),
      reasons: JSON.parse(localStorage.getItem(STORAGE_KEYS.REASONS) || '[]'),
      memories: JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMORIES) || '[]'),
      drawings: JSON.parse(localStorage.getItem(STORAGE_KEYS.DRAWINGS) || '[]'),
      backupDate: new Date().toISOString(),
      app: 'Our Love Hub',
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `love-hub-backup-ceren-tahir-${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg('Tüm aşk verileri JSON olarak başarıyla indirildi! 💾');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.profile) setLocalData(STORAGE_KEYS.PROFILE, parsed.profile);
        if (parsed.notes) setLocalData(STORAGE_KEYS.NOTES, parsed.notes);
        if (parsed.events) setLocalData(STORAGE_KEYS.EVENTS, parsed.events);
        if (parsed.coupons) setLocalData(STORAGE_KEYS.COUPONS, parsed.coupons);
        if (parsed.reasons) setLocalData(STORAGE_KEYS.REASONS, parsed.reasons);
        if (parsed.memories) setLocalData(STORAGE_KEYS.MEMORIES, parsed.memories);
        if (parsed.drawings) setLocalData(STORAGE_KEYS.DRAWINGS, parsed.drawings);

        playChime();
        setStatusMsg('Yedek başarıyla yüklendi! Sayfa yenileniyor...');
        setTimeout(() => window.location.reload(), 1200);
      } catch (err) {
        setStatusMsg('Yedek yükleme hatası: Geçersiz JSON dosyası!');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemoData = () => {
    if (window.confirm('Tüm demo veriler temizlensin ve temiz aşk alanına sıfırlansın mı?')) {
      playPop();
      setLocalData(STORAGE_KEYS.PROFILE, INITIAL_COUPLE_PROFILE);
      setLocalData(STORAGE_KEYS.NOTES, INITIAL_NOTES);
      setLocalData(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
      setLocalData(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
      setLocalData(STORAGE_KEYS.REASONS, INITIAL_REASONS);
      setLocalData(STORAGE_KEYS.MEMORIES, INITIAL_MEMORIES);
      setLocalData(STORAGE_KEYS.DRAWINGS, INITIAL_DRAWINGS);
      setLocalData(STORAGE_KEYS.PET, INITIAL_PET_DATA);
      setLocalData(STORAGE_KEYS.DAILY_QUESTIONS, INITIAL_DAILY_QUESTIONS);
      setLocalData(STORAGE_KEYS.WHEEL, INITIAL_WHEEL_CONFIGS);
      setLocalData(STORAGE_KEYS.QUIZ, INITIAL_QUIZ_QUESTIONS);
      setLocalData(STORAGE_KEYS.SCRATCH_CARDS, INITIAL_SCRATCH_CARDS);
      setLocalData(STORAGE_KEYS.INSIDE_JOKES, INITIAL_INSIDE_JOKES);
      setLocalData(STORAGE_KEYS.SOS_VAULT, INITIAL_SOS_VAULT);
      window.location.reload();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md"
      style={{ zIndex: 99999 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 relative shadow-2xl border border-rose-200 max-h-[90vh] flex flex-col"
        style={{ zIndex: 100000 }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-lg text-slate-800">Aşk Alanı Ayarları</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-rose-100/60 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 p-1 my-3 bg-rose-50/80 rounded-2xl border border-rose-100">
          <button
            onClick={() => {
              playPop();
              setActiveTab('profile');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            💑 Çift Bilgileri
          </button>
          <button
            onClick={() => {
              playPop();
              setActiveTab('security');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'security'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🔒 PIN & Gizlilik
          </button>
          <button
            onClick={() => {
              playPop();
              setActiveTab('firebase');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'firebase'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ☁️ Firebase Bulut
          </button>
        </div>

        {statusMsg && (
          <div className="p-2.5 mb-3 bg-rose-100/90 text-rose-800 text-xs font-medium rounded-xl text-center">
            {statusMsg}
          </div>
        )}

        {/* Tab Contents */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-4 text-xs sm:text-sm">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Partner 1 */}
              <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-rose-800 text-xs">1. Partner (İsim & Avatar)</label>
                  <span className="text-[10px] text-rose-500 font-semibold">Dokunarak Hızlıca Seç</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={formData.partner1Name}
                    onChange={(e) => setFormData({ ...formData, partner1Name: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 font-bold"
                    placeholder="Partner 1 İsim"
                    required
                  />
                  <div className="w-12 h-10 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-2xl shadow-2xs">
                    {formData.partner1Avatar}
                  </div>
                </div>

                {/* Quick Visual Avatar Picker */}
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-rose-200/50">
                  {['👱🏼‍♀️', '👱🏻‍♀️', '👩🏼', '👩🏻', '👸🏼', '👸🏻', '👩🏻‍🦰', '🌸', '🧸', '🐰', '🐱', '💖'].map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        playPop();
                        setFormData({ ...formData, partner1Avatar: av });
                      }}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-transform active:scale-90 cursor-pointer ${
                        formData.partner1Avatar === av
                          ? 'bg-rose-500 ring-2 ring-rose-400 scale-110 shadow-sm'
                          : 'bg-white hover:bg-rose-100 border border-rose-100'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Partner 2 */}
              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-blue-800 text-xs">2. Partner (İsim & Avatar)</label>
                  <span className="text-[10px] text-blue-500 font-semibold">Dokunarak Hızlıca Seç</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={formData.partner2Name}
                    onChange={(e) => setFormData({ ...formData, partner2Name: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold"
                    placeholder="Partner 2 İsim"
                    required
                  />
                  <div className="w-12 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-2xl shadow-2xs">
                    {formData.partner2Avatar}
                  </div>
                </div>

                {/* Quick Visual Avatar Picker */}
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-blue-200/50">
                  {['👨🏻‍🦰', '👨🏼', '👨🏻', '👨🏽', '🧑🏼', '🧑🏻', '👱🏻‍♂️', '👱🏼‍♂️', '🤴🏻', '🤴🏼', '👨🏼‍💻', '✨'].map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        playPop();
                        setFormData({ ...formData, partner2Avatar: av });
                      }}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-transform active:scale-90 cursor-pointer ${
                        formData.partner2Avatar === av
                          ? 'bg-blue-600 ring-2 ring-blue-400 scale-110 shadow-sm'
                          : 'bg-white hover:bg-blue-100 border border-blue-100'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Relationship Title & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block text-xs mb-1">
                    İlişki Başlığı
                  </label>
                  <input
                    type="text"
                    value={formData.relationshipTitle}
                    onChange={(e) => setFormData({ ...formData, relationshipTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block text-xs mb-1">
                    Tanışma / Yıldönümü Tarihi
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.anniversaryDate}
                    onChange={(e) => setFormData({ ...formData, anniversaryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block text-xs mb-1">
                  Şarkımız (İsim / Sanatçı)
                </label>
                <input
                  type="text"
                  value={formData.ourSong}
                  onChange={(e) => setFormData({ ...formData, ourSong: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="Örn: Perfect - Ed Sheeran"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block text-xs mb-1">
                  Spotify Şarkı / Çalma Listesi Linki
                </label>
                <input
                  type="text"
                  value={formData.spotifyUrl}
                  onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono"
                  placeholder="https://open.spotify.com/track/..."
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block text-xs mb-1">
                  Günün Romantik Notu / Sözü
                </label>
                <textarea
                  rows={2}
                  value={formData.dailyQuote}
                  onChange={(e) => setFormData({ ...formData, dailyQuote: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-white border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="Günün sözünü yazın..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-sm shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-purple-900 text-sm">4 Haneli PIN Koruması</h4>
                    <p className="text-xs text-purple-700">
                      {profile.pinCode ? 'PIN kilidi şu anda aktif 🔒' : 'PIN kilidi henüz ayarlanmadı'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPinModal();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
                  >
                    {profile.pinCode ? 'PIN Değiştir / Kaldır' : 'PIN Oluştur'}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-white/80 rounded-2xl border border-rose-100 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs">Şifre Kurtarma (Gizli Soru)</h4>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Gizli Soru</label>
                  <input
                    type="text"
                    value={formData.pinQuestion}
                    onChange={(e) => setFormData({ ...formData, pinQuestion: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    placeholder="Örn: İlk buluştuğumuz kafe neresiydi?"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Gizli Soru Cevabı</label>
                  <input
                    type="text"
                    value={formData.pinAnswer}
                    onChange={(e) => setFormData({ ...formData, pinAnswer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    placeholder="Örn: Kadıköy"
                  />
                </div>
              </div>

              {/* Backup and Restore Box */}
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      Veri Yedekleme & Güvenlik
                    </h4>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Girdiğiniz tüm notlar, fotoğraflar ve çizimler silinmez. Dilerseniz JSON yedeğini indirebilirsiniz.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Yedek İndir (JSON)</span>
                  </button>

                  <label className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-center">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Yedek Yükle</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetDemoData}
                  className="w-full py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Örnek / Demo Verilerini Sıfırla
                </button>
              </div>
            </div>
          )}

          {activeTab === 'firebase' && (
            <form onSubmit={handleSaveFirebaseConfig} className="space-y-4">
              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-800">
                <p className="font-semibold mb-1">☁️ Firebase Bulut Senkronizasyonu</p>
                <p>
                  Firebase yapılandırma JSON objenizi doğrudan aşağıya yapıştırarak uygulamanızı gerçek zamanlı bulut veritabanına bağlayabilirsiniz. Boş bırakırsanız yerel modda çalışır.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block text-xs mb-1">
                  Firebase Config JSON:
                </label>
                <textarea
                  rows={6}
                  value={firebaseJson}
                  onChange={(e) => setFirebaseJson(e.target.value)}
                  className="w-full p-3 font-mono text-[11px] rounded-2xl bg-slate-900 text-emerald-400 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "myloveapp.firebaseapp.com",\n  "projectId": "myloveapp",\n  "storageBucket": "myloveapp.appspot.com",\n  "messagingSenderId": "...",\n  "appId": "..."\n}`}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFirebaseJson('');
                    localStorage.removeItem('lovehub_firebase_config');
                    setUseFirebase(false);
                    setStatusMsg('Yerel moda geçildi.');
                  }}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold"
                >
                  Yerel Moda Geç
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-xs shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600"
                >
                  Firebase'i Bağla
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default SettingsModal;
