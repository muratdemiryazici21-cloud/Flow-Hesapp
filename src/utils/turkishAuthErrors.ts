export function getTurkishAuthErrorMessage(codeOrMessage: string): string {
  let text = codeOrMessage;
  try {
    if (codeOrMessage.trim().startsWith('{')) {
      const parsed = JSON.parse(codeOrMessage);
      if (parsed.error) {
        text = parsed.error;
      }
    }
  } catch {
    // not json
  }

  const code = text.toLowerCase();

  if (code.includes('auth/invalid-credential') || code.includes('invalid-login-credentials')) {
    return 'Girdiğiniz e-posta adresi veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.';
  }
  if (code.includes('auth/wrong-password')) {
    return 'Girdiğiniz şifre hatalı. Lütfen tekrar deneyin veya şifrenizi sıfırlayın.';
  }
  if (code.includes('auth/user-not-found')) {
    return 'Bu e-posta adresine bağlı bir Flow hesabı bulunamadı.';
  }
  if (code.includes('auth/email-already-in-use')) {
    return 'Bu e-posta adresi zaten kullanımda. Lütfen giriş yapın veya farklı bir e-posta deneyin.';
  }
  if (code.includes('auth/invalid-email')) {
    return 'Lütfen geçerli bir e-posta adresi girin.';
  }
  if (code.includes('auth/weak-password')) {
    return 'Şifreniz çok zayıf. Şifre en az 6 karakter olmalı ve harf ile rakam içermelidir.';
  }
  if (code.includes('auth/too-many-requests')) {
    return 'Çok fazla başarısız deneme yapıldı. Güvenliğiniz için hesabınız geçici olarak kilitlendi. Lütfen birkaç dakika sonra tekrar deneyin.';
  }
  if (code.includes('auth/network-request-failed')) {
    return 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.';
  }
  if (code.includes('auth/popup-closed-by-user')) {
    return 'Google ile giriş penceresi işlem tamamlanmadan kapatıldı.';
  }
  if (code.includes('auth/popup-blocked')) {
    return 'Açılır pencere tarayıcınız tarafından engellendi. Lütfen pop-up engelleyicinizi kapatıp tekrar deneyin.';
  }
  if (code.includes('auth/operation-not-allowed')) {
    return 'Google ile giriş bu Firebase projesinde henüz etkinleştirilmemiş. Lütfen e-posta ve şifrenizle giriş yapın veya hesap oluşturun.';
  }
  if (code.includes('auth/unauthorized-domain')) {
    return 'Bu alan adı Firebase konsolunda yetkilendirilmemiş.';
  }
  if (code.includes('auth/cancelled-popup-request')) {
    return 'Açılır pencere isteği iptal edildi.';
  }
  if (code.includes('requires-recent-login')) {
    return 'Bu hassas işlem için lütfen oturumunuzu yeniden açın.';
  }
  if (code.includes('username-taken')) {
    return 'Bu kullanıcı adı zaten başka bir Flow kullanıcısı tarafından alınmış.';
  }
  if (code.includes('passwords-do-not-match')) {
    return 'Girdiğiniz şifreler birbiriyle eşleşmiyor.';
  }
  if (code.includes('permission-denied') || code.includes('missing or insufficient permissions')) {
    return 'Veritabanı erişim yetki hatası (Firestore Kuralları). Lütfen güvenlik kurallarınızı kontrol edin.';
  }

  return text.length < 120 && !text.includes('Firebase:') ? text : 'Bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.';
}
