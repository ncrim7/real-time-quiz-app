// Canlı quiz odası ve gerçek zamanlı quiz akışı için ana bileşen
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { getQuizByRoomCode, saveQuizHistory } from '../services/api';
import Leaderboard from './Leaderboard';
import QuestionTimer from './QuestionTimer';
import { useLocation, useNavigate } from 'react-router-dom';

// Socket.io bağlantısı (backend ile gerçek zamanlı iletişim)
const socket = io('https://quiz-master-backend-p6bs.onrender.com');

// Arka plan müziği için basit bir mp3 dosyası (public klasörüne eklenmeli)
const MUSIC_URL = process.env.PUBLIC_URL + '/quiz-music.mp3';

function LiveQuiz() {
  // State'ler: oda kodu, kullanıcı adı, quiz objesi, sorular, skorlar, vs.
  const [roomCode, setRoomCode] = useState(''); // Oda kodu
  const [username, setUsername] = useState(""); // Kullanıcı adı
  const [joined, setJoined] = useState(false); // Odaya katılım durumu
  const [quiz, setQuiz] = useState(null); // Quiz objesi
  const [question, setQuestion] = useState(null); // Şu anki soru
  const [answer, setAnswer] = useState(''); // Kullanıcının cevabı
  const [showTimer, setShowTimer] = useState(false); // Zamanlayıcı gösterilsin mi
  const [quizEnd, setQuizEnd] = useState(false); // Quiz bitti mi
  const [scores, setScores] = useState([]); // Skor tablosu
  const [waitingOthers, setWaitingOthers] = useState(false); // Diğer oyuncuları bekliyor muyuz?
  const [historySaved, setHistorySaved] = useState(false); // Skor geçmişi kaydedildi mi
  const userIdRef = useRef(socket.id); // Socket id referansı
  const location = useLocation();
  const navigate = useNavigate();
  // Arka plan müziği için ref ve state
  const audioRef = useRef(null);
  const [musicPlaying, setMusicPlaying] = useState(true);

  // Socket eventleri: quiz akışını ve skorları yönetir
  useEffect(() => {
    // Yeni soru geldiğinde state güncellenir
    socket.on('question', ({ index, question }) => {
      // setCurrentQ(index); // KULLANILMIYOR, YORUMA ALINDI
      setQuestion(question);
      setAnswer('');
      setShowTimer(true);
      setWaitingOthers(false); // Yeni soru gelince bekleme kalkar
    });
    // Cevap alındığında (isteğe bağlı kullanılabilir)
    socket.on('receiveAnswer', ({ userId, answer, isCorrect }) => {
      // İsterseniz cevapları listeleyebilirsiniz
    });
    // Skor tablosu güncellendiğinde
    socket.on('updateScores', (newScores) => {
      setScores(newScores);
    });
    // Quiz bittiğinde skorlar ve durum güncellenir
    socket.on('quizEnd', async ({ scores }) => {
      setQuizEnd(true);
      setScores(scores);
      setShowTimer(false);
      // Quiz geçmişini kaydet (sadece bir kez kaydetmek için kontrol ekle)
      if (!historySaved && quiz && username) {
        try {
          await saveQuizHistory({
            quizId: quiz._id,
            score: scores.find(s => s.username === username)?.score || 0,
            mode: 'canli',
            date: new Date().toISOString()
          });
          setHistorySaved(true);
        } catch (err) {
          // Hata yönetimi (opsiyonel bildirim)
          console.error('Quiz geçmişi kaydedilemedi:', err);
        }
      }
    });
    // Backend'den autoNextQuestion gelirse yeni soruya geç
    socket.on('autoNextQuestion', () => {
      socket.emit('nextQuestion', roomCode);
      setWaitingOthers(false); // Yeni soru tetiklenince bekleme kalkar
    });
    // LobbyEnd event'i ile quiz başlatılır
    socket.on('lobbyEnd', async () => {
      // Oda kodu ile quiz bilgisini backend'den çek
      const res = await getQuizByRoomCode(roomCode);
      setQuiz(res.data);
      setJoined(true);
      setQuizEnd(false);
      setTimeout(() => {
        socket.emit('getQuestion', roomCode);
      }, 300); // State güncellensin diye gecikme artırıldı
    });
    // Component unmount olduğunda eventler temizlenir
    return () => {
      socket.off('question');
      socket.off('receiveAnswer');
      socket.off('updateScores');
      socket.off('quizEnd');
      socket.off('autoNextQuestion');
      socket.off('lobbyEnd');
    };
  }, [roomCode, historySaved, quiz, username]); // eslint-disable-line react-hooks/exhaustive-deps

  // Odaya katılma fonksiyonu
  const joinRoom = async () => {
    if (roomCode && username) {
      setJoined(true);
      setQuizEnd(false);
      socket.emit('joinRoom', { roomCode, username });
    } else {
      alert('Oda kodu ve kullanıcı adı zorunludur!');
    }
  };

  // Lobby'den yönlendirme ile gelindiyse roomCode ve username state'ini al
  useEffect(() => {
    if (location.state && location.state.roomCode) {
      setRoomCode(location.state.roomCode);
    }
    if (location.state && location.state.username) {
      setUsername(location.state.username);
    }
  }, [location.state]);

  // Cevap gönderme fonksiyonu
  const sendAnswer = (selected) => {
    if (roomCode && question) {
      socket.emit('sendAnswer', {
        roomCode,
        answer: selected,
        userId: userIdRef.current,
        username // username'i de gönder
      });
      setAnswer(selected);
      setShowTimer(false);
      setWaitingOthers(true); // Cevap verince diğer oyuncuları bekle
    }
  };

  // Soru süresi dolduğunda otomatik sonraki soruya geç
  const handleTimeout = () => {
    setShowTimer(false);
    setTimeout(() => {
      socket.emit('nextQuestion', roomCode);
    }, 1000);
  };
  

  // Odaya katılım yoksa katılım formunu göster
  if (!joined) {
    return (
      <div className="card live-quiz-join" style={{ padding: 40, maxWidth: 420, margin: '48px auto', borderRadius: 18, background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 24px #6366f122', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        <h2 style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '2rem', marginBottom: 18, letterSpacing: '-1px' }}>Canlı Quiz Odası</h2>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Oda Kodu</label>
          <input className="input-flat" placeholder="Oda Kodu" value={roomCode} onChange={e => setRoomCode(e.target.value)} style={{ fontSize: 17, padding: '0.9rem 1.1rem', borderRadius: 11, border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600, outline: 'none', boxShadow: '0 2px 8px #6366f111', transition: 'border 0.18s, box-shadow 0.18s' }} />
          <label style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: 15, marginBottom: 4, marginTop: 8 }}>Kullanıcı Adı</label>
          <input className="input-flat" placeholder="Kullanıcı Adı" value={username} onChange={e => setUsername(e.target.value)} style={{ fontSize: 17, padding: '0.9rem 1.1rem', borderRadius: 11, border: '1.5px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600, outline: 'none', boxShadow: '0 2px 8px #6366f111', transition: 'border 0.18s, box-shadow 0.18s' }} />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', fontSize: 18, padding: '1rem 0', borderRadius: 13, marginTop: 18, fontWeight: 700, letterSpacing: 0.2, textAlign: 'center', justifyContent: 'center', display: 'flex', alignItems: 'center' }} onClick={joinRoom}>Odaya Katıl</button>
      </div>
    );
  }

  // Quiz bittiğinde skor tablosunu göster
  if (quizEnd) {
    return (
      <div className="card" style={{ padding: 32 }}>
        <audio ref={audioRef} src={MUSIC_URL} autoPlay loop style={{ display: 'none' }} />
        <h2>Quiz Bitti!</h2>
        <Leaderboard roomId={roomCode} scores={scores} />
        <div style={{ marginTop: 24 }}>
          <button onClick={() => navigate('/')} style={{ marginRight: 12 }}>Ana Sayfa</button>
          <button onClick={() => navigate('/profile')}>Profilim / Geçmişim</button>
          <button style={{ marginLeft: 16 }} onClick={() => setMusicPlaying(p => !p)}>{musicPlaying ? 'Müziği Durdur' : 'Müziği Başlat'}</button>
        </div>
      </div>
    );
  }

  // Soru yükleniyorsa loading mesajı göster
  if (!question) return <div style={{ padding: 32 }}>Soru yükleniyor...</div>;

  // Quiz sırasında soru ve seçenekleri, zamanlayıcı ve skor tablosu göster
  return (
    <div style={{ padding: 32, maxWidth: 520, margin: '0 auto', background: 'rgba(255,255,255,0.97)', borderRadius: 18, boxShadow: '0 4px 24px #6366f122', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <audio ref={audioRef} src={MUSIC_URL} autoPlay loop style={{ display: 'none' }} />
      <h2 style={{fontWeight:800, color:'var(--primary)', fontSize:'2rem', marginBottom:8, textAlign:'center'}}>{quiz?.title || 'Canlı Quiz'}</h2>
      <button className="btn btn-primary" style={{ marginBottom: 18, fontSize:16, borderRadius:10, padding:'0.6rem 1.5rem' }} onClick={() => setMusicPlaying(p => !p)}>{musicPlaying ? 'Müziği Durdur' : 'Müziği Başlat'}</button>
      <div style={{ marginBottom: 20, width:'100%' }}>
        <b style={{fontSize:20, display:'block', textAlign:'center', marginBottom:18}}>{question.text}</b>
        <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:14, alignItems:'center'}}>
          {question.options.map((opt, i) => (
            <li key={i} style={{width:'100%'}}>
              <button
                className="btn btn-secondary"
                disabled={!!answer}
                onClick={() => sendAnswer(opt)}
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
        {/* Diğer oyuncuları bekleme mesajı */}
        {waitingOthers && <div style={{ color: '#888', marginTop: 12, textAlign:'center' }}>Diğer oyuncular bekleniyor...</div>}
      </div>
      {/* Skor tablosu */}
      <Leaderboard roomId={roomCode} scores={scores} />
    </div>
  );
}

export default LiveQuiz;
