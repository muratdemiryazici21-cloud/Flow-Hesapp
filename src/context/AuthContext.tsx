import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword as firebaseUpdatePassword,
  updateEmail as firebaseUpdateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser as firebaseDeleteUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase/config';
import {
  UserProfile,
  UserSession,
  ConnectedDevice,
  AuthorizedApp,
  SecurityLog,
  PrivacySettings,
  TwoFactorConfig,
} from '../types';
import { detectCurrentDevice } from '../utils/deviceDetector';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  sessions: UserSession[];
  connectedDevices: ConnectedDevice[];
  authorizedApps: AuthorizedApp[];
  securityLogs: SecurityLog[];
  privacySettings: PrivacySettings | null;
  twoFactorConfig: TwoFactorConfig | null;
  loading: boolean;
  currentSessionId: string;
  signUpWithEmail: (email: string, pass: string, name: string, username: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateUserProfileData: (data: { displayName?: string; username?: string; photoURL?: string; bio?: string }) => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
  changeEmail: (newEmail: string, currentPass: string) => Promise<void>;
  terminateOtherSessions: () => Promise<void>;
  terminateSession: (sessionId: string) => Promise<void>;
  removeConnectedDevice: (deviceId: string) => Promise<void>;
  addConnectedDevice: (device: Partial<ConnectedDevice>) => Promise<void>;
  authorizeApp: (appName: AuthorizedApp['appName'], permissions: string[]) => Promise<string>;
  revokeApp: (appId: string) => Promise<void>;
  deleteAccount: (currentPass?: string) => Promise<void>;
  logSecurityEvent: (action: string, type: SecurityLog['type'], status?: SecurityLog['status'], details?: string) => Promise<void>;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => Promise<void>;
  enable2FA: (secret: string, backupCodes: string[]) => Promise<void>;
  disable2FA: () => Promise<void>;
  exportUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate or retrieve persistent session ID for current browser tab/storage
function getOrCreateSessionId(): string {
  let sId = localStorage.getItem('flow_session_id');
  if (!sId) {
    sId = 'sess_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    localStorage.setItem('flow_session_id', sId);
  }
  return sId;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [authorizedApps, setAuthorizedApps] = useState<AuthorizedApp[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [twoFactorConfig, setTwoFactorConfig] = useState<TwoFactorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const currentSessionId = getOrCreateSessionId();

  // Helper to log security actions into Firestore
  const logSecurityEvent = async (
    action: string,
    type: SecurityLog['type'],
    status: SecurityLog['status'] = 'info',
    details?: string
  ) => {
    const targetUser = auth.currentUser;
    if (!targetUser) return;
    const currentDevice = await detectCurrentDevice();
    const now = new Date().toISOString();
    const logId = 'log_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);

    try {
      await setDoc(doc(db, 'users', targetUser.uid, 'securityLogs', logId), {
        id: logId,
        userId: targetUser.uid,
        action,
        type,
        deviceName: currentDevice.deviceName,
        deviceType: currentDevice.deviceType,
        os: currentDevice.os,
        browser: currentDevice.browser,
        ipAddress: currentDevice.ipAddress,
        location: currentDevice.location,
        timestamp: now,
        status,
        details: details || '',
      });
    } catch (e) {
      console.warn('Could not record security log:', e);
    }
  };

  // Seed default demo devices and initial setup if newly registered
  const seedDefaultUserData = async (uid: string) => {
    const currentDevice = await detectCurrentDevice();
    const now = new Date().toISOString();

    // 1. Current Session
    const currentSessionRef = doc(db, 'users', uid, 'sessions', currentSessionId);
    try {
      await setDoc(currentSessionRef, {
        id: currentSessionId,
        userId: uid,
        deviceName: currentDevice.deviceName,
        deviceType: currentDevice.deviceType,
        os: currentDevice.os,
        browser: currentDevice.browser,
        ipAddress: currentDevice.ipAddress,
        location: currentDevice.location,
        lastActive: now,
        current: true,
        createdAt: now,
      });
    } catch (e) {
      console.warn('Could not record initial session:', e);
    }

    // 2. Connected devices
    const primaryDeviceRef = doc(db, 'users', uid, 'connectedDevices', 'device_primary');
    try {
      await setDoc(primaryDeviceRef, {
        id: 'device_primary',
        userId: uid,
        deviceName: currentDevice.deviceName,
        deviceType: currentDevice.deviceType,
        appName: 'Flow Hesap Web',
        linkedAt: now,
        lastSync: now,
        status: 'active',
      });
    } catch (e) {
      console.warn('Could not record initial connected device:', e);
    }

    // 3. FlowBrowser App authorization
    const flowBrowserAppRef = doc(db, 'users', uid, 'authorizedApps', 'app_flowbrowser');
    try {
      await setDoc(flowBrowserAppRef, {
        id: 'app_flowbrowser',
        userId: uid,
        appName: 'FlowBrowser',
        authorizedAt: now,
        status: 'active',
        permissions: ['profile', 'bookmarks', 'passwords_vault', 'history'],
        token: 'flw_live_' + Math.random().toString(36).substring(2, 16),
      });
    } catch (e) {
      console.warn('Could not record initial authorized app:', e);
    }

    // 4. Default Privacy Settings
    const privacyDocRef = doc(db, 'users', uid, 'settings', 'privacy');
    try {
      await setDoc(privacyDocRef, {
        userId: uid,
        flowBrowserBookmarksSync: true,
        flowBrowserPasswordsSync: true,
        flowBrowserTabsSync: true,
        searchHistorySync: true,
        musicSync: true,
        driveAutoSync: true,
        loginAlerts: true,
        marketingEmails: false,
        updatedAt: now,
      });
    } catch (e) {
      console.warn('Could not record initial privacy settings:', e);
    }

    // 5. Initial Security Log
    await logSecurityEvent('Hesap Oluşturuldu ve Giriş Yapıldı', 'login', 'success', 'İlk kayıt işlemi tamamlandı.');
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setSessions([]);
        setConnectedDevices([]);
        setAuthorizedApps([]);
        setSecurityLogs([]);
        setPrivacySettings(null);
        setTwoFactorConfig(null);
        setLoading(false);
        return;
      }

      // Fetch or sync user profile from Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        } else {
          // If first sign-in (e.g. Google Popup without existing doc)
          const baseName = currentUser.displayName || 'Flow Kullanıcısı';
          const cleanUsername = (currentUser.email ? currentUser.email.split('@')[0] : 'flow_user')
            .replace(/[^a-zA-Z0-9._-]/g, '')
            .substring(0, 20);

          const newProfile: UserProfile = {
            uid: currentUser.uid,
            displayName: baseName,
            username: cleanUsername || `user_${currentUser.uid.substring(0, 6)}`,
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await setDoc(userRef, newProfile);
          setProfile(newProfile);

          // Reserve username if possible
          try {
            await setDoc(doc(db, 'usernames', newProfile.username), {
              uid: currentUser.uid,
              username: newProfile.username,
              createdAt: new Date().toISOString(),
            });
          } catch (unameErr) {
            console.warn('Username reservation notice:', unameErr);
          }

          await seedDefaultUserData(currentUser.uid);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentSessionId]);

  // Real-time subcollections listeners for active user
  useEffect(() => {
    if (!user) return;

    // Listen to profile updates
    const userRef = doc(db, 'users', user.uid);
    const unsubProfile = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
    );

    // Listen to active sessions
    const sessionsRef = collection(db, 'users', user.uid, 'sessions');
    const unsubSessions = onSnapshot(
      sessionsRef,
      (snap) => {
        const list: UserSession[] = [];
        snap.forEach((d) => {
          const data = d.data() as UserSession;
          list.push({
            ...data,
            current: data.id === currentSessionId,
          });
        });
        setSessions(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/sessions`);
      }
    );

    // Listen to connected devices
    const devicesRef = collection(db, 'users', user.uid, 'connectedDevices');
    const unsubDevices = onSnapshot(
      devicesRef,
      (snap) => {
        const list: ConnectedDevice[] = [];
        snap.forEach((d) => {
          list.push(d.data() as ConnectedDevice);
        });
        setConnectedDevices(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/connectedDevices`);
      }
    );

    // Listen to authorized apps
    const appsRef = collection(db, 'users', user.uid, 'authorizedApps');
    const unsubApps = onSnapshot(
      appsRef,
      (snap) => {
        const list: AuthorizedApp[] = [];
        snap.forEach((d) => {
          list.push(d.data() as AuthorizedApp);
        });
        setAuthorizedApps(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/authorizedApps`);
      }
    );

    // Listen to security logs
    const logsRef = collection(db, 'users', user.uid, 'securityLogs');
    const unsubLogs = onSnapshot(
      logsRef,
      (snap) => {
        const list: SecurityLog[] = [];
        snap.forEach((d) => {
          list.push(d.data() as SecurityLog);
        });
        // Sort newest first
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setSecurityLogs(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/securityLogs`);
      }
    );

    // Listen to privacy settings
    const privacyDoc = doc(db, 'users', user.uid, 'settings', 'privacy');
    const unsubPrivacy = onSnapshot(
      privacyDoc,
      (docSnap) => {
        if (docSnap.exists()) {
          setPrivacySettings(docSnap.data() as PrivacySettings);
        } else {
          // Initialize default privacy settings
          const defaultSettings: PrivacySettings = {
            userId: user.uid,
            flowBrowserBookmarksSync: true,
            flowBrowserPasswordsSync: true,
            flowBrowserTabsSync: true,
            searchHistorySync: true,
            musicSync: true,
            driveAutoSync: true,
            loginAlerts: true,
            marketingEmails: false,
          };
          setPrivacySettings(defaultSettings);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}/settings/privacy`);
      }
    );

    // Listen to 2FA config
    const twoFactorDoc = doc(db, 'users', user.uid, 'settings', 'twoFactor');
    const unsub2FA = onSnapshot(
      twoFactorDoc,
      (docSnap) => {
        if (docSnap.exists()) {
          setTwoFactorConfig(docSnap.data() as TwoFactorConfig);
        } else {
          setTwoFactorConfig({ userId: user.uid, enabled: false });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}/settings/twoFactor`);
      }
    );

    // Update current session timestamp every 3 minutes
    const interval = setInterval(async () => {
      try {
        const currentSessionDoc = doc(db, 'users', user.uid, 'sessions', currentSessionId);
        await updateDoc(currentSessionDoc, {
          lastActive: new Date().toISOString(),
        });
      } catch {
        // silent fail for heartbeat
      }
    }, 180000);

    return () => {
      unsubProfile();
      unsubSessions();
      unsubDevices();
      unsubApps();
      unsubLogs();
      unsubPrivacy();
      unsub2FA();
      clearInterval(interval);
    };
  }, [user, currentSessionId]);

  // Sign up with Email and Password
  const signUpWithEmail = async (email: string, pass: string, name: string, rawUsername: string) => {
    const cleanUsername = rawUsername.trim().toLowerCase().replace(/[^a-zA-Z0-9._-]/g, '');
    if (cleanUsername.length < 3) {
      throw new Error('Kullanıcı adı en az 3 karakterden oluşmalıdır.');
    }

    const usernameDocRef = doc(db, 'usernames', cleanUsername);
    const usernameSnap = await getDoc(usernameDocRef);
    if (usernameSnap.exists()) {
      throw new Error('username-taken');
    }

    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = cred.user;

    try {
      await updateProfile(newUser, { displayName: name });
    } catch {
      // non fatal
    }

    const now = new Date().toISOString();
    const userProfile: UserProfile = {
      uid: newUser.uid,
      displayName: name,
      username: cleanUsername,
      email: email,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'users', newUser.uid), userProfile);
      await setDoc(usernameDocRef, {
        uid: newUser.uid,
        username: cleanUsername,
        createdAt: now,
      });
      await seedDefaultUserData(newUser.uid);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${newUser.uid}`);
    }
  };

  // Sign in with Email and Password
  const signInWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const currentDevice = await detectCurrentDevice();
    const now = new Date().toISOString();

    try {
      await setDoc(doc(db, 'users', cred.user.uid, 'sessions', currentSessionId), {
        id: currentSessionId,
        userId: cred.user.uid,
        deviceName: currentDevice.deviceName,
        deviceType: currentDevice.deviceType,
        os: currentDevice.os,
        browser: currentDevice.browser,
        ipAddress: currentDevice.ipAddress,
        location: currentDevice.location,
        lastActive: now,
        current: true,
        createdAt: now,
      });
      await logSecurityEvent('Oturum Açıldı (E-posta)', 'login', 'success', `${currentDevice.deviceName} üzerinden giriş yapıldı.`);
    } catch (err) {
      console.warn('Session record warning:', err);
    }
  };

  // Sign in with Google (Popup)
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    const currentDevice = await detectCurrentDevice();
    const now = new Date().toISOString();

    try {
      await setDoc(doc(db, 'users', cred.user.uid, 'sessions', currentSessionId), {
        id: currentSessionId,
        userId: cred.user.uid,
        deviceName: currentDevice.deviceName,
        deviceType: currentDevice.deviceType,
        os: currentDevice.os,
        browser: currentDevice.browser,
        ipAddress: currentDevice.ipAddress,
        location: currentDevice.location,
        lastActive: now,
        current: true,
        createdAt: now,
      });
      await logSecurityEvent('Google İle Hızlı Giriş Yapıldı', 'login', 'success', `${currentDevice.deviceName} üzerinden Google oturumu doğrulandı.`);
    } catch (err) {
      console.warn('Google sign-in session record warning:', err);
    }
  };

  // Sign out
  const signOut = async () => {
    if (user) {
      try {
        await logSecurityEvent('Oturum Kapatıldı', 'login', 'info', 'Kullanıcı güvenli çıkış yaptı.');
        await deleteDoc(doc(db, 'users', user.uid, 'sessions', currentSessionId));
      } catch {
        // ignore cleanup error on sign out
      }
    }
    await firebaseSignOut(auth);
  };


  // Send password reset email
  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };


  // Update Profile Data
  const updateUserProfileData = async (data: {
    displayName?: string;
    username?: string;
    photoURL?: string;
    bio?: string;
  }) => {
    if (!user || !profile) return;

    const userRef = doc(db, 'users', user.uid);
    const updates: Partial<UserProfile> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (data.username && data.username.toLowerCase() !== profile.username.toLowerCase()) {
      const cleanNew = data.username.trim().toLowerCase().replace(/[^a-zA-Z0-9._-]/g, '');
      if (cleanNew.length < 3) throw new Error('Kullanıcı adı en az 3 karakter olmalıdır.');

      const newUsernameRef = doc(db, 'usernames', cleanNew);
      const snap = await getDoc(newUsernameRef);
      if (snap.exists() && snap.data()?.uid !== user.uid) {
        throw new Error('username-taken');
      }

      try {
        if (profile.username) {
          await deleteDoc(doc(db, 'usernames', profile.username));
        }
        await setDoc(newUsernameRef, {
          uid: user.uid,
          username: cleanNew,
          createdAt: new Date().toISOString(),
        });
        updates.username = cleanNew;
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `usernames/${cleanNew}`);
      }
    }

    try {
      await updateDoc(userRef, updates);
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      await logSecurityEvent('Profil Bilgileri Güncellendi', 'profile', 'info', 'Ad, kullanıcı adı veya avatar değiştirildi.');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }

    try {
      const authProfileUpdates: { displayName?: string; photoURL?: string } = {};
      if (data.displayName) {
        authProfileUpdates.displayName = data.displayName;
      }
      if (data.photoURL !== undefined) {
        if (data.photoURL === '' || (data.photoURL.startsWith('http') && data.photoURL.length < 2000)) {
          authProfileUpdates.photoURL = data.photoURL;
        }
      }
      if (Object.keys(authProfileUpdates).length > 0) {
        await updateProfile(user, authProfileUpdates);
      }
    } catch (authProfileErr) {
      console.warn('Firebase Auth profile sync notice (non-fatal):', authProfileErr);
    }
  };

  // Change Password
  const changePassword = async (currentPass: string, newPass: string) => {
    if (!user || !user.email) throw new Error('Oturum açmış kullanıcı bulunamadı.');
    const credential = EmailAuthProvider.credential(user.email, currentPass);
    await reauthenticateWithCredential(user, credential);
    await firebaseUpdatePassword(user, newPass);
    await logSecurityEvent('Hesap Şifresi Değiştirildi', 'security', 'success', 'Parola başarıyla yenilendi.');
  };

  // Change Email
  const changeEmail = async (newEmail: string, currentPass: string) => {
    if (!user || !user.email) throw new Error('Oturum açmış kullanıcı bulunamadı.');
    const credential = EmailAuthProvider.credential(user.email, currentPass);
    await reauthenticateWithCredential(user, credential);
    await firebaseUpdateEmail(user, newEmail);
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { email: newEmail, updatedAt: new Date().toISOString() });
    await logSecurityEvent('E-posta Adresi Değiştirildi', 'security', 'warning', `E-posta adresi ${newEmail} olarak güncellendi.`);
    try {
      await sendEmailVerification(user);
    } catch {
      // verification email warning
    }
  };

  // Terminate other sessions
  const terminateOtherSessions = async () => {
    if (!user) return;
    try {
      const snap = await getDocs(collection(db, 'users', user.uid, 'sessions'));
      const deletions: Promise<void>[] = [];
      snap.forEach((d) => {
        if (d.id !== currentSessionId) {
          deletions.push(deleteDoc(d.ref));
        }
      });
      await Promise.all(deletions);
      await logSecurityEvent('Diğer Tüm Oturumlar Sonlandırıldı', 'security', 'warning', 'Tüm yabancı tarayıcı oturumları kapatıldı.');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/sessions`);
    }
  };

  // Terminate specific session
  const terminateSession = async (sessionId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'sessions', sessionId));
      await logSecurityEvent('Oturum Sonlandırıldı', 'security', 'warning', `${sessionId} kimlikli oturum kapatıldı.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/sessions/${sessionId}`);
    }
  };

  // Remove connected device
  const removeConnectedDevice = async (deviceId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'connectedDevices', deviceId));
      await logSecurityEvent('Bağlı Cihaz Kaldırıldı', 'device', 'warning', `${deviceId} kimlikli cihazın erişimi iptal edildi.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/connectedDevices/${deviceId}`);
    }
  };

  // Add connected device
  const addConnectedDevice = async (device: Partial<ConnectedDevice>) => {
    if (!user) return;
    const id = device.id || 'dev_' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    try {
      await setDoc(doc(db, 'users', user.uid, 'connectedDevices', id), {
        id,
        userId: user.uid,
        deviceName: device.deviceName || 'Yeni Flow Cihazı',
        deviceType: device.deviceType || 'mobile',
        appName: device.appName || 'Flow Uygulaması',
        linkedAt: now,
        lastSync: now,
        status: 'active',
      });
      await logSecurityEvent('Yeni Cihaz Eşlendi', 'device', 'success', `${device.deviceName || 'Cihaz'} başarıyla bağlandı.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/connectedDevices/${id}`);
    }
  };

  // Authorize Flow application via OAuth flow
  const authorizeApp = async (appName: AuthorizedApp['appName'], permissions: string[]): Promise<string> => {
    if (!user) throw new Error('Kullanıcı oturumu bulunamadı.');
    const appId = 'app_' + appName.toLowerCase();
    const token = 'flw_live_' + Math.random().toString(36).substring(2, 18) + '_' + Date.now().toString(36);
    const now = new Date().toISOString();

    const appDocRef = doc(db, 'users', user.uid, 'authorizedApps', appId);
    try {
      await setDoc(appDocRef, {
        id: appId,
        userId: user.uid,
        appName,
        permissions,
        authorizedAt: now,
        status: 'active',
        token,
      });

      const deviceRef = doc(db, 'users', user.uid, 'connectedDevices', 'device_' + appName.toLowerCase());
      await setDoc(deviceRef, {
        id: 'device_' + appName.toLowerCase(),
        userId: user.uid,
        deviceName: `${appName} Entegrasyonu`,
        deviceType: 'browser',
        appName: appName,
        linkedAt: now,
        lastSync: now,
        status: 'active',
      });

      await logSecurityEvent(`${appName} Uygulaması Yetkilendirildi`, 'oauth', 'success', `OAuth 2.0 belirteci üretildi (${token.substring(0, 10)}...).`);
      return token;
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/authorizedApps/${appId}`);
    }
  };

  // Revoke authorized app
  const revokeApp = async (appId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'authorizedApps', appId));
      await logSecurityEvent('Uygulama Erişimi İptal Edildi', 'oauth', 'warning', `${appId} için OAuth belirteci geçersiz kılındı.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/authorizedApps/${appId}`);
    }
  };

  // Update Privacy Settings
  const updatePrivacySettings = async (settings: Partial<PrivacySettings>) => {
    if (!user) return;
    const privacyDoc = doc(db, 'users', user.uid, 'settings', 'privacy');
    const now = new Date().toISOString();
    try {
      await setDoc(privacyDoc, { ...privacySettings, ...settings, userId: user.uid, updatedAt: now }, { merge: true });
      await logSecurityEvent('Gizlilik Tercihleri Güncellendi', 'security', 'info', 'Senkronizasyon ayarları kaydedildi.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/settings/privacy`);
    }
  };

  // Enable 2FA
  const enable2FA = async (secret: string, backupCodes: string[]) => {
    if (!user) return;
    const twoFactorDoc = doc(db, 'users', user.uid, 'settings', 'twoFactor');
    const now = new Date().toISOString();
    try {
      await setDoc(twoFactorDoc, {
        userId: user.uid,
        enabled: true,
        secret,
        backupCodes,
        enabledAt: now,
      });
      await logSecurityEvent('İki Adımlı Doğrulama (2FA) Aktifleştirildi', 'security', 'success', 'Authenticator uygulaması ve kurtarma kodları tanımlandı.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/settings/twoFactor`);
    }
  };

  // Disable 2FA
  const disable2FA = async () => {
    if (!user) return;
    const twoFactorDoc = doc(db, 'users', user.uid, 'settings', 'twoFactor');
    try {
      await setDoc(twoFactorDoc, {
        userId: user.uid,
        enabled: false,
      });
      await logSecurityEvent('İki Adımlı Doğrulama Devre Dışı Bırakıldı', 'security', 'warning', '2FA koruması kapatıldı.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/settings/twoFactor`);
    }
  };

  // Export User Data (Takeout JSON)
  const exportUserData = () => {
    if (!user || !profile) return;
    const dataToExport = {
      exportDate: new Date().toISOString(),
      platform: 'Flow Hesap (flowaccount.netlify.app)',
      profile,
      activeSessions: sessions,
      connectedDevices,
      authorizedApps,
      privacySettings,
      securityLogs,
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-hesap-verilerim-${profile.username || 'user'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    logSecurityEvent('Hesap Verileri İndirildi', 'security', 'info', 'Kullanıcı tüm Flow verilerini JSON formatında dışa aktardı.');
  };

  // Delete user account
  const deleteAccount = async (currentPass?: string) => {
    if (!user) return;

    if (currentPass && user.email) {
      const credential = EmailAuthProvider.credential(user.email, currentPass);
      await reauthenticateWithCredential(user, credential);
    }

    try {
      if (profile?.username) {
        await deleteDoc(doc(db, 'usernames', profile.username));
      }
      await deleteDoc(doc(db, 'users', user.uid));
      await firebaseDeleteUser(user);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}`);
    }
  };

  const value = {
    user,
    profile,
    sessions,
    connectedDevices,
    authorizedApps,
    securityLogs,
    privacySettings,
    twoFactorConfig,
    loading,
    currentSessionId,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    sendPasswordReset,
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
