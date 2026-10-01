import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fingerprint, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Smartphone, 
  Loader2, 
  Trash2, 
  Sparkles,
  Lock,
  Scan
} from 'lucide-react';
import { biometricService } from '../services/biometricService';

interface BiometricDeviceManagerProps {
  playSound?: (type: 'correct' | 'wrong' | 'victory' | 'intro' | 'click') => void;
  onEnrollmentChange?: (isEnrolled: boolean) => void;
}

export const BiometricDeviceManager: React.FC<BiometricDeviceManagerProps> = ({
  playSound,
  onEnrollmentChange
}) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<{ deviceName: string; enrolledDate: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const checkStatus = () => {
    const enrolled = biometricService.isEnrolled();
    setIsEnrolled(enrolled);
    setDeviceInfo(biometricService.getDeviceInfo());
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleEnroll = async () => {
    setIsProcessing(true);
    setStatusMessage(null);
    playSound?.('click');

    try {
      const res = await biometricService.enrollDevice();
      if (res.success) {
        playSound?.('victory');
        checkStatus();
        onEnrollmentChange?.(true);
        setStatusMessage({
          type: 'success',
          text: 'تم تفعيل ومطابقة بصمة هذا الجهاز بنجاح! يمكنك الآن استخدام البصمة للدخول السريع.'
        });
      } else {
        playSound?.('wrong');
        setStatusMessage({
          type: 'error',
          text: res.error || 'تعذر تسجيل البصمة. يرجى التأكد من تفعيل بصمة الإصبع أو قفل الشاشة بجهازك.'
        });
      }
    } catch (e: any) {
      playSound?.('wrong');
      setStatusMessage({
        type: 'error',
        text: e.message || 'حدث خطأ غير متوقع أثناء تفعيل البصمة.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestBiometric = async () => {
    setIsProcessing(true);
    setStatusMessage(null);
    playSound?.('click');

    try {
      const res = await biometricService.verifyBiometric();
      if (res.success) {
        playSound?.('correct');
        setStatusMessage({
          type: 'success',
          text: 'رائع! تمت مطابقة بصمة هذا الجهاز بنجاح وتعمل بأعلى درجات الأمان.'
        });
      } else {
        playSound?.('wrong');
        setStatusMessage({
          type: 'error',
          text: res.error || 'فشلت مطابقة البصمة. يرجى المحاولة مجدداً.'
        });
      }
    } catch (e: any) {
      playSound?.('wrong');
      setStatusMessage({
        type: 'error',
        text: e.message || 'حدث خطأ أثناء فحص البصمة.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisenroll = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إلغاء تفعيل الدخول بالبصمة من هذا الجهاز؟')) {
      playSound?.('click');
      biometricService.disenrollDevice();
      checkStatus();
      onEnrollmentChange?.(false);
      setStatusMessage({
        type: 'success',
        text: 'تم إلغاء تفعيل البصمة من هذا الجهاز بنجاح.'
      });
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 border-2 border-indigo-500/30 shadow-2xl relative overflow-hidden text-right">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${
            isEnrolled 
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-emerald-500/20' 
              : 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-amber-500/20'
          }`}>
            <Fingerprint className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-black text-white flex items-center gap-2">
              بصمة الدخول البيومترية لهذا الجهاز
              {isEnrolled ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                  مفعلة ✓
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/30 text-amber-300 border border-amber-400/40">
                  غير مفعلة
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-300 font-semibold mt-0.5">
              مصادقة سريعة مشفرة عبر مستشعر بصمة هاتفك أو حاسوبك
            </p>
          </div>
        </div>
      </div>

      {/* Content based on enrollment state */}
      <div className="space-y-4 relative z-10">
        {isEnrolled ? (
          <div className="space-y-4">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-indigo-300" />
                <div>
                  <p className="text-xs font-black text-white">{deviceInfo?.deviceName || 'هذا الجهاز'}</p>
                  <p className="text-[10px] text-slate-300">تم التفعيل: {deviceInfo?.enrolledDate || 'مؤخراً'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>جهاز معتمد ومطابق</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              بصمة هذا الجهاز مسجلة ومربوطة بحسابك (<strong className="text-amber-300">alahsaey@gmail.com</strong>). يمكنك الآن تسجيل الدخول مباشرة بالبصمة من شاشة الدخول.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestBiometric}
                disabled={isProcessing}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                <span>اختبار مطابقة البصمة الآن</span>
              </button>

              <button
                type="button"
                onClick={handleDisenroll}
                disabled={isProcessing}
                className="px-5 py-3 bg-white/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-white/10 hover:border-rose-500/30 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>إلغاء تفعيل البصمة من هذا الجهاز</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-200 text-xs font-bold leading-relaxed">
              💡 لتسجيل الدخول بلمسة إصبع دون الحاجة لإدخال حساب Google في كل مرة، اضغط على الزر أدناه لتفعيل مستشعر بصمة هذا الجهاز وربطه بحسابك.
            </div>

            <button
              type="button"
              onClick={handleEnroll}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري فحص مستشعر البصمة...</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5" />
                  <span>تفعيل البصمة البيومترية لهذا الجهاز الآن</span>
                  <Sparkles className="w-4 h-4 animate-pulse text-amber-950" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Status Message Feedback */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`p-3.5 rounded-2xl text-xs font-black flex items-center gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BiometricDeviceManager;
