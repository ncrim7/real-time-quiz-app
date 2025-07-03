// Oyun bekleme (lobby) ekranı, PIN ile giriş ve zamanlayıcı
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate, useLocation } from 'react-router-dom';

const socket = io('https://quiz-master-backend-p6bs.onrender.com');

function Lobby() {
  const [seconds, setSeconds] = useState(30);
  const [players, setPlayers] = useState(1);
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Refresh sonrası roomCode ve username'i localStorage'dan yükle
  useEffect(() => {
    // Eğer state yoksa localStorage'dan yükle
    if (!location.state) {
      const savedRoom = localStorage.getItem('lobbyRoomCode');
      const savedUser = localStorage.getItem('lobbyUsername');
      if (savedRoom && savedUser) {
        setRoomCode(savedRoom);
        setUsername(savedUser);
        setJoined(true);
        socket.emit('joinLobby', { roomCode: savedRoom, username: savedUser });
      }
    } else {
      // State varsa localStorage'a kaydet
      if (location.state.roomCode) localStorage.setItem('lobbyRoomCode', location.state.roomCode);
      if (location.state.username) localStorage.setItem('lobbyUsername', location.state.username);
    }
  }, [location.state]);

  // Oyun sahibi için roomCode location.state ile gelir
  useEffect(() => {
    if (location.state && location.state.roomCode) {
      setRoomCode(location.state.roomCode);
      socket.emit('startLobby', { roomCode: location.state.roomCode });
      setJoined(true);
    }
  }, [location.state]);

  // Katılımcı PIN ile giriş yaparsa
  const handleJoin = () => {
    if (roomCode && username) {
      localStorage.setItem('lobbyRoomCode', roomCode);
      localStorage.setItem('lobbyUsername', username);
      socket.emit('joinLobby', { roomCode, username });
      setJoined(true);
    }
  };

  // Lobby eventlerini dinle
  useEffect(() => {
    socket.on('lobbyStarted', ({ roomCode }) => {
      setRoomCode(roomCode);
    });
    socket.on('lobbyTimer', ({ seconds }) => {
      setSeconds(seconds);
    });
    socket.on('lobbyPlayers', ({ players }) => {
      setPlayers(players);
    });
    // LobbyEnd ile oyun başlarsa localStorage temizle
    socket.on('lobbyEnd', () => {
      localStorage.removeItem('lobbyRoomCode');
      localStorage.removeItem('lobbyUsername');
      navigate('/live-quiz', { state: { roomCode, username } });
    });
    return () => {
      socket.off('lobbyStarted');
      socket.off('lobbyTimer');
      socket.off('lobbyPlayers');
      socket.off('lobbyEnd');
    };
  }, [roomCode, username, navigate]);

  if (!joined) {
    // Katılımcı için PIN ve kullanıcı adı girişi
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)' }}>
        <div className="card lobby-card" style={{ padding: 40, minWidth: 340, maxWidth: 420, width: '100%', borderRadius: 18, background: 'rgba(255,255,255,0.97)', boxShadow: '0 4px 24px #6366f122', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <h2 style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '2rem', marginBottom: 10, letterSpacing: '-1px' }}>Oyun PIN'i ile Katıl</h2>
          <input placeholder="Oyun PIN" value={roomCode} onChange={e => setRoomCode(e.target.value.toUpperCase())} />
          <input placeholder="Kullanıcı Adı" value={username} onChange={e => setUsername(e.target.value)} style={{ marginLeft: 8 }} />
          <button onClick={handleJoin}>Odaya Katıl</button>
        </div>
      </div>
    );
  }

  // Oyun sahibi ve katılımcılar için lobby ekranı
  // Oyun sahibi (quiz başlatan) için quiz sonlandır butonu göster
  const isOwner = localStorage.getItem('email') && location.state && location.state.isOwner;

  // Quiz'i sonlandırma fonksiyonu
  const handleEndQuiz = async () => {
    try {
      // Aktif quiz id'sini backend'den çekmek için roomCode ile quiz getir
      const res = await fetch(`https://quiz-master-backend-p6bs.onrender.com/api/quiz/room/${roomCode}`);
      const quiz = await res.json();
      if (quiz && quiz._id) {
        await fetch(`https://quiz-master-backend-p6bs.onrender.com/api/quiz/${quiz._id}/end`, { method: 'POST' });
        alert('Quiz sonlandırıldı.');
        // Odayı terk et ve ana sayfaya yönlendir
        localStorage.removeItem('lobbyRoomCode');
        localStorage.removeItem('lobbyUsername');
        navigate('/');
      }
    } catch {
      alert('Quiz sonlandırılamadı.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)' }}>
      <div className="card lobby-card" style={{ padding: 40, minWidth: 340, maxWidth: 420, width: '100%', borderRadius: 18, background: 'rgba(255,255,255,0.97)', boxShadow: '0 4px 24px #6366f122', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <h2 style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '2rem', marginBottom: 10, letterSpacing: '-1px' }}>Oyun Bekleme Odası</h2>
        <div style={{ fontSize: 22, marginBottom: 10, color: 'var(--primary-dark)' }}>PIN: <b>{roomCode}</b></div>
        <div style={{ fontWeight: 600, color: 'var(--text)' }}>Katılımcı sayısı: <span style={{ color: 'var(--primary)' }}>{players}</span></div>
        <div style={{ margin: '18px 0', fontSize: 18, color: 'var(--text-secondary)', fontWeight: 500 }}>Oyun <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{seconds}</span> saniye sonra başlayacak...</div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>Arkadaşlarınıza PIN'i verin, onlar da katılsın!</div>
        {/* Sadece quiz sahibi için quiz sonlandır butonu */}
        {isOwner && (
          <button onClick={handleEndQuiz} style={{ marginTop: 18, background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ef444422', transition: 'background 0.18s, box-shadow 0.18s, transform 0.13s' }}>
            Quizi Sonlandır
          </button>
        )}
      </div>
    </div>
  );
}

export default Lobby;
