import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Image as ImageIcon, Upload, MapPin, Calendar, Sparkles } from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import { uploadImageToStorage } from '../../services/firebase';

const PhotoUploadModal = ({ isOpen, onClose }) => {
  const { addMemory, useFirebase } = useSharedData();
  const { playPop, playChime } = useSound();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [location, setLocation] = useState('');
  const [caption, setCaption] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      playPop();
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagePreview) {
      alert('Lütfen bir fotoğraf seçin!');
      return;
    }

    setIsUploading(true);
    let finalImageUrl = imagePreview;

    // If connected to Firebase, upload to storage
    if (useFirebase) {
      const storagePath = `memories/${Date.now()}_photo.jpg`;
      const uploadedUrl = await uploadImageToStorage(imagePreview, storagePath);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      }
    }

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    playChime();
    await addMemory({
      title: title.trim() || 'Güzel Bir Anımız 💖',
      date,
      location: location.trim() || 'Birlikte Bir Yer',
      caption: caption.trim(),
      imageUrl: finalImageUrl,
      tags: tags.length > 0 ? tags : ['Anı', 'Aşk'],
    });

    setIsUploading(false);
    onClose();
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
        className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 relative shadow-2xl border border-rose-200 max-h-[90vh] overflow-y-auto"
        style={{ zIndex: 100000 }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">Yeni Anı / Fotoğraf Yükle</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-rose-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Image Upload Area / Preview */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full min-h-[160px] rounded-2xl border-2 border-dashed border-rose-300 hover:border-rose-400 bg-rose-50/50 hover:bg-rose-50 transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer relative overflow-hidden"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {imagePreview ? (
              <div className="w-full h-48 flex items-center justify-center relative">
                <img
                  src={imagePreview}
                  alt="Seçilen Fotoğraf"
                  className="max-h-full max-w-full rounded-xl object-cover shadow-sm"
                />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/60 text-white rounded-lg text-[10px] font-semibold">
                  Fotoğrafı Değiştir
                </span>
              </div>
            ) : (
              <div className="space-y-1 text-slate-500">
                <Upload className="w-8 h-8 mx-auto text-rose-400 mb-1" />
                <p className="font-bold text-slate-700 text-xs">Fotoğraf Seç veya Buraya Sürükle</p>
                <p className="text-[10px] text-slate-400">PNG, JPG, WEBP desteklenir</p>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1 text-xs">Anı Başlığı</label>
            <input
              type="text"
              required
              placeholder="Örn: İlk Tatilimiz & Gün Batımı 🌅"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Date */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-xs">Tarih</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-rose-200 focus:outline-none text-xs"
              />
            </div>

            {/* Location */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1 text-xs">Konum / Şehir</label>
              <input
                type="text"
                placeholder="Örn: Kadıköy Moda Sahili"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-rose-200 focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1 text-xs">Tatlı Bir Not / Anı Hikayesi</label>
            <textarea
              rows={3}
              placeholder="O gün hakkında unutmak istemediğin güzel bir detay..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-xs"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1 text-xs">
              Etiketler (Virgülle ayırın)
            </label>
            <input
              type="text"
              placeholder="Örn: Tatil, Kafe, Gece, Doğum Günü"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl bg-white border border-rose-200 focus:outline-none text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading || !imagePreview}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isUploading ? 'Yükleniyor...' : 'Anıyı Kaydet 💖'}
          </button>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default PhotoUploadModal;
