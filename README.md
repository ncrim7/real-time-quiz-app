# Kahoot-Clone

Gelişmiş, gerçek zamanlı çok oyunculu quiz platformu. Kullanıcılar kayıt olup giriş yapabilir, quiz oluşturabilir, canlı quiz oturumlarına PIN ile katılabilir ve skor tablosu görebilir. Modern admin paneli, kullanıcı profili, gelişmiş dashboard ve yönetim özellikleriyle birlikte gelir.

## Teknolojiler
- **Backend:** Node.js, Express.js, MongoDB,JWT, Socket.io
- **Frontend:** React, MUI (Material UI), modern CSS, responsive tasarım

## Temel Özellikler
- Kullanıcı kaydı ve girişi (JWT ile)
- Quiz oluşturma, listeleme, oynama
- Canlı quiz odası (PIN/oda kodu ile katılım, lobby, zamanlayıcı)
- Her oyuncunun kendi cevabını verebilmesi, cevap sonrası butonların kilitlenmesi ve "Diğer oyuncular bekleniyor" mesajı
- Tüm oyuncular cevap verince veya süre dolunca otomatik yeni soruya geçiş
- Gerçek zamanlı skor tablosu (puan sıralı)
- Quiz geçmişi ve kullanıcı profili (dashboard)
- Modern ve kullanıcı dostu arayüz
- **Admin paneli:** kullanıcı, quiz ve analytics yönetimi, canlı quiz başlatma/sonlandırma, quiz kartında oda kodu gösterimi ve kopyalama, End Live ile oturumu bitirme
- Sadece admin rolüne sahip kullanıcılar için admin paneli erişimi ve yönetim yetkileri
- Canlı quiz bekleme odasında quiz sonlandırma (sadece quiz sahibi veya admin için)
- Arka plan müziği ile quiz deneyimini zenginleştirme

## Klasör Yapısı
- `backend/` : API, socket, modeller, route'lar, canlı quiz event yönetimi
- `frontend/` : React uygulaması, sayfalar, servisler, modern dashboard, admin paneli, canlı quiz ve lobby akışı

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
- Gerçek zamanlı çok oyunculu quiz akışı (PIN ile katılım, lobby, zamanlayıcı, otomatik soru geçişi)
- Her oyuncu kendi cevabını verebilir, cevap sonrası bekleme mesajı ve UI/UX iyileştirmeleri
- Quiz geçmişi ve skorlar otomatik kaydedilir, profil sayfasında ve admin panelinde görüntülenir
- Oyun başlatma/bitirme, skor tablosu, bağlantı kopması ve yeniden katılım için temel altyapı
- Modern admin paneli: kullanıcı, quiz, analytics yönetimi ve canlı quiz kontrolü, oda kodu gösterimi ve End Live
- Sadece admin rolüne sahip kullanıcılar için admin paneli erişimi ve yönetim yetkileri
- Canlı quiz bekleme odasında quiz sonlandırma (sadece quiz sahibi veya admin için)
- Multimedya desteği (isteğe bağlı)

## Notlar
- Kodun tamamında açıklamalar ve örnekler mevcuttur.
- Son kullanıcı deneyimi ve hata yönetimi için ek testler ve iyileştirmeler yapılmıştır.
- Detaylı kullanım ve API için `backend/README.md` ve `frontend/README.md` dosyalarına bakınız.
