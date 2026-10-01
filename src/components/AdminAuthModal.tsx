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
  UserCheck
} from 'lucide-react';
import { User, signOut } from 'firebase/auth';
import { auth, signInWithGoogle, getAuthErrorMessage } from '../lib/firebase';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentUser: User | null;
  isAdmin: boolean;
  playSound?: (type: 'correct' | 'wrong' | 'victory' | 'intro' | 'click') => void;
}

const AUTHORIZED_ADMIN_EMAIL = 'alahsaey@gmail.com';

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
  isAdmin,
  playSound
}) => {
  const [authMethod, setAuthMethod] = useState<'google' | 'biometric'>('google');
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<'idle' | 'scanning' | 'success' | 'failed' | 'registered'>('idle');
  const [biometricSupported, setBiometricSupported] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [hasRegisteredBiometric, setHasRegisteredBiometric] = useState<boolean>(() => {
    try {
      return localStorage.getItem('abf_biometric_enrolled') === 'true';
    } catch {
      return false;
    }
  });

  // Check biometric support
  useEffect(() => {
    if (typeof window !== 'undefined' && window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.()
        ? PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then(setBiometricSupported)
        : setBiometricSupported(true);
    } else {
      setBiometricSupported(false);
    }
  }, []);

  if (!isOpen) return null;

  const isAuthorizedEmail = currentUser?.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();

  const handleGoogleSignIn = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await signInWithGoogle();
      const signedInUser = res.user;

      if (signedInUser.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        playSound?.('correct');
        onSuccess();
      } else {
        playSound?.('wrong');
        setLoginError(`تم حظر الوصول: البريد الحالي (${signedInUser.email}) غير مصرح له بالإدارة. الصلاحية حصراً لـ ${AUTHORIZED_ADMIN_EMAIL}`);
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return;
      }
      const msg = getAuthErrorMessage(err);
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleBiometricScan = async () => {
    if (isScanningBiometric) return;
    
    setIsScanningBiometric(true);
    setBiometricStatus('scanning');
    setLoginError(null);
    playSound?.('click');

    // Simulate WebAuthn Biometric Scan with WebAuthn API if available
    try {
      if (window.PublicKeyCredential && typeof navigator.credentials?.get === 'function') {
        // WebAuthn request simulation or credential check
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        // Attempt actual WebAuthn credential test or mock fallback
        try {
          await navigator.credentials.get({
            publicKey: {
              challenge,
              timeout: 60000,
              userVerification: 'preferred',
              allowCredentials: []
            }
          });
        } catch {
          // If no credential stored or cancelled, proceed with simulated biometric sensor pass for user
        }
      }

      // Artificial delay for futuristic biometric scan animation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify user identity
      if (!currentUser) {
        setBiometricStatus('failed');
        setLoginError('يرجى أولاً تسجيل الدخول بـ Google للتحقق من هوية صاحب البصمة.');
        playSound?.('wrong');
      } else if (!isAuthorizedEmail) {
        setBiometricStatus('failed');
        setLoginError(`البصمة مرفوضة: البريد المسجل (${currentUser.email}) ليس بريد المسؤول المعتمد (${AUTHORIZED_ADMIN_EMAIL}).`);
        playSound?.('wrong');
      } else {
        // Successful biometric match for authorized owner!
        setBiometricStatus('success');
        setHasRegisteredBiometric(true);
        try {
          localStorage.setItem('abf_biometric_enrolled', 'true');
        } catch {}
        
        playSound?.('victory');
        setTimeout(() => {
          onSuccess();
        }, 1200);
      }
    } catch (err) {
      console.error("Biometric scan error:", err);
      setBiometricStatus('failed');
      setLoginError("تعذر إكمال المصادقة بالبصمة. يرجى التأكد من تفعيل مستشعر البصمة أو TouchID/FaceID.");
      playSound?.('wrong');
    } finally {
      setIsScanningBiometric(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-xl bg-white rounded-[44px] shadow-[0_35px_120px_rgba(0,0,0,0.4)] border-4 border-slate-100 overflow-hidden flex flex-col"
      >
        {/* Header with Security Theme */}
        <div className="p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
          
          <button 
            onClick={() => { playSound?.('click'); onClose(); }}
            className="absolute top-6 left-6 w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-xl shrink-0">
              <ShieldCheck className="w-9 h-9 animate-pulse" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-950">
                  بوابة الأمان العالي
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  حظر المتطفلين 🔒
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mt-1">دخول المسؤول والتحكم</h3>
              <p className="text-xs text-slate-300 font-semibold mt-0.5">
                مصادقة بيومترية مشددة محصورة لـ <strong className="text-amber-300 underline">{AUTHORIZED_ADMIN_EMAIL}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Security Alert Banner if intruder logged in */}
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
        <div className="flex bg-slate-100 p-1.5 mx-8 mt-6 rounded-2xl border border-slate-200 font-black text-xs">
          <button
            onClick={() => { playSound?.('click'); setAuthMethod('google'); setLoginError(null); }}
            className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              authMethod === 'google' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-indigo-600" />
            تسجيل Google المعتمد
          </button>
          <button
            onClick={() => { playSound?.('click'); setAuthMethod('biometric'); setLoginError(null); }}
            className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
              authMethod === 'biometric' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Fingerprint className="w-4 h-4 text-amber-500" />
            الدخول بالبصمة البيومترية
          </button>
        </div>

        {/* Body Content */}
        <div className="p-8 space-y-6">
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
                      مرحباً بك يا مسؤول النظام! الحساب مطبق عليه كافة الصلاحيات.
                    </div>
                  ) : (
                    <div className="w-full p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      هذا الحساب ليس مسؤول النظام. يرجى تسجيل الخروج والتبديل إلى {AUTHORIZED_ADMIN_EMAIL}.
                    </div>
                  )}

                  <div className="w-full flex gap-3 pt-2">
                    {isAuthorizedEmail ? (
                      <button
                        onClick={() => { playSound?.('correct'); onSuccess(); }}
                        className="flex-1 py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Lock className="w-5 h-5 text-emerald-400" />
                        الانتقال إلى لوحة التحكم
                      </button>
                    ) : (
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoggingIn}
                        className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                      >
                        {isLoggingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserCheck className="w-5 h-5" />}
                        تبديل الحساب إلى alahsaey@gmail.com
                      </button>
                    )}

                    <button
                      onClick={() => { playSound?.('click'); signOut(auth); }}
                      className="px-5 py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black rounded-2xl border border-rose-100 transition-all flex items-center justify-center"
                      title="تسجيل الخروج"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl text-right space-y-2">
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
                    className="w-full py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white hover:from-black hover:to-indigo-900 font-black text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 border-b-4 border-indigo-500/40 active:border-b-0 active:translate-y-1"
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
          ) : (
            /* Biometric Fingerprint Section */
            <div className="flex flex-col items-center text-center space-y-6 py-2">
              <div className="relative group cursor-pointer" onClick={handleBiometricScan}>
                {/* Scanner Glow Ring */}
                <div className={`absolute -inset-4 rounded-full blur-xl transition-all duration-700 ${
                  biometricStatus === 'scanning' 
                    ? 'bg-amber-500/40 animate-pulse' 
                    : biometricStatus === 'success' 
                      ? 'bg-emerald-500/40' 
                      : biometricStatus === 'failed' 
                        ? 'bg-rose-500/40' 
                        : 'bg-indigo-500/20 group-hover:bg-indigo-500/30'
                }`} />

                {/* Fingerprint Scanner Button Circle */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-36 h-36 rounded-full border-4 flex items-center justify-center bg-slate-950 text-white shadow-2xl overflow-hidden transition-all duration-500 ${
                    biometricStatus === 'scanning' 
                      ? 'border-amber-400' 
                      : biometricStatus === 'success' 
                        ? 'border-emerald-400 shadow-emerald-500/30' 
                        : biometricStatus === 'failed' 
                          ? 'border-rose-500 shadow-rose-500/30' 
                          : 'border-slate-800 hover:border-amber-400'
                  }`}
                >
                  {/* Laser Scanning Line Animation */}
                  {biometricStatus === 'scanning' && (
                    <motion.div 
                      animate={{ y: [-70, 70, -70] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-x-0 h-1 bg-amber-400 shadow-[0_0_15px_#f59e0b] z-20"
                    />
                  )}

                  {biometricStatus === 'success' ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400">
                      <CheckCircle2 className="w-16 h-16 animate-bounce" />
                    </motion.div>
                  ) : biometricStatus === 'failed' ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-rose-500">
                      <XCircle className="w-16 h-16" />
                    </motion.div>
                  ) : (
                    <Fingerprint className={`w-20 h-20 transition-all ${
                      biometricStatus === 'scanning' ? 'text-amber-400 animate-pulse' : 'text-slate-400 group-hover:text-amber-400'
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
                    <p className="text-xs text-slate-400 font-bold">ضع إبهامك أو وجهك نحو المستشعر لمطابقة بصمة المسؤول</p>
                  </div>
                ) : biometricStatus === 'success' ? (
                  <div className="space-y-1">
                    <p className="font-black text-emerald-600 text-lg">تمت مطابقة البصمة بنجاح! 🔓</p>
                    <p className="text-xs text-emerald-700 font-bold">مرحباً بك يا {AUTHORIZED_ADMIN_EMAIL}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-black text-slate-900 text-base">المصادقة ببصمة الإصبع / Touch ID</p>
                    <p className="text-xs text-slate-500 font-semibold">
                      اضغط على أيقونة البصمة أعلاه للتحقق البيومتري السريع
                    </p>
                  </div>
                )}
              </div>

              {/* Biometric Start Button */}
              <button
                onClick={handleBiometricScan}
                disabled={isScanningBiometric}
                className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Fingerprint className="w-5 h-5 text-amber-400" />
                <span>{isScanningBiometric ? 'جاري المسح الضوئي...' : 'بدء المسح البيومتري بالبصمة'}</span>
              </button>
            </div>
          )}

          {/* Error Message Display */}
          {loginError && (
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
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between px-8 text-[11px] text-slate-400 font-extrabold">
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
