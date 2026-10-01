import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Trophy, 
  ArrowLeft, 
  Calendar,
  Layers,
  History,
  Timer,
  Download,
  Users,
  Percent
} from 'lucide-react';
import { dataService, DBGameSession } from '../lib/dataService';
import { Skeleton, DashboardOverviewSkeleton } from './ui/Skeleton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

interface StatisticsDashboardProps {
  onBack: () => void;
  isAdmin: boolean;
  currentUserId?: string;
  playSound?: (type: 'correct' | 'wrong' | 'victory' | 'intro' | 'click') => void;
}

export default function StatisticsDashboard({ onBack, isAdmin, currentUserId, playSound }: StatisticsDashboardProps) {
  const [sessions, setSessions] = useState<DBGameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'diff'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [valueType, setValueType] = useState<'score' | 'percentage'>('score');
  const [lastDayOnly, setLastDayOnly] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [activeTab, setActiveTab] = useState<'overview' | 'weekly'>('overview');

  useEffect(() => {
    const unsubStats = dataService.subscribeGameSessions(isAdmin, currentUserId, (data) => {
      setSessions(data);
      setLoading(false);
    }, (err: any) => {
      console.warn("Statistics sync notice:", err);
      setLoading(false);
    });

    const unsubSettings = dataService.subscribeSettings((settings) => {
      if (settings?.logoUrl) setLogoUrl(settings.logoUrl);
    }, (err: any) => {
      console.warn("Settings sync notice in stats:", err);
    });

    return () => {
      unsubStats();
      unsubSettings();
    };
  }, [isAdmin, currentUserId]);

  const handleExportCSV = () => {
    playSound?.('click');
    if (!stats || sessions.length === 0) return;

    // Build CSV Content
    let csvContent = "\ufeff"; // BOM for Arabic support in Excel
    
    // Summary Section
    csvContent += "إحصائيات عامة للمسابقة\n";
    csvContent += "إجمالي المباريات,أطول سلسلة فوز,عدد التعادلات,عدد الفرق المشاركة\n";
    csvContent += `${stats.totalGames},${stats.maxStreak},${stats.draws},${stats.topTeams.length}\n\n`;

    // Top Categories
    csvContent += "الأقسام الأكثر طلباً (تحليل الأداء)\n";
    csvContent += "القسم,عدد مرات الاختيار,النسبة المئوية\n";
    const totalCatSelections = stats.topCategories.reduce((acc, cat) => acc + cat.count, 0);
    stats.topCategories.forEach(cat => {
      const percentage = totalCatSelections > 0 ? ((cat.count / totalCatSelections) * 100).toFixed(1) : 0;
      csvContent += `${cat.name},${cat.count},%${percentage}\n`;
    });
    csvContent += "\n";

    // Top Teams
    csvContent += "ترتيب الفرق (الأوائل)\n";
    csvContent += "الفريق,عدد الانتصارات,إجمالي النقاط,عدد الجولات,متوسط النقاط\n";
    stats.topTeams.forEach(team => {
      csvContent += `${team.name},${team.wins},${team.totalScore},${team.games},${team.averageScore}\n`;
    });
    csvContent += "\n";

    // Detailed History
    csvContent += "سجل المباريات التفصيلي\n";
    csvContent += "رقم المحاولة,التاريخ,الوقت,النتيجة النهائية,الفائز,الأقسام المختارة\n";
    
    sortedSessions.forEach((s, idx) => {
      const d = s.createdAt?.toDate ? s.createdAt.toDate() : new Date();
      const date = d.toLocaleDateString('ar-SA');
      const time = d.toLocaleTimeString('ar-SA');
      const teamsStr = (s.teams || []).map(t => `${t.name}: ${t.score}`).join(' | ');
      const winnerName = s.winnerId === 'draw' ? 'تعادل' : (s.teams || []).find(t => t.id === s.winnerId)?.name || 'غير معروف';
      const categories = (s.categories || []).map(c => c.replace(/,/g, ' ')).join(' - ');
      csvContent += `${sortedSessions.length - idx},${date},${time},"${teamsStr}","${winnerName}","${categories}"\n`;
    });

    // Download Logic
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = 'none';
    link.setAttribute("href", url);
    link.setAttribute("download", `مسابقة_ابوالفواطم_إحصائيات_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSessionsForStats = useMemo(() => {
    if (sessions.length === 0) return [];
    
    // Filter sessions to only keep those with actual activity (at least one team scored)
    const activeSessions = sessions.filter(s => s.teams?.some(t => t.score > 0));
    if (activeSessions.length === 0) return [];

    if (!lastDayOnly) return activeSessions;

    const mostRecentDate = activeSessions.reduce((latest, s) => {
      const d = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(0);
      return d > latest ? d : latest;
    }, new Date(0));

    const latestDayStr = mostRecentDate.toDateString();
    return activeSessions.filter(s => {
      const d = s.createdAt?.toDate ? s.createdAt.toDate() : null;
      return d && d.toDateString() === latestDayStr;
    });
  }, [sessions, lastDayOnly]);

  const weeklyStats = useMemo(() => {
    if (sessions.length === 0) return null;

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklySessions = sessions.filter(s => {
      const d = s.createdAt?.toDate ? s.createdAt.toDate() : new Date(0);
      return d >= oneWeekAgo && s.teams?.some(t => t.score > 0);
    });

    if (weeklySessions.length === 0) return null;

    const teamWeeklyStats: Record<string, { wins: number, score: number, games: number }> = {};
    
    weeklySessions.forEach(s => {
      (s.teams || []).forEach(team => {
        if (!teamWeeklyStats[team.name]) teamWeeklyStats[team.name] = { wins: 0, score: 0, games: 0 };
        teamWeeklyStats[team.name].games++;
        teamWeeklyStats[team.name].score += team.score;
        if (s.winnerId === team.id || s.winnerId === team.name) {
          teamWeeklyStats[team.name].wins++;
        }
      });
    });

    return Object.entries(teamWeeklyStats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.wins - a.wins || b.score - a.score)
      .slice(0, 3);
  }, [sessions]);

  const stats = useMemo(() => {
    if (filteredSessionsForStats.length === 0) return null;

    const totalGames = filteredSessionsForStats.length;
    let totalDrawsCount = 0;
    const categoryCounts: Record<string, number> = {};
    const teamStats: Record<string, { wins: number, totalScore: number, games: number }> = {};
    
    // Sort chronologically for streaks
    const chronoSessions = [...filteredSessionsForStats].sort((a, b) => 
      (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
    );

    let maxStreak = 0;
    let currentStreak = 0;
    let lastWinnerId = '';

    filteredSessionsForStats.forEach(s => {
      const isDraw = s.winnerId === 'draw';
      if (isDraw) totalDrawsCount++;

      (s.teams || []).forEach(team => {
        if (!teamStats[team.name]) teamStats[team.name] = { wins: 0, totalScore: 0, games: 0 };
        teamStats[team.name].games++;
        teamStats[team.name].totalScore += team.score;
        if (s.winnerId === team.id || (s.winnerId === team.name)) {
          teamStats[team.name].wins++;
        }
      });

      s.categories.forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
    });

    // Calculate Longest Win Streak
    chronoSessions.forEach(s => {
      const winnerId = s.winnerId;
      
      if (winnerId !== 'draw' && winnerId === lastWinnerId) {
        currentStreak++;
      } else {
        currentStreak = winnerId !== 'draw' ? 1 : 0;
      }
      lastWinnerId = winnerId;
      maxStreak = Math.max(maxStreak, currentStreak);
    });

    const topCategories = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const topTeams = Object.entries(teamStats)
      .map(([name, data]) => ({ 
        name, 
        ...data, 
        averageScore: data.games > 0 ? (data.totalScore / data.games).toFixed(1) : '0' 
      }))
      .filter(team => team.totalScore > 0) // Exclude teams that "left with zeros"
      .sort((a, b) => b.wins - a.wins || b.totalScore - a.totalScore)
      .slice(0, 10);

    return {
      totalGames,
      draws: totalDrawsCount,
      maxStreak,
      topCategories,
      topTeams
    };
  }, [sessions]);

  const sortedSessions = useMemo(() => {
    let filtered = [...filteredSessionsForStats];
    if (dateFilter) {
      filtered = filtered.filter(s => {
        if (!s.createdAt?.toDate) return false;
        const sessionDate = s.createdAt.toDate().toISOString().split('T')[0];
        return sessionDate === dateFilter;
      });
    }

    const sorted = filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      } else {
        const getDiff = (s: DBGameSession) => {
          const sortedTeams = [...(s.teams || [])].sort((t1, t2) => t2.score - t1.score);
          if (sortedTeams.length < 2) return sortedTeams[0]?.score || 0;
          return sortedTeams[0].score - sortedTeams[1].score;
        };
        const diffA = getDiff(a);
        const diffB = getDiff(b);
        return sortOrder === 'desc' ? diffB - diffA : diffA - diffB;
      }
    });

    return sorted;
  }, [sessions, sortBy, sortOrder, dateFilter, filteredSessionsForStats]);

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedSessions.slice(start, start + itemsPerPage);
  }, [sortedSessions, currentPage]);

  const totalPages = Math.ceil(sortedSessions.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 font-sans">
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 gap-6">
             <div className="flex items-center gap-4">
                <Skeleton variant="circular" width={64} height={64} />
                <div className="space-y-2">
                   <Skeleton width={200} height={32} />
                   <Skeleton width={150} height={16} />
                </div>
             </div>
             <div className="flex gap-3">
                <Skeleton width={120} height={48} className="rounded-2xl" />
                <Skeleton width={120} height={48} className="rounded-2xl" />
             </div>
          </header>

          <DashboardOverviewSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex items-center gap-6">
            <div className="logo h-16 w-auto drop-shadow-sm transition-transform hover:scale-105">
              <img 
                src={logoUrl || "/logo.png"} 
                alt="Logo" 
                className="h-full w-auto object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = "https://img.icons8.com/color/512/trophy.png";
                  target.className = "h-10 w-auto opacity-40 grayscale";
                }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">إحصائيات المسابقة</h1>
              <div className="flex gap-4 mt-1">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'overview' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-500'}`}
                >
                  النظرة العامة
                </button>
                <button 
                  onClick={() => setActiveTab('weekly')}
                  className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === 'weekly' ? 'text-emerald-600 border-emerald-600' : 'text-slate-400 border-transparent hover:text-slate-500'}`}
                >
                  أبطال الأسبوع
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button 
                onClick={() => { playSound?.('click'); setLastDayOnly(true); }}
                aria-pressed={lastDayOnly}
                className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all flex items-center gap-2 ${lastDayOnly ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Calendar className="w-3 h-3" />
                آخر يوم
              </button>
              <button 
                onClick={() => { playSound?.('click'); setLastDayOnly(false); }}
                aria-pressed={!lastDayOnly}
                className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all flex items-center gap-2 ${!lastDayOnly ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Layers className="w-3 h-3" />
                الكل
              </button>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button 
                onClick={() => { playSound?.('click'); setValueType('score'); }}
                aria-pressed={valueType === 'score'}
                className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-2 ${valueType === 'score' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Trophy className="w-3 h-3" />
                النقاط
              </button>
              <button 
                onClick={() => { playSound?.('click'); setValueType('percentage'); }}
                aria-pressed={valueType === 'percentage'}
                className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-2 ${valueType === 'percentage' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Percent className="w-3 h-3" />
                النسبة %
              </button>
            </div>
            {isAdmin && stats && stats.totalGames > 0 && (
              <button 
                onClick={() => { playSound?.('click'); handleExportCSV(); }}
                aria-label="تصدير الإحصائيات بصيغة CSV"
                className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 font-black rounded-2xl hover:bg-indigo-100 transition-all border border-indigo-100"
              >
                <Download className="w-5 h-5" />
                تصدير (CSV)
              </button>
            )}
            <button 
              onClick={() => { playSound?.('click'); onBack(); }}
              aria-label="العودة للمسابقة"
              className="flex items-center gap-2 px-6 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all border border-slate-200"
            >
              <ArrowLeft className="w-5 h-5" />
              العودة للمسابقة
            </button>
          </div>
        </header>

        {!stats || sessions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[48px] border-2 border-dashed border-slate-200">
             <History className="w-20 h-20 text-slate-200 mx-auto mb-4 animate-pulse" />
             <h2 className="text-2xl font-black text-slate-400">لا توجد بيانات مسجلة بعد</h2>
             <p className="text-slate-400 font-bold">ابدأ مسابقة جديدة لتظهر الإحصائيات هنا</p>
          </div>
        ) : activeTab === 'weekly' ? (
          <div className="space-y-12 py-10">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg rotate-3">
                <Trophy className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-black text-slate-800">أبطال الأسبوع الحالي</h2>
              <p className="text-slate-500 font-bold">يتم اختيار الأبطال بناءً على عدد مرات الفوز وإجمالي النقاط خلال الـ 7 أيام الماضية</p>
            </div>

            {(!weeklyStats || weeklyStats.length === 0) ? (
              <div className="bg-white p-20 rounded-[60px] text-center border-4 border-slate-50 shadow-inner">
                <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <h3 className="text-xl font-black text-slate-400">لا يتوفر نشاط كافٍ هذا الأسبوع</h3>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-end justify-center gap-6 max-w-6xl mx-auto px-4">
                {/* Podium visualization */}
                {weeklyStats[1] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 max-w-[300px] text-center space-y-4"
                  >
                    <div className="relative group">
                      <div className="w-24 h-24 bg-slate-200 rounded-3xl flex items-center justify-center mx-auto shadow-lg text-slate-500 text-3xl font-black border-4 border-white mb-4">
                        2
                      </div>
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-slate-400 text-white rounded-full flex items-center justify-center font-black shadow-lg">🥈</div>
                    </div>
                    <div className="bg-white p-6 rounded-[40px] border-b-8 border-slate-200 shadow-xl space-y-2">
                       <h3 className="text-xl font-black text-slate-800 truncate">{weeklyStats[1].name}</h3>
                       <div className="flex justify-center gap-3">
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black text-slate-400 uppercase">فوز</span>
                           <span className="text-xl font-black text-slate-700">{weeklyStats[1].wins}</span>
                         </div>
                         <div className="w-px h-8 bg-slate-100" />
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black text-slate-400 uppercase">نقاط</span>
                           <span className="text-xl font-black text-slate-700">{weeklyStats[1].score}</span>
                         </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {weeklyStats[0] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="flex-1 max-w-[350px] text-center space-y-6 z-10"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-32 h-32 bg-amber-400 rounded-3xl flex items-center justify-center mx-auto shadow-[0_20px_50px_rgba(251,191,36,0.3)] text-white text-5xl font-black border-4 border-white mb-4"
                      >
                        1
                      </motion.div>
                      <div className="absolute -top-4 -right-4 w-14 h-14 bg-amber-500 text-white rounded-full flex items-center justify-center text-2xl shadow-xl">👑</div>
                    </div>
                    <div className="bg-white p-10 rounded-[50px] border-b-[12px] border-amber-400 shadow-[0_30px_70px_rgba(0,0,0,0.1)] space-y-4 ring-8 ring-amber-50">
                       <h3 className="text-3xl font-black text-slate-800 truncate leading-tight">{weeklyStats[0].name}</h3>
                       <div className="flex justify-center gap-8">
                         <div className="flex flex-col">
                           <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">مرات الفوز</span>
                           <span className="text-3xl font-black text-amber-600">{weeklyStats[0].wins}</span>
                         </div>
                         <div className="w-px h-12 bg-slate-100" />
                         <div className="flex flex-col">
                           <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">إجمالي النقاط</span>
                           <span className="text-3xl font-black text-amber-600">{weeklyStats[0].score}</span>
                         </div>
                       </div>
                       <div className="pt-2">
                         <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">بطل الأسبوع</span>
                       </div>
                    </div>
                  </motion.div>
                )}

                {weeklyStats[2] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex-1 max-w-[280px] text-center space-y-4"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 bg-amber-700/10 rounded-3xl flex items-center justify-center mx-auto shadow-lg text-amber-900/60 text-2xl font-black border-4 border-white mb-4">
                        3
                      </div>
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-800/80 text-white rounded-full flex items-center justify-center font-black shadow-lg">🥉</div>
                    </div>
                    <div className="bg-white p-6 rounded-[40px] border-b-8 border-amber-800/20 shadow-xl space-y-2">
                       <h3 className="text-lg font-black text-slate-800 truncate">{weeklyStats[2].name}</h3>
                       <div className="flex justify-center gap-3">
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black text-slate-400 uppercase">فوز</span>
                           <span className="text-lg font-black text-slate-700">{weeklyStats[2].wins}</span>
                         </div>
                         <div className="w-px h-8 bg-slate-100" />
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black text-slate-400 uppercase">نقاط</span>
                           <span className="text-lg font-black text-slate-700">{weeklyStats[2].score}</span>
                         </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-2' : ''} gap-8 items-start`}>
            
            {/* Column 1: Competition Statistics & Activity Log */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                   <Trophy className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">
                  {isAdmin ? 'احصائيات المسابقات' : 'نشاطي في المسابقات'}
                </h2>
              </div>

              {isAdmin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                      <span className="text-xs font-black text-slate-400 uppercase">إجمالي المحاولات</span>
                      <div className="text-4xl font-black text-indigo-600 mt-1">{stats.totalGames}</div>
                  </div>
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                      <span className="text-xs font-black text-slate-400 uppercase">مباريات مكتملة</span>
                      <div className="text-4xl font-black text-emerald-600 mt-1">
                        {filteredSessionsForStats.filter(s => s.isCompleted).length}
                      </div>
                  </div>
                </div>
              )}

              {/* Top Performing Teams Section */}
              {isAdmin && stats.topTeams.length > 0 && (
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                  <h3 className="text-lg font-black text-slate-700 flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-400" />
                    الفرق الأكثر تفوقاً
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {stats.topTeams.map((team, idx) => {
                      const winRate = team.games > 0 ? Math.round((team.wins / team.games) * 100) : 0;
                      
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={idx} 
                          className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[32px] hover:shadow-2xl hover:shadow-indigo-100/50 transition-all group relative overflow-hidden"
                        >
                          {/* Rank Badge */}
                          <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-sm ${
                            idx === 0 ? 'bg-amber-400' : 
                            idx === 1 ? 'bg-slate-300' : 
                            idx === 2 ? 'bg-amber-600' : 
                            'bg-slate-200 text-slate-500'
                          }`}>
                            RANK #{idx + 1}
                          </div>
                          
                          <div className="flex items-center gap-4 pt-2">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${
                              idx === 0 ? 'bg-amber-50 text-amber-600' : 
                              idx === 1 ? 'bg-slate-50 text-slate-600' : 
                              idx === 2 ? 'bg-orange-50 text-orange-600' : 
                              'bg-indigo-50 text-indigo-600'
                            }`}>
                              {team.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{team.name}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{team.games} جولات</span>
                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">الإجمالي: {team.totalScore}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 pt-2">
                            {/* Win Rate Ring (Simple representation) */}
                            <div className="relative w-14 h-14 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle
                                  cx="28"
                                  cy="28"
                                  r="24"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="transparent"
                                  className="text-slate-100"
                                />
                                <circle
                                  cx="28"
                                  cy="28"
                                  r="24"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="transparent"
                                  strokeDasharray={150.8}
                                  strokeDashoffset={150.8 - (150.8 * winRate) / 100}
                                  className="text-emerald-500 transition-all duration-1000"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[10px] font-black text-slate-800">% {winRate}</span>
                                <span className="text-[8px] font-bold text-slate-400 leading-none">فوز</span>
                              </div>
                            </div>

                            <div className="text-right flex flex-col items-end min-w-[70px]">
                              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">متوسط النقاط</div>
                              <div className="text-2xl font-black text-indigo-600 leading-none tabular-nums">
                                {team.averageScore}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-700 flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-400" />
                  سجل النشاط الأخير
                </h3>
                
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                  <input 
                    type="date" 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    aria-label="تصفية حسب التاريخ"
                    className="bg-transparent border-none text-xs font-black text-slate-600 focus:ring-0 cursor-pointer w-full"
                  />
                  {dateFilter && (
                    <button 
                      onClick={() => setDateFilter('')}
                      aria-label="إلغاء تصفية التاريخ"
                      className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      إلغاء
                    </button>
                  )}
                </div>

                <div className="space-y-3 pr-2">
                   {paginatedSessions.map((s, idx) => {
                     const date = s.createdAt?.toDate ? s.createdAt.toDate().toLocaleString('ar-SA') : 'الآن';
                     const durationMinutes = s.duration ? Math.floor(s.duration / 60) : 0;
                     const durationSeconds = s.duration ? s.duration % 60 : 0;
                     
                     return (
                       <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx} 
                        className={`p-5 rounded-3xl border-2 transition-all ${s.isCompleted ? 'bg-indigo-50/30 border-indigo-50' : 'bg-slate-50 border-slate-50 opacity-80'}`}
                       >
                         <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{date}</span>
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${s.isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                <span className="text-xs font-black text-slate-500">{s.isCompleted ? 'مكتملة' : 'قيد التقدم / لم تكتمل'}</span>
                              </div>
                            </div>
                            {s.duration !== undefined && (
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl border border-slate-100 text-xs font-black text-slate-600">
                                <Timer className="w-3 h-3" />
                                {durationMinutes}:{durationSeconds.toString().padStart(2, '0')}
                              </div>
                            )}
                         </div>

                         <div className="flex items-center justify-between gap-4 py-3 border-y border-slate-100/50 my-3">
                            {(s.teams || []).map((team, tIdx) => {
                              const totalScore = (s.teams || []).reduce((acc, t) => acc + t.score, 0);
                              const displayValue = valueType === 'score' 
                                ? team.score 
                                : (totalScore > 0 ? `${Math.round((team.score / totalScore) * 100)}%` : '0%');
                              return (
                                <React.Fragment key={tIdx}>
                                  <div className="text-center flex-1">
                                    <div className="text-xs font-black text-slate-400 truncate mb-1">{team.name}</div>
                                    <div className={`text-2xl font-black ${s.winnerId === team.id ? 'text-indigo-600' : 'text-slate-800'}`}>
                                      {displayValue}
                                    </div>
                                  </div>
                                  {tIdx === 0 && <div className="text-[10px] font-black text-slate-300">VS</div>}
                                </React.Fragment>
                              );
                            })}
                         </div>

                         <div className="flex flex-wrap gap-1.5">
                            {(s.categories || []).map((cat, ci) => (
                              <span key={ci} className="px-2 py-0.5 bg-white text-[9px] font-bold text-slate-500 rounded-md border border-slate-100">
                                {cat}
                              </span>
                            ))}
                         </div>
                       </motion.div>
                     );
                   })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <button 
                      onClick={() => { playSound?.('click'); setCurrentPage(prev => Math.max(1, prev - 1)); }}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-all"
                    >
                      السابق
                    </button>
                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { playSound?.('click'); setCurrentPage(i + 1); }}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => { playSound?.('click'); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-all"
                    >
                      التالي
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Category Statistics */}
            {isAdmin && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                     <Layers className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800">احصائيات الأقسام</h2>
                </div>

                <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={stats.topCategories.slice(0, 12)} 
                        margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
                      >
                        <defs>
                          {stats.topCategories.slice(0, 5).map((cat, i) => (
                            <linearGradient key={`grad-${i}`} id={`colorGradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={['#10b981', '#0ea5e9', '#6366f1', '#f59e0b', '#f43f5e'][i]} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor={['#10b981', '#0ea5e9', '#6366f1', '#f59e0b', '#f43f5e'][i]} stopOpacity={0.3}/>
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#475569', fontSize: 11, fontWeight: '900' }}
                          interval={0}
                          angle={-35}
                          textAnchor="end"
                          height={80}
                          label={{ value: 'الأقسام الأكثر طلباً', position: 'bottom', offset: 0, fill: '#94a3b8', fontSize: 10, fontWeight: '800' }}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: '700' }}
                          label={{ value: 'عدد المرات', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10, fontWeight: '800' }}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white/95 backdrop-blur-xl p-4 rounded-[24px] shadow-2xl border border-slate-100 min-w-[140px]">
                                  <p className="text-xs font-black text-slate-400 mb-1 uppercase tracking-widest leading-none">اسم القسم</p>
                                  <p className="text-sm font-black text-slate-800 mb-2 truncate">{label}</p>
                                  <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                                    <span className="text-[10px] font-bold text-slate-500">عدد المحاولات:</span>
                                    <span className="text-base font-black text-indigo-600">{payload[0].value}</span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          radius={[12, 12, 0, 0]} 
                          barSize={45}
                          animationDuration={1500}
                        >
                           {stats.topCategories.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index < 5 ? `url(#colorGradient-${index})` : '#cbd5e1'} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">عدد مرات الاستخدام لكل قسم</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                        {stats.topCategories.map((cat, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            key={idx} 
                            className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 text-[10px] flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                 {idx + 1}
                               </div>
                               <span className="font-bold text-slate-700">{cat.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-400 group-hover:text-slate-600">مرة</span>
                              <span className="text-xl font-black text-indigo-600">{cat.count}</span>
                            </div>
                          </motion.div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
