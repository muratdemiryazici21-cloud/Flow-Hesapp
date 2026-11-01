import React from 'react';
import { ShieldCheck, Lock, Globe, Server } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2478F2] flex items-center justify-center text-white font-bold">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M4 6.5C4 5.67157 4.67157 5 5.5 5H18.5C19.3284 5 20 5.67157 20 6.5C20 7.32843 19.3284 8 18.5 8H5.5C4.67157 8 4 7.32843 4 6.5ZM4 12C4 11.1716 4.67157 10.5 5.5 10.5H14.5C15.3284 10.5 16 11.1716 16 12C16 12.8284 15.3284 13.5 14.5 13.5H5.5C4.67157 13.5 4 12.8284 4 12ZM4 17.5C4 16.6716 4.67157 16 5.5 16H18.5C19.3284 16 20 16.6716 20 17.5C20 18.3284 19.3284 19 18.5 19H5.5C4.67157 19 4 18.3284 4 17.5Z" />
                </svg>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">Flow Hesap</span>
            </div>
            <p className="text-slate-300 font-medium">Tek hesap, tüm Flow hizmetleri.</p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Flow ekosisteminin ortak kimlik ve güvenlik omurgası. FlowBrowser, FlowSearch, FlowMusic ve FlowDrive deneyimlerinizi güvenle birbirine bağlar.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                <Globe className="w-3.5 h-3.5 text-[#2478F2]" />
                flowaccount.netlify.app
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Tüm Sistemler Aktif
              </span>
            </div>
          </div>

          {/* Ecosystem Apps */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Flow Ekosistemi
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <span className="text-slate-300 hover:text-white transition-colors cursor-default">
                  FlowBrowser
                </span>
              </li>
              <li>
                <a
                  href="https://flow-search.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span className="group-hover:text-emerald-400 transition-colors">FlowSearch</span>
                  <span className="text-[10px] text-slate-500 font-mono group-hover:text-slate-400">flow-search ↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://flowmusic-app.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span className="group-hover:text-pink-400 transition-colors">FlowMusic</span>
                  <span className="text-[10px] text-slate-500 font-mono group-hover:text-slate-400">flowmusic-app ↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://flow-drive.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span className="group-hover:text-purple-400 transition-colors">FlowDrive</span>
                  <span className="text-[10px] text-slate-500 font-mono group-hover:text-slate-400">flow-drive ↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Security & Standards */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4">
              Güvenlik ve Standartlar
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#2478F2]" />
                <span>OAuth 2.0 / OIDC Uyumluluğu</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>AES-256 Uçtan Uca Şifreleme</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Server className="w-4 h-4 text-purple-400" />
                <span>Bulut Firestore Koruması</span>
              </li>
              <li className="pt-2 text-xs text-slate-500">
                Gizlilik Sözleşmesi • Kullanım Koşulları • KVKK Uyumlu
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Flow Hesap. Tüm hakları saklıdır.</p>
          <p>
            <span>Netlify Edge Dağıtımı</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
