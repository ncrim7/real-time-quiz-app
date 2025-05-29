# Kahoot-Clone

Gerçek zamanlı quiz platformu. Kullanıcılar kayıt olup giriş yapabilir, quiz oluşturabilir, canlı quiz oturumlarına katılabilir ve skor tablosu görebilir.

## Teknolojiler
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Socket.io
- **Frontend:** React, modern CSS, responsive tasarım

## Temel Özellikler
- Kullanıcı kaydı ve girişi (JWT ile)
- Quiz oluşturma, listeleme, oynama
- Canlı quiz odası (oda kodu ile katılım)
- Gerçek zamanlı skor tablosu
- Kullanıcıya özel quiz geçmişi ve skor kaydı
- Modern ve kullanıcı dostu arayüz

## Klasör Yapısı
- `backend/` : API, socket, modeller, route'lar
- `frontend/` : React uygulaması, sayfalar, servisler

## Kurulum
1. **Backend** için:
   ```powershell
   cd backend
   npm install
   npm run dev
   ```
2. **Frontend** için:
   ```powershell
   cd frontend
   npm install
   npm start
   ```

## Gelişmiş Özellikler
- Quiz geçmişi ve skorlar
- Oyun başlatma/bitirme yönetimi
- Admin paneli (isteğe bağlı)
- Multimedya desteği (isteğe bağlı)

## Notlar
- Kodun tamamında açıklamalar ve örnekler mevcuttur.
- Detaylı kullanım ve API için backend/README.md dosyasına bakınız.
