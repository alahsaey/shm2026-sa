import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Award, 
  Download, 
  Share2, 
  Printer, 
  X, 
  Sparkles, 
  Check, 
  Star,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Team } from '../types';

interface AwardCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  rank: number; // 1, 2, 3...
  competitionName: string;
  competitionSlogan?: string;
  dateStr?: string;
  totalTeamsCount?: number;
  playSound?: (type: 'correct' | 'wrong' | 'victory' | 'intro' | 'click') => void;
}

export const AwardCertificateModal: React.FC<AwardCertificateModalProps> = ({
  isOpen,
  onClose,
  team,
  rank,
  competitionName,
  competitionSlogan,
  dateStr,
  playSound
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !team) return null;

  const currentDate = dateStr || new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const rankLabel = rank === 1 ? 'المركز الأول • بطل المسابقة' :
                    rank === 2 ? 'المركز الثاني • وصيف البطولة' :
                    rank === 3 ? 'المركز الثالث • درع التميز' :
                    `المركز ${rank} • شهادة مشاركة وتقدير`;

  const rankBadgeColor = rank === 1 ? 'from-amber-400 via-amber-500 to-yellow-600 text-slate-950' :
                         rank === 2 ? 'from-slate-300 via-slate-400 to-slate-500 text-slate-950' :
                         rank === 3 ? 'from-amber-700 via-amber-800 to-yellow-900 text-amber-100' :
                         'from-indigo-600 to-purple-800 text-white';

  /**
   * High-resolution 2K Certificate Generator via Native Canvas
   */
  const handleDownloadPNG = async () => {
    setIsExporting(true);
    playSound?.('click');

    try {
      const canvas = document.createElement('canvas');
      const width = 1920;
      const height = 1080;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas not supported');

      // 1. Rich Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.5, '#1e1b4b');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Decorative radial glow
      const radialGlow = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 700);
      radialGlow.addColorStop(0, 'rgba(217, 119, 6, 0.25)');
      radialGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.15)');
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Ornate Dual Gold Borders
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 14;
      ctx.strokeRect(60, 60, width - 120, height - 120);

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(84, 84, width - 168, height - 168);

      // Corner Accents
      const drawCorner = (x: number, y: number, angle: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(40, 0);
        ctx.lineTo(40, 10);
        ctx.lineTo(10, 10);
        ctx.lineTo(10, 40);
        ctx.lineTo(0, 40);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };
      drawCorner(60, 60, 0);
      drawCorner(width - 60, 60, Math.PI / 2);
      drawCorner(width - 60, height - 60, Math.PI);
      drawCorner(60, height - 60, -Math.PI / 2);

      // 3. Text Header - Islamic / Cultural Heading
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
      ctx.fillText('بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ', width / 2, 140);

      // Main Competition Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 68px "Segoe UI", Arial, sans-serif';
      ctx.fillText(competitionName || 'مسابقة أبوالفواطم الثقافية', width / 2, 230);

      if (competitionSlogan) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 30px "Segoe UI", Arial, sans-serif';
        ctx.fillText(competitionSlogan, width / 2, 280);
      }

      // Title: شهادة فوز وتقدير
      const titleGrad = ctx.createLinearGradient(width / 2 - 300, 0, width / 2 + 300, 0);
      titleGrad.addColorStop(0, '#fef08a');
      titleGrad.addColorStop(0.5, '#fbbf24');
      titleGrad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = titleGrad;
      ctx.font = '900 78px "Segoe UI", Arial, sans-serif';
      ctx.fillText('شَهَادَةُ تَتْوِيجٍ وَتَقْدِيرٍ', width / 2, 380);

      // Award Statement
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
      ctx.fillText('تتشرف إدارة المسابقة بمنح هذه الشهادة المتميزة إلى أبطال:', width / 2, 450);

      // Winning Team Name with highlight banner
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 450, 480, 900, 110, [28]);
      ctx.fill();
      ctx.strokeStyle = team.color || '#f59e0b';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 64px "Segoe UI", Arial, sans-serif';
      ctx.fillText(team.name, width / 2, 558);

      // Rank & Achievement
      ctx.fillStyle = '#fbbf24';
      ctx.font = '900 42px "Segoe UI", Arial, sans-serif';
      ctx.fillText(`🏆 ${rankLabel} 🏆`, width / 2, 650);

      // Score Callout
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
      ctx.fillText(`برصيد نهائي مستحق قدره: ${team.score} نقطة`, width / 2, 715);

      // Appreciation Note
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 28px "Segoe UI", Arial, sans-serif';
      ctx.fillText('تقديراً لجهودهم المعرفية وتألقهم المتميز وروحهم التنافسية العالية', width / 2, 775);

      // Footer - Official Seal & Signatures
      // Left: Date
      ctx.textAlign = 'right';
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 28px "Segoe UI", Arial, sans-serif';
      ctx.fillText(`التاريخ: ${currentDate}`, width - 150, 950);

      // Right: Management
      ctx.textAlign = 'left';
      ctx.fillText('إدارة مسابقة أبوالفواطم', 150, 930);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px "Segoe UI", Arial, sans-serif';
      ctx.fillText('معتمد رسمي • Al-Ahsaey', 150, 970);

      // Center Official Golden Seal
      ctx.beginPath();
      ctx.arc(width / 2, 920, 55, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
      ctx.fillText('الختم الرسمي', width / 2, 915);
      ctx.fillText('★ معتمد ★', width / 2, 940);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `شهادة_فوز_${team.name.replace(/\s+/g, '_')}_${competitionName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();

      playSound?.('victory');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to export certificate:', err);
      playSound?.('wrong');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    playSound?.('click');
    const shareText = `🏆 نبارك لـ ${team.name} فوزهم بـ (${rankLabel}) في ${competitionName} برصيد ${team.score} نقطة! 🎉`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `شهادة فوز ${team.name} - ${competitionName}`,
          text: shareText,
          url: window.location.href
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(shareText + '\n' + window.location.href);
        alert('تم نسخ رابط وتفاصيل الشهادة لمشاركتها عبر الواتساب!');
      } catch {}
    }
  };

  const handlePrint = () => {
    playSound?.('click');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl animate-in fade-in duration-300 overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-[0_35px_120px_rgba(0,0,0,0.5)] border-4 border-amber-300 overflow-hidden my-6 flex flex-col"
      >
        {/* Top Control Bar */}
        <div className="p-4 md:p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-white">شهادة التكريم والبطولة الرسمية</h3>
              <p className="text-[11px] text-slate-400 font-bold">جاهزة للتحميل كصورة عالية الدقة والمشاركة</p>
            </div>
          </div>

          <button 
            onClick={() => { playSound?.('click'); onClose(); }}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Visual Canvas Preview */}
        <div className="p-4 md:p-8 bg-slate-100 flex items-center justify-center overflow-x-auto">
          <div 
            ref={certificateRef}
            className="relative w-full max-w-3xl aspect-[16/10] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-10 border-8 border-amber-400 shadow-2xl text-center text-white flex flex-col justify-between overflow-hidden select-none"
            style={{
              boxShadow: '0 0 50px rgba(245, 158, 11, 0.25), inset 0 0 40px rgba(0,0,0,0.6)'
            }}
          >
            {/* Background Ornate Glow & Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-indigo-500/10 to-transparent pointer-events-none" />
            <div className="absolute inset-2 border-2 border-amber-400/40 rounded-2xl pointer-events-none" />

            {/* Header: Basmala & Competition Name */}
            <div className="space-y-1 relative z-10">
              <p className="text-amber-200/90 text-[11px] md:text-sm font-serif">بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ</p>
              <h2 className="text-xl md:text-3xl font-black text-white drop-shadow-md">
                {competitionName || 'مسابقة أبوالفواطم الثقافية'}
              </h2>
              {competitionSlogan && (
                <p className="text-xs md:text-sm text-slate-300 font-medium">{competitionSlogan}</p>
              )}
            </div>

            {/* Certificate Title Badge */}
            <div className="my-2 relative z-10">
              <div className="inline-block px-8 py-2 md:py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 shadow-xl border-2 border-amber-300">
                <h1 className="text-xl md:text-3xl font-black tracking-wide">
                  شَهَادَةُ تَتْوِيجٍ وَتَقْدِيرٍ
                </h1>
              </div>
            </div>

            {/* Middle: Honored Team */}
            <div className="space-y-3 relative z-10">
              <p className="text-xs md:text-sm text-slate-300 font-bold">
                تمنح إدارة المسابقة هذه الشهادة التكريمية إلى أبطال:
              </p>
              
              <div 
                className="py-3 px-8 rounded-2xl inline-block bg-white/10 backdrop-blur-md border-2 shadow-xl"
                style={{ borderColor: team.color || '#f59e0b' }}
              >
                <h3 
                  className="text-2xl md:text-4xl font-black drop-shadow-lg tracking-tight"
                  style={{ color: team.color || '#f59e0b' }}
                >
                  {team.name}
                </h3>
              </div>

              <div>
                <span className={`inline-block px-4 py-1 rounded-full text-xs md:text-sm font-black bg-gradient-to-r ${rankBadgeColor} shadow-md`}>
                  🏆 {rankLabel}
                </span>
                <p className="text-sm md:text-base font-black text-slate-200 mt-1">
                  برصيد نهائي مستحق: <strong className="text-amber-400 text-lg md:text-xl">{team.score}</strong> نقطة
                </p>
              </div>

              <p className="text-[11px] md:text-xs text-slate-400 italic">
                تقديراً لجهودهم المعرفية وتألقهم المتميز وروحهم التنافسية العالية
              </p>
            </div>

            {/* Footer Signatures & Date */}
            <div className="flex items-end justify-between pt-4 border-t border-amber-400/30 text-[10px] md:text-xs text-slate-300 relative z-10">
              <div className="text-right">
                <p className="font-black text-white">إدارة مسابقة أبوالفواطم</p>
                <p className="text-amber-400 font-bold">معتمد رسمي • Al-Ahsaey</p>
              </div>

              {/* Gold Seal Stamp */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-amber-400 bg-amber-500/20 flex flex-col items-center justify-center text-amber-300 font-black shadow-lg">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-[8px] uppercase tracking-widest mt-0.5">الختم الرسمي</span>
              </div>

              <div className="text-left">
                <p className="text-slate-400">التاريخ:</p>
                <p className="font-bold text-white flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentDate}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="p-4 md:p-6 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPNG}
              disabled={isExporting}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-sm rounded-2xl shadow-xl flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-5 h-5 text-emerald-950" />
                  <span>تم حفظ الشهادة بنجاح! ✓</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>{isExporting ? 'جاري إنشاء الشهادة...' : 'تحميل الشهادة صورة (PNG عالية الدقة)'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>مشاركة</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl flex items-center gap-2 transition-all cursor-pointer"
              title="طباعة الشهادة"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => { playSound?.('click'); onClose(); }}
            className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-2xl transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AwardCertificateModal;
