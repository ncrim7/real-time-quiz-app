➤ Tanıtım Videosu : [`Video`](https://www.youtube.com/watch?v=yzVxxUGjL58)
# 🎯 Real-Time Quiz App

Gelişmiş, gerçek zamanlı çok oyunculu quiz platformu. Kullanıcılar kayıt olup giriş yapabilir, quiz oluşturabilir, canlı quiz oturumlarına PIN ile katılabilir ve skor tablosu görebilir. Modern admin paneli, kullanıcı profili, gelişmiş dashboard ve yönetim özellikleriyle birlikte gelir.

## 🚀 Özellikler

### ✨ Temel Özellikler
- **Kullanıcı Yönetimi**: JWT tabanlı kayıt ve giriş sistemi
- **Quiz Oluşturma**: Kolay quiz oluşturma, düzenleme ve yönetim
- **Gerçek Zamanlı Oyun**: Socket.io ile canlı quiz oturumları
- **PIN Sistemi**: Oda kodu ile kolay katılım
- **Responsive Tasarım**: Tüm cihazlarda uyumlu modern arayüz

### 🎮 Canlı Quiz Deneyimi
- **Lobby Sistemi**: Quiz başlamadan önce bekleme odası
- **Zamanlayıcı**: Her soru için otomatik geri sayım
- **Gerçek Zamanlı Cevaplar**: Her oyuncunun kendi cevabını verebilmesi
- **Akıllı Geçiş**: Tüm oyuncular cevap verince veya süre dolunca otomatik yeni soruya geçiş
- **Cevap Kilitleme**: Cevap verildikten sonra butonların kilitlenmesi
- **Bekleme Mesajları**: "Diğer oyuncular bekleniyor" bildirimleri

### 📊 Skorlama ve Analiz
- **Gerçek Zamanlı Skor Tablosu**: Puan sıralamalı canlı skor tablosu
- **Quiz Geçmişi**: Tüm geçmiş quiz sonuçları
- **Kullanıcı Profili**: Kişisel istatistikler ve başarılar
- **Analytics Dashboard**: Detaylı performans analizi

### 👨‍💼 Admin Paneli
- **Kullanıcı Yönetimi**: Kullanıcı listeleme, düzenleme ve yönetimi
- **Quiz Yönetimi**: Tüm quizleri görüntüleme ve yönetme
- **Canlı Quiz Kontrol**: Aktif quiz oturumlarını başlatma/sonlandırma
- **Analytics**: Detaylı kullanım istatistikleri
- **Rol Tabanlı Erişim**: Sadece admin rolüne sahip kullanıcılar için erişim

### 🎛️ Gelişmiş Kontroller
- **Quiz Sahibi Kontrolleri**: Canlı quiz bekleme odasında quiz sonlandırma
- **Bağlantı Yönetimi**: Bağlantı kopması ve yeniden katılım altyapısı
- **Hata Yönetimi**: Kapsamlı hata yakalama ve kullanıcı bilgilendirme

## 🛠️ Teknoloji Stack

### Backend
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL veritabanı
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token kimlik doğrulama
- **Socket.io**: Gerçek zamanlı iletişim

### Frontend
- **React**: UI kütüphanesi
- **Material-UI (MUI)**: Modern component kütüphanesi
- **CSS3**: Modern styling ve animasyonlar
- **Responsive Design**: Mobil-first tasarım yaklaşımı

## 📁 Proje Yapısı

```
real-time-quiz-app/
│
├── backend/                    # Backend API ve Socket servisleri
│   ├── models/                # MongoDB modelleri
│   ├── routes/                # API route'ları
│   ├── middleware/            # Middleware fonksiyonları
│   ├── socket/                # Socket.io event yönetimi
│   ├── config/                # Veritabanı ve konfigürasyon
│   └── server.js              # Ana server dosyası
│
├── frontend/                   # React frontend uygulaması
│   ├── src/
│   │   ├── components/        # React bileşenleri
│   │   ├── pages/             # Sayfa bileşenleri
│   │   ├── services/          # API servisleri
│   │   ├── context/           # React Context
│   │   └── utils/             # Yardımcı fonksiyonlar
│   └── public/                # Statik dosyalar
│
└── README.md                  # Bu dosya
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v14 veya üzeri)
- MongoDB (v4.0 veya üzeri)
- npm veya yarn

### Backend Kurulumu

1. Backend klasörüne gidin:
```bash
cd backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment variables dosyası oluşturun (`.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quiz-app
JWT_SECRET=your-secret-key
```

4. Development modunda çalıştırın:
```bash
npm run dev
```

### Frontend Kurulumu

1. Frontend klasörüne gidin:
```bash
cd frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Development server'ı başlatın:
```bash
npm start
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 🎯 Kullanım Kılavuzu

### Quiz Oluşturma
1. Hesap oluşturun veya giriş yapın
2. Dashboard'dan "Quiz Oluştur" butonuna tıklayın
3. Quiz başlığı, açıklama ve soruları ekleyin
4. Her soru için çoktan seçmeli cevaplar ve doğru cevabı belirleyin
5. Quiz'i kaydedin

### Canlı Quiz Oturumu Başlatma
1. Oluşturduğunuz quiz'i seçin
2. "Canlı Quiz Başlat" butonuna tıklayın
3. Sistem size benzersiz bir PIN kodu verecek
4. PIN kodunu katılımcılarla paylaşın

### Quiz'e Katılma
1. Ana sayfadan "Oyuna Katıl" seçeneğini seçin
2. Size verilen PIN kodunu girin
3. İsminizi girin ve lobby'de bekleyin
4. Quiz başladığında sorulara cevap verin

### Admin Paneli Kullanımı
1. Admin yetkisine sahip hesapla giriş yapın
2. Üst menüden "Admin Panel" seçeneğini seçin
3. Kullanıcıları, quiz'leri ve analytics'i yönetin
4. Canlı quiz oturumlarını kontrol edin

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/profile` - Kullanıcı profili

### Quiz Management
- `GET /api/quizzes` - Quiz listesi
- `POST /api/quizzes` - Quiz oluşturma
- `GET /api/quizzes/:id` - Quiz detayı
- `PUT /api/quizzes/:id` - Quiz güncelleme
- `DELETE /api/quizzes/:id` - Quiz silme

### Live Quiz
- `POST /api/live/start/:quizId` - Canlı quiz başlatma
- `POST /api/live/join` - Quiz'e katılma
- `POST /api/live/answer` - Cevap gönderme
- `GET /api/live/results/:sessionId` - Sonuçları görüntüleme

### Admin
- `GET /api/admin/users` - Kullanıcı listesi
- `GET /api/admin/quizzes` - Tüm quiz'ler
- `GET /api/admin/analytics` - İstatistikler
- `POST /api/admin/manage-session` - Quiz oturumu yönetimi

## 🔌 Socket Events

### Client → Server
- `join-quiz` - Quiz odasına katılma
- `submit-answer` - Cevap gönderme
- `leave-quiz` - Quiz'den ayrılma

### Server → Client
- `quiz-started` - Quiz başlama bildirimi
- `new-question` - Yeni soru gönderimi
- `question-results` - Soru sonuçları
- `quiz-ended` - Quiz bitiş bildirimi
- `scoreboard-update` - Skor tablosu güncelleme
- `player-joined` - Yeni oyuncu katılımı
- `waiting-for-players` - Oyuncu bekleme durumu

## 🎨 UI/UX Özellikleri

- **Modern Tasarım**: Material Design prensipleri
- **Dark/Light Mode**: Tema değiştirme desteği
- **Animasyonlar**: Smooth geçişler ve hover efektleri
- **Loading States**: Kullanıcı deneyimini iyileştiren yükleme durumları
- **Error Handling**: Kullanıcı dostu hata mesajları
- **Mobile Optimization**: Mobil cihazlar için optimize edilmiş arayüz

## 🔒 Güvenlik Özellikleri

- JWT tabanlı authentication
- Rol tabanlı yetkilendirme (RBAC)
- Rate limiting
- Input validation ve sanitization
- CORS konfigürasyonu
- Güvenli Socket.io connections

## 📈 Gelecek Geliştirmeler

- [ ] Multimedya desteği (resim, video sorular)
- [ ] Sesli cevap desteği
- [ ] AI destekli soru önerileri
- [ ] Advanced analytics ve reporting
- [ ] Mobile aplikasyon (React Native)
- [ ] Çoklu dil desteği (i18n)
- [ ] Sosyal medya entegrasyonu
- [ ] Turnuva modu
- [ ] Özel tema desteği

## 🐛 Bilinen Sorunlar ve Çözümler

### Yaygın Sorunlar
1. **Socket bağlantı problemi**: Server'ın çalıştığından emin olun
2. **MongoDB bağlantı hatası**: MongoDB servisinin aktif olduğunu kontrol edin
3. **JWT token süresi**: Token süresi dolmuşsa tekrar giriş yapın

### Hata Ayıklama
- Browser console'u kontrol edin
- Server log'larını inceleyin
- Network tab'ında API isteklerini kontrol edin

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun 
3. Değişikliklerinizi commit edin 
4. Branch'inizi push edin 
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakınız.

## 👨‍💻 Geliştiriciler

- **GitHub**: [@ncrim7](https://github.com/ncrim7)
- **GitHub**: [@ncrim7](https://github.com/erdembaltaci)

## 📞 İletişim

Sorularınız veya önerileriniz için:
- GitHub Issues üzerinden issue açın
- Pull request gönderin

## 🙏 Teşekkürler

Bu projenin geliştirilmesinde kullanılan açık kaynak kütüphanelere ve topluma teşekkürler.

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
