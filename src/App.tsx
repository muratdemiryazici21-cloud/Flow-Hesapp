/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { FlowBrowserAuthorize } from './components/FlowBrowserAuthorize';
import { Loader2 } from 'lucide-react';

function MainLayout() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<'home' | 'dashboard' | 'authorize'>('home');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Initialize view and tab from initial window.location.pathname on mount
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/flowbrowser/authorize')) {
      setView('authorize');
    } else if (path === '/login') {
      setView('home');
      setAuthMode('login');
      setAuthModalOpen(true);
    } else if (path === '/register') {
      setView('home');
      setAuthMode('register');
      setAuthModalOpen(true);
    } else if (path === '/forgot-password') {
      setView('home');
      setAuthMode('forgot');
      setAuthModalOpen(true);
    } else if (path === '/dashboard') {
      setView('dashboard');
      setActiveTab('overview');
    } else if (path === '/profile') {
      setView('dashboard');
      setActiveTab('personal');
    } else if (path === '/security' || path === '/verify-email') {
      setView('dashboard');
      setActiveTab('security');
    } else if (path === '/devices') {
      setView('dashboard');
      setActiveTab('devices');
    } else if (path === '/settings') {
      setView('dashboard');
      setActiveTab('privacy');
    } else {
      setView('home');
    }

    // Handle browser popstate (back/forward buttons)
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p.startsWith('/flowbrowser/authorize')) {
        setView('authorize');
      } else if (p === '/login') {
        setView('home');
        setAuthMode('login');
        setAuthModalOpen(true);
      } else if (p === '/register') {
        setView('home');
        setAuthMode('register');
        setAuthModalOpen(true);
      } else if (p === '/forgot-password') {
        setView('home');
        setAuthMode('forgot');
        setAuthModalOpen(true);
      } else if (p === '/dashboard') {
        setView('dashboard');
        setActiveTab('overview');
        setAuthModalOpen(false);
      } else if (p === '/profile') {
        setView('dashboard');
        setActiveTab('personal');
        setAuthModalOpen(false);
      } else if (p === '/security' || p === '/verify-email') {
        setView('dashboard');
        setActiveTab('security');
        setAuthModalOpen(false);
      } else if (p === '/devices') {
        setView('dashboard');
        setActiveTab('devices');
        setAuthModalOpen(false);
      } else if (p === '/settings') {
        setView('dashboard');
        setActiveTab('privacy');
        setAuthModalOpen(false);
      } else {
        setView('home');
        setAuthModalOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL pathname when view, activeTab, authModalOpen, or authMode changes
  useEffect(() => {
    let targetPath = '/';
    if (authModalOpen) {
      if (authMode === 'login') targetPath = '/login';
      else if (authMode === 'register') targetPath = '/register';
      else if (authMode === 'forgot') targetPath = '/forgot-password';
    } else if (view === 'dashboard') {
      if (activeTab === 'overview') targetPath = '/dashboard';
      else if (activeTab === 'personal') targetPath = '/profile';
      else if (activeTab === 'security') targetPath = '/security';
      else if (activeTab === 'devices') targetPath = '/devices';
      else if (activeTab === 'privacy') targetPath = '/settings';
      else if (activeTab === 'history') targetPath = '/security';
      else if (activeTab === 'flowbrowser') targetPath = '/dashboard';
      else targetPath = '/dashboard';
    } else {
      targetPath = '/';
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  }, [view, activeTab, authModalOpen, authMode]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleGoToDashboard = (tab?: string) => {
    setView('dashboard');
    if (tab) setActiveTab(tab);
    setAuthModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#2478F2] flex items-center justify-center text-white shadow-lg shadow-[#2478F2]/25 animate-pulse">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M4 6.5C4 5.67157 4.67157 5 5.5 5H18.5C19.3284 5 20 5.67157 20 6.5C20 7.32843 19.3284 8 18.5 8H5.5C4.67157 8 4 7.32843 4 6.5ZM4 12C4 11.1716 4.67157 10.5 5.5 10.5H14.5C15.3284 10.5 16 11.1716 16 12C16 12.8284 15.3284 13.5 14.5 13.5H5.5C4.67157 13.5 4 12.8284 4 12ZM4 17.5C4 16.6716 4.67157 16 5.5 16H18.5C19.3284 16 20 16.6716 20 17.5C20 18.3284 19.3284 19 18.5 19H5.5C4.67157 19 4 18.3284 4 17.5Z" />
          </svg>
        </div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
          Flow Hesap Başlatılıyor...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        view={view}
        setView={setView}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {view === 'authorize' ? (
          <FlowBrowserAuthorize />
        ) : view === 'home' || !user ? (
          <HomeView
            onOpenAuth={handleOpenAuth}
            onGoToDashboard={handleGoToDashboard}
          />
        ) : (
          <DashboardView
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAuthModal={() => handleOpenAuth('login')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          if (view === 'home') {
            window.history.pushState({}, '', '/');
          }
        }}
        initialMode={authMode === 'forgot' ? 'login' : authMode}
        onSuccess={() => {
          setView('dashboard');
          setActiveTab('overview');
          setAuthModalOpen(false);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
