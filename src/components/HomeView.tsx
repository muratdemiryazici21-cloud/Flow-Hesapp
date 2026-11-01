import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ECOSYSTEM_APPS } from '../data/ecosystemApps';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Laptop, 
  Key, 
  RefreshCw, 
  ExternalLink,
  Layers,
  ChevronRight,
  Globe,
  Lock,
  Compass
} from 'lucide-react';

interface HomeViewProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onGoToDashboard: (tab?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenAuth, onGoToDashboard }) => {
  const { user, profile } = useAuth();
  const [selectedAppId, setSelectedAppId] = useState<string>('FlowBrowser');

  const selectedApp = ECOSYSTEM_APPS.find((a) => a.id === selectedAppId) || ECOSYSTEM_APPS[0];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#2478F2]/15 via-blue-400/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Ecosystem Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#2478F2] text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#2478F2] animate-pulse"></span>
            <span>Flow Ekosistemi Ortak Kimlik Platformu</span>
          </div>

          {/* Slogan */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Tek hesap, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2478F2] via-[#3384f5] to-[#5196f7]">
              tüm Flow hizmetleri.
            </span>
          </h1>

          {/* Short Intro */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            FlowBrowser, FlowSearch, FlowMusic ve FlowDrive için tek ve güvenli hesap yönetimi.
            Parolalarınız, ayarlarınız ve verileriniz tüm cihazlarınızda anında senkronize olur.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            {!user ? (
              <>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#2478F2] hover:bg-[#1b6cdb] active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-[#2478F2]/25 flex items-center justify-center gap-2.5 transition-all text-base cursor-pointer"
                >
                  <span>Flow Hesabı Oluştur</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-2xl shadow-xs transition-all text-base cursor-pointer"
                >
                  Giriş Yap
                </button>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => onGoToDashboard('overview')}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#2478F2] hover:bg-[#1b6cdb] text-white font-bold rounded-2xl shadow-lg shadow-[#2478F2]/25 flex items-center justify-center gap-2.5 transition-all text-base cursor-pointer"
                >
                  <span>Hesap Paneline Git ({profile?.displayName || user.displayName || 'Profil'})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onGoToDashboard('flowbrowser')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-blue-50 text-[#2478F2] hover:bg-blue-100/70 font-semibold rounded-2xl transition-all text-base cursor-pointer flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>FlowBrowser Eşitle</span>
                </button>
              </div>
            )}
          </div>

          {/* Live Platform Stats */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xl font-black text-slate-900">4</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Flow Uygulaması</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xl font-black text-[#2478F2]">OAuth 2.0</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">OIDC Standartları</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xl font-black text-emerald-600">%99.9</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Uptime Güvencesi</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <p className="text-2xl font-black text-slate-900">Uçtan Uca</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">AES-256 Şifreleme</p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Applications Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Desteklenen Flow Uygulamaları
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Oluşturacağınız tek bir Flow Hesabı ile aşağıdaki tüm uygulamalara anında ve güvenle erişebilirsiniz.
          </p>
        </div>

        {/* App Switcher Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {ECOSYSTEM_APPS.map((app) => {
            const isActive = app.id === selectedAppId;
            return (
              <button
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#2478F2] text-white shadow-md shadow-[#2478F2]/25 scale-105'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <span>{app.name}</span>
                {app.id === 'FlowBrowser' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-[#2478F2]'}`}>
                    Öne Çıkan
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active App Detailed Showcase Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
            {/* Left Column: Info & Sync Items */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                  style={{ backgroundColor: selectedApp.color }}
                >
                  {selectedApp.name.substring(4, 5) || 'F'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedApp.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {selectedApp.category}
                  </p>
                </div>
              </div>

              <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
                "{selectedApp.tagline}"
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedApp.description}
              </p>

              {/* Sync Features */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Flow Hesap İle Neler Eşitlenir?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedApp.syncFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-medium text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#2478F2] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protocol or action */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {selectedApp.url && (
                  <a
                    href={selectedApp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
                  >
                    <span>{selectedApp.name} Uygulamasını Aç</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  </a>
                )}
                {selectedApp.protocol ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-mono text-[#2478F2]">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Entegrasyon: {selectedApp.protocol}</span>
                  </div>
                ) : null}
                <button
                  onClick={() => {
                    if (user) {
                      onGoToDashboard(selectedApp.id === 'FlowBrowser' ? 'flowbrowser' : 'overview');
                    } else {
                      onOpenAuth('register');
                    }
                  }}
                  className="text-xs sm:text-sm font-bold text-[#2478F2] hover:text-[#1961cb] flex items-center gap-1.5 group cursor-pointer"
                >
                  <span>Hesap Eşitleme Ayarları</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Ecosystem Visual */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-inner relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  flow-sync.live
                </span>
              </div>

              <div className="py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Bağlantı Durumu</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Eşitlenmeye Hazır
                  </span>
                </div>

                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">{selectedApp.name} İstemcisi</span>
                    <span className="text-[#2478F2] font-mono">OAuth 2.0</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: '100%', backgroundColor: selectedApp.color }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Token: flw_auth_{selectedApp.name.toLowerCase()}_active
                  </p>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                  <p className="text-slate-500">// Canlı Entegrasyon Bilgisi</p>
                  {selectedApp.url && (
                    <p className="text-emerald-400">● URL: {selectedApp.url.replace('https://', '')}</p>
                  )}
                  {selectedApp.protocol && (
                    <p className="text-sky-400">● Protokol: {selectedApp.protocol}</p>
                  )}
                  <p className="text-blue-400">✓ Zero-Knowledge Token: Aktif</p>
                  <p className="text-slate-300">✓ Şifreler Asla Aktarılmaz</p>
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-400">
                  Flow Hesap Veritabanı ile 7/24 Kesintisiz Eşitleme
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special FlowBrowser Integration Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-600 via-[#2478F2] to-[#1258c7] rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-[#2478F2]/20 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>Resmi Tarayıcı Entegrasyonu</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              FlowBrowser ve Flow Hesap Uyumu
            </h2>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              FlowBrowser içerisindeki <code className="bg-black/30 px-2 py-0.5 rounded text-yellow-300 font-mono">flowbrowser://account</code> adresi 
              doğrudan ortak Flow Hesap sistemimize bağlanır. Parolalarınızı ve kişisel bilgilerinizi tarayıcıya veya URL parametrelerine sızdırmadan 
              OAuth 2.0 / OpenID Connect tabanlı güvenli bir token yetkilendirme akışı kullanılır.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <Key className="w-6 h-6 text-yellow-300 mb-2" />
                <h4 className="font-bold text-sm">Şifresiz Yetkilendirme</h4>
                <p className="text-xs text-blue-100 mt-1">Parola URL'de veya bellekte saklanmaz.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <RefreshCw className="w-6 h-6 text-emerald-300 mb-2" />
                <h4 className="font-bold text-sm">Anlık Sekme Senkronu</h4>
                <p className="text-xs text-blue-100 mt-1">Bilgisayarda başladığınızı mobilde sürdürün.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <ShieldCheck className="w-6 h-6 text-sky-200 mb-2" />
                <h4 className="font-bold text-sm">Tek Tıkla Erişim İptali</h4>
                <p className="text-xs text-blue-100 mt-1">İstediğiniz an yetkiyi panelden geri alın.</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  if (user) {
                    onGoToDashboard('flowbrowser');
                  } else {
                    onOpenAuth('login');
                  }
                }}
                className="px-6 py-3 bg-white text-[#2478F2] hover:bg-blue-50 font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>FlowBrowser Eşitleme Portalını Aç</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Security Architecture Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Güvenlik ve Gizlilik Mimarisi
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Verileriniz ticari bir ürün değildir. Flow ekosisteminde gizlilik bir özellik değil, temel bir haktır.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2478F2] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">E-posta ve Kimlik Doğrulama</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Her yeni Flow hesabı e-posta doğrulama döngüsünden geçer. Aynı e-posta adresiyle birden fazla hesap açılamaz.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Düz Metin Şifre Yok</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Şifreleriniz sunucularda veya veritabanında asla düz metin olarak barındırılmaz. Uçtan uca şifreleme ve Firebase Security Rules ile korunur.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tam Cihaz ve Oturum Kontrolü</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Windows, Android ve diğer bağlı cihazlarınızı görüntüleyebilir; şüpheli durumlarda tüm diğer oturumları tek tıkla sonlandırabilirsiniz.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
