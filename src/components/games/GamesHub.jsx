import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Compass,
  Brain,
  Gift,
  BookOpen,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import DecisionWheel from './DecisionWheel';
import CoupleQuiz from './CoupleQuiz';
import ScratchCard from './ScratchCard';
import InsideJokes from '../jokes/InsideJokes';
import DailyQuestion from '../daily/DailyQuestion';
import HeartbeatSync from '../heartbeat/HeartbeatSync';
import { useSound } from '../../context/SoundContext';

const SUB_TABS = [
  { id: 'heartbeat', name: 'Kalp Atışı 💓', icon: Activity },
  { id: 'wheel', name: 'Çarkıfelek 🎡', icon: Compass },
  { id: 'quiz', name: 'Aşk Testi 🧠', icon: Brain },
  { id: 'scratch', name: 'Kazı Kazan 🎟️', icon: Gift },
  { id: 'daily', name: 'Günün Sorusu 💬', icon: HelpCircle },
  { id: 'jokes', name: 'Çift Sözlüğü 📖', icon: BookOpen },
];

const GamesHub = () => {
  const [activeSubTab, setActiveSubTab] = useState('heartbeat');
  const { playPop } = useSound();

  const handleSubTabChange = (tabId) => {
    playPop();
    setActiveSubTab(tabId);
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation Pills */}
      <div className="flex justify-center px-1">
        <div className="glass-pill p-1.5 rounded-full shadow-md shadow-rose-100/50 flex items-center gap-1 max-w-full overflow-x-auto no-scrollbar">
          {SUB_TABS.map((subTab) => {
            const Icon = subTab.icon;
            const isActive = activeSubTab === subTab.id;

            return (
              <button
                key={subTab.id}
                onClick={() => handleSubTabChange(subTab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{subTab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeSubTab === 'heartbeat' && <HeartbeatSync />}
          {activeSubTab === 'wheel' && <DecisionWheel />}
          {activeSubTab === 'quiz' && <CoupleQuiz />}
          {activeSubTab === 'scratch' && <ScratchCard />}
          {activeSubTab === 'daily' && <DailyQuestion />}
          {activeSubTab === 'jokes' && <InsideJokes />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GamesHub;
