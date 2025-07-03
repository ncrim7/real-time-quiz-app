// Tek başına quiz çözme (canlı olmayan mod) için sayfa
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById } from '../services/api';
import QuestionTimer from './QuestionTimer';
import { saveQuizHistory } from '../services/api';

// Arka plan müziği için basit bir mp3 dosyası (public klasörüne eklenmeli)
const MUSIC_URL = process.env.PUBLIC_URL + '/quiz-music.mp3';

function PlayQuiz() {
  // URL'den quiz id'sini al
  const { id } = useParams();
  const navigate = useNavigate();
  // Quiz objesi, mevcut soru, cevap ve zamanlayıcı için state'ler
  const [quiz, setQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0); // Şu anki soru indeksi
  const [answer, setAnswer] = useState(''); // Kullanıcının cevabı
  const [showTimer, setShowTimer] = useState(true); // Zamanlayıcı gösterilsin mi
  const [historySaved, setHistorySaved] = useState(false);
  const correctCountRef = useRef(0);

  // Cevapları ve doğru sayısını takip etmek için bir dizi ekleyelim
  const [answers, setAnswers] = useState([]);

  // Arka plan müziği için ref ve state
  const audioRef = useRef(null);
  const [musicPlaying, setMusicPlaying] = useState(true);

  // Sayfa yüklendiğinde quiz detayını backend'den çek
  useEffect(() => {
    getQuizById(id).then(res => setQuiz(res.data));
  }, [id]);

  // Cevap verildiğinde bir sonraki soruya geçiş
  const handleAnswer = (selected) => {
    setAnswer(selected);
    setShowTimer(false);
    setAnswers(prev => [...prev, selected]);
    setTimeout(() => {
      setCurrentQ(q => q + 1); // Sonraki soruya geç
      setAnswer('');
      setShowTimer(true);
    }, 1000);
  };

  // Süre dolduğunda otomatik sonraki soruya geçiş
  const handleTimeout = () => {
    setShowTimer(false);
    setAnswers(prev => [...prev, null]); // Cevap verilmediyse null ekle
    setTimeout(() => {
      setCurrentQ(q => q + 1);
      setAnswer('');
      setShowTimer(true);
    }, 1000);
  };

  // Quiz başladığında müziği başlat
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && musicPlaying) {
      audio.volume = 0.25;
      audio.play().catch(() => {});
    }
    return () => {
      if (audio) audio.pause();
    };
  }, [musicPlaying]);

  // Quiz bitiminde geçmişi kaydet (koşul dışında, hook kuralına uygun)
  useEffect(() => {
    if (
      quiz &&
      answers.length === quiz.questions.length &&
      !historySaved
    ) {
      // Doğru cevap sayısını hesapla
      const correctCount = quiz.questions.reduce((acc, q, idx) => {
        if (answers[idx] && q.options[q.correctIndex] === answers[idx]) return acc + 1;
        return acc;
      }, 0);
      correctCountRef.current = correctCount;
      const token = localStorage.getItem('token');
      if (token && quiz._id) {
        saveQuizHistory(quiz._id, {
          score: correctCount,
          date: new Date(),
          mode: 'bireysel'
        }, token).finally(() => setHistorySaved(true));
      } else {
        setHistorySaved(true);
      }
    }
  }, [quiz, answers, historySaved]);

  // Quiz yükleniyorsa loading mesajı göster
  if (!quiz) return <div style={{textAlign:'center',padding:32}}>Yükleniyor...</div>;
  // Tüm sorular bittiğinde quiz bitti mesajı ve yönlendirme butonları göster
  if (currentQ >= quiz.questions.length) return (
    <div style={{ textAlign:'center', padding: 32 }}>
      <audio ref={audioRef} src={MUSIC_URL} autoPlay loop style={{ display: 'none' }} />
      <h2 style={{fontWeight:800, color:'var(--primary)', fontSize:'2rem', marginBottom:12}}>{quiz.title} Bitti!</h2>
      <div style={{fontSize:20, marginBottom:18}}>Doğru sayınız: <b>{correctCountRef.current} / {quiz.questions.length}</b></div>
      <button className="btn btn-secondary" onClick={() => navigate('/')}>Ana Sayfa</button>
      <button className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => navigate('/profile')}>Profilim / Geçmişim</button>
      <button className="btn btn-primary" style={{ marginLeft: 16 }} onClick={() => setMusicPlaying(p => !p)}>{musicPlaying ? 'Müziği Durdur' : 'Müziği Başlat'}</button>
    </div>
  );

  // Mevcut soru
  const q = quiz.questions[currentQ];

  return (
    <div style={{ padding: 32, maxWidth: 520, margin: '0 auto', background: 'rgba(255,255,255,0.97)', borderRadius: 18, boxShadow: '0 4px 24px #6366f122', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <audio ref={audioRef} src={MUSIC_URL} autoPlay loop style={{ display: 'none' }} />
      <h2 style={{fontWeight:800, color:'var(--primary)', fontSize:'2rem', marginBottom:8, textAlign:'center'}}>{quiz.title}</h2>
      <button className="btn btn-primary" style={{ marginBottom: 18, fontSize:16, borderRadius:10, padding:'0.6rem 1.5rem' }} onClick={() => setMusicPlaying(p => !p)}>{musicPlaying ? 'Müziği Durdur' : 'Müziği Başlat'}</button>
      <div style={{ marginBottom: 20, width:'100%' }}>
        <b style={{fontSize:20, display:'block', textAlign:'center', marginBottom:18}}>{q.text}</b>
        <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:14, alignItems:'center'}}>
          {q.options.map((opt, i) => (
            <li key={i} style={{width:'100%'}}>
              <button
                className="btn btn-secondary"
                disabled={!!answer}
                onClick={() => handleAnswer(opt)}
                style={{
                  width:'100%',
                  maxWidth:340,
                  fontSize:17,
                  padding:'0.8rem 1.2rem',
                  borderRadius:12,
                  margin:'0 auto',
                  opacity: answer && answer !== opt ? 0.5 : 1,
                  cursor: answer ? 'not-allowed' : 'pointer',
                  background: answer === opt ? 'linear-gradient(90deg,#10b981 60%,#6366f1 100%)' : undefined,
                  color: answer === opt ? '#fff' : undefined,
                  fontWeight:600,
                  boxShadow: answer === opt ? '0 4px 16px #10b98133' : '0 2px 8px #6366f122',
                  transition:'all 0.18s'
                }}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
        {/* Soru için zamanlayıcı */}
        {showTimer && <div style={{marginTop:18, textAlign:'center'}}><QuestionTimer duration={10} onTimeout={handleTimeout} /></div>}
        {/* Kullanıcı cevabı */}
        {answer && <div style={{ color: '#10b981', fontWeight:700, marginTop:12, textAlign:'center' }}>Cevabınız: {answer}</div>}
      </div>
    </div>
  );
}

export default PlayQuiz;
