# Kahoot-Clone Backend

## Özellikler
- Node.js + Express.js tabanlı REST API
- MongoDB (Mongoose ile)
- JWT tabanlı kimlik doğrulama
- Gerçek zamanlı quiz akışı (Socket.io)
- Quiz oluşturma, başlatma, bitirme, oda kodu ile katılım
- Kullanıcıya özel quiz geçmişi ve skor kaydı
- Modern, güvenli ve ölçeklenebilir altyapı
- **Çok oyunculu canlı quiz:** PIN ile katılım, lobby (bekleme odası), zamanlayıcı, eşzamanlı soru akışı, skor tablosu, quiz geçmişi ve kullanıcı profili
- **Gerçek zamanlı otomasyon:** Her oyuncu kendi cevabını verebilir, tüm oyuncular cevap verince veya süre dolunca otomatik olarak yeni soruya geçilir
- **Bağlantı ve edge-case yönetimi:** Bağlantı kopması, yeniden katılım gibi durumlar için temel altyapı
- **Admin paneli:** Kullanıcı, quiz ve analytics yönetimi, canlı quiz başlatma/sonlandırma, sadece admin rolü için erişim
- **Canlı quiz bekleme odasında quiz sonlandırma:** Sadece quiz sahibi için

## Kurulum
1. Gerekli paketleri yükleyin:
   ```powershell
   cd backend
   npm install
   ```
2. `.env` dosyasındaki ayarları kontrol edin (MongoDB bağlantı adresi, JWT secret, port).
3. Sunucuyu başlatın:
   ```powershell
   npm run dev
   ```

## API Endpointleri
- POST `/api/auth/register` : Kullanıcı kaydı (username, email, password)
- POST `/api/auth/login` : Kullanıcı girişi (JWT döner, rol bilgisi ile)
- GET `/api/user/me` : Kullanıcı profilini ve quiz geçmişini getir (JWT ile korumalı)
- POST `/api/quiz` : Quiz oluştur (JWT ile korumalı)
- GET `/api/quiz` : Tüm quizleri listele
- GET `/api/quiz/:id` : Belirli quiz detayını getir
- POST `/api/quiz/:id/start` : Quiz başlat (oda kodu üretir, quiz'i aktif yapar)
- POST `/api/quiz/:id/end` : Quiz bitir (quiz'i pasif yapar)
- GET `/api/quiz/room/:roomCode` : Oda kodu ile aktif quiz bul
- **Admin API:**
  - GET `/api/admin/users` : Tüm kullanıcıları getir (admin)
  - GET `/api/admin/quizzes` : Tüm quizleri getir (admin)
  - GET `/api/admin/analytics` : Analytics verilerini getir (admin)
  - PUT `/api/admin/quiz/:id` : Quiz düzenle (admin)
  - DELETE `/api/admin/quiz/:id` : Quiz sil (admin)
  - POST `/api/admin/quiz/:id/start` : Quiz başlat (admin)

## Socket.io Eventleri
- `joinRoom` : { roomCode, username } ile odaya katılım
- `getQuestion` : Odanın mevcut sorusunu getirir
- `sendAnswer` : { roomCode, answer, userId, username } ile cevap gönderir
- `nextQuestion` : Sonraki soruya geçer (backend otomasyonu ile)
- `autoNextQuestion` : Süre dolunca veya tüm oyuncular cevap verince backend tarafından otomatik tetiklenir
- `updateScores` : Skor tablosunu günceller
- `quizEnd` : Quiz bittiğinde skorları gönderir
- `lobbyStarted`, `lobbyTimer`, `lobbyPlayers`, `lobbyEnd` : Lobby yönetimi için eventler
- `receiveAnswer` : Her oyuncunun cevabı geldiğinde tetiklenir

## Canlı Quiz Akışı
- Her oyuncu kendi cevabını verebilir, cevap verdikten sonra cevabı kilitlenir ve "Diğer oyuncular bekleniyor" mesajı gösterilir
- Tüm oyuncular cevap verirse veya süre dolarsa backend otomatik olarak yeni soruya geçer
- Soruya hiç cevap verilmezse de otomatik geçiş sağlanır
- Skor tablosu puana göre sıralanır, quiz sonunda geçmiş ve skorlar kaydedilir

## Quiz Geçmişi
- Her kullanıcıya özel quiz geçmişi ve skorlar otomatik kaydedilir
- `/api/user/me` endpointi ile geçmiş görüntülenebilir
- Admin panelinde tüm kullanıcıların ve quizlerin geçmişi yönetilebilir

## Notlar
- Kodda tüm endpointler ve socket eventleri için detaylı açıklamalar mevcuttur
- Son kullanıcı deneyimi ve hata yönetimi için ek testler ve iyileştirmeler yapılmıştır
- Modern admin paneli ve canlı quiz yönetimi için backend kodunu inceleyiniz
