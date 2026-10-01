import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Medal, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Flame, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  Maximize2, 
  X, 
  Target,
  BarChart3,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Team } from '../types';

interface LiveTeamLeaderboardProps {
  teams: Team[];
  currentTurnId?: string;
  animatingTeamId?: string | null;
  answerFeedback?: 'correct' | 'wrong' | null;
  variant?: 'ticker' | 'embedded' | 'modal';
  onCloseModal?: () => void;
  onOpenModal?: () => void;
  playSound?: (type: 'correct' | 'wrong' | 'victory' | 'intro' | 'click') => void;
  className?: string;
}

export const LiveTeamLeaderboard: React.FC<LiveTeamLeaderboardProps> = ({
  teams = [],
  currentTurnId,
  animatingTeamId,
  answerFeedback,
  variant = 'embedded',
  onCloseModal,
  onOpenModal,
  playSound,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'podium' | 'detailed'>('cards');
  const [lastScoreMap, setLastScoreMap] = useState<Record<string, number>>({});
  const [scoreDeltas, setScoreDeltas] = useState<Record<string, number>>({});
  const prevRanksRef = useRef<Record<string, number>>({});
  const [rankChanges, setRankChanges] = useState<Record<string, 'up' | 'down' | 'same'>>({});

  // Compute sorted teams
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [teams]);

  const highestScore = useMemo(() => {
    return sortedTeams.length > 0 ? Math.max(...sortedTeams.map(t => t.score), 1) : 1;
  }, [sortedTeams]);

  const totalCompetitionPoints = useMemo(() => {
    return sortedTeams.reduce((acc, t) => acc + (t.score || 0), 0);
  }, [sortedTeams]);

  // Track score changes and rank shifts
  useEffect(() => {
    const newDeltas: Record<string, number> = {};
    const newRanks: Record<string, number> = {};
    const newChanges: Record<string, 'up' | 'down' | 'same'> = {};

    sortedTeams.forEach((t, idx) => {
      const currentRank = idx + 1;
      newRanks[t.id] = currentRank;

      const prevScore = lastScoreMap[t.id];
      if (typeof prevScore === 'number' && prevScore !== t.score) {
        newDeltas[t.id] = t.score - prevScore;
      }

      const prevRank = prevRanksRef.current[t.id];
      if (typeof prevRank === 'number') {
        if (currentRank < prevRank) {
          newChanges[t.id] = 'up';
        } else if (currentRank > prevRank) {
          newChanges[t.id] = 'down';
        } else {
          newChanges[t.id] = 'same';
        }
      }
    });

    if (Object.keys(newDeltas).length > 0) {
      setScoreDeltas(newDeltas);
      // Clear deltas after 3.5s
      const timer = setTimeout(() => {
        setScoreDeltas({});
      }, 3500);
      return () => clearTimeout(timer);
    }

    setRankChanges(newChanges);
    prevRanksRef.current = newRanks;

    const newScoreMap: Record<string, number> = {};
    teams.forEach(t => {
      newScoreMap[t.id] = t.score;
    });
    setLastScoreMap(newScoreMap);
  }, [teams, sortedTeams]);

  // Helper for rank badge
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          icon: <Crown className="w-4 h-4 text-amber-500 fill-amber-400" />,
          bg: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-amber-300/50 shadow-md',
          label: 'الأول',
          border: 'border-amber-400',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]'
        };
      case 2:
        return {
          icon: <Medal className="w-4 h-4 text-slate-300 fill-slate-300" />,
          bg: 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900 font-black shadow-slate-300/50 shadow-md',
          label: 'الثاني',
          border: 'border-slate-300',
          glow: 'shadow-[0_0_12px_rgba(148,163,184,0.2)]'
        };
      case 3:
        return {
          icon: <Medal className="w-4 h-4 text-amber-700 fill-amber-700" />,
          bg: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black shadow-amber-600/30 shadow-md',
          label: 'الثالث',
          border: 'border-amber-600/40',
          glow: 'shadow-[0_0_10px_rgba(217,119,6,0.2)]'
        };
      default:
        return {
          icon: null,
          bg: 'bg-slate-100 text-slate-600 font-bold border border-slate-200',
          label: `المركز ${rank}`,
          border: 'border-slate-200',
          glow: ''
        };
    }
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      playSound?.('victory');
    } catch {
      // ignore
    }
  };

  if (teams.length === 0) {
    return null;
  }

  // Render modal variant
  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl border-4 border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border-2 border-amber-400/40 flex items-center justify-center text-amber-300 shadow-lg">
                <Trophy className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-[0.25em] text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  مباشر ولحظي
                </span>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                  لوحة صدارة وترتيب الفرق
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <div className="flex bg-white/10 p-1 rounded-2xl border border-white/10 text-xs font-bold">
                <button
                  onClick={() => { playSound?.('click'); setViewMode('cards'); }}
                  className={`px-3 py-1.5 rounded-xl transition-all ${viewMode === 'cards' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-white/70 hover:text-white'}`}
                >
                  قائمة حركية
                </button>
                <button
                  onClick={() => { playSound?.('click'); setViewMode('podium'); }}
                  className={`px-3 py-1.5 rounded-xl transition-all ${viewMode === 'podium' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-white/70 hover:text-white'}`}
                >
                  منصة التتويج 🏆
                </button>
              </div>

              {onCloseModal && (
                <button 
                  onClick={() => { playSound?.('click'); onCloseModal(); }}
                  className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
            {viewMode === 'podium' ? (
              /* Podium View */
              <div className="flex flex-col items-center justify-center py-6">
                <div className="flex items-end justify-center gap-4 md:gap-8 w-full max-w-2xl px-4 min-h-[300px]">
                  {/* 2nd Place */}
                  {sortedTeams.length > 1 && (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex-1 flex flex-col items-center max-w-[180px]"
                    >
                      <div className="text-center mb-3">
                        <div className="w-14 h-14 md:w-16 md:h-16 mx-auto rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg mb-2" style={{ backgroundColor: sortedTeams[1].color || '#64748b' }}>
                          {sortedTeams[1].name.charAt(0)}
                        </div>
                        <span className="block font-black text-slate-800 text-sm md:text-base truncate max-w-[140px]">{sortedTeams[1].name}</span>
                        <span className="text-lg md:text-xl font-black text-slate-900">{sortedTeams[1].score} نقطة</span>
                      </div>
                      <div className="w-full h-36 md:h-44 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-3xl border-2 border-b-0 border-slate-300 shadow-md flex flex-col items-center justify-start pt-4">
                        <span className="text-3xl">🥈</span>
                        <span className="text-xs font-black text-slate-600 mt-1 uppercase">المركز الثاني</span>
                      </div>
                    </motion.div>
                  )}

                  {/* 1st Place */}
                  {sortedTeams.length > 0 && (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex-1 flex flex-col items-center max-w-[210px] z-10"
                    >
                      <div className="text-center mb-3">
                        <div className="relative inline-block">
                          <Crown className="w-7 h-7 text-amber-500 fill-amber-400 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
                          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl ring-4 ring-amber-400/50" style={{ backgroundColor: sortedTeams[0].color || '#f59e0b' }}>
                            {sortedTeams[0].name.charAt(0)}
                          </div>
                        </div>
                        <span className="block font-black text-slate-900 text-base md:text-lg mt-1 truncate max-w-[160px]">{sortedTeams[0].name}</span>
                        <span className="text-2xl md:text-3xl font-black text-amber-600">{sortedTeams[0].score} نقطة</span>
                      </div>
                      <div className="w-full h-48 md:h-56 bg-gradient-to-t from-amber-200 via-amber-100 to-amber-50 rounded-t-3xl border-2 border-b-0 border-amber-300 shadow-xl flex flex-col items-center justify-start pt-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
                        <span className="text-4xl animate-pulse">🥇</span>
                        <span className="text-xs font-black text-amber-900 mt-1 uppercase tracking-wider">المتصدر الأول</span>
                      </div>
                    </motion.div>
                  )}

                  {/* 3rd Place */}
                  {sortedTeams.length > 2 && (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex-1 flex flex-col items-center max-w-[180px]"
                    >
                      <div className="text-center mb-3">
                        <div className="w-14 h-14 md:w-16 md:h-16 mx-auto rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg mb-2" style={{ backgroundColor: sortedTeams[2].color || '#d97706' }}>
                          {sortedTeams[2].name.charAt(0)}
                        </div>
                        <span className="block font-black text-slate-800 text-sm md:text-base truncate max-w-[140px]">{sortedTeams[2].name}</span>
                        <span className="text-lg md:text-xl font-black text-slate-900">{sortedTeams[2].score} نقطة</span>
                      </div>
                      <div className="w-full h-28 md:h-36 bg-gradient-to-t from-amber-700/20 to-amber-700/10 rounded-t-3xl border-2 border-b-0 border-amber-700/30 shadow-md flex flex-col items-center justify-start pt-4">
                        <span className="text-3xl">🥉</span>
                        <span className="text-xs font-black text-amber-800 mt-1 uppercase">المركز الثالث</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Remaining teams (4th and beyond) */}
                {sortedTeams.length > 3 && (
                  <div className="w-full max-w-xl mt-8 space-y-3">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">بقية الفرق</h5>
                    {sortedTeams.slice(3).map((team, idx) => (
                      <div key={team.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-black">
                            #{idx + 4}
                          </span>
                          <span className="font-black text-slate-800">{team.name}</span>
                        </div>
                        <span className="font-black text-slate-900 text-lg">{team.score} نقطة</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Animated Cards / List View */
              <div className="space-y-3">
                <AnimatePresence>
                  {sortedTeams.map((team, index) => {
                    const rank = index + 1;
                    const badge = getRankBadge(rank);
                    const isCurrentTurn = currentTurnId === team.id;
                    const delta = scoreDeltas[team.id];
                    const change = rankChanges[team.id];
                    const diffToFirst = rank === 1 ? 0 : sortedTeams[0].score - team.score;
                    const percentageOfMax = highestScore > 0 ? (team.score / highestScore) * 100 : 0;

                    return (
                      <motion.div
                        key={team.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 220 }}
                        className={`p-4 md:p-5 rounded-3xl border-2 transition-all flex flex-col gap-3 relative overflow-hidden bg-white shadow-md ${
                          isCurrentTurn ? 'ring-4 ring-indigo-500/20 shadow-indigo-100' : ''
                        } ${badge.glow}`}
                        style={{ borderColor: isCurrentTurn ? team.color || '#4f46e5' : undefined }}
                      >
                        {isCurrentTurn && (
                          <div className="absolute top-0 right-0 left-0 h-1.5" style={{ backgroundColor: team.color || '#4f46e5' }} />
                        )}

                        <div className="flex items-center justify-between gap-4">
                          {/* Rank + Avatar + Name */}
                          <div className="flex items-center gap-3 md:gap-4 min-w-0">
                            {/* Rank Badge */}
                            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-2xl flex items-center justify-center shrink-0 ${badge.bg}`}>
                              {badge.icon || <span className="text-sm font-black">#{rank}</span>}
                            </div>

                            {/* Team Avatar */}
                            <div 
                              className="w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-md shrink-0"
                              style={{ backgroundColor: team.color || '#4f46e5' }}
                            >
                              {team.name.charAt(0)}
                            </div>

                            {/* Name & Indicators */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-black text-slate-900 text-base md:text-lg truncate max-w-[180px] md:max-w-[280px]">
                                  {team.name}
                                </h4>
                                {isCurrentTurn && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-600 border border-indigo-200 animate-pulse flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    دوره الآن
                                  </span>
                                )}
                                {change === 'up' && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-0.5 animate-bounce">
                                    <ChevronUp className="w-3 h-3" />
                                    تقدم
                                  </span>
                                )}
                                {change === 'down' && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-0.5">
                                    <ChevronDown className="w-3 h-3" />
                                    تراجع
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-semibold text-slate-400">
                                {rank === 1 ? '👑 متصدر المسابقة' : `فارق النقاط عن الصدارة: ${diffToFirst} نقطة`}
                              </span>
                            </div>
                          </div>

                          {/* Score and Delta */}
                          <div className="flex items-center gap-3 shrink-0">
                            {delta && delta !== 0 && (
                              <motion.span 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1.2, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className={`text-xs md:text-sm font-black px-2 py-1 rounded-xl shadow-sm ${
                                  delta > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                                }`}
                              >
                                {delta > 0 ? `+${delta}` : delta}
                              </motion.span>
                            )}

                            <div className="text-right">
                              <span className="text-2xl md:text-3xl font-black text-slate-900 block leading-none">
                                {team.score}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">نقطة</span>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar of Points */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1 relative">
                          <motion.div 
                            className="h-full rounded-full transition-all duration-700"
                            style={{ 
                              backgroundColor: team.color || '#4f46e5',
                              width: `${Math.max(percentageOfMax, 3)}%`
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>مجموع نقاط الفرق ككل: <strong className="text-slate-800">{totalCompetitionPoints}</strong></span>
            </div>
            <button
              onClick={triggerCelebration}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-black flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              احتفال صدارة 🎉
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render embedded/ticker variant (used directly on top of the selection screen or question view)
  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {/* Small bar header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Trophy className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
            ترتيب الفرق المباشر
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </span>
        </div>

        {onOpenModal && (
          <button 
            onClick={() => { playSound?.('click'); onOpenModal(); }}
            className="flex items-center gap-1 text-[11px] font-black text-indigo-600 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 px-2.5 py-1 rounded-xl transition-all"
            title="تكبير لوحة الصدارة ومنصة التتويج"
          >
            <Maximize2 className="w-3 h-3" />
            عرض المنصة والترتيب الشامل
          </button>
        )}
      </div>

      {/* Horizontal Animated Scroll Bar */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 px-1">
        <AnimatePresence>
          {sortedTeams.map((team, index) => {
            const rank = index + 1;
            const badge = getRankBadge(rank);
            const isCurrentTurn = currentTurnId === team.id;
            const isAnimating = animatingTeamId === team.id;
            const isCorrect = isAnimating && answerFeedback === 'correct';
            const isWrong = isAnimating && answerFeedback === 'wrong';
            const delta = scoreDeltas[team.id];
            const change = rankChanges[team.id];

            return (
              <motion.div
                key={team.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  scale: isCorrect ? 1.05 : isWrong ? 0.97 : isCurrentTurn ? 1.02 : 0.96,
                  y: 0,
                  borderColor: isCorrect ? '#10b981' : isWrong ? '#ef4444' : isCurrentTurn ? team.color || '#4f46e5' : '#f1f5f9'
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  layout: { type: 'spring', damping: 20, stiffness: 200 },
                  duration: 0.3
                }}
                className={`min-w-[230px] md:min-w-[270px] p-3 md:p-3.5 rounded-[26px] border-2 bg-white/95 backdrop-blur-md shadow-lg transition-all flex items-center justify-between relative overflow-hidden shrink-0 ${
                  isCurrentTurn 
                    ? 'ring-4 ring-indigo-500/15 shadow-indigo-100 z-10' 
                    : 'opacity-85 hover:opacity-100'
                } ${badge.glow}`}
                style={{ borderColor: isCurrentTurn ? team.color : undefined }}
              >
                {/* Active turn indicator bar */}
                {isCurrentTurn && (
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: team.color || '#4f46e5' }} />
                )}

                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank badge */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${badge.bg}`}>
                    {badge.icon || <span className="text-xs font-black">#{rank}</span>}
                  </div>

                  {/* Team Initial Avatar */}
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md text-base font-black shrink-0" 
                    style={{ backgroundColor: isCorrect ? '#10b981' : isWrong ? '#ef4444' : team.color || '#4f46e5' }}
                  >
                    {isCorrect ? '🏆' : isWrong ? '❌' : team.name.charAt(0)}
                  </div>

                  {/* Team Name & Meta */}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none">
                        {badge.label}
                      </span>
                      {change === 'up' && (
                        <ChevronUp className="w-3 h-3 text-emerald-500 animate-bounce" />
                      )}
                      {change === 'down' && (
                        <ChevronDown className="w-3 h-3 text-rose-500" />
                      )}
                    </div>
                    <span className="font-black text-slate-900 text-xs md:text-sm leading-tight truncate max-w-[110px] md:max-w-[130px] mt-0.5">
                      {team.name}
                    </span>
                    {isCurrentTurn && (
                      <span className="text-[9px] font-black text-indigo-600 flex items-center gap-0.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping inline-block" />
                        دوره الآن
                      </span>
                    )}
                  </div>
                </div>

                {/* Score & Delta */}
                <div className="flex items-center gap-2 shrink-0">
                  {delta && delta !== 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                        delta > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {delta > 0 ? `+${delta}` : delta}
                    </motion.span>
                  )}
                  <div className="text-right">
                    <div className="text-2xl md:text-3xl font-black text-slate-900 leading-none">
                      {team.score}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase">نقطة</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveTeamLeaderboard;
