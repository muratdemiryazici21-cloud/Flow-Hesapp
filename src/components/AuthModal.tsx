import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTurkishAuthErrorMessage } from '../utils/turkishAuthErrors';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  AtSign, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  Loader2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const { signUpWithEmail, signInWithEmail, signInWithGoogle, sendPasswordReset } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  if (!isOpen) return null;

  const resetFormState = () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(false);
  };

  const handleModeChange = (newMode: 'login' | 'register' | 'forgot') => {
    resetFormState();
    setMode(newMode);
  };

  // Password strength calculation (0 to 4)
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'register') {
      if (!displayName.trim()) {
        setError('Lütfen ad ve soyadınızı girin.');
        return;
      }
      if (!username.trim()) {
        setError('Lütfen bir kullanıcı adı belirleyin.');
        return;
      }
      if (username.length < 3) {
        setError('Kullanıcı adı en az 3 karakter olmalıdır.');
        return;
      }
      if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
        setError('Kullanıcı adı yalnızca harf, rakam, nokta ve alt çizgi içerebilir.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Lütfen geçerli bir e-posta adresi girin.');
        return;
      }
      if (password.length < 6) {
        setError('Şifreniz en az 6 karakter olmalıdır.');
        return;
      }
      if (password !== passwordConfirm) {
        setError('Girdiğiniz şifreler eşleşmiyor.');
        return;
      }
      if (!termsAccepted) {
        setError('Devam etmek için Flow Hizmet Şartlarını onaylamalısınız.');
        return;
      }

      setLoading(true);
      try {
        await signUpWithEmail(email, password, displayName, username);
        setSuccessMessage('Hesabınız başarıyla oluşturuldu! E-posta adresinize doğrulama bağlantısı gönderildi.');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1800);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(getTurkishAuthErrorMessage(msg));
      } finally {
        setLoading(false);
      }
    } else if (mode === 'login') {
      if (!email.trim() || !password) {
        setError('Lütfen e-posta adresinizi ve şifrenizi girin.');
        return;
      }

      setLoading(true);
      try {
        await signInWithEmail(email, password);
        if (onSuccess) onSuccess();
        onClose();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(getTurkishAuthErrorMessage(msg));
      } finally {
        setLoading(false);
      }
    } else if (mode === 'forgot') {
      if (!email.trim() || !email.includes('@')) {
        setError('Lütfen geçerli bir e-posta adresi girin.');
        return;
      }

      setLoading(true);
      try {
        await sendPasswordReset(email);
        setSuccessMessage('Şifre sıfırlama bağlantısı e-posta adresinize iletildi. Lütfen gelen kutunuzu kontrol edin.');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(getTurkishAuthErrorMessage(msg));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(getTurkishAuthErrorMessage(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header accent strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#2478F2] via-[#4F95FF] to-[#60A5FA]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Logo & Heading */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#2478F2] text-white flex items-center justify-center mx-auto shadow-md shadow-[#2478F2]/30 mb-3">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M4 6.5C4 5.67157 4.67157 5 5.5 5H18.5C19.3284 5 20 5.67157 20 6.5C20 7.32843 19.3284 8 18.5 8H5.5C4.67157 8 4 7.32843 4 6.5ZM4 12C4 11.1716 4.67157 10.5 5.5 10.5H14.5C15.3284 10.5 16 11.1716 16 12C16 12.8284 15.3284 13.5 14.5 13.5H5.5C4.67157 13.5 4 12.8284 4 12ZM4 17.5C4 16.6716 4.67157 16 5.5 16H18.5C19.3284 16 20 16.6716 20 17.5C20 18.3284 19.3284 19 18.5 19H5.5C4.67157 19 4 18.3284 4 17.5Z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {mode === 'login' && 'Flow Hesabınıza Giriş Yapın'}
              {mode === 'register' && 'Flow Hesabı Oluşturun'}
              {mode === 'forgot' && 'Şifrenizi Sıfırlayın'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              {mode === 'forgot'
                ? 'E-posta adresinizi girin, sıfırlama bağlantısı gönderelim.'
                : 'Tek hesapla Flow ekosistemindeki tüm uygulamalara bağlanın.'}
            </p>
            {mode === 'forgot' && (
              <p className="mt-3 p-3 rounded-xl bg-blue-50/80 text-blue-800 text-xs font-medium leading-relaxed border border-blue-100">
                Şifre sıfırlama bağlantınız e-posta adresinize gönderildiyse gelen kutunuzu kontrol edin. E-postayı göremiyorsanız Spam klasörünü de kontrol etmeyi unutmayın.
              </p>
            )}
          </div>

          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' && (
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('register')}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Hesap Oluştur
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-rose-700 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ad ve Soyad
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Ahmet Yılmaz"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-[#2478F2] focus:ring-2 focus:ring-[#2478F2]/20 rounded-xl text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kullanıcı Adı <span className="text-slate-400 font-normal">(@benzersiz)</span>
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="ahmetyilmaz"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9._-]/g, ''))}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-[#2478F2] focus:ring-2 focus:ring-[#2478F2]/20 rounded-xl text-sm outline-none transition-all font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="ornek@flow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-[#2478F2] focus:ring-2 focus:ring-[#2478F2]/20 rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Şifre
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => handleModeChange('forgot')}
                      className="text-xs text-[#2478F2] hover:underline font-semibold"
                    >
                      Şifremi unuttum?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-[#2478F2] focus:ring-2 focus:ring-[#2478F2]/20 rounded-xl text-sm outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength bar in register mode */}
                {mode === 'register' && password.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex gap-1 h-1.5">
                      <div className={`flex-1 rounded-full transition-colors ${strength >= 1 ? 'bg-rose-500' : 'bg-slate-200'}`} />
                      <div className={`flex-1 rounded-full transition-colors ${strength >= 2 ? 'bg-amber-500' : 'bg-slate-200'}`} />
                      <div className={`flex-1 rounded-full transition-colors ${strength >= 3 ? 'bg-blue-500' : 'bg-slate-200'}`} />
                      <div className={`flex-1 rounded-full transition-colors ${strength >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {strength <= 1 && 'Zayıf şifre'}
                      {strength === 2 && 'Orta düzey şifre'}
                      {strength === 3 && 'İyi şifre'}
                      {strength >= 4 && 'Çok güçlü şifre'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {mode === 'register' && (
              <>
                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Şifre Tekrar
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-[#2478F2] focus:ring-2 focus:ring-[#2478F2]/20 rounded-xl text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Terms agreement */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 rounded text-[#2478F2] focus:ring-[#2478F2]"
                  />
                  <label htmlFor="terms" className="text-xs text-slate-600 leading-tight">
                    <span className="font-semibold text-slate-900">Flow Hesap Sözleşmesi</span> ve Gizlilik Politikası'nı okudum, kabul ediyorum.
                  </label>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-[#2478F2] hover:bg-[#1f6bd9] active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-[#2478F2]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>İşlem yapılıyor...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Giriş Yap'}
                    {mode === 'register' && 'Flow Hesabı Oluştur'}
                    {mode === 'forgot' && 'Sıfırlama Bağlantısı Gönder'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Google Sign In option */}
          {mode !== 'forgot' && (
            <>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-semibold">veya</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm cursor-pointer disabled:opacity-70"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-xs sm:text-sm">Google ile Devam Et</span>
              </button>
            </>
          )}

          {/* Footer Back Link in Forgot mode */}
          {mode === 'forgot' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="text-xs text-[#2478F2] hover:underline font-semibold"
              >
                ← Giriş ekranına geri dön
              </button>
            </div>
          )}

          {/* Security note */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-bit SSL ve Firebase Güvenli Kimlik Doğrulama</span>
          </div>
        </div>
      </div>
    </div>
  );
};
