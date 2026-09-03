import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Shirt,
  Sparkles,
  Heart,
  Flame,
  Clock,
  Archive,
  Plus,
  Trash2,
  X,
  Upload,
  CheckCircle2,
  Smile,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import { formatDateTurkish } from '../../utils/dateUtils';

const QUICK_TAGS = [
  '#GününKombini',
  '#OfisŞıklığı',
  '#RahatPazar',
  '#RandevuGecesi',
  '#SporStili',
  '#SıcakKahve',
  '#Vintage',
];

const REACTION_EMOJIS = [
  { emoji: '🔥', label: 'Alev Alev' },
  { emoji: '😍', label: 'Aşık Oldum' },
  { emoji: '💯', label: '10 Üzerinden 10' },
  { emoji: '💖', label: 'Çok Yakışmış' },
];

const FitCheckModule = () => {
  const { fitCheckPosts, addFitCheckPost, likeFitCheckPost, deleteFitCheckPost, currentPartner, profile } =
    useSharedData();
  const { playPop, playChime } = useSound();

  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'archive'
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Form state
  const [previewUrl, setPreviewUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedTag, setSelectedTag] = useState(QUICK_TAGS[0]);

  // Live timer tick every minute for countdowns
  const [, setTimerTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerTick((t) => t + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const now = Date.now();
  const livePosts = fitCheckPosts.filter((p) => now <= p.expiresAt && !p.isArchived);
  const archivedPosts = fitCheckPosts.filter((p) => now > p.expiresAt || p.isArchived);

  // Separate live posts by partner
  const cerenPost = livePosts.find((p) => p.author === profile.partner1?.name);
  const tahirPost = livePosts.find((p) => p.author === profile.partner2?.name);

  // Remaining time format helper
  const getRemainingTimeStr = (expiresAt) => {
    const msLeft = Math.max(0, expiresAt - Date.now());
    const hours = Math.floor(msLeft / (1000 * 60 * 60));
    const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
    if (hours === 0 && minutes === 0) return 'Süre dolmak üzere';
    return `${hours} saat ${minutes} dk kaldı`;
  };

  // Image Upload handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Lütfen 5 MB veya daha küçük bir fotoğraf seçin.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!previewUrl) {
      alert('Lütfen kombin fotoğrafınızı seçin.');
      return;
    }

    playChime();
    addFitCheckPost({
      photoUrl: previewUrl,
      caption: caption.trim() || 'Günün Kombini ✨',
      tag: selectedTag,
    });

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fb7185', '#c084fc', '#f59e0b'],
    });

    setPreviewUrl('');
    setCaption('');
    setIsUploadOpen(false);
  };

  const handleReaction = (postId, emoji) => {
    playPop();
    likeFitCheckPost(postId, emoji);
  };

  const handleDelete = (postId) => {
    if (window.confirm('Bu kombini silmek istediğinize emin misiniz?')) {
      playPop();
      deleteFitCheckPost(postId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toggle & Upload Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Switcher: Live 24h vs Archive */}
        <div className="glass-pill p-1.5 rounded-full border border-rose-200/80 shadow-md flex items-center gap-1">
          <button
            onClick={() => {
              playPop();
              setActiveTab('live');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'live'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Bugünkü Kombinler ({livePosts.length})</span>
          </button>
          <button
            onClick={() => {
              playPop();
              setActiveTab('archive');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'archive'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>FitCheck Arşivi ({archivedPosts.length})</span>
          </button>
        </div>

        <button
          onClick={() => {
            playPop();
            setIsUploadOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white text-xs font-extrabold shadow-md shadow-rose-200 active:scale-95 transition-all cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>Kombinimi Paylaş 👗✨</span>
        </button>
      </div>

      {/* Info Banner */}
      <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/70 flex items-center justify-between text-xs text-rose-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />
          <span>
            FitCheck'ler <strong>24 saat</strong> boyunca burada sergilenir, süre dolduğunda otomatik olarak
            <strong> Fotoğraf Arşivi</strong>'ne hatıra olarak aktarılır! 📸
          </span>
        </div>
      </div>

      {activeTab === 'live' ? (
        /* LIVE 24H FITCHECKS */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ceren's Card */}
          <div className="glass-card rounded-3xl p-5 sm:p-6 border border-rose-200/80 shadow-xl flex flex-col justify-between min-h-[420px]">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{profile.partner1?.avatar || '👱🏻‍♀️'}</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">
                    {profile.partner1?.name}'in Kombini
                  </h3>
                  <span className="text-[10px] text-slate-400">Bugünkü FitCheck</span>
                </div>
              </div>
              {cerenPost && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {getRemainingTimeStr(cerenPost.expiresAt)}
                  </span>
                  {currentPartner.name === profile.partner1?.name && (
                    <button
                      onClick={() => handleDelete(cerenPost.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Kombini Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {cerenPost ? (
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/5] shadow-inner max-h-[340px]">
                  <img
                    src={cerenPost.photoUrl}
                    alt="Ceren's Outfit"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                    {cerenPost.tag || '#GününKombini'}
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-700 italic">
                  "{cerenPost.caption}"
                </p>

                {/* Reaction Bar */}
                <div className="pt-2 border-t border-rose-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">Tahir'in Tepkisi:</span>
                  <div className="flex items-center gap-1">
                    {REACTION_EMOJIS.map((r) => {
                      const count = cerenPost.reactions?.[r.emoji] || 0;
                      return (
                        <button
                          key={r.emoji}
                          onClick={() => handleReaction(cerenPost.id, r.emoji)}
                          className="px-2 py-1 rounded-xl bg-white border border-rose-100 hover:bg-rose-50 text-xs transition-all active:scale-110 cursor-pointer shadow-2xs flex items-center gap-1"
                          title={r.label}
                        >
                          <span>{r.emoji}</span>
                          {count > 0 && <span className="font-bold text-[10px] text-slate-600">{count}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="my-auto text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto text-2xl">
                  👗
                </div>
                <h4 className="font-bold text-sm text-slate-700">
                  {profile.partner1?.name} henüz bugünkü kombinini paylaşmadı
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Bugün ne giydiğini merakla bekliyoruz! Hemen bir ayna selfiesi veya fotoğraf yükle.
                </p>
                {currentPartner.name === profile.partner1?.name && (
                  <button
                    onClick={() => {
                      playPop();
                      setIsUploadOpen(true);
                    }}
                    className="px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-200 cursor-pointer"
                  >
                    Kombinimi Yükle 📸
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Tahir's Card */}
          <div className="glass-card rounded-3xl p-5 sm:p-6 border border-blue-200/80 shadow-xl flex flex-col justify-between min-h-[420px]">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{profile.partner2?.avatar || '👨🏻'}</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">
                    {profile.partner2?.name}'in Kombini
                  </h3>
                  <span className="text-[10px] text-slate-400">Bugünkü FitCheck</span>
                </div>
              </div>
              {tahirPost && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {getRemainingTimeStr(tahirPost.expiresAt)}
                  </span>
                  {currentPartner.name === profile.partner2?.name && (
                    <button
                      onClick={() => handleDelete(tahirPost.id)}
                      className="p-1.5 rounded-xl hover:bg-blue-100 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                      title="Kombini Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {tahirPost ? (
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/5] shadow-inner max-h-[340px]">
                  <img
                    src={tahirPost.photoUrl}
                    alt="Tahir's Outfit"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                    {tahirPost.tag || '#GününKombini'}
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-700 italic">
                  "{tahirPost.caption}"
                </p>

                {/* Reaction Bar */}
                <div className="pt-2 border-t border-blue-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">Ceren'in Tepkisi:</span>
                  <div className="flex items-center gap-1">
                    {REACTION_EMOJIS.map((r) => {
                      const count = tahirPost.reactions?.[r.emoji] || 0;
                      return (
                        <button
                          key={r.emoji}
                          onClick={() => handleReaction(tahirPost.id, r.emoji)}
                          className="px-2 py-1 rounded-xl bg-white border border-blue-100 hover:bg-blue-50 text-xs transition-all active:scale-110 cursor-pointer shadow-2xs flex items-center gap-1"
                          title={r.label}
                        >
                          <span>{r.emoji}</span>
                          {count > 0 && <span className="font-bold text-[10px] text-slate-600">{count}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="my-auto text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mx-auto text-2xl">
                  👔
                </div>
                <h4 className="font-bold text-sm text-slate-700">
                  {profile.partner2?.name} henüz bugünkü kombinini paylaşmadı
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Tahir'in stilini merak ediyoruz! Fotoğrafını hemen yükle.
                </p>
                {currentPartner.name === profile.partner2?.name && (
                  <button
                    onClick={() => {
                      playPop();
                      setIsUploadOpen(true);
                    }}
                    className="px-4 py-2 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-200 cursor-pointer"
                  >
                    Kombinimi Yükle 📸
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ARCHIVE VIEW */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 flex items-center gap-2">
            <Archive className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              Burada 24 saatini tamamlayıp otomatik olarak arşivlenen tüm geçmiş FitCheck'leriniz yer alır.
              Aynı zamanda Fotoğraf Arşivi modülünüzde de saklanmaktadır! 🖼️✨
            </span>
          </div>

          {archivedPosts.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 text-center border border-rose-100 text-slate-400 space-y-2">
              <p className="text-4xl">👗</p>
              <p className="font-bold text-slate-600">Henüz Arşivlenmiş FitCheck Yok</p>
              <p className="text-xs">Yüklediğiniz kombinler 24 saat sonunda otomatik buraya gelecektir.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {archivedPosts.map((post) => (
                <div
                  key={post.id}
                  className="glass-card rounded-2xl p-3 border border-rose-200 shadow-md flex flex-col justify-between overflow-hidden"
                >
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 mb-2">
                    <img src={post.photoUrl} alt="Archived Outfit" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span className="font-bold">{post.author}</span>
                      <span>{new Date(post.uploadedAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">{post.caption}</p>
                    <span className="text-[10px] text-rose-500 font-bold">{post.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Outfit Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-7 relative shadow-2xl border border-rose-200 max-h-[90vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-purple-500 text-white flex items-center justify-center shadow-xs">
                    <Shirt className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">Günün Kombinini Paylaş</h3>
                    <p className="text-[10px] text-slate-400">Aktif Profil: {currentPartner.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadOpen(false)}
                  className="p-1.5 rounded-full hover:bg-rose-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs sm:text-sm">
                {/* Photo Preview / Upload Box */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 text-xs">
                    Kombin Fotoğrafı
                  </label>
                  {previewUrl ? (
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 border-2 border-rose-300 max-h-[260px]">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPreviewUrl('')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-rose-300 hover:border-rose-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer bg-rose-50/50 hover:bg-rose-50 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Fotoğraf Seç veya Yükle</span>
                      <span className="text-[10px] text-slate-400">JPG, PNG (Maks 5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Caption */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 text-xs">
                    Kombin Notu / Açıklaması
                  </label>
                  <input
                    type="text"
                    required
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Örn: Bugün beyaz keten gömlek günü 🌿"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5 text-xs">Etiket Seç</label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_TAGS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          playPop();
                          setSelectedTag(t);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          selectedTag === t
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-rose-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 cursor-pointer transition-all"
                >
                  FitCheck'i Yayınla (24 Saat Canlı) 👗✨
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FitCheckModule;
