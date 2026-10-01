import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Tv, 
  Radio, 
  Zap, 
  Star, 
  TrendingUp,
  X,
  Volume2
} from 'lucide-react';
import { Team, Category, Question } from '../types';

interface LiveBroadcastTickerProps {
  teams: Team[];
  currentTurnId?: string;
  competitionName: string;
  activeCategory?: Category;
  activeQuestion?: Question;
  timeLeft?: number;
  isTvMode: boolean;
  onToggleTvMode: () => void;
}

export const LiveBroadcastTicker: React.FC<LiveBroadcastTickerProps> = ({
  teams,
  currentTurnId,
  competitionName,
  activeCategory,
  activeQuestion,
  timeLeft,
  isTvMode,
  onToggleTvMode
}) => {
  const [tickerIndex, setTickerIndex] = useState(0);

  // Compute stats
  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const leader = sorted[0];
  const runnerUp = sorted[1];
  const currentTeam = teams.find(t => t.id === currentTurnId);
  const pointDiff = leader && runnerUp ? leader.score - runnerUp.score : 0;

  // Items to rotate in the ticker
  const tickerItems = [
    leader ? `🏆 المتصدر الحالي: ${leader.name} برصيد ${leader.score} نقطة` : `✨ ${competitionName}`,
    runnerUp && pointDiff > 0 ? `⚡ الفارق النقطي بين الأول والثاني: ${pointDiff} نقطة فقط` : `🌟 تنافس متقارب وإثارة معرفية مستمرة!`,
    currentTeam ? `🎙️ الجولة الآن: دور (${currentTeam.name}) للإجابة واختيار السؤال` : `🎯 استعدوا للجولات القادمة`,
    `⭐ ترقبوا "الأسئلة الذهبية" لمضاعفة النقاط (2X) وقلب موازين اللقاء!`,
    `✨ مسابقة أبوالفواطم • إبداع المعرفة والتميز الثقافي`
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [tickerItems.length]);

  return (
    <aside 
      aria-label="شريط البث المباشر"
      className="fixed bottom-0 inset-x-0 z-[60] bg-slate-950/95 text-white border-t-2 border-amber-400/40 backdrop-blur-xl shadow-[0_-10px_35px_rgba(0,0,0,0.6)] select-none"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Live Channel / TV Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-lg text-[11px] font-black uppercase tracking-wider animate-pulse shadow-md">
            <Radio className="w-3.5 h-3.5" />
            <span>بث مباشر</span>
          </div>

          <button
            type="button"
            onClick={onToggleTvMode}
            className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${
              isTvMode 
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md' 
                : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/10'
            }`}
            title="تبديل وضع البث للشاشات والبروجكتر"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isTvMode ? 'وضع الشاشات مفعل' : 'وضع الشاشات (TV)'}</span>
          </button>
        </div>

        {/* Dynamic Rotating News Ticker */}
        <div className="flex-1 overflow-hidden text-right h-7 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={tickerIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="text-xs md:text-sm font-black text-amber-200 truncate flex items-center gap-2 w-full justify-end"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin-slow" />
              <span className="truncate">{tickerItems[tickerIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mini Leaderboard preview on ticker */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 pl-2">
          {sorted.slice(0, 3).map((t, idx) => (
            <div 
              key={t.id}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-white/10 border border-white/10"
            >
              <span className="text-[10px] text-slate-400">#{idx + 1}</span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
              <span className="text-white max-w-[80px] truncate">{t.name}</span>
              <span className="text-amber-300 font-mono">{t.score}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LiveBroadcastTicker;
