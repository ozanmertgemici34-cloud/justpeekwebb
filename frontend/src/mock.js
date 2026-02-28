// Mock data for JustPeek marketing site

export const features = [
  {
    id: 1,
    icon: "Target",
    title: "Kusursuz Aimbot & Hedef Takibi",
    description: "Rakiplerinizi birer mıknatıs gibi çekin. İnsan benzeri yumuşak geçişlerle, izleyen kimsenin anlayamayacağı bir hassasiyet kazanın.",
    gradient: "from-red-600 to-rose-600"
  },
  {
    id: 2,
    icon: "Eye",
    title: "Taktiksel Görüş Sistemi (ESP)",
    description: "Duvarların arkasını bir cam gibi görün. Rakiplerin konumunu, sağlığını ve mesafesini anlık olarak bilmek size oyunun kaderini değiştirme gücü verir.",
    gradient: "from-rose-600 to-pink-600"
  },
  {
    id: 3,
    icon: "Zap",
    title: "Akıllı Triggerbot",
    description: "Crosshair'ınızın ucuna gelen her rakip için ölümcül bir refleks. Milisaniyeler içinde kusursuz atışı yapın.",
    gradient: "from-red-700 to-red-600"
  },
  {
    id: 4,
    icon: "Crosshair",
    title: "Profesyonel Sekme Kontrolü (RCS)",
    description: "Mermileriniz her zaman hedefe gitsin. Doğal ve gerçekçi bir geri tepme kontrolüyle, sprey yeteneklerinizi dünya standartlarına taşıyın.",
    gradient: "from-red-600 to-orange-600"
  },
  {
    id: 5,
    icon: "Users",
    title: "Farkındalık Paneli (Spectator List)",
    description: "Sizi izleyenlerin adını ekranda görün. Kimin gördüğünü bildiğinizde, her zaman güvenli tarafta kalırsınız.",
    gradient: "from-rose-600 to-red-600"
  },
  {
    id: 6,
    icon: "Ghost",
    title: "Efsanevi Stealth Koruması",
    description: "Sıfır iz, dijital kamuflaj ve tam gizlilik. En derin taramalarda bile görünmez kalarak size en güvenli oyun deneyimini sunar.",
    gradient: "from-red-800 to-red-600"
  }
];

export const benefits = [
  {
    id: 1,
    icon: "Plug",
    title: "Tak Çalıştır",
    description: "Karmaşık ayarlar ve dosyalarla uğraşmayın. Saniyeler içinde oyuna hükmetmeye hazırsınız."
  },
  {
    id: 2,
    icon: "Gauge",
    title: "Maksimum Performans",
    description: "Oyun motoruyla tam entegre çalışarak FPS kaybınızı sıfıra indirir."
  },
  {
    id: 3,
    icon: "Palette",
    title: "Modern Arayüz",
    description: "Şık tasarımı ve kullanım kolaylığıyla, ayarlarınızı yapmak hiç bu kadar keyifli olmamıştı."
  }
];

export const securityFeatures = [
  {
    id: 1,
    title: "Sıfır İz",
    description: "Sisteminizde veya oyun dosyalarınızda asla kalıcı bir iz bırakmaz."
  },
  {
    id: 2,
    title: "Dijital Kamuflaj",
    description: "Gelişmiş şifreleme ve gizleme yöntemlerimiz sayesinde, varlığımız anti-cheat sistemleri için bir bilmeceden ibarettir."
  },
  {
    id: 3,
    title: "Tam Gizlilik",
    description: "En derin taramalarda bile görünmez kalarak, size en güvenli oyun deneyimini sunar."
  }
];

export const mockEmails = [
  { id: 1, email: "user1@example.com", date: "2024-12-20", status: "active" },
  { id: 2, email: "user2@example.com", date: "2024-12-19", status: "active" },
  { id: 3, email: "user3@example.com", date: "2024-12-18", status: "active" }
];

export const mockUsers = [
  { 
    id: 1, 
    name: "Ozan Mert Gemici", 
    email: "ozanmertgemici34@gmail.com", 
    password: "ozan201223",
    role: "admin",
    registered: "2024-12-01", 
    status: "active",
    purchases: 5
  },
  { 
    id: 2, 
    name: "Test User", 
    email: "test@example.com", 
    password: "test123",
    role: "user",
    registered: "2024-12-15", 
    status: "active",
    purchases: 2
  },
  { 
    id: 3, 
    name: "Demo User", 
    email: "demo@example.com", 
    password: "demo123",
    role: "user",
    registered: "2024-12-20", 
    status: "active",
    purchases: 1
  }
];

export const mockPurchases = [
  {
    id: 1,
    userId: 2,
    product: "JustPeek - 1 Month",
    price: "$29.99",
    date: "2024-12-20",
    status: "active",
    expiryDate: "2025-01-20"
  },
  {
    id: 2,
    userId: 2,
    product: "JustPeek - 1 Week",
    price: "$9.99",
    date: "2024-12-10",
    status: "expired",
    expiryDate: "2024-12-17"
  },
  {
    id: 3,
    userId: 3,
    product: "JustPeek - 1 Month",
    price: "$29.99",
    date: "2024-12-18",
    status: "active",
    expiryDate: "2025-01-18"
  }
];

export const DISCORD_LINK = "https://discord.gg/Z2MdBahqcN";
