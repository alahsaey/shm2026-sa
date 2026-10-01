import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Fingerprint, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  KeyRound, 
  Sparkles, 
  LogOut, 
  X, 
  ShieldAlert, 
  Loader2, 
  Scan, 
  UserCheck, 
  Copy, 
  ExternalLink, 
  Check, 
  Key,
  Globe,
  Settings,
  Smartphone
} from 'lucide-react';
import { User, signOut } from 'firebase/auth';
import { auth, signInWithGoogle, getAuthErrorMessage } from '../lib/firebase';
import { biometricService } from '../services/biometricService';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentUser: User | null;
  isAdmin: boolean;
  playSound?: (type: 'correct' | 'wrong' | 'victory' | 'intro' | 'click') => void;
}

const AUTHORIZED_ADMIN_EMAIL = 'alahsaey@gmail.com';
const FIREBASE_PROJECT_ID = 'gen-lang-client-0332714924';

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
  isAdmin,
  playSound
}) => {
  const [authMethod, setAuthMethod] = useState<'google' | 'biometric' | 'passcode'>('google');
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUnauthorizedDomain, setIsUnauthorizedDomain] = useState(false);
  const [domainCopied, setDomainCopied] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolledDeviceInfo, setEnrolledDeviceInfo] = useState<{ deviceName: string; enrolledDate: string } | null>(null);

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  useEffect(() => {
    if (isOpen) {
      const enrolled = biometricService.isEnrolled();
      setIsEnrolled(enrolled);
      setEnrolledDeviceInfo(biometricService.getDeviceInfo());
      setBiometricStatus('idle');
      setLoginError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isAuthorizedEmail = currentUser?.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();

  const handleCopyDomain = async () => {
    try {
      await navigator.clipboard.writeText(currentHostname);
      setDomainCopied(true);
      playSound?.('click');
      setTimeout(() => setDomainCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setLoginError(null);
    setIsUnauthorizedDomain(false);

    try {
      const res = await signInWithGoogle();
      const signedInUser = res.user;

      if (signedInUser.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        playSound?.('correct');
        try {
          sessionStorage.setItem('abf_admin_authenticated', 'true');
          localStorage.setItem('abf_admin_authenticated', 'true');
        } catch {}
        onSuccess();
      } else {
        playSound?.('wrong');
        setLoginError(`تم حظر الوصول: البريد الحالي (${signedInUser.email}) غير مصرح له بالإدارة. الصلاحية حصراً لـ ${AUTHORIZED_ADMIN_EMAIL}`);
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return;
      }
      if (err?.code === 'auth/unauthorized-domain') {
        setIsUnauthorizedDomain(true);
      }
      const msg = getAuthErrorMessage(err);
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleBiometricScan = async () => {
    if (isScanningBiometric) return;
    
    // Check if enrolled first
    if (!biometricService.isEnrolled()) {
      setBiometricStatus('failed');
      setLoginError('البصمة غير مفعلة على هذا الجهاز بعد. يرجى تسجيل الدخول بحساب Google أولاً ثم تفعيل البصمة من إعدادات الموقع.');
      playSound?.('wrong');
      return;
    }

    setIsScanningBiometric(true);
    setBiometricStatus('scanning');
    setLoginError(null);
    playSound?.('click');

    try {
      const res = await biometricService.verifyBiometric();
      
      if (res.success) {
        setBiometricStatus('success');
        try {
          sessionStorage.setItem('abf_admin_authenticated', 'true');
          localStorage.setItem('abf_admin_authenticated', 'true');
        } catch {}
        
        playSound?.('victory');
        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else {
        setBiometricStatus('failed');
        setLoginError(res.error || 'فشلت مطابقة البصمة على هذا الجهاز.');
        playSound?.('wrong');
      }
    } catch (err: any) {
      console.error("Biometric scan error:", err);
      setBiometricStatus('failed');
      setLoginError("تعذر إكمال المصادقة بالبصمة. يرجى استخدام رمز المرور البديل أو حساب Google.");
      playSound?.('wrong');
    } finally {
      setIsScanningBiometric(false);
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);

    const cleaned = passcode.trim().toLowerCase();
    // Valid master admin passcodes
    if (cleaned === '2026' || cleaned === 'alahsaey' || cleaned === 'alahsaey2026' || cleaned === 'admin2026') {
      playSound?.('victory');
      try {
        sessionStorage.setItem('abf_admin_authenticated', 'true');
        localStorage.setItem('abf_admin_authenticated', 'true');
      } catch {}
      onSuccess();
    } else {
      playSound?.('wrong');
      setPasscodeError('الرمز السري غير صحيح. يرجى إدخال الرمز المعتمد للمسؤول.');
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        className="relative w-full max-w-xl bg-white rounded-[40px] shadow-[0_35px_120px_rgba(0,0,0,0.4)] border-4 border-slate-100 overflow-hidden flex flex-col my-8"
      >
        {/* Header with Security Theme */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
          
          <button 
            onClick={() => { playSound?.('click'); onClose(); }}
            className="absolute top-6 left-6 w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-xl shrink-0">
              <ShieldCheck className="w-8 h-8 md:w-9 md:h-9 animate-pulse" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-950">
                  بوابة الأمان العالي
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  حظر المتطفلين 🔒
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mt-1">دخول المسؤول والتحكم</h3>
              <p className="text-xs text-slate-300 font-semibold mt-0.5">
                مصادقة محصورة لـ <strong className="text-amber-300 underline">{AUTHORIZED_ADMIN_EMAIL}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Security Alert Banner if non-admin logged in */}
        {currentUser && !isAuthorizedEmail && (
          <div className="p-4 bg-rose-50 border-b-2 border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-bold">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <p className="font-black text-rose-900 text-sm">تم اكتشاف حساب غير مصرح له!</p>
              <p className="mt-0.5">
                أنت مسجل حالياً بـ ({currentUser.email}). تم تقييد جميع صلاحيات لوحة التحكم فقط للمسؤول ({AUTHORIZED_ADMIN_EMAIL}).
              </p>
            </div>
          </div>
        )}

        {/* Method Switch Tabs */}
        <div className="grid grid-cols-3 bg-slate-100 p-1.5 mx-6 md:mx-8 mt-6 rounded-2xl border border-slate-200 font-black text-xs gap-1">
          <button
            onClick={() => { playSound?.('click'); setAuthMethod('google'); setLoginError(null); }}
            className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'google' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="truncate">Google المعتمد</span>
          </button>
          
          <button
            onClick={() => { 
              playSound?.('click'); 
              setAuthMethod('biometric'); 
              setLoginError(null);
              setIsEnrolled(biometricService.isEnrolled());
              setEnrolledDeviceInfo(biometricService.getDeviceInfo());
            }}
            className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 relative ${
              authMethod === 'biometric' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Fingerprint className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate">بصمة الجهاز</span>
            {isEnrolled && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => { playSound?.('click'); setAuthMethod('passcode'); setLoginError(null); }}
            className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'passcode' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">رمز المرور السري</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 md:p-8 space-y-6">
          {authMethod === 'google' ? (
            <div className="space-y-5 text-center">
              {currentUser ? (
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col items-center gap-4">
                  <div className="relative">
                    <img 
                      src={currentUser.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentUser.uid}`}
                      alt="Avatar"
                      className="w-20 h-20 rounded-3xl border-4 border-white shadow-lg object-cover"
                    />
                    {isAuthorizedEmail ? (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-md">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white p-1.5 rounded-full border-2 border-white shadow-md">
                        <XCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-lg">{currentUser.displayName || 'مستخدم Google'}</h4>
                    <span className="text-xs font-bold text-slate-500 block mt-0.5">{currentUser.email}</span>
                  </div>

                  {isAuthorizedEmail ? (
                    <div className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-black flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      مرحباً بك يا مسؤول النظام! الحساب مصرح له بكامل الصلاحيات.
                    </div>
                  ) : (
                    <div className="w-full p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      هذا الحساب ليس مسؤول النظام. يرجى التبديل إلى {AUTHORIZED_ADMIN_EMAIL}.
                    </div>
                  )}

                  <div className="w-full flex gap-3 pt-2">
                    {isAuthorizedEmail ? (
                      <button
                        onClick={() => { playSound?.('correct'); onSuccess(); }}
                        className="flex-1 py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Lock className="w-5 h-5 text-emerald-400" />
                        الانتقال إلى لوحة التحكم
                      </button>
                    ) : (
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoggingIn}
                        className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserCheck className="w-5 h-5" />}
                        تبديل الحساب إلى alahsaey@gmail.com
                      </button>
                    )}

                    <button
                      onClick={() => { playSound?.('click'); signOut(auth); }}
                      className="px-5 py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black rounded-2xl border border-rose-100 transition-all flex items-center justify-center cursor-pointer"
                      title="تسجيل الخروج"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-5 md:p-6 bg-slate-50 border border-slate-200 rounded-3xl text-right space-y-2">
                    <h5 className="font-black text-slate-800 text-sm flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-amber-500" />
                      شرط الوصول والحماية الحصرية
                    </h5>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      تتطلب لوحة التحكم مصادقة بريد Google المعتمد مسبقاً (<strong className="text-slate-800">{AUTHORIZED_ADMIN_EMAIL}</strong>). يمنع النظام تلقائياً أي بريد إلكتروني آخر من الوصول.
                    </p>
                  </div>

                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoggingIn}
                    className="w-full py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white hover:from-black hover:to-indigo-900 font-black text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 border-b-4 border-indigo-500/40 active:border-b-0 active:translate-y-1 cursor-pointer"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                        <span>جاري الاتصال بـ Google...</span>
                      </>
                    ) : (
                      <>
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" />
                        <span>تسجيل الدخول بحساب Google المعتمد</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : authMethod === 'biometric' ? (
            /* Biometric Fingerprint Section */
            <div className="flex flex-col items-center text-center space-y-6 py-2">
              {isEnrolled ? (
                /* Enrolled State */
                <>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-black flex items-center justify-center gap-2 w-full">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>تم التعرف على جهازك المعتمد ({enrolledDeviceInfo?.deviceName || 'هذا الجهاز'})</span>
                  </div>

                  <div className="relative group cursor-pointer" onClick={handleBiometricScan}>
                    {/* Scanner Glow Ring */}
                    <div className={`absolute -inset-4 rounded-full blur-xl transition-all duration-700 ${
                      biometricStatus === 'scanning' 
                        ? 'bg-amber-500/40 animate-pulse' 
                        : biometricStatus === 'success' 
                          ? 'bg-emerald-500/40' 
                          : biometricStatus === 'failed' 
                            ? 'bg-rose-500/40' 
                            : 'bg-emerald-500/20 group-hover:bg-emerald-500/30'
                    }`} />

                    {/* Fingerprint Scanner Button Circle */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-32 h-32 md:w-36 md:h-36 rounded-full border-4 flex items-center justify-center bg-slate-950 text-white shadow-2xl overflow-hidden transition-all duration-500 ${
                        biometricStatus === 'scanning' 
                          ? 'border-amber-400' 
                          : biometricStatus === 'success' 
                            ? 'border-emerald-400 shadow-emerald-500/30' 
                            : biometricStatus === 'failed' 
                              ? 'border-rose-500 shadow-rose-500/30' 
                              : 'border-slate-800 hover:border-emerald-400'
                      }`}
                    >
                      {/* Laser Scanning Line Animation */}
                      {biometricStatus === 'scanning' && (
                        <motion.div 
                          animate={{ y: [-60, 60, -60] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          className="absolute inset-x-0 h-1 bg-amber-400 shadow-[0_0_15px_#f59e0b] z-20"
                        />
                      )}

                      {biometricStatus === 'success' ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400">
                          <CheckCircle2 className="w-14 h-14 md:w-16 md:h-16 animate-bounce" />
                        </motion.div>
                      ) : biometricStatus === 'failed' ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-rose-500">
                          <XCircle className="w-14 h-14 md:w-16 md:h-16" />
                        </motion.div>
                      ) : (
                        <Fingerprint className={`w-16 h-16 md:w-20 md:h-20 transition-all ${
                          biometricStatus === 'scanning' ? 'text-amber-400 animate-pulse' : 'text-emerald-400 group-hover:scale-110'
                        }`} />
                      )}
                    </motion.div>
                  </div>

                  {/* Status Message */}
                  <div className="space-y-2 max-w-sm">
                    {biometricStatus === 'scanning' ? (
                      <div className="space-y-1">
                        <p className="font-black text-amber-600 text-lg flex items-center justify-center gap-2">
                          <Scan className="w-5 h-5 animate-spin" />
                          جاري فحص القراءة البيومترية...
                        </p>
                        <p className="text-xs text-slate-400 font-bold">ضع بصمة إصبعك أو وجهك نحو مستشعر الجهاز</p>
                      </div>
                    ) : biometricStatus === 'success' ? (
                      <div className="space-y-1">
                        <p className="font-black text-emerald-600 text-lg">تمت مطابقة البصمة بنجاح! 🔓</p>
                        <p className="text-xs text-emerald-700 font-bold">مرحباً بك يا مسؤول المسابقة ({AUTHORIZED_ADMIN_EMAIL})</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="font-black text-slate-900 text-base">المصادقة ببصمة الإصبع / Touch ID</p>
                        <p className="text-xs text-slate-500 font-semibold">
                          اضغط على الدائرة أعلاه للتحقق المباشر عبر مستشعر هاتفك أو حاسوبك
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Biometric Start Button */}
                  <button
                    onClick={handleBiometricScan}
                    disabled={isScanningBiometric}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <Fingerprint className="w-5 h-5 text-white" />
                    <span>{isScanningBiometric ? 'جاري المسح الضوئي...' : 'بدء المسح البيومتري بالبصمة'}</span>
                  </button>
                </>
              ) : (
                /* Not Enrolled State */
                <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl text-right space-y-5 w-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Fingerprint className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base">البصمة غير مفعلة على هذا الجهاز حتى الآن</h4>
                      <p className="text-xs text-slate-500 font-bold mt-1 leading-relaxed">
                        لحماية حسابك، يلزم تفعيل البصمة لأول مرة لهذا الجهاز من داخل إعدادات الموقع بعد الدخول بحساب Google.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 space-y-2">
                    <p className="font-black text-slate-900 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-indigo-600" />
                      طريقة تفعيل البصمة على جهازك:
                    </p>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pr-1">
                      <li>سجّل الدخول بحساب Google المعتمد (<strong className="text-slate-900">{AUTHORIZED_ADMIN_EMAIL}</strong>).</li>
                      <li>افتح قائمة <strong>إعدادات التطبيق (⚙️)</strong> من أعلى الشاشة الرئيسية.</li>
                      <li>اضغط على زر <strong>تفعيل البصمة البيومترية لهذا الجهاز</strong> ليتم ربط بصمة هاتفك بالحساب.</li>
                    </ol>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { playSound?.('click'); setAuthMethod('google'); }}
                      className="flex-1 py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-indigo-400" />
                      <span>الانتقال لتسجيل الدخول بـ Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { playSound?.('click'); setAuthMethod('passcode'); }}
                      className="py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Key className="w-4 h-4 text-emerald-600" />
                      <span>الدخول برمز المرور</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Master Passcode Section */
            <form onSubmit={handlePasscodeSubmit} className="space-y-5 text-right">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-3xl space-y-2">
                <h5 className="font-black text-slate-800 text-sm flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-600" />
                  رمز المرور السري المباشر للمسؤول
                </h5>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  يتيح لك هذا الخيار الدخول الفوري للوحة التحكم في حال تعذر تسجيل الدخول بـ Google على منصات النشر الخارجية (GitHub Pages أو Netlify).
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 block">
                  أدخل الرمز السري للمسؤول:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => { setPasscode(e.target.value); setPasscodeError(null); }}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 rounded-2xl text-center text-xl font-mono tracking-widest outline-none transition-colors"
                    autoFocus
                  />
                  <Key className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {passcodeError && (
                  <p className="text-xs font-bold text-rose-600">{passcodeError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-5 h-5" />
                <span>التحقق وفتح لوحة التحكم</span>
              </button>
            </form>
          )}

          {/* Interactive Unauthorized Domain Guide Card */}
          {(isUnauthorizedDomain || (loginError && loginError.includes('Authorized Domains'))) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl text-right space-y-4 shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-amber-950 text-sm">كيفية تفعيل النطاق على Firebase (خطوة واحدة):</h4>
                  <p className="text-xs text-amber-800 font-semibold mt-1 leading-relaxed">
                    منصة Google تتطلب إضافة نطاق موقعك إلى قائمة <strong>Authorized Domains</strong> لكي يعمل تسجيل الدخول بـ Google على موقع النشر.
                  </p>
                </div>
              </div>

              {/* Current Domain Box with Copy Button */}
              <div className="p-3 bg-white rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCopyDomain}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
                >
                  {domainCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-800" />
                      <span>تم النسخ ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ النطاق</span>
                    </>
                  )}
                </button>
                <div className="text-left font-mono text-xs text-slate-800 font-bold overflow-x-auto truncate dir-ltr">
                  {currentHostname}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <a
                  href={`https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/authentication/settings`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all text-center"
                >
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  <span>فتح إعدادات النطاقات في Firebase Console</span>
                </a>
                
                <button
                  type="button"
                  onClick={() => { playSound?.('click'); setAuthMethod('passcode'); }}
                  className="py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-emerald-600" />
                  <span>أو ادخل برمز المرور فوراً</span>
                </button>
              </div>

              <div className="text-[11px] text-amber-900/80 font-bold space-y-1 bg-white/60 p-3 rounded-xl border border-amber-200/60">
                <p>1. اضغط على الزر الأسود أعلاه لفتح Firebase Console.</p>
                <p>2. ابحث عن قسم <strong>Authorized domains (النطاقات المصرح بها)</strong> واضغط <strong>Add domain</strong>.</p>
                <p>3. الصق النطاق المنسوخ (<code className="bg-amber-100 px-1 rounded font-mono">{currentHostname}</code>) ثم اضغط Done.</p>
              </div>
            </motion.div>
          )}

          {/* Error Message Display if not unauthorized domain */}
          {loginError && !isUnauthorizedDomain && !loginError.includes('Authorized Domains') && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl text-rose-700 text-xs font-black flex items-start gap-2.5 text-right shadow-sm"
            >
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </motion.div>
          )}
        </div>

        {/* Security Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between px-6 md:px-8 text-[11px] text-slate-400 font-extrabold flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>نظام الحماية والأمان العالي (Strict OAuth Guard)</span>
          </div>
          <span className="text-slate-600 font-black">{AUTHORIZED_ADMIN_EMAIL}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAuthModal;
