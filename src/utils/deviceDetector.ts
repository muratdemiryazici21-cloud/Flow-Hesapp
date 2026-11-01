export interface DetectedDeviceInfo {
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'browser';
  os: string;
  browser: string;
  ipAddress: string;
  location: string;
}

export async function detectCurrentDevice(): Promise<DetectedDeviceInfo> {
  const ua = navigator.userAgent;
  let os = 'Bilinmeyen İşletim Sistemi';
  let deviceType: 'desktop' | 'mobile' | 'tablet' | 'browser' = 'desktop';
  let browser = 'Modern Web Tarayıcısı';

  // OS detection
  if (/Windows NT 10.0/i.test(ua)) os = 'Windows 11/10';
  else if (/Windows NT/i.test(ua)) os = 'Windows PC';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Android/i.test(ua)) {
    os = 'Android';
    deviceType = 'mobile';
  } else if (/iPad/i.test(ua)) {
    os = 'iPadOS';
    deviceType = 'tablet';
  } else if (/iPhone/i.test(ua)) {
    os = 'iOS';
    deviceType = 'mobile';
  } else if (/Linux/i.test(ua)) os = 'Linux';

  // Browser detection
  if (ua.includes('FlowBrowser')) {
    browser = 'FlowBrowser';
  } else if (/Edg\//i.test(ua)) {
    browser = 'Microsoft Edge';
  } else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) {
    browser = 'Google Chrome';
  } else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
    browser = 'Apple Safari';
  } else if (/Firefox\//i.test(ua)) {
    browser = 'Mozilla Firefox';
  }

  let ipAddress = '127.0.0.1';
  let location = 'Türkiye';

  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.ip) ipAddress = data.ip;
      if (data.city && data.country_name) {
        location = `${data.city}, ${data.country_name}`;
      } else if (data.country_name) {
        location = data.country_name;
      }
    }
  } catch {
    try {
      const res2 = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(2000) });
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2.ip) ipAddress = data2.ip;
      }
    } catch {
      ipAddress = '192.168.1.50';
    }
  }

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone && location === 'Türkiye') {
      if (timeZone.includes('Istanbul')) location = 'İstanbul, Türkiye';
      else if (timeZone.includes('Ankara') || timeZone.includes('Turkey')) location = 'Ankara, Türkiye';
      else if (timeZone.includes('Izmir')) location = 'İzmir, Türkiye';
      else location = timeZone.replace('_', ' ');
    }
  } catch {
    // keep default
  }

  const deviceName = `${os} (${browser})`;

  return {
    deviceName,
    deviceType,
    os,
    browser,
    ipAddress,
    location,
  };
}
