import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const features = [
  {
    icon: '📝',
    title: 'Quiz Oluştur',
    desc: 'Kendi quizini kolayca oluştur, paylaş ve yönet.'
  },
  {
    icon: '🚀',
    title: 'Quiz Katıl',
    desc: 'Arkadaşlarının veya topluluğun quizlerine anında katıl.'
  },
  {
    icon: '⏱️',
    title: 'Gerçek Zamanlı Deneyim',
    desc: 'Canlı skorlar ve anlık sonuçlarla gerçek zamanlı yarış.'
  }
];

function Home() {
  const navigate = useNavigate();
  const [quizHistory, setQuizHistory] = useState([]);
  const [quizTitles, setQuizTitles] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // Token yoksa sadece quiz geçmişi gösterilmez, ana sayfa herkese açık
    axios.get('https://quiz-master-backend-p6bs.onrender.com/api/user/me', {
      headers: { Authorization: 'Bearer ' + token }
    }).then(res => {
      setQuizHistory(res.data.quizHistory || []);
    });
  }, []);

  useEffect(() => {
    async function fetchTitles() {
      const missing = quizHistory.filter(q => q.quizId && !quizTitles[q.quizId]);
      const promises = missing.map(q =>
        axios.get('https://quiz-master-backend-p6bs.onrender.com/api/quiz/' + q.quizId)
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
    <div className="page-container">
      <h1 className="page-title">QuizMaster'a Hoş Geldiniz</h1>
      <div className="page-subtitle">
        Gerçek zamanlı quizler oluştur, katıl ve arkadaşlarınla yarış. Bilgini test et, eğlen ve geliş!
      </div>
      <div className="features-row">
        {features.map((f, i) => (
          <div className="feature-card2" key={i}>
            <div className="feature-card2-icon">{f.icon}</div>
            <div className="feature-card2-title">{f.title}</div>
            <div className="feature-card2-desc">{f.desc}</div>
          </div>
        ))}
      </div>
      {quizHistory.length > 0 && (
        <div className="quiz-history-card">
          <div className="quiz-history-title">Quiz Geçmişiniz</div>
          <ul className="quiz-history-list">
            {quizHistory.map((q, i) => (
              <li className="quiz-history-item" key={i}>
                <span className="quiz-history-quiz">{quizTitles[q.quizId] || '...'}</span>
                <span className="quiz-history-date">{new Date(q.date).toLocaleString('tr-TR')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;
