import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Trophy, 
  Timer, 
  Calendar,
  Users,
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { dataService, DBGameSession } from '../lib/dataService';
import { Skeleton } from './ui/Skeleton';

interface RecentCompetitionsProps {
  onBack: () => void;
  isAdmin: boolean;
  currentUserId?: string;
  playSound?: (type: 'correct' | 'wrong' | 'victory' | 'intro' | 'click') => void;
}

export default function RecentCompetitions({ onBack, isAdmin, currentUserId, playSound }: RecentCompetitionsProps) {
  const [sessions, setSessions] = useState<DBGameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsub = dataService.subscribeGameSessions(isAdmin, currentUserId, (data) => {
      // Filter out inactive sessions (where all teams have 0 score)
      const activeSessions = data.filter(s => 
        s.teams?.some(t => t.score > 0)
      );

      if (activeSessions.length > 0) {
        // Find the most recent date available among active sessions
        const mostRecentSessionDate = activeSessions.reduce((latest, s) => {
          const d = s.createdAt?.toDate ? s.createdAt.toDate() : (s.createdAt instanceof Date ? s.createdAt : new Date(0));
          return d > latest ? d : latest;
        }, new Date(0));

        const latestDayString = mostRecentSessionDate.toDateString();

        // Filter sessions that happened on the same day as the most recent session
        const latestDaySessions = activeSessions.filter(s => {
          const d = s.createdAt?.toDate ? s.createdAt.toDate() : (s.createdAt instanceof Date ? s.createdAt : null);
          return d && d.toDateString() === latestDayString;
        });

        setSessions(latestDaySessions);
      } else {
        setSessions([]);
      }
      setLoading(false);
    }, (err: any) => {
      console.warn("Recent competitions sync notice:", err);
      setLoading(false);
    });

    return () => unsub();
  }, [isAdmin, currentUserId]);

  const filteredSessions = sessions.filter(s => {
    const searchLower = searchTerm.toLowerCase();
    const teamNames = (s.teams || []).map(t => t.name.toLowerCase()).join(' ');
    const categoryNames = (s.categories || []).map(c => c.toLowerCase()).join(' ');
    return teamNames.includes(searchLower) || categoryNames.includes(searchLower);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 font-sans">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 gap-4">
             <div className="flex items-center gap-4">
                <Skeleton variant="circular" width={48} height={48} />
                <div className="space-y-2">
                   <Skeleton width={120} height={24} />
                   <Skeleton width={80} height={12} />
                </div>
             </div>
             <Skeleton width={300} height={48} className="rounded-2xl" />
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} variant="circular" width={32} height={32} className="border-2 border-white" />
                    ))}
                  </div>
                  <Skeleton width={60} height={20} className="rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton width="100%" height={24} />
                  <Skeleton width="60%" height={16} />
                </div>
                <div className="flex gap-2">
                   <Skeleton width="45%" height={32} className="rounded-xl" />
                   <Skeleton width="45%" height={32} className="rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
               <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">آخر المسابقات</h1>
              {sessions.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                    يوم: {sessions[0].createdAt?.toDate ? sessions[0].createdAt.toDate().toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="بحث في المتسابقين أو الأقسام..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 bg-slate-100 border-none rounded-2xl text-xs font-black text-slate-600 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
              />
            </div>
            <button 
              onClick={() => { playSound?.('click'); onBack(); }}
              className="flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">العودة</span>
            </button>
          </div>
        </header>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[48px] border-2 border-dashed border-slate-200">
             <History className="w-20 h-20 text-slate-200 mx-auto mb-4 animate-pulse" />
             <h2 className="text-2xl font-black text-slate-400">لا توجد مسابقات مسجلة</h2>
             <p className="text-slate-400 font-bold">لم يتم العثور على أي نتائج مطابقة لبحثك</p>
          </div>
        ) : (
          <div className="space-y-4 pr-2">
            {filteredSessions.map((session, idx) => {
              const date = session.createdAt?.toDate ? session.createdAt.toDate().toLocaleString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'تاريخ غير معروف';
              
              const durationMinutes = session.duration ? Math.floor(session.duration / 60) : 0;
              const durationSeconds = session.duration ? session.duration % 60 : 0;
              const maxScore = Math.max(...(session.teams || []).map(t => t.score), 0);
              
              // Improved winner detection
              let winner = (session.teams || []).find(t => t.id === session.winnerId || t.name === session.winnerId);
              let isDraw = session.winnerId === 'draw';
              
              const teamsWithMaxScore = (session.teams || []).filter(t => t.score === maxScore);

              // If no explicit winnerId from session, determine from scores
              if (!winner && !isDraw) {
                if (teamsWithMaxScore.length === 1) {
                  winner = teamsWithMaxScore[0];
                } else if (teamsWithMaxScore.length > 1 && maxScore > 0) {
                  isDraw = true;
                }
              }

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={session.id || idx}
                  className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-300" />
                          <span className="text-xs font-black text-slate-400 uppercase tracking-tight">{date}</span>
                        </div>
                        <div className="flex items-center gap-4">
                           {session.duration !== undefined && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500">
                              <Timer className="w-3 h-3" />
                              {durationMinutes}:{durationSeconds.toString().padStart(2, '0')}
                            </div>
                          )}
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black ${session.isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {session.isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {session.isCompleted ? 'مكتملة' : 'لم تكتمل'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 py-4 px-6 bg-slate-50 rounded-3xl group-hover:bg-indigo-50/30 transition-colors">
                        {(session.teams || []).map((team, tIdx) => (
                          <React.Fragment key={tIdx}>
                            <div className="flex-1 text-center">
                              <div className="text-[10px] font-black text-slate-400 uppercase mb-1">{team.name}</div>
                              <div className={`text-3xl font-black ${winner?.id === team.id || winner?.name === team.name ? 'text-indigo-600' : 'text-slate-800'}`}>
                                {team.score}
                              </div>
                            </div>
                            {tIdx === 0 && <div className="text-xs font-black text-slate-200">مقابل</div>}
                          </React.Fragment>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(session.categories || []).map((cat, ci) => (
                          <span key={ci} className="px-3 py-1 bg-white border border-slate-100 text-[10px] font-black text-slate-500 rounded-xl shadow-sm">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center justify-center md:w-48 bg-slate-900 md:rounded-[24px] rounded-[24px] p-6 text-white shadow-xl shadow-slate-100">
                      {isDraw ? (
                        <div className="text-center">
                          <Users className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                          <div className="text-sm font-black uppercase tracking-widest text-amber-400">تعادل</div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">الفائز</div>
                          <div className="text-base font-black truncate max-w-[140px] leading-tight">
                            {winner?.name || 'مجهول'}
                          </div>
                        </div>
                      )}
                      <div className="hidden md:block w-8 h-px bg-slate-700 my-4" />
                      <div className="hidden md:block text-center">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">أعلى نتيجة</div>
                        <div className="text-3xl font-black text-emerald-400">{maxScore}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
