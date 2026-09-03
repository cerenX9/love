import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Plus,
  CheckCircle2,
  Trash2,
  Sparkles,
  Ticket,
  Heart,
  Layers,
  Infinity,
  Pencil,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSharedData } from '../../context/SharedDataContext';
import { useSound } from '../../context/SoundContext';
import { formatDateTurkish } from '../../utils/dateUtils';
import AddCouponModal from './AddCouponModal';
import ReasonsFlipCards from './ReasonsFlipCards';

const CouponBook = () => {
  const { coupons, redeemCoupon, deleteCoupon, resetCoupon } = useSharedData();
  const { playPop, playStamp, playChime } = useSound();

  const [activeSection, setActiveSection] = useState('coupons'); // 'coupons' | 'reasons'
  const [couponFilter, setCouponFilter] = useState('all'); // 'all' | 'active' | 'redeemed'
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const handleReset = (id) => {
    playPop();
    resetCoupon(id);
  };

  const handleRedeem = (coupon) => {
    if (coupon.isRedeemed) return;
    playStamp();

    // Little confetti pop
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#e11d48', '#fb7185', '#f43f5e'],
    });

    redeemCoupon(coupon.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu kuponu silmek istediğinize emin misiniz?')) {
      playPop();
      deleteCoupon(id);
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    if (couponFilter === 'active') return !c.isRedeemed;
    if (couponFilter === 'redeemed') return c.isRedeemed;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Toggle Switcher: Coupons vs Reasons */}
      <div className="flex justify-center">
        <div className="glass-pill p-1.5 rounded-full border border-rose-200/80 shadow-md flex items-center gap-1">
          <button
            onClick={() => {
              playPop();
              setActiveSection('coupons');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSection === 'coupons'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Aşk Kuponları</span>
          </button>
          <button
            onClick={() => {
              playPop();
              setActiveSection('reasons');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSection === 'reasons'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>"Neden Sen?" (100 Neden)</span>
          </button>
        </div>
      </div>

      {activeSection === 'reasons' ? (
        <ReasonsFlipCards />
      ) : (
        // COUPONS SECTION
        <div className="space-y-6">
          {/* Header Card */}
          <div className="glass-card rounded-3xl p-5 sm:p-7 border border-rose-200/70 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-rose-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center text-white shadow-md shadow-rose-300">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                    Dijital Aşk Kupon Defteri
                  </h2>
                  <p className="text-xs text-slate-500">
                    İstediğin kuponu tek tıkla kullan ve aşk damganı vur! 🎟️✨
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playPop();
                    setIsAddOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Kupon Ekle</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 pt-3 text-xs">
              <button
                onClick={() => {
                  playPop();
                  setCouponFilter('all');
                }}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  couponFilter === 'all'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-white hover:bg-rose-50 text-slate-600 border border-rose-100'
                }`}
              >
                Tüm Kuponlar ({coupons.length})
              </button>
              <button
                onClick={() => {
                  playPop();
                  setCouponFilter('active');
                }}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  couponFilter === 'active'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-white hover:bg-emerald-50 text-slate-600 border border-emerald-100'
                }`}
              >
                Kullanılabilir ({coupons.filter((c) => !c.isRedeemed).length})
              </button>
              <button
                onClick={() => {
                  playPop();
                  setCouponFilter('redeemed');
                }}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  couponFilter === 'redeemed'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                Kullanılanlar ({coupons.filter((c) => c.isRedeemed).length})
              </button>
            </div>
          </div>

          {/* Coupons Grid */}
          {filteredCoupons.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 text-center border border-rose-100 text-slate-400 text-xs sm:text-sm">
              <p className="text-3xl mb-2">🎟️</p>
              <p>Bu filtreye uygun kupon bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCoupons.map((coupon) => {
                const isInfinite = Boolean(coupon.isInfinite);
                const maxUses = isInfinite ? null : (Number(coupon.maxUses) || 1);
                const usedCount = Number(coupon.usedCount) || (coupon.isRedeemed ? (maxUses || 1) : 0);
                const remainingUses = isInfinite ? null : Math.max(0, maxUses - usedCount);

                return (
                  <motion.div
                    key={coupon.id}
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    whileHover={!coupon.isRedeemed ? { y: -4, scale: 1.02 } : {}}
                    className={`relative rounded-3xl p-5 border-2 shadow-lg flex flex-col justify-between overflow-hidden transition-all ${
                      coupon.isRedeemed
                        ? 'bg-slate-50/90 border-slate-200 opacity-80'
                        : 'bg-white border-rose-200/90 hover:border-rose-300'
                    }`}
                  >
                    {/* Decorative Ticket Perforated Circles on sides */}
                    <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-rose-50 border-r-2 border-rose-200" />
                    <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-rose-50 border-l-2 border-rose-200" />

                    {/* Stamp Overlay if Redeemed */}
                    {coupon.isRedeemed && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <div className="stamp-redeemed px-4 py-2 rounded-xl text-center bg-white/90 shadow-md">
                          <span className="text-base sm:text-lg block font-black text-rose-700">KULLANILDI</span>
                          <span className="text-[10px] block font-mono text-slate-600">
                            {formatDateTurkish(coupon.redeemedAt)}
                          </span>
                          {coupon.redeemedBy && (
                            <span className="text-[9px] block text-slate-500">Tarafından: {coupon.redeemedBy}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Top Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-100/80 text-rose-700 text-[10px] font-bold uppercase tracking-wider">
                          Aşk Bileti 🎟️
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              playPop();
                              setEditingCoupon(coupon);
                            }}
                            className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Kuponu Düzenle"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Kuponu Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base text-slate-800 leading-snug">
                        {coupon.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {coupon.description}
                      </p>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-4 mt-3 border-t border-dashed border-rose-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isInfinite ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold shadow-2xs">
                              <Infinity className="w-3.5 h-3.5 text-rose-500" />
                              Sonsuz Kullanım
                            </span>
                            {usedCount > 0 && (
                              <span className="text-[10px] text-slate-400 font-medium">
                                ({usedCount} kez)
                              </span>
                            )}
                          </div>
                        ) : maxUses > 1 ? (
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                                coupon.isRedeemed
                                  ? 'bg-slate-100 text-slate-500 border-slate-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              <Layers className="w-3 h-3 text-amber-500" />
                              {coupon.isRedeemed
                                ? `Tükendi (${maxUses}/${maxUses})`
                                : `Kalan: ${remainingUses}/${maxUses}`}
                            </span>
                            {/* Progress bar */}
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  coupon.isRedeemed
                                    ? 'bg-slate-300'
                                    : 'bg-gradient-to-r from-amber-400 to-rose-400'
                                }`}
                                style={{ width: `${Math.min(100, (remainingUses / maxUses) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            {coupon.isRedeemed ? 'Kullanıldı (1/1)' : 'Tek kullanımlıktır 💖'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {!coupon.isRedeemed ? (
                          <button
                            onClick={() => handleRedeem(coupon)}
                            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-200 active:scale-90 transition-transform cursor-pointer flex items-center gap-1"
                          >
                            <span>Kullan</span>
                            <span>💥</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              Tamamlandı
                            </span>
                            <button
                              onClick={() => handleReset(coupon.id)}
                              className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Kullanımları Sıfırla / Yeniden Doldur"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Add / Edit Coupon Modal */}
          <AddCouponModal
            isOpen={isAddOpen || Boolean(editingCoupon)}
            couponToEdit={editingCoupon}
            onClose={() => {
              setIsAddOpen(false);
              setEditingCoupon(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CouponBook;
