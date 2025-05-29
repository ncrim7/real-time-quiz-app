// Canlı quiz odası ve gerçek zamanlı quiz akışı için ana bileşen
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { getQuizByRoomCode } from '../services/api';
import Leaderboard from './Leaderboard';
import QuestionTimer from './QuestionTimer';

// Socket.io bağlantısı (backend ile gerçek zamanlı iletişim)
const socket = io('http://localhost:5000');

function LiveQuiz() {
  // State'ler: oda kodu, kullanıcı adı, quiz objesi, sorular, skorlar, vs.
  const [roomCode, setRoomCode] = useState(''); // Oda kodu
  const [username, setUsername] = useState(""); // Kullanıcı adı
  const [joined, setJoined] = useState(false); // Odaya katılım durumu
  const [quiz, setQuiz] = useState(null); // Quiz objesi
  const [currentQ, setCurrentQ] = useState(0); // Şu anki soru indeksi
  const [question, setQuestion] = useState(null); // Şu anki soru
  const [answer, setAnswer] = useState(''); // Kullanıcının cevabı
  const [showTimer, setShowTimer] = useState(false); // Zamanlayıcı gösterilsin mi
  const [quizEnd, setQuizEnd] = useState(false); // Quiz bitti mi
  const [scores, setScores] = useState([]); // Skor tablosu
  const userIdRef = useRef(socket.id); // Socket id referansı

  // Socket eventleri: quiz akışını ve skorları yönetir
  useEffect(() => {
    // Yeni soru geldiğinde state güncellenir
    socket.on('question', ({ index, question }) => {
      setCurrentQ(index);
      setQuestion(question);
      setAnswer('');
      setShowTimer(true);
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
    socket.on('quizEnd', ({ scores }) => {
      setQuizEnd(true);
      setScores(scores);
      setShowTimer(false);
    });
    // Component unmount olduğunda eventler temizlenir
    return () => {
      socket.off('question');
      socket.off('receiveAnswer');
      socket.off('updateScores');
      socket.off('quizEnd');
    };
  }, []);

  // Odaya katılma fonksiyonu
  const joinRoom = async () => {
    if (roomCode && username) {
      try {
        // Oda kodu ile quiz bilgisini backend'den çek
        const res = await getQuizByRoomCode(roomCode);
        setQuiz(res.data);
        setJoined(true);
        setQuizEnd(false);
        // Odaya katıl ve kullanıcı adını gönder
        socket.emit('joinRoom', { roomCode, username });
        // İlk soruyu başlat
        socket.emit('getQuestion', roomCode);
      } catch {
        alert('Oda kodu ile aktif quiz bulunamadı!');
      }
    } else {
      alert('Oda kodu ve kullanıcı adı zorunludur!');
    }
  };

  // Cevap gönderme fonksiyonu
  const sendAnswer = (selected) => {
    if (roomCode && question) {
      socket.emit('sendAnswer', {
        roomCode,
        answer: selected,
        userId: userIdRef.current
      });
      setAnswer(selected);
      setShowTimer(false);
      // Demo amaçlı: 1 sn sonra sıradaki soruya geç (gerçekte tüm oyuncular cevaplayınca veya süre bitince tetiklenmeli)
      setTimeout(() => {
        socket.emit('nextQuestion', roomCode);
      }, 1000);
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
      <div className="card" style={{ padding: 32 }}>
        <h2>Canlı Quiz Odası</h2>
        <input placeholder="Oda Kodu" value={roomCode} onChange={e => setRoomCode(e.target.value)} />
        <input placeholder="Kullanıcı Adı" value={username} onChange={e => setUsername(e.target.value)} style={{ marginLeft: 8 }} />
        <button onClick={joinRoom}>Odaya Katıl</button>
      </div>
    );
  }

  // Quiz bittiğinde skor tablosunu göster
  if (quizEnd) {
    return (
      <div className="card" style={{ padding: 32 }}>
        <h2>Quiz Bitti!</h2>
        <Leaderboard roomId={roomCode} scores={scores} />
      </div>
    );
  }

  // Soru yükleniyorsa loading mesajı göster
  if (!question) return <div style={{ padding: 32 }}>Soru yükleniyor...</div>;

  // Quiz sırasında soru ve seçenekleri, zamanlayıcı ve skor tablosu göster
  return (
    <div className="quiz-card" style={{ padding: 32 }}>
      <h2>{quiz?.title || 'Canlı Quiz'}</h2>
      <div style={{ marginBottom: 16 }}>
        <b>{question.text}</b>
        <ul>
          {question.options.map((opt, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              <button disabled={!!answer} onClick={() => sendAnswer(opt)}>{opt}</button>
            </li>
          ))}
        </ul>
        {/* Soru için zamanlayıcı */}
        {showTimer && <QuestionTimer duration={10} onTimeout={handleTimeout} />}
        {/* Kullanıcı cevabı */}
        {answer && <div className="success">Cevabınız: {answer}</div>}
      </div>
      {/* Skor tablosu */}
      <Leaderboard roomId={roomCode} scores={scores} />
    </div>
  );
}

export default LiveQuiz;
