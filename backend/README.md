# Kahoot-Clone Backend

## Özellikler
- Node.js + Express.js tabanlı REST API
- MongoDB (Mongoose ile)
- JWT tabanlı kimlik doğrulama
- Gerçek zamanlı quiz akışı (Socket.io)
- Quiz oluşturma, başlatma, bitirme, oda kodu ile katılım
- Kullanıcıya özel quiz geçmişi ve skor kaydı
- Modern, güvenli ve ölçeklenebilir altyapı

## Kurulum
1. Gerekli paketleri yükleyin:
   ```powershell
   cd backend
   npm install
   ```
2. .env dosyasındaki ayarları kontrol edin (MongoDB bağlantı adresi, JWT secret, port).
3. Sunucuyu başlatın:
   ```powershell
   npm run dev
   ```

## API Endpointleri
- POST `/api/auth/register` : Kullanıcı kaydı (username, email, password)
- POST `/api/auth/login` : Kullanıcı girişi (JWT döner)
- GET `/api/user/me` : Kullanıcı profilini ve quiz geçmişini getir (JWT ile korumalı)
- POST `/api/quiz` : Quiz oluştur (JWT ile korumalı)
- GET `/api/quiz` : Tüm quizleri listele
- GET `/api/quiz/:id` : Belirli quiz detayını getir
- POST `/api/quiz/:id/start` : Quiz başlat (oda kodu üretir)
- POST `/api/quiz/:id/end` : Quiz bitir
- GET `/api/quiz/room/:roomCode` : Oda kodu ile aktif quiz bul

## Socket.io Eventleri
- `joinRoom` : { roomCode, username } ile odaya katılım
- `getQuestion` : Odanın mevcut sorusunu getirir
- `sendAnswer` : { roomCode, answer, userId } ile cevap gönderir
- `nextQuestion` : Sonraki soruya geçer
- `updateScores` : Skor tablosunu günceller
- `quizEnd` : Quiz bittiğinde skorları gönderir

## Quiz Geçmişi
- Her kullanıcıya özel quiz geçmişi ve skorlar otomatik kaydedilir.
- `/api/user/me` endpointi ile geçmiş görüntülenebilir.

## Notlar
- Tüm endpointler ve socket eventleri için detaylı açıklamalar kod içinde mevcuttur.
- Gelişmiş özellikler ve güvenlik için kodu inceleyiniz.
