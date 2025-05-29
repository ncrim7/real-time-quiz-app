import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  // Kullanıcı bilgisini ve quiz geçmişini tutan state'ler
  const [user, setUser] = useState(null); // Giriş yapan kullanıcı bilgisi
  const [quizHistory, setQuizHistory] = useState([]); // Kullanıcının quiz geçmişi
  const [quizTitles, setQuizTitles] = useState({}); // QuizId -> Başlık eşlemesi

  // Sayfa yüklendiğinde kullanıcı giriş yapmışsa profil ve quiz geçmişini çek
  useEffect(() => {
    const token = localStorage.getItem('token'); // JWT token localStorage'dan alınır
    if (token) {
      // Backend'den kullanıcı profilini ve quiz geçmişini çek
      axios.get('http://localhost:5000/api/user/me', {
        headers: { Authorization: 'Bearer ' + token }
      }).then(res => {
        setUser(res.data); // Kullanıcı bilgisi state'e yazılır
        setQuizHistory(res.data.quizHistory || []); // Quiz geçmişi state'e yazılır
      });
    }
  }, []);

  // Quiz geçmişi değiştiğinde, başlıkları topluca çek
  useEffect(() => {
    async function fetchTitles() {
      // Sadece yeni başlıkları çek
      const missing = quizHistory.filter(q => q.quizId && !quizTitles[q.quizId]);
      const promises = missing.map(q =>
        axios.get(`http://localhost:5000/api/quiz/${q.quizId}`)
          .then(res => ({ id: q.quizId, title: res.data.title }))
          .catch(() => ({ id: q.quizId, title: 'Quiz bulunamadı' }))
      );
      const results = await Promise.all(promises);
      if (results.length > 0) {
        setQuizTitles(prev => {
          const updated = { ...prev };
          results.forEach(r => { updated[r.id] = r.title; });
          return updated;
        });
      }
    }
    if (quizHistory.length > 0) fetchTitles();
    // eslint-disable-next-line
  }, [quizHistory]);

  return (
    <div style={{ padding: 32 }}>
      <h1>Kahoot-Clone</h1>
      <p>Gerçek zamanlı quiz platformuna hoş geldiniz!</p>
      {/* Eğer kullanıcı giriş yaptıysa quiz geçmişi gösterilir */}
      {user && (
        <div className="card" style={{ marginTop: 32 }}>
          <h3>Quiz Geçmişiniz</h3>
          {/* Hiç quiz geçmişi yoksa bilgilendirme */}
          {quizHistory.length === 0 && <div>Henüz quiz geçmişiniz yok.</div>}
          {/* Quiz geçmişi varsa listele */}
          {quizHistory.length > 0 && (
            <ol>
              {quizHistory.slice().reverse().map((q, i) => (
                <li key={i}>
                  <b>{quizTitles[q.quizId] || '...'}</b><br />
                  Skor: {q.score} <br />
                  Tarih: {new Date(q.date).toLocaleString('tr-TR')}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
