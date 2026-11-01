import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  Laptop, 
  Compass, 
  ChevronDown, 
  Menu, 
  X,
  ExternalLink,
  Sparkles,
  History,
  Database
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  view: 'home' | 'dashboard';
  setView: (view: 'home' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  activeTab,
  setActiveTab,
  view,
  setView,
}) => {
  const { user, profile, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabClick = (tabId: string) => {
    setView('dashboard');
    setActiveTab(tabId);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    setView('home');
  };

  const avatarSrc = profile?.photoURL || user?.photoURL;
  const initial = (profile?.displayName || user?.displayName || user?.email || 'F')[0].toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView(user ? 'dashboard' : 'home')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2478F2] to-[#4F95FF] flex items-center justify-center text-white shadow-md shadow-[#2478F2]/25 group-hover:scale-105 transition-transform duration-200">
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 6.5C4 5.67157 4.67157 5 5.5 5H18.5C19.3284 5 20 5.67157 20 6.5C20 7.32843 19.3284 8 18.5 8H5.5C4.67157 8 4 7.32843 4 6.5ZM4 12C4 11.1716 4.67157 10.5 5.5 10.5H14.5C15.3284 10.5 16 11.1716 16 12C16 12.8284 15.3284 13.5 14.5 13.5H5.5C4.67157 13.5 4 12.8284 4 12ZM4 17.5C4 16.6716 4.67157 16 5.5 16H18.5C19.3284 16 20 16.6716 20 17.5C20 18.3284 19.3284 19 18.5 19H5.5C4.67157 19 4 18.3284 4 17.5Z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-[#2478F2] transition-colors">
                    Flow Hesap
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#2478F2] border border-blue-100">
                    flowaccount.netlify.app
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                  Tek hesap, tüm Flow hizmetleri.
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setView('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                view === 'home'
                  ? 'text-[#2478F2] bg-blue-50/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Ana Sayfa
            </button>

            {user && (
              <>
                <button
                  onClick={() => {
                    setView('dashboard');
                    setActiveTab('overview');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    view === 'dashboard' && activeTab === 'overview'
                      ? 'text-[#2478F2] bg-blue-50/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  Hesap Paneli
                </button>
                <button
                  onClick={() => {
                    setView('dashboard');
                    setActiveTab('security');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    view === 'dashboard' && activeTab === 'security'
                      ? 'text-[#2478F2] bg-blue-50/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  Güvenlik
                </button>
                <button
                  onClick={() => {
                    setView('dashboard');
                    setActiveTab('devices');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    view === 'dashboard' && activeTab === 'devices'
                      ? 'text-[#2478F2] bg-blue-50/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  Cihazlar
                </button>
                <button
                  onClick={() => {
                    setView('dashboard');
                    setActiveTab('flowbrowser');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    view === 'dashboard' && activeTab === 'flowbrowser'
                      ? 'text-[#2478F2] bg-blue-50/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#2478F2]" />
                  FlowBrowser
                </button>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {!user ? (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#2478F2] hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer"
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#2478F2] hover:bg-[#1f6bd9] active:scale-95 shadow-sm shadow-[#2478F2]/30 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Hesap Oluştur</span>
                </button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all cursor-pointer"
                >
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={profile?.displayName || 'Profil'}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#2478F2]/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2478F2] to-[#60A5FA] text-white flex items-center justify-center font-bold text-sm">
                      {initial}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight max-w-[120px] truncate">
                      {profile?.displayName || user.displayName || 'Flow Kullanıcısı'}
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-[120px] truncate">
                      @{profile?.username || 'flow'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-200/80 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {profile?.displayName || user.displayName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleTabClick('overview')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50/60 hover:text-[#2478F2] flex items-center gap-2.5 transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>Hesap Özeti</span>
                      </button>

                      <button
                        onClick={() => handleTabClick('personal')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50/60 hover:text-[#2478F2] flex items-center gap-2.5 transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>Kişisel Bilgiler</span>
                      </button>

                      <button
                        onClick={() => handleTabClick('security')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50/60 hover:text-[#2478F2] flex items-center gap-2.5 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Güvenlik Ayarları</span>
                      </button>

                      <button
                        onClick={() => handleTabClick('history')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50/60 hover:text-[#2478F2] flex items-center gap-2.5 transition-colors"
                      >
                        <History className="w-4 h-4 text-emerald-600" />
                        <span>Güvenlik Geçmişi</span>
                      </button>

                      <button
                        onClick={() => handleTabClick('privacy')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50/60 hover:text-[#2478F2] flex items-center gap-2.5 transition-colors"
                      >
                        <Database className="w-4 h-4 text-purple-600" />
                        <span>Veri ve Gizlilik</span>
                      </button>

                      <button
                        onClick={() => handleTabClick('devices')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50/60 hover:text-[#2478F2] flex items-center gap-2.5 transition-colors"
                      >
                        <Laptop className="w-4 h-4" />
                        <span>Bağlı Cihazlar</span>
                      </button>

                      <button
                        onClick={() => handleTabClick('flowbrowser')}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50/60 hover:text-[#2478F2] flex items-center gap-2.5 transition-colors"
                      >
                        <Compass className="w-4 h-4 text-[#2478F2]" />
                        <span>FlowBrowser & OAuth</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Çıkış Yap</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-2">
          <button
            onClick={() => {
              setView('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#2478F2]"
          >
            Ana Sayfa
          </button>
          {user ? (
            <>
              <button
                onClick={() => handleTabClick('overview')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#2478F2]"
              >
                Hesap Özeti
              </button>
              <button
                onClick={() => handleTabClick('personal')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#2478F2]"
              >
                Kişisel Bilgiler
              </button>
              <button
                onClick={() => handleTabClick('security')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#2478F2]"
              >
                Güvenlik Ayarları
              </button>
              <button
                onClick={() => handleTabClick('history')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#2478F2] flex items-center justify-between"
              >
                <span>Güvenlik Geçmişi</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Yeni</span>
              </button>
              <button
                onClick={() => handleTabClick('privacy')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#2478F2]"
              >
                Veri ve Gizlilik
              </button>
              <button
                onClick={() => handleTabClick('devices')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#2478F2]"
              >
                Bağlı Cihazlar
              </button>
              <button
                onClick={() => handleTabClick('flowbrowser')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#2478F2]"
              >
                FlowBrowser Entegrasyonu
              </button>
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Çıkış Yap
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full py-2.5 text-center font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('register');
                }}
                className="w-full py-2.5 text-center font-semibold text-white bg-[#2478F2] rounded-xl shadow-md shadow-[#2478F2]/25"
              >
                Hesap Oluştur
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
