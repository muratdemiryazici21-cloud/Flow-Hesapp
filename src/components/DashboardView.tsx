import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { PRESET_AVATARS, ECOSYSTEM_APPS } from '../data/ecosystemApps';
import { getTurkishAuthErrorMessage } from '../utils/turkishAuthErrors';
import { compressAvatarImage } from '../utils/imageCompressor';
import {
  User as UserIcon,
  ShieldCheck,
  Laptop,
  Compass,
  CheckCircle2,
  AlertCircle,
  Key,
  Mail,
  Trash2,
  ExternalLink,
  Smartphone,
  Globe,
  LogOut,
  RefreshCw,
  Camera,
  AtSign,
  Calendar,
  Lock,
  Check,
  Info,
  QrCode,
  Sparkles,
  Link2,
  ShieldAlert,
  Copy,
  CheckCheck,
  UploadCloud,
  ImageIcon,
  History,
  Database,
  Download,
  Search,
  Filter,
  Sliders,
  Shield,
  FileText,
  CheckCircle,
  ArrowUpRight,
  HardDrive,
  Cloud,
  Clock,
  MapPin,
  Activity,
  FileDown,
  ShieldX
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DashboardViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuthModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ activeTab, setActiveTab }) => {
  const {
    user,
    profile,
    sessions,
    connectedDevices,
    authorizedApps,
    securityLogs,
    privacySettings,
    twoFactorConfig,
    updateUserProfileData,
    changePassword,
    changeEmail,
    terminateOtherSessions,
    terminateSession,
    removeConnectedDevice,
    addConnectedDevice,
    authorizeApp,
    revokeApp,
    deleteAccount,
    logSecurityEvent,
    updatePrivacySettings,
    enable2FA,
    disable2FA,
    exportUserData,
  } = useAuth();

  // Personal Info Form State
  const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || user?.photoURL || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [personalSuccess, setPersonalSuccess] = useState<string | null>(null);
  const [personalError, setPersonalError] = useState<string | null>(null);
  const [personalLoading, setPersonalLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = async (file: File) => {
    setPersonalError(null);
    setUploadingImage(true);
    try {
      const dataUrl = await compressAvatarImage(file);
      setPhotoURL(dataUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setPersonalError(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Email Change State
  const [newEmail, setNewEmail] = useState('');
  const [emailCurrentPass, setEmailCurrentPass] = useState('');
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);


  // FlowBrowser OAuth Modal State
  const [oauthModalOpen, setOauthModalOpen] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthAuthCode, setOauthAuthCode] = useState<string | null>(null);

  // Add Device Modal State
  const [pairModalOpen, setPairModalOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('Android Flow Cihazı');
  const [newDeviceType, setNewDeviceType] = useState('mobile');
  const [pairCode, setPairCode] = useState(() => 'FLW-' + Math.floor(100000 + Math.random() * 900000));
  const [qrMode, setQrMode] = useState<'web' | 'protocol'>('web');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [pairingSuccess, setPairingSuccess] = useState(false);

  const refreshPairCode = () => {
    setPairCode('FLW-' + Math.floor(100000 + Math.random() * 900000));
    setPairingSuccess(false);
  };

  // 2FA Setup & Recovery Codes State
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState<1 | 2>(1);
  const [totpSecret, setTotpSecret] = useState('');
  const [twoFactorInput, setTwoFactorInput] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackupCodes, setCopiedBackupCodes] = useState(false);
  const [viewBackupModalOpen, setViewBackupModalOpen] = useState(false);
  const [disable2FAModalOpen, setDisable2FAModalOpen] = useState(false);

  // Security History State
  const [historyCategory, setHistoryCategory] = useState<'all' | 'login' | 'security' | 'device' | 'app'>('all');
  const [historySearch, setHistorySearch] = useState('');
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  // Privacy & Sync State
  const [privacyFeedback, setPrivacyFeedback] = useState<string | null>(null);
  const [privacySavingKey, setPrivacySavingKey] = useState<string | null>(null);

  const init2FASetup = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let sec = '';
    for (let i = 0; i < 16; i++) {
      sec += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const codes = Array.from({ length: 8 }, () => {
      const a = Math.floor(1000 + Math.random() * 9000);
      const b = Math.floor(1000 + Math.random() * 9000);
      return `${a}-${b}`;
    });
    setTotpSecret(sec);
    setBackupCodes(codes);
    setTwoFactorInput('');
    setTwoFactorError(null);
    setTwoFactorStep(1);
    setTwoFactorModalOpen(true);
  };

  const handleConfirm2FA = async () => {
    if (twoFactorInput.replace(/\s+/g, '').length < 6) {
      setTwoFactorError('Lütfen Authenticator uygulamanızdaki 6 haneli doğrulama kodunu girin.');
      return;
    }
    setTwoFactorLoading(true);
    setTwoFactorError(null);
    try {
      await enable2FA(totpSecret, backupCodes);
      setTwoFactorStep(2);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTwoFactorError(msg);
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setTwoFactorLoading(true);
    try {
      await disable2FA();
      setDisable2FAModalOpen(false);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const handleTogglePrivacySetting = async (key: string, value: boolean) => {
    setPrivacySavingKey(key);
    try {
      await updatePrivacySettings({ [key]: value });
      setPrivacyFeedback('Gizlilik ve senkronizasyon ayarınız güncellendi.');
      setTimeout(() => setPrivacyFeedback(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setPrivacySavingKey(null);
    }
  };

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const handleExportAllData = () => {
    const data = exportUserData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-hesap-verileri-${user?.uid?.slice(0, 8) || 'export'}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSecurityLogs = () => {
    const blob = new Blob([JSON.stringify(securityLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-guvenlik-kayitlari-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadBackupCodes = (codes: string[]) => {
    const content = `FLOW HESAP - İKİ ADIMLI DOĞRULAMA YEDEK KODLARI\n` +
      `Kullanıcı: ${user?.email || ''}\nOluşturulma: ${new Date().toLocaleString('tr-TR')}\n\n` +
      `Bu kurtarma kodlarını güvenli bir yerde saklayın. Her kod yalnızca bir kez kullanılabilir:\n\n` +
      codes.map((c, i) => `${i + 1}. ${c}`).join('\n') +
      `\n\nUyarı: Bu kodları kimseyle paylaşmayın. Authenticator uygulamanıza erişemediğinizde hesabınızı kurtarmak için gereklidir.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-2fa-yedek-kodlar-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Delete Account Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Oturum Açılmadı</h2>
        <p className="text-sm text-slate-600">Bu paneli görüntülemek için lütfen giriş yapın.</p>
      </div>
    );
  }

  // Format created date
  const createdDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Bilinmiyor';

  // Security score calculation
  const is2FAActive = !!twoFactorConfig?.enabled;
  let securityScore = 50;
  if (is2FAActive) securityScore += 30;
  if (profile?.username) securityScore += 20;
  if (securityScore > 100) securityScore = 100;

  // Personal Info Submit
  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalError(null);
    setPersonalSuccess(null);
    setPersonalLoading(true);

    try {
      await updateUserProfileData({
        displayName: displayName.trim(),
        username: username.trim().toLowerCase(),
        photoURL: photoURL.trim(),
        bio: bio.trim(),
      });
      setPersonalSuccess('Kişisel bilgileriniz başarıyla güncellendi.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setPersonalError(getTurkishAuthErrorMessage(msg));
    } finally {
      setPersonalLoading(false);
    }
  };

  // Change Password Submit
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) {
      setPasswordError('Yeni şifreniz en az 6 karakter olmalıdır.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setPasswordError('Yeni şifreler birbiriyle eşleşmiyor.');
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess('Şifreniz başarıyla değiştirildi.');
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setPasswordError(getTurkishAuthErrorMessage(msg));
    } finally {
      setPasswordLoading(false);
    }
  };

  // Change Email Submit
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);

    if (!newEmail.trim() || !newEmail.includes('@')) {
      setEmailError('Lütfen geçerli bir yeni e-posta adresi girin.');
      return;
    }

    setEmailLoading(true);
    try {
      await changeEmail(newEmail.trim(), emailCurrentPass);
      setEmailSuccess('E-posta adresiniz güncellendi ve yeni adrese doğrulama bağlantısı gönderildi.');
      setNewEmail('');
      setEmailCurrentPass('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setEmailError(getTurkishAuthErrorMessage(msg));
    } finally {
      setEmailLoading(false);
    }
  };



  // FlowBrowser device management
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm('Bu cihazın bağlantısını kesmek istediğinize emin misiniz?')) return;
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`/api/flowbrowser/devices/${deviceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Cihaz kaldırılamadı.');
      alert('Cihaz bağlantısı başarıyla kesildi.');
    } catch (e: any) {
      alert('Hata: ' + e.message);
    }
  };

  const handleRevokeAll = async () => {
    if (!confirm('Tüm FlowBrowser cihazlarının bağlantısını kesmek istediğinize emin misiniz?')) return;
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/flowbrowser/revoke', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Bağlantılar kesilemedi.');
      alert('Tüm cihaz bağlantıları başarıyla kesildi.');
    } catch (e: any) {
      alert('Hata: ' + e.message);
    }
  };

  // Delete account action
  const handleDeleteAccount = async () => {
    setDeleteError(null);
    setDeleteLoading(true);
    try {
      await deleteAccount(deletePassword || undefined);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setDeleteError(getTurkishAuthErrorMessage(msg));
      setDeleteLoading(false);
    }
  };

  const isFlowBrowserAuthorized = authorizedApps.some((a) => a.appName === 'FlowBrowser' && a.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Card: User Identity Snapshot */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Accent top gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#2478F2] via-blue-500 to-indigo-600" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar with click to edit */}
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('personal')}>
              {profile?.photoURL || user.photoURL ? (
                <img
                  src={profile?.photoURL || user.photoURL || ''}
                  alt={profile?.displayName || 'Avatar'}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#2478F2]/10 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#2478F2] to-[#60A5FA] text-white flex items-center justify-center font-bold text-3xl shadow-sm">
                  {(profile?.displayName || user.email || 'F')[0].toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-5 h-5" />
              </div>
            </div>

            {/* User Meta */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {profile?.displayName || user.displayName || 'Flow Kullanıcısı'}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1 font-mono text-slate-700">
                  <AtSign className="w-3.5 h-3.5 text-slate-400" />
                  {profile?.username || 'belirlenmedi'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Üyelik: {createdDate}
                </span>
              </div>
            </div>
          </div>

          {/* Security Score Widget */}
          <div className="w-full md:w-auto bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center gap-4">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="23"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-slate-200"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="23"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={144.5}
                  strokeDashoffset={144.5 - (144.5 * securityScore) / 100}
                  className="text-[#2478F2] transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-xs font-black text-slate-900">%{securityScore}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Hesap Güvenlik Durumu</p>
              <p className="text-[11px] text-slate-500">
                {securityScore >= 80 ? 'Mükemmel seviyede' : 'Güçlendirme önerilir'}
              </p>
              <button
                onClick={() => setActiveTab('security')}
                className="text-[11px] font-bold text-[#2478F2] hover:underline cursor-pointer"
              >
                Ayarları İncele →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-[#2478F2] text-[#2478F2]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Genel Bakış</span>
        </button>

        <button
          onClick={() => setActiveTab('personal')}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'personal'
              ? 'border-[#2478F2] text-[#2478F2]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Kişisel Bilgiler</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-[#2478F2] text-[#2478F2]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Güvenlik Ayarları</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'history'
              ? 'border-[#2478F2] text-[#2478F2]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4 text-emerald-600" />
          <span>Güvenlik Geçmişi</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {securityLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'privacy'
              ? 'border-[#2478F2] text-[#2478F2]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4 text-purple-600" />
          <span>Veri ve Gizlilik</span>
        </button>

        <button
          onClick={() => setActiveTab('devices')}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'devices'
              ? 'border-[#2478F2] text-[#2478F2]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>Bağlı Cihazlar ({connectedDevices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('flowbrowser')}
          className={`pb-3 px-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'flowbrowser'
              ? 'border-[#2478F2] text-[#2478F2]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>FlowBrowser & OAuth</span>
        </button>
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">

          {/* Grid of Key Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Profile Summary Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Profil Kartı</h3>
                <button
                  onClick={() => setActiveTab('personal')}
                  className="text-xs text-[#2478F2] font-semibold hover:underline cursor-pointer"
                >
                  Düzenle
                </button>
              </div>
              <div className="space-y-2.5 text-xs">
                <div>
                  <p className="text-slate-400 font-medium">Ad Soyad</p>
                  <p className="font-semibold text-slate-800 text-sm">{profile?.displayName || 'Belirtilmedi'}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Kullanıcı Adı</p>
                  <p className="font-semibold text-slate-800 font-mono">@{profile?.username || 'belirlenmedi'}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Kayıtlı E-posta</p>
                  <p className="font-semibold text-slate-800">{user.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Hakkımda</p>
                  <p className="text-slate-600 italic">{profile?.bio || 'Biyografi eklenmedi.'}</p>
                </div>
              </div>
            </div>

            {/* Active Sessions Summary Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Aktif Oturumlar ({sessions.length})</h3>
                <button
                  onClick={() => setActiveTab('security')}
                  className="text-xs text-[#2478F2] font-semibold hover:underline cursor-pointer"
                >
                  Tümünü Gör
                </button>
              </div>
              <div className="space-y-3">
                {sessions.slice(0, 2).map((s) => (
                  <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Laptop className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{s.deviceName}</p>
                        <p className="text-[10px] text-slate-400">{s.location}</p>
                      </div>
                    </div>
                    {s.current && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        Bu Cihaz
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* FlowBrowser Connection Snapshot */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-6 rounded-3xl border border-blue-100/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#2478F2] font-bold text-sm">
                  <Compass className="w-4 h-4" />
                  <span>FlowBrowser Durumu</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isFlowBrowserAuthorized ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {isFlowBrowserAuthorized ? 'Bağlı' : 'Bağlı Değil'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yer imleriniz, şifre kasanız ve açık sekmeleriniz FlowBrowser ile senkronize olsun.
              </p>
              <button
                onClick={() => setActiveTab('flowbrowser')}
                className="w-full py-2.5 bg-[#2478F2] hover:bg-[#1a68d8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>FlowBrowser Ayarlarını Aç</span>
              </button>
            </div>
          </div>

          {/* Ecosystem Apps Grid */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Flow Ekosistemi Hizmetleriniz</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Flow Hesabınız ile bu uygulamaların tümünde anında oturum açabilirsiniz.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ECOSYSTEM_APPS.map((app) => {
                const isAuthorized = authorizedApps.some((a) => a.appName === app.id && a.status === 'active');
                return (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: app.color }}
                        >
                          {app.name.substring(4, 5)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{app.name}</h4>
                          <p className="text-[10px] text-slate-400">{app.category}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAuthorized ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isAuthorized ? 'Eşitleniyor' : 'Hazır'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {app.tagline}
                    </p>

                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200/60 text-xs">
                      {app.url ? (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-800 hover:text-[#2478F2] bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs transition-colors"
                        >
                          <span>Uygulamayı Aç</span>
                          <ExternalLink className="w-3 h-3 text-[#2478F2]" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {app.protocol || 'flow-sso'}
                        </span>
                      )}
                      <button
                        onClick={() => setActiveTab('flowbrowser')}
                        className="text-[#2478F2] text-xs font-bold hover:underline cursor-pointer"
                      >
                        Yönet →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flow Ekosistemi & Bulut Depolama (FlowDrive 15 GB) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 text-[#2478F2] flex items-center justify-center shadow-xs">
                  <Cloud className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Flow Bulut Depolama (FlowDrive)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Flow Hesabınıza dahil 15 GB ücretsiz güvenli bulut depolama alanı.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://flow-drive.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#2478F2] hover:bg-[#1a68d8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>FlowDrive'ı Aç</span>
                </a>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Depolamayı Yönet
                </button>
              </div>
            </div>

            {/* Storage Progress & Breakdown */}
            <div className="space-y-3 p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-bold text-slate-800">
                  <span className="text-base font-extrabold text-[#2478F2]">2.4 GB</span> / 15 GB Kullanılıyor (%16)
                </span>
                <span className="text-slate-500 font-medium">12.6 GB Boş</span>
              </div>

              {/* Multi-segmented Progress Bar */}
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                <div className="h-full bg-[#2478F2]" style={{ width: '8%' }} title="FlowDrive Belgeler: 1.2 GB" />
                <div className="h-full bg-pink-500" style={{ width: '5.3%' }} title="FlowMusic Önbelleği: 0.8 GB" />
                <div className="h-full bg-emerald-500" style={{ width: '2.7%' }} title="FlowBrowser Yedekleri: 0.4 GB" />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#2478F2]" />
                  <div>
                    <p className="font-semibold text-slate-800">FlowDrive</p>
                    <p className="text-[11px] text-slate-400">1.2 GB dosya</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-pink-500" />
                  <div>
                    <p className="font-semibold text-slate-800">FlowMusic</p>
                    <p className="text-[11px] text-slate-400">0.8 GB müzik</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <div>
                    <p className="font-semibold text-slate-800">FlowBrowser</p>
                    <p className="text-[11px] text-slate-400">0.4 GB yedek</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-300" />
                  <div>
                    <p className="font-semibold text-slate-800">Kullanılabilir</p>
                    <p className="text-[11px] text-slate-400">12.6 GB boş</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. PERSONAL INFO */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info Form */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Kişisel Bilgileri Düzenle</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Flow ekosisteminde görünen adınızı, kullanıcı adınızı ve biyografinizi özelleştirin.
              </p>
            </div>

            {personalSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{personalSuccess}</span>
              </div>
            )}

            {personalError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{personalError}</span>
              </div>
            )}

            <form onSubmit={handleSavePersonalInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ad ve Soyad
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2478F2] focus:ring-2 focus:ring-[#2478F2]/20 rounded-xl text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kullanıcı Adı <span className="text-slate-400 font-normal">(@benzersiz)</span>
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9._-]/g, ''))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2478F2] focus:ring-2 focus:ring-[#2478F2]/20 rounded-xl text-sm font-mono outline-none transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Kullanıcı adınız FlowBrowser profilinizde ve Flow servislerinde görünür.
                </p>
              </div>

              {/* Profile Photo Uploader (Device File Selection & Drag & Drop) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Profil Fotoğrafı (Cihazdan Seç veya Sürükle Bırak)
                </label>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      await handleImageFile(e.target.files[0]);
                      e.target.value = '';
                    }
                  }}
                />

                {/* Drag & Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 ${
                    isDragging
                      ? 'border-[#2478F2] bg-blue-50/80 scale-[1.01]'
                      : 'border-slate-300 hover:border-[#2478F2] bg-slate-50/60 hover:bg-slate-50'
                  }`}
                >
                  {uploadingImage ? (
                    <div className="py-4 flex flex-col items-center justify-center gap-2 text-slate-600">
                      <RefreshCw className="w-8 h-8 text-[#2478F2] animate-spin" />
                      <p className="text-xs font-bold">Fotoğraf Optimize Ediliyor...</p>
                    </div>
                  ) : photoURL ? (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <div className="relative">
                        <img
                          src={photoURL}
                          alt="Seçilen Fotoğraf"
                          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#2478F2]/20 shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 p-1 bg-[#2478F2] text-white rounded-full">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="text-center sm:text-left space-y-1">
                        <p className="text-xs font-bold text-slate-900">Fotoğraf Seçildi</p>
                        <p className="text-[11px] text-slate-500">
                          Değiştirmek için tıklayın veya yeni bir resmi buraya sürükleyin
                        </p>
                        <div className="pt-1 flex items-center gap-2 justify-center sm:justify-start">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold bg-[#2478F2] text-white rounded-lg hover:bg-[#1a68d8]"
                          >
                            Başka Resim Seç
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhotoURL('');
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg"
                          >
                            Kaldır
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2478F2] flex items-center justify-center mx-auto">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Resmi Buraya Sürükleyip Bırakın
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          veya cihazınızdan dosya seçmek için tıklayın
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        PNG, JPG, WEBP (En fazla 15MB, otomatik olarak kare profil formatına kırpılır)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Preset Avatars Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Veya Hazır Flow Avatarlarından Seçin
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {PRESET_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoURL(avatar)}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden ring-2 transition-all cursor-pointer ${
                        photoURL === avatar ? 'ring-[#2478F2] scale-105 shadow-md' : 'ring-transparent hover:ring-slate-300'
                      }`}
                    >
                      <img src={avatar} alt="Preset" className="w-full h-full object-cover" />
                      {photoURL === avatar && (
                        <div className="absolute inset-0 bg-[#2478F2]/40 flex items-center justify-center text-white">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hakkımda / Biyografi
                </label>
                <textarea
                  rows={3}
                  maxLength={250}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Kendinizden veya Flow ekosistemi ilgi alanlarınızdan bahsedin..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2478F2] focus:ring-2 focus:ring-[#2478F2]/20 rounded-xl text-sm outline-none transition-all resize-none"
                />
                <p className="text-[10px] text-slate-400 text-right">{bio.length}/250</p>
              </div>

              <button
                type="submit"
                disabled={personalLoading}
                className="px-6 py-2.5 bg-[#2478F2] hover:bg-[#1a68d8] text-white text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {personalLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </form>
          </div>

          {/* Change Email Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">E-posta Adresini Değiştir</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mevcut e-posta: <span className="font-semibold text-slate-800">{user.email}</span>
                </p>
              </div>

              {emailSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  {emailSuccess}
                </div>
              )}

              {emailError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {emailError}
                </div>
              )}

              <form onSubmit={handleChangeEmail} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Yeni E-posta Adresi
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="yeni@flow.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#2478F2]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mevcut Şifreniz (Güvenlik Doğrulaması)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={emailCurrentPass}
                    onChange={(e) => setEmailCurrentPass(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#2478F2]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={emailLoading}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  {emailLoading ? 'Güncelleniyor...' : 'E-postayı Güncelle'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. SECURITY SETTINGS */}
      {activeTab === 'security' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Change Password Card */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#2478F2]" />
                  <span>Şifre Değiştir</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Güvenliğiniz için periyodik olarak şifrenizi yenilemeniz önerilir.
                </p>
              </div>

              {passwordSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mevcut Şifreniz
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2478F2] rounded-xl text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Yeni Şifre (En az 6 karakter)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2478F2] rounded-xl text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Yeni Şifre Tekrar
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2478F2] rounded-xl text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-6 py-2.5 bg-[#2478F2] hover:bg-[#1a68d8] text-white text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {passwordLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                </button>
              </form>
            </div>

            {/* Danger Zone Card */}
            <div className="lg:col-span-6 space-y-6">
              {/* Danger Zone: Delete Account */}
              <div className="bg-rose-50/60 p-6 rounded-3xl border border-rose-200/80 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Tehlikeli Bölge: Hesabı Sil</span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  Flow hesabınızı sildiğinizde profil bilgileriniz, kayıtlı cihazlarınız ve tüm bağlı Flow servisleri verileriniz kalıcı olarak imha edilir.
                </p>
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Flow Hesabımı Kalıcı Olarak Sil</span>
                </button>
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication (2FA) Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2478F2] flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      İki Adımlı Doğrulama (2FA - TOTP)
                    </h3>
                    {twoFactorConfig?.enabled ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Etkinleştirildi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                        Devre Dışı
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    Google Authenticator, Microsoft Authenticator veya 1Password gibi uygulamalar kullanarak hesabınıza girişlerde ek 6 haneli güvenlik kodu talep edin.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {twoFactorConfig?.enabled ? (
                  <>
                    <button
                      onClick={() => setViewBackupModalOpen(true)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Key className="w-4 h-4 text-slate-500" />
                      <span>Kurtarma Kodları</span>
                    </button>
                    <button
                      onClick={() => setDisable2FAModalOpen(true)}
                      className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Devre Dışı Bırak
                    </button>
                  </>
                ) : (
                  <button
                    onClick={init2FASetup}
                    className="px-5 py-2.5 bg-[#2478F2] hover:bg-[#1a68d8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>2FA'yı Etkinleştir</span>
                  </button>
                )}
              </div>
            </div>

            {twoFactorConfig?.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">Hesap Koruması Tam</p>
                    <p className="text-[11px] text-emerald-700">Şifreniz çalınsa dahi hesabınız kilitli kalır.</p>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <QrCode className="w-5 h-5 text-slate-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Doğrulama Yöntemi</p>
                    <p className="text-[11px] text-slate-500">Zaman Tabanlı TOTP Algoritması</p>
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <Key className="w-5 h-5 text-slate-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Tek Seferlik Kurtarma Kodları</p>
                    <p className="text-[11px] text-slate-500">{twoFactorConfig?.backupCodes?.length || 8} yedek kod aktif</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Sessions Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Aktif Oturumlar ({sessions.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Flow hesabınıza şu anda bağlı olan tüm web tarayıcıları ve oturumlar.
                </p>
              </div>

              {sessions.length > 1 && (
                <button
                  onClick={terminateOtherSessions}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Diğer Tüm Oturumları Sonlandır</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                      {sess.deviceType === 'mobile' ? (
                        <Smartphone className="w-5 h-5 text-[#2478F2]" />
                      ) : (
                        <Laptop className="w-5 h-5 text-[#2478F2]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">{sess.deviceName}</p>
                        {sess.current && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2478F2]/10 text-[#2478F2] border border-[#2478F2]/20">
                            Şu Anki Oturum
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {sess.location} • Son hareket:{' '}
                        {new Date(sess.lastActive).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 font-mono">
                    IP: {sess.ipAddress}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: GÜVENLİK GEÇMİŞİ (AUDIT LOGS) */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">Güvenlik ve Giriş Geçmişi</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {securityLogs.length} Kayıt
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Hesabınızda gerçekleştirilen tüm girişler, şifre güncellemeleri ve yetkilendirmeler denetim kaydı altında tutulur.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportSecurityLogs}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Günlüğü JSON olarak indir"
                >
                  <Download className="w-3.5 h-3.5 text-[#2478F2]" />
                  <span>Günlüğü İndir (JSON)</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <button
                  onClick={() => setHistoryCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    historyCategory === 'all'
                      ? 'bg-[#2478F2] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Tümü ({securityLogs.length})
                </button>
                <button
                  onClick={() => setHistoryCategory('login')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    historyCategory === 'login'
                      ? 'bg-[#2478F2] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Girişler ({securityLogs.filter((l) => (l.category || l.type) === 'login').length})
                </button>
                <button
                  onClick={() => setHistoryCategory('security')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    historyCategory === 'security'
                      ? 'bg-[#2478F2] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Güvenlik ({securityLogs.filter((l) => (l.category || l.type) === 'security').length})
                </button>
                <button
                  onClick={() => setHistoryCategory('device')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    historyCategory === 'device'
                      ? 'bg-[#2478F2] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Cihazlar ({securityLogs.filter((l) => (l.category || l.type) === 'device').length})
                </button>
                <button
                  onClick={() => setHistoryCategory('app')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    historyCategory === 'app'
                      ? 'bg-[#2478F2] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Uygulama Yetkileri ({securityLogs.filter((l) => (l.category || l.type) === 'app' || (l.category || l.type) === 'oauth').length})
                </button>
              </div>

              {/* Search input */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="İşlem, cihaz veya IP ara..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2478F2] rounded-xl text-xs outline-none transition-all"
                />
              </div>
            </div>

            {/* Logs List Feed */}
            {(() => {
              const q = historySearch.toLowerCase().trim();
              const filtered = securityLogs.filter((log) => {
                const itemCat = log.category || log.type;
                const matchesCat =
                  historyCategory === 'all' ||
                  itemCat === historyCategory ||
                  (historyCategory === 'app' && itemCat === 'oauth');
                const dev = log.device || log.deviceName || '';
                const loc = log.location || '';
                const ip = log.ipAddress || '';
                const matchesQ =
                  !q ||
                  log.action.toLowerCase().includes(q) ||
                  dev.toLowerCase().includes(q) ||
                  loc.toLowerCase().includes(q) ||
                  ip.toLowerCase().includes(q);
                return matchesCat && matchesQ;
              });

              if (filtered.length === 0) {
                return (
                  <div className="py-12 text-center space-y-3 bg-slate-50/60 rounded-2xl border border-slate-200/60">
                    <History className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600">Eşleşen güvenlik kaydı bulunamadı</p>
                    <p className="text-xs text-slate-400">
                      {historySearch ? 'Arama teriminizi değiştirmeyi deneyin.' : 'Bu kategoride henüz bir olay gerçekleşmedi.'}
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {filtered.map((log) => {
                    const isSuccess = log.status === 'success';
                    const isWarning = log.status === 'warning';
                    const itemCat = log.category || log.type;
                    const deviceName = log.device || log.deviceName || 'Flow Web İstemcisi';
                    const locationName = log.location || 'Konum belirtilmedi';
                    const ipDisplay = log.ipAddress || '127.0.0.1';

                    return (
                      <div
                        key={log.id}
                        className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50/90 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                              itemCat === 'login'
                                ? 'bg-blue-100 text-[#2478F2]'
                                : itemCat === 'security'
                                ? 'bg-purple-100 text-purple-700'
                                : itemCat === 'device'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {itemCat === 'login' && <Globe className="w-5 h-5" />}
                            {itemCat === 'security' && <ShieldCheck className="w-5 h-5" />}
                            {itemCat === 'device' && <Laptop className="w-5 h-5" />}
                            {(itemCat === 'app' || itemCat === 'oauth') && <Compass className="w-5 h-5" />}
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900">{log.action}</h4>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isSuccess
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isWarning
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {isSuccess ? 'Başarılı' : isWarning ? 'Uyarı' : 'Bilgi'}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                {itemCat === 'login'
                                  ? 'GİRİŞ'
                                  : itemCat === 'security'
                                  ? 'GÜVENLİK'
                                  : itemCat === 'device'
                                  ? 'CİHAZ'
                                  : 'UYGULAMA'}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Laptop className="w-3 h-3 text-slate-400" />
                                <span>{deviceName}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{locationName}</span>
                              </span>
                              <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                                <span>IP: {ipDisplay}</span>
                                <button
                                  onClick={() => handleCopyIp(ipDisplay)}
                                  className="p-1 hover:text-[#2478F2] transition-colors cursor-pointer"
                                  title="IP Kopyala"
                                >
                                  {copiedIp === ipDisplay ? (
                                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-left sm:text-right shrink-0">
                          <p className="text-xs font-medium text-slate-600">
                            {new Date(log.timestamp).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString('tr-TR', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Anomaly Detection Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Şüpheli bir hareket mi fark ettiniz?</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tanımadığınız bir konum veya cihaz görürseniz parolanızı hemen değiştirin ve diğer tüm oturumları tek tıkla sonlandırın.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('security')}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Güvenliği Sağla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: VERİ VE GİZLİLİK (DATA & PRIVACY) */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          {/* Privacy feedback alert */}
          {privacyFeedback && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{privacyFeedback}</span>
            </div>
          )}

          {/* Flow Takeout Export Hero Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-white p-6 sm:p-8 rounded-3xl border border-indigo-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2478F2] to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Flow Verilerinizi İndirin (Flow Takeout)</h2>
                  <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                    Flow ekosistemindeki tüm profil bilgileriniz, bağlı cihazlarınız, yetkili uygulamalarınız, güvenlik geçmişiniz ve gizlilik tercihleriniz tek bir JSON dosyasında arşivlenir.
                  </p>
                </div>
              </div>

              <button
                onClick={handleExportAllData}
                className="px-5 py-2.5 bg-[#2478F2] hover:bg-[#1a68d8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 shrink-0"
              >
                <FileDown className="w-4 h-4" />
                <span>Tüm Verilerimi İndir (.json)</span>
              </button>
            </div>
          </div>

          {/* Synchronization and Privacy Controls */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Flow Ekosistemi Senkronizasyon Tercihleri</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cihazlarınız ve FlowBrowser arasında hangi verilerin bulutta şifrelenerek senkronize edileceğini kontrol edin.
              </p>
            </div>

            <div className="space-y-4">
              {/* Item 1: syncBookmarks */}
              <div className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between gap-4 transition-all">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2478F2] flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">FlowBrowser Yer İmleri Eşitlemesi</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2478F2] border border-blue-200">
                        Bulut Senkron
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tarayıcınızdaki sık kullanılan web siteleri ve klasörler tüm Flow cihazlarınıza aktarılır.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={privacySettings?.syncBookmarks ?? true}
                    onChange={(e) => handleTogglePrivacySetting('syncBookmarks', e.target.checked)}
                    disabled={privacySavingKey === 'syncBookmarks'}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2478F2]"></div>
                </label>
              </div>

              {/* Item 2: syncHistory */}
              <div className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between gap-4 transition-all">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">Tarayıcı Ziyaret Geçmişi Eşitlemesi</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        İsteğe Bağlı
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Ziyaret ettiğiniz web siteleri geçmişi telefonunuz ve bilgisayarınız arasında senkronize edilir.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={privacySettings?.syncHistory ?? true}
                    onChange={(e) => handleTogglePrivacySetting('syncHistory', e.target.checked)}
                    disabled={privacySavingKey === 'syncHistory'}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2478F2]"></div>
                </label>
              </div>

              {/* Item 3: syncPasswords */}
              <div className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between gap-4 transition-all">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">Uçtan Uca Şifreli Parola Kasası</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        AES-256 GCM
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      FlowBrowser şifre kasasındaki kayıtlarınız yalnızca cihazınızda çözümlenen anahtarla korunur.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={privacySettings?.syncPasswords ?? true}
                    onChange={(e) => handleTogglePrivacySetting('syncPasswords', e.target.checked)}
                    disabled={privacySavingKey === 'syncPasswords'}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2478F2]"></div>
                </label>
              </div>

              {/* Item 4: activityHistory */}
              <div className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between gap-4 transition-all">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">Flow Arama & Medya Etkinliği</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                        FlowSearch / FlowMusic
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      FlowSearch ve FlowMusic içerisindeki arama ve oynatma tercihlerinizi hatırlayarak daha isabetli öneriler sunar.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={privacySettings?.activityHistory ?? true}
                    onChange={(e) => handleTogglePrivacySetting('activityHistory', e.target.checked)}
                    disabled={privacySavingKey === 'activityHistory'}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2478F2]"></div>
                </label>
              </div>

              {/* Item 5: locationTracking */}
              <div className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between gap-4 transition-all">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">Güvenlik Amaçlı IP Tabanlı Konum Tespiti</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Güvenlik Denetimi
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Giriş yapılan şehir ve ülke yaklaşık olarak belirlenerek olağandışı girişlerde bildirim almanızı sağlar.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={privacySettings?.locationTracking ?? true}
                    onChange={(e) => handleTogglePrivacySetting('locationTracking', e.target.checked)}
                    disabled={privacySavingKey === 'locationTracking'}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2478F2]"></div>
                </label>
              </div>

              {/* Item 6: personalizedAds */}
              <div className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 flex items-center justify-between gap-4 transition-all">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">Kişiselleştirilmiş Flow Ekosistem Önerileri</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        İsteğe Bağlı
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Flow ekosisteminde kullandığınız araçlara göre yeni özellikler ve entegrasyon tavsiyeleri görüntülenir.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={privacySettings?.personalizedAds ?? false}
                    onChange={(e) => handleTogglePrivacySetting('personalizedAds', e.target.checked)}
                    disabled={privacySavingKey === 'personalizedAds'}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2478F2]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Guarantee Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center gap-2.5 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-sm font-bold">Flow Sıfır Bilgi & Gizlilik Güvencesi</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Flow ekosistemi hiçbir kullanıcının kişisel verilerini, arama geçmişini veya kayıtlı parolalarını üçüncü taraflarla paylaşmaz, satmaz veya veri brokerlerine aktarmaz. Parolalarınız ve şifrelenmiş yedekleriniz yalnızca sizin kontrolünüzdedir.
            </p>
          </div>

          {/* Danger Zone: Account Deletion */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-rose-700 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Kalıcı Veri ve Hesap Silme</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Flow Hesabınızı sildiğinizde FlowBrowser, FlowSearch, FlowMusic ve FlowDrive'daki tüm verileriniz anında yok edilir.
                </p>
              </div>

              <button
                onClick={() => setDeleteModalOpen(true)}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 text-xs font-bold rounded-xl border border-rose-200 transition-colors cursor-pointer shrink-0"
              >
                Hesabı Kalıcı Olarak Sil...
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. CONNECTED DEVICES & ACTIVE SESSIONS */}
      {activeTab === 'devices' && (
        <div className="space-y-8">
          {/* Active Sessions Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#2478F2]" />
                  <span>Aktif Oturumlar ve Cihaz Geçmişi ({sessions.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Flow hesabınıza o an bağlı olan tüm tarayıcı oturumları ve cihazlar.
                </p>
              </div>

              {sessions.filter((s) => !s.current).length > 0 && (
                <button
                  onClick={terminateOtherSessions}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Tüm Cihazlardan Çıkış Yap</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    sess.current ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs shrink-0">
                      {sess.deviceType === 'mobile' ? (
                        <Smartphone className="w-6 h-6 text-[#2478F2]" />
                      ) : (
                        <Laptop className="w-6 h-6 text-[#2478F2]" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{sess.deviceName}</h3>
                        {sess.current ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2478F2]/10 text-[#2478F2] border border-[#2478F2]/20">
                            Şu Anki Oturum (Bu Cihaz)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Diğer Aktif Oturum
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {sess.location || 'Konum Bilinmiyor'}
                        </span>
                        <span>•</span>
                        <span>IP: {sess.ipAddress}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Son Aktivite: {new Date(sess.lastActive).toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>

                  {!sess.current && (
                    <button
                      onClick={() => terminateSession(sess.id)}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Oturumu Sonlandır</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Connected Devices Hardware / Apps Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Eşlenen Bağlı Cihazlar ({connectedDevices.length})</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Flow ekosistemine kayıtlı Windows, Android ve diğer desteklenen donanım cihazlarınız.
                </p>
              </div>
              <button
                onClick={() => setPairModalOpen(true)}
                className="px-4 py-2.5 bg-[#2478F2] hover:bg-[#1a68d8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <QrCode className="w-4 h-4" />
                <span>Yeni Cihaz Eşle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedDevices.map((dev) => (
                <div
                  key={dev.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex items-start justify-between gap-4 transition-all"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                      {dev.deviceType === 'mobile' ? (
                        <Smartphone className="w-6 h-6 text-[#2478F2]" />
                      ) : (
                        <Laptop className="w-6 h-6 text-[#2478F2]" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{dev.deviceName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Uygulama: {dev.appName}</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Bağlantı Tarihi: {new Date(dev.linkedAt).toLocaleDateString('tr-TR')}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Aktif Senkronizasyon
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteDevice(dev.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Cihaz Bağlantısını Kaldır"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. FLOWBROWSER & OAUTH */}
      {activeTab === 'flowbrowser' && (
        <div className="space-y-8">
          {/* Spotlight Hero Card */}
          <div className="bg-gradient-to-br from-[#2478F2] via-blue-600 to-indigo-700 p-6 sm:p-10 rounded-3xl text-white shadow-xl shadow-[#2478F2]/20 space-y-6 relative overflow-hidden">
            <div className="max-w-2xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
                <Compass className="w-3.5 h-3.5" />
                <span>Resmi flowbrowser://account Entegrasyonu</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                FlowBrowser & Flow Hesap Köprüsü
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                FlowBrowser tarayıcınızda açtığınız <code className="bg-black/30 px-2 py-0.5 rounded text-yellow-300 font-mono">flowbrowser://account</code> adresi 
                doğrudan bu merkeze bağlanır. Yetkilendirme OAuth 2.0 / OpenID Connect standartlarıyla gerçekleşir. Parolanız asla tarayıcıya veya URL adres çubuğuna aktarılmaz.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setOauthModalOpen(true)}
                  className="px-5 py-2.5 bg-white text-[#2478F2] hover:bg-blue-50 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Link2 className="w-4 h-4" />
                  <span>FlowBrowser Yetkilendirmesini Başlat</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive FlowBrowser Live Simulator */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#2478F2]" />
                  <span>FlowBrowser Eşitleme Durumu ve Simülatörü</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  FlowBrowser tarayıcınızın Flow Hesabınızdan anlık olarak eşitlendiği veriler:
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isFlowBrowserAuthorized ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {isFlowBrowserAuthorized ? '✓ flowbrowser://account Bağlandı' : 'Yetkilendirme Bekleniyor'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="text-xs font-bold text-slate-700">Senkronize Edilen Yer İmleri</p>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <a 
                    href="https://flow-search.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-1.5 bg-white hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors group"
                  >
                    <span className="group-hover:text-emerald-600 font-medium">Flow Search Ana Sayfa</span>
                    <span className="text-[10px] text-emerald-600 font-mono">flow-search ↗</span>
                  </a>
                  <a 
                    href="https://flow-drive.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-1.5 bg-white hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors group"
                  >
                    <span className="group-hover:text-purple-600 font-medium">FlowDrive Belgelerim</span>
                    <span className="text-[10px] text-purple-600 font-mono">flow-drive ↗</span>
                  </a>
                  <a 
                    href="https://flowmusic-app.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-1.5 bg-white hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors group"
                  >
                    <span className="group-hover:text-pink-600 font-medium">FlowMusic Çalma Listesi</span>
                    <span className="text-[10px] text-pink-600 font-mono">flowmusic-app ↗</span>
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="text-xs font-bold text-slate-700">Açık Sekmeler Senkronu</p>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="p-2 bg-white rounded-lg border border-slate-100 text-[11px]">
                    <p className="font-semibold text-slate-800">Windows Bilgisayar (Chrome/Flow)</p>
                    <p className="text-slate-400 text-[10px]">3 aktif sekme eşitlendi</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-100 text-[11px]">
                    <p className="font-semibold text-slate-800">Android Telefon</p>
                    <p className="text-slate-400 text-[10px]">1 aktif sekme eşitlendi</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="text-xs font-bold text-slate-700">Şifre Kasası Durumu</p>
                <div className="p-3 bg-white rounded-lg border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Kayıtlı Parolalar:</span>
                    <span className="font-bold text-slate-900 font-mono">14 Parola</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Şifreleme:</span>
                    <span className="text-emerald-600 font-bold font-mono text-[11px]">AES-256 GCM</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    Parolalar yalnızca cihazınızda çözümlenir.
                  </p>
                </div>
              </div>
            </div>

            {/* Authorized Apps Management */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-3">
                Yetkilendirilmiş Flow Uygulamaları ({authorizedApps.length})
              </h4>
              <div className="space-y-2.5">
                {authorizedApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2478F2] text-white flex items-center justify-center font-bold text-xs">
                        {app.appName.substring(4, 5)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{app.appName}</p>
                        <p className="text-[10px] text-slate-500 font-mono truncate max-w-xs">
                          Yetki Token: {app.token?.substring(0, 16)}...
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => revokeApp(app.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Erişimi İptal Et
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FlowBrowser OAuth Consent Flow */}
      {oauthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2478F2] to-blue-400 text-white flex items-center justify-center mx-auto shadow-md">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                FlowBrowser Flow Hesabınıza Bağlanmak İstiyor
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Protokol: flowbrowser://account (OAuth 2.0 / OIDC)
              </p>
            </div>

            {oauthSuccessToken ? (
              <div className="space-y-4 text-center">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs sm:text-sm space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="font-bold">FlowBrowser Yetkilendirildi!</p>
                  <p className="text-xs text-emerald-700">
                    Oturumunuz ve senkronizasyon anahtarınız tarayıcınızla güvenli bir şekilde eşleşti.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setOauthModalOpen(false);
                    setOauthSuccessToken(null);
                  }}
                  className="w-full py-2.5 bg-[#2478F2] text-white text-xs font-bold rounded-xl"
                >
                  Tamamla ve Kapat
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
                  <p className="font-bold text-slate-800">İstenen Erişim İzinleri:</p>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Flow Profil Kimliği (Ad, E-posta, Kullanıcı Adı)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Yer İmleri ve Okuma Listesi Senkronizasyonu</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Uçtan Uca Şifreli Parola Kasası Eşitlemesi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Açık Sekmeler ve Geçmiş Senkronizasyonu</span>
                    </li>
                  </ul>
                </div>

                <p className="text-[11px] text-slate-400 text-center">
                  Şifreniz hiçbir zaman FlowBrowser'a veya üçüncü şahıslara aktarılmaz. Yalnızca şifrelenmiş token üretilir.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setOauthModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Reddet
                  </button>
                  <button
                    onClick={handleAuthorizeFlowBrowser}
                    disabled={oauthLoading}
                    className="flex-1 py-2.5 bg-[#2478F2] hover:bg-[#1a68d8] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {oauthLoading ? 'Bağlanıyor...' : 'İzin Ver ve Eşitle'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Pair New Device with Working Scannable QR Code */}
      {pairModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Flow Cihaz Eşleme</h3>
                <p className="text-xs text-slate-500">Çalışan QR kod ile cihazınızı anında bağlayın</p>
              </div>
              <button
                onClick={() => {
                  setPairModalOpen(false);
                  setPairingSuccess(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* QR Type Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setQrMode('web')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  qrMode === 'web' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Kamera ile Tara (Web URL)
              </button>
              <button
                type="button"
                onClick={() => setQrMode('protocol')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  qrMode === 'protocol' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                FlowBrowser Protokolü
              </button>
            </div>

            {pairingSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3 animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">
                  Cihaz Başarıyla Eşlendi!
                </h4>
                <p className="text-xs text-emerald-700">
                  <span className="font-semibold">{newDeviceName}</span> Flow hesabınıza bağlandı ve bağlı cihazlar listenize eklendi.
                </p>
                <button
                  onClick={() => {
                    setPairModalOpen(false);
                    setPairingSuccess(false);
                  }}
                  className="mt-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Tamamla ve Kapat
                </button>
              </div>
            ) : (
              <>
                {/* Real Working QR Code Canvas / SVG */}
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-200/80 space-y-3.5">
                  <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-slate-200/90 relative">
                    <QRCodeSVG
                      value={
                        qrMode === 'web'
                          ? `https://flow-account.netlify.app/?pair_code=${pairCode}&uid=${user.uid}`
                          : `flowbrowser://account?pair_code=${pairCode}&uid=${user.uid}&token=flw_sync_${pairCode.toLowerCase()}`
                      }
                      size={184}
                      level="H"
                      marginSize={2}
                      fgColor="#0F172A"
                      bgColor="#FFFFFF"
                    />
                  </div>

                  <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      Telefonunuzun veya FlowBrowser kamerasını doğrultun
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-xs break-all font-mono">
                      {qrMode === 'web'
                        ? `https://flow-account.netlify.app/?pair_code=${pairCode}`
                        : `flowbrowser://account?pair_code=${pairCode}`}
                    </p>
                  </div>

                  {/* 6-Digit Pairing Code Display */}
                  <div className="w-full pt-1">
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                      <div className="text-left">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Eşleme Kodu</span>
                        <span className="font-mono font-black text-sm tracking-widest text-[#2478F2]">{pairCode}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(pairCode);
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          {copiedCode ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'Kopyalandı' : 'Kodu Al'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={refreshPairCode}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                          title="Yeni Kod ve QR Üret"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Device Details Form */}
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Eşlenecek Cihaz Adı
                      </label>
                      <input
                        type="text"
                        value={newDeviceName}
                        onChange={(e) => setNewDeviceName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#2478F2]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Cihaz Türü
                      </label>
                      <select
                        value={newDeviceType}
                        onChange={(e) => setNewDeviceType(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#2478F2]"
                      >
                        <option value="mobile">Android / Akıllı Telefon</option>
                        <option value="desktop">Windows Bilgisayar</option>
                        <option value="tablet">iPad / Android Tablet</option>
                        <option value="browser">FlowBrowser Tarayıcı</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const urlToCopy = qrMode === 'web'
                          ? `https://flow-account.netlify.app/?pair_code=${pairCode}&uid=${user.uid}`
                          : `flowbrowser://account?pair_code=${pairCode}&uid=${user.uid}`;
                        navigator.clipboard.writeText(urlToCopy);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedLink ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'QR Linki Kopyalandı' : 'QR Linkini Kopyala'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        await addConnectedDevice({
                          deviceName: newDeviceName,
                          deviceType: newDeviceType,
                          appName: qrMode === 'protocol' ? 'FlowBrowser' : 'Flow Ekosistemi',
                        });
                        setPairingSuccess(true);
                      }}
                      className="flex-1 py-2.5 bg-[#2478F2] hover:bg-[#1a68d8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Eşlemeyi Onayla</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Delete Account Confirmation */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-200 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Flow Hesabını Silmek Üzeresiniz</h3>
              <p className="text-xs text-slate-500">
                Bu işlem geri alınamaz. FlowBrowser, FlowSearch, FlowMusic ve FlowDrive üzerindeki tüm verileriniz kalıcı olarak silinecektir.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {deleteError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                İşlemi onaylamak için mevcut şifrenizi girin
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? 'Siliniyor...' : 'Evet, Kalıcı Olarak Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL: Two-Factor Authentication Setup */}
      {twoFactorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            {twoFactorStep === 1 ? (
              <>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2478F2] flex items-center justify-center mx-auto shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    İki Adımlı Doğrulamayı (2FA) Kur
                  </h3>
                  <p className="text-xs text-slate-500">
                    Google Authenticator, Microsoft Authenticator veya Authy uygulamanızla QR kodu tarayın.
                  </p>
                </div>

                {twoFactorError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{twoFactorError}</span>
                  </div>
                )}

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                    <QRCodeSVG
                      value={`otpauth://totp/FlowHesap:${encodeURIComponent(user.email || 'user')}?secret=${totpSecret}&issuer=Flow`}
                      size={170}
                      level="M"
                      marginSize={2}
                    />
                  </div>

                  <div className="w-full text-center space-y-1">
                    <p className="text-[11px] font-semibold text-slate-500">Manuel Gizli Anahtar</p>
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 text-xs font-mono">
                      <span className="font-bold text-slate-800 tracking-wider select-all">{totpSecret}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(totpSecret);
                          setCopiedSecret(true);
                          setTimeout(() => setCopiedSecret(false), 2000);
                        }}
                        className="p-1 text-slate-500 hover:text-[#2478F2] rounded-lg transition-colors cursor-pointer"
                        title="Anahtarı Kopyala"
                      >
                        {copiedSecret ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 6-Digit Code Verification Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Uygulamanızdaki 6 Haneli Doğrulama Kodu
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={twoFactorInput}
                    onChange={(e) => setTwoFactorInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#2478F2] outline-none transition-all"
                  />
                  <p className="text-[11px] text-slate-400 text-center">
                    Authenticator uygulamanızın anlık ürettiği 6 haneli kodu girin.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setTwoFactorModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm2FA}
                    disabled={twoFactorLoading || twoFactorInput.length < 6}
                    className="flex-1 py-2.5 bg-[#2478F2] hover:bg-[#1a68d8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {twoFactorLoading ? 'Doğrulanıyor...' : 'Doğrula ve Aktifleştir'}
                  </button>
                </div>
              </>
            ) : (
              /* Step 2: Backup Codes Generated */
              <div className="space-y-5">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    İki Adımlı Doğrulama Aktifleştirildi!
                  </h3>
                  <p className="text-xs text-slate-500">
                    Telefonunuza erişemediğinizde kullanabileceğiniz acil durum kurtarma kodlarınız aşağıdadır. Bu kodları güvenli bir yere kaydedin.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-white rounded-lg border border-slate-200 text-center font-mono text-xs font-bold text-slate-800"
                      >
                        {code}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(backupCodes.join('\n'));
                        setCopiedBackupCodes(true);
                        setTimeout(() => setCopiedBackupCodes(false), 2000);
                      }}
                      className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedBackupCodes ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBackupCodes ? 'Kopyalandı' : 'Tümünü Kopyala'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadBackupCodes(backupCodes)}
                      className="flex-1 py-2 bg-white hover:bg-slate-100 text-[#2478F2] text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Dosya Olarak İndir (.txt)</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTwoFactorModalOpen(false);
                    setTwoFactorStep(1);
                  }}
                  className="w-full py-2.5 bg-[#2478F2] hover:bg-[#1a68d8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Tamamla ve Güvenliği Koru
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: View Existing Backup Codes */}
      {viewBackupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2478F2] flex items-center justify-center mx-auto">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Acil Durum Yedek Kodlarınız</h3>
              <p className="text-xs text-slate-500">
                Telefonunuz yanınızda olmadığında veya uygulamanızı sildiğinizde bu kodlarla oturum açabilirsiniz. Her kod bir kez geçerlidir.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {(twoFactorConfig?.backupCodes || []).map((code, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-white rounded-lg border border-slate-200 text-center font-mono text-xs font-bold text-slate-800"
                  >
                    {code}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText((twoFactorConfig?.backupCodes || []).join('\n'));
                    setCopiedBackupCodes(true);
                    setTimeout(() => setCopiedBackupCodes(false), 2000);
                  }}
                  className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedBackupCodes ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBackupCodes ? 'Kopyalandı' : 'Tümünü Kopyala'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadBackupCodes(twoFactorConfig?.backupCodes || [])}
                  className="flex-1 py-2 bg-white hover:bg-slate-100 text-[#2478F2] text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>İndir (.txt)</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setViewBackupModalOpen(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Disable 2FA Confirmation */}
      {disable2FAModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-200 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">İki Adımlı Doğrulamayı Kapat</h3>
              <p className="text-xs text-slate-500">
                2FA'yı devre dışı bırakmak hesap güvenliğinizi önemli ölçüde zayıflatır. Şifreniz ele geçirilirse hesabınıza doğrudan erişilebilir.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDisable2FAModalOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleDisable2FA}
                disabled={twoFactorLoading}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {twoFactorLoading ? 'Kapatılıyor...' : 'Evet, 2FA\'yı Kapat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
