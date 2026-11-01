import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const FlowBrowserAuthorize: React.FC = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState<'idle' | 'authorizing' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const queryParams = new URLSearchParams(window.location.search);
    const code_challenge = queryParams.get('code_challenge');
    const state = queryParams.get('state');
    const device_name = queryParams.get('device_name') || 'FlowBrowser';

    const handleAuthorize = async () => {
        if (!user || !code_challenge || !state) return;

        setStatus('authorizing');
        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/flowbrowser/authorize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ code_challenge, state, device_name })
            });

            if (!response.ok) throw new Error('Yetkilendirme kodu üretilemedi.');

            const { authCode } = await response.json();
            setStatus('success');
            
            // Redirect back to the desktop application
            window.location.href = `flowbrowser://auth/callback?code=${authCode}&state=${state}`;
        } catch (e: any) {
            setErrorMsg(e.message);
            setStatus('error');
        }
    };

    if (!user) return <div className="p-8 text-center">Yetkilendirme için lütfen giriş yapın.</div>;

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-lg border border-slate-200 space-y-6">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-[#2478F2] flex items-center justify-center mx-auto">
                    <Compass className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">FlowBrowser Yetkilendirme</h2>
                <p className="text-sm text-slate-600">
                    <strong>{device_name}</strong>, Flow Hesap bilgilerinize erişmek istiyor.
                </p>
            </div>

            {status === 'idle' && (
                <button
                    onClick={handleAuthorize}
                    className="w-full py-3 bg-[#2478F2] text-white font-bold rounded-xl hover:bg-[#1a68d8]"
                >
                    Yetkilendir ve Bağlan
                </button>
            )}

            {status === 'authorizing' && (
                <div className="text-center text-slate-600 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> İşleniyor...
                </div>
            )}

            {status === 'error' && (
                <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {errorMsg}
                </div>
            )}
        </div>
    );
};
