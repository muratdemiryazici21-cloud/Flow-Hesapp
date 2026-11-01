export interface UserProfile {
  uid: string;
  displayName: string;
  username: string;
  email: string;
  photoURL?: string;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
  emailVerified?: boolean;
}

export interface UserSession {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'browser';
  os: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  current: boolean;
  createdAt: string;
}

export interface ConnectedDevice {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: string;
  appName: string;
  linkedAt: string;
  lastSync: string;
  status: 'active' | 'revoked';
}

export interface AuthorizedApp {
  id: string;
  userId: string;
  appName: 'FlowBrowser' | 'FlowSearch' | 'FlowMusic' | 'FlowDrive';
  authorizedAt: string;
  status: 'active' | 'revoked';
  permissions: string[];
  token?: string;
}

export interface SecurityLog {
  id: string;
  userId: string;
  action: string;
  type: 'login' | 'security' | 'device' | 'oauth' | 'profile' | 'app';
  category?: 'login' | 'security' | 'device' | 'oauth' | 'profile' | 'app';
  device?: string;
  deviceName?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  location?: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info';
  details?: string;
  userAgent?: string;
}

export interface PrivacySettings {
  userId: string;
  flowBrowserBookmarksSync?: boolean;
  flowBrowserPasswordsSync?: boolean;
  flowBrowserTabsSync?: boolean;
  searchHistorySync?: boolean;
  musicSync?: boolean;
  driveAutoSync?: boolean;
  loginAlerts?: boolean;
  marketingEmails?: boolean;
  syncBookmarks?: boolean;
  syncHistory?: boolean;
  syncPasswords?: boolean;
  activityHistory?: boolean;
  locationTracking?: boolean;
  personalizedAds?: boolean;
  updatedAt?: string;
  [key: string]: any;
}

export interface TwoFactorConfig {
  userId: string;
  enabled: boolean;
  secret?: string;
  backupCodes?: string[];
  enabledAt?: string;
}

export interface FlowEcosystemApp {
  id: 'FlowBrowser' | 'FlowSearch' | 'FlowMusic' | 'FlowDrive';
  name: string;
  category: string;
  tagline: string;
  description: string;
  icon: string;
  syncFeatures: string[];
  protocol?: string;
  url?: string;
  color: string;
}
