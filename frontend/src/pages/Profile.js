// Kullanıcıya ait profil ve quiz geçmişi sayfası
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [quizTitles, setQuizTitles] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/user/me', {
        headers: { Authorization: 'Bearer ' + token }
      }).then(res => {
        setUser(res.data);
        setQuizHistory(res.data.quizHistory || []);
      });
    }
  }, []);

  useEffect(() => {
    async function fetchTitles() {
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

  if (!user) return <div style={{ padding: 32 }}>Yükleniyor...</div>;

  return (
    <div style={{ padding: 32 }}>
      <h2>Profilim</h2>
      <div className="card" style={{ marginBottom: 32 }}>
        <b>Email:</b> {user.email}<br />
        <b>Kullanıcı Adı:</b> {user.username || '-'}<br />
        <b>Kayıt Tarihi:</b> {new Date(user.createdAt).toLocaleString('tr-TR')}
      </div>
      <div className="card">
        <h3>Quiz Geçmişim</h3>
        {quizHistory.length === 0 && <div>Henüz quiz geçmişiniz yok.</div>}
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
    </div>
  );
}

export default Profile;
