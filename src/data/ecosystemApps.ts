import { FlowEcosystemApp } from '../types';

export const ECOSYSTEM_APPS: FlowEcosystemApp[] = [
  {
    id: 'FlowBrowser',
    name: 'FlowBrowser',
    category: 'Yeni Nesil Web Tarayıcısı',
    tagline: 'Hızlı, gizli ve tamamen size özel web deneyimi.',
    description: 'Yıldırım hızında gezinme, yerel reklam engelleme ve gizlilik kalkanı. Flow Hesap ile yer imleriniz, sekmeleriniz, uzantılarınız ve şifre kasanız tüm masaüstü ve mobil cihazlarınızda anında eşitlenir.',
    icon: 'Globe',
    protocol: 'flowbrowser://account',
    color: '#2478F2',
    syncFeatures: [
      'Yer imleri ve okuma listeleri',
      'Açık sekmeler ve oturum geçmişi',
      'Uçtan uca şifreli şifre kasası',
      'Kişiselleştirilmiş uzantı ve tema ayarları',
    ],
  },
  {
    id: 'FlowSearch',
    name: 'FlowSearch',
    category: 'Gizlilik Odaklı Arama Motoru',
    tagline: 'İzleme yok, sansür yok, sadece saf ve doğru bilgi.',
    description: 'Kullanıcı verilerinizi reklam verenlere satmayan akıllı arama motoru. Arama geçmişiniz ve yapay zeka destekli özetleme tercihleriniz Flow hesabınızda şifrelenerek saklanır.',
    icon: 'Search',
    url: 'https://flow-search.netlify.app',
    color: '#10B981',
    syncFeatures: [
      'Gizli arama geçmişi ve filtreler',
      'Özel arama kısayolları ve widgetlar',
      'Bölge ve dil tercihleri',
    ],
  },
  {
    id: 'FlowMusic',
    name: 'FlowMusic',
    category: 'Yüksek Çözünürlüklü Müzik & Podcast',
    tagline: 'Müziğin ritmini stüdyo kalitesinde yakalayın.',
    description: 'Kayıpsız Hi-Fi ses kalitesi, milyonlarca parça ve özel podcastler. Favori parçalarınız ve çalma listeleriniz her platformda kesintisiz akar.',
    icon: 'Music',
    url: 'https://flowmusic-app.netlify.app',
    color: '#EC4899',
    syncFeatures: [
      'Kişisel çalma listeleri ve favoriler',
      'Çevrimdışı indirme lisansları',
      'Ekolayzer ve ses profilleri',
    ],
  },
  {
    id: 'FlowDrive',
    name: 'FlowDrive',
    category: 'Güvenli Bulut Depolama',
    tagline: 'Dosyalarınız askeri düzeyde şifrelemeyle güvende.',
    description: 'Fotoğraflarınız, belgeleriniz ve yedeklemeleriniz için sıfır-bilgi (zero-knowledge) şifreli bulut alanı. Tek tıkla güvenli paylaşım bağlantıları oluşturun.',
    icon: 'HardDrive',
    url: 'https://flow-drive.netlify.app',
    color: '#8B5CF6',
    syncFeatures: [
      'Otomatik kamera ve galeri yedekleme',
      'Sürüm geçmişi ve dosya kurtarma',
      'Şifreli bağlantı ile dosya paylaşımı',
    ],
  },
];

export const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
];
