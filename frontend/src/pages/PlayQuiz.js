// Tek başına quiz çözme (canlı olmayan mod) için sayfa
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById } from '../services/api';
import QuestionTimer from './QuestionTimer';

function PlayQuiz() {
  // URL'den quiz id'sini al
  const { id } = useParams();
  // Quiz objesi, mevcut soru, cevap ve zamanlayıcı için state'ler
  const [quiz, setQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0); // Şu anki soru indeksi
  const [answer, setAnswer] = useState(''); // Kullanıcının cevabı
  const [showTimer, setShowTimer] = useState(true); // Zamanlayıcı gösterilsin mi
  const navigate = useNavigate();

  // Sayfa yüklendiğinde quiz detayını backend'den çek
  useEffect(() => {
    getQuizById(id).then(res => setQuiz(res.data));
  }, [id]);

  // Cevap verildiğinde bir sonraki soruya geçiş
  const handleAnswer = (selected) => {
    setAnswer(selected);
    setShowTimer(false);
    setTimeout(() => {
      setCurrentQ(q => q + 1); // Sonraki soruya geç
      setAnswer('');
      setShowTimer(true);
    }, 1000);
  };

  // Süre dolduğunda otomatik sonraki soruya geçiş
  const handleTimeout = () => {
    setShowTimer(false);
    setTimeout(() => {
      setCurrentQ(q => q + 1);
      setAnswer('');
      setShowTimer(true);
    }, 1000);
  };

  // Quiz yükleniyorsa loading mesajı göster
  if (!quiz) return <div>Yükleniyor...</div>;
  // Tüm sorular bittiğinde quiz bitti mesajı ve yönlendirme butonları göster
  if (currentQ >= quiz.questions.length) return (
    <div style={{ padding: 32 }}>
      <h2>Quiz bitti!</h2>
      <button onClick={() => navigate('/')}>Ana Sayfa</button>
      <button style={{ marginLeft: 8 }} onClick={() => navigate('/profile')}>Profilim / Geçmişim</button>
    </div>
  );

  // Mevcut soru
  const q = quiz.questions[currentQ];

  return (
    <div style={{ padding: 32 }}>
      <h2>{quiz.title}</h2>
      <div style={{ marginBottom: 16 }}>
        <b>{q.text}</b>
        <ul>
          {q.options.map((opt, i) => (
            <li key={i}>
              <button disabled={!!answer} onClick={() => handleAnswer(opt)}>{opt}</button>
            </li>
          ))}
        </ul>
        {/* Soru için zamanlayıcı */}
        {showTimer && <QuestionTimer duration={10} onTimeout={handleTimeout} />}
        {/* Kullanıcı cevabı */}
        {answer && <div style={{ color: 'green' }}>Cevabınız: {answer}</div>}
      </div>
    </div>
  );
}

export default PlayQuiz;
