import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Calendar,
  Sparkles,
  Heart,
  Smile,
} from 'lucide-react';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';

const InsideJokes = () => {
  const { insideJokes, addInsideJoke, deleteInsideJoke, currentPartner, awardXP } =
    useSharedData();
  const { playPop, playChime } = useSound();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Word Form State
  const [newTerm, setNewTerm] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newFirstDate, setNewFirstDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [newCategory, setNewCategory] = useState('Takılmaca');

  const categories = ['all', 'Yemek & Eğlence', 'Takılmaca', 'Gündelik', 'Gece Halleri'];

  // Filtered and A-Z sorted jokes
  const filteredJokes = insideJokes
    .filter((joke) => {
      const matchSearch =
        joke.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        joke.meaning.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'all' || joke.category === selectedCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => a.term.localeCompare(b.term, 'tr'));

  // Submit new joke
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTerm.trim() || !newMeaning.trim()) return;

    playChime();
    addInsideJoke({
      term: newTerm.trim(),
      meaning: newMeaning.trim(),
      firstSaidDate: newFirstDate,
      category: newCategory,
    });

    setNewTerm('');
    setNewMeaning('');
    setIsAddingNew(false);
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/80 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base leading-tight">
              İçeriden Şakalar & Çift Sözlüğü 📖
            </h3>
            <span className="text-[11px] text-amber-600 font-semibold">
              Sadece ikimizin anladığı özel terimler ve espriler! 😂💖
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            playPop();
            setIsAddingNew(!isAddingNew);
          }}
          className="px-3.5 py-1.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-200 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yeni Kelime Ekle</span>
        </button>
      </div>

      {/* Add New Joke Form */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-6 p-4 sm:p-5 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3"
          >
            <h4 className="font-bold text-xs text-amber-900">Sözlüğe Yeni Bir Terim Ekle:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Kelime / Şaka Başlığı:</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: MAKARNA! veya 5 Dakikaya Hazırım"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Kategori:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-amber-200 focus:outline-none"
                >
                  <option value="Takılmaca">Takılmaca</option>
                  <option value="Yemek & Eğlence">Yemek & Eğlence</option>
                  <option value="Gündelik">Gündelik</option>
                  <option value="Gece Halleri">Gece Halleri</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-600 block mb-1">Anlamı / Ortaya Çıkış Hikayesi:</label>
              <textarea
                rows={2}
                required
                placeholder="Bu şakanın aramızdaki gerçek anlamı nedir?"
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-white border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-100 text-slate-600"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-xs"
              >
                Sözlüğe Kaydet 📖
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-5">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Şaka veya kelime ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-2xl bg-white/90 border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-white/80 text-slate-600 hover:bg-rose-50 border border-rose-100'
              }`}
            >
              {cat === 'all' ? 'Tümü' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Cards Grid */}
      {filteredJokes.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 sm:p-10 text-center border border-rose-100 text-slate-500 space-y-3">
          <p className="text-4xl">📖</p>
          <h4 className="font-bold text-slate-800 text-sm sm:text-base">Henüz Çift Sözlüğüne Kelime Eklenmedi</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Sadece ikinizin bildiği o komik kelimeleri, takılmacaları ve özel şakaları sözlüğe ekleyin!
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-2xl text-xs font-bold shadow-md shadow-amber-200 cursor-pointer"
          >
            İlk Kelimeyi Ekle 📖
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredJokes.map((joke) => (
            <motion.div
              key={joke.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-white/90 border border-rose-100 shadow-2xs flex flex-col justify-between hover:border-amber-300 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
                      {joke.term.charAt(0).toUpperCase()}
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-800">
                      {joke.term}
                    </h4>
                  </div>

                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                    {joke.category || 'Takılmaca'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic mb-3">
                  "{joke.meaning}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100/70">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>İlk çıkış: {joke.firstSaidDate || '2026-02-05'}</span>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`"${joke.term}" terimini silmek istediğinize emin misiniz?`)) {
                      deleteInsideJoke(joke.id);
                    }
                  }}
                  className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                  title="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsideJokes;
