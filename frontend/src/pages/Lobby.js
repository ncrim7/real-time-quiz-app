// Oyun bekleme (lobby) ekranı, PIN ile giriş ve zamanlayıcı
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate, useLocation } from 'react-router-dom';

const socket = io('http://localhost:5000');

function Lobby() {
  const [seconds, setSeconds] = useState(30);
  const [players, setPlayers] = useState(1);
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    socket.on('lobbyEnd', () => {
      // Oyun başlasın (canlı quiz sayfasına yönlendir)
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
      <div className="card" style={{ padding: 32 }}>
        <h2>Oyun PIN'i ile Katıl</h2>
        <input placeholder="Oyun PIN" value={roomCode} onChange={e => setRoomCode(e.target.value.toUpperCase())} />
        <input placeholder="Kullanıcı Adı" value={username} onChange={e => setUsername(e.target.value)} style={{ marginLeft: 8 }} />
        <button onClick={handleJoin}>Odaya Katıl</button>
      </div>
    );
  }

  // Oyun sahibi ve katılımcılar için lobby ekranı
  return (
    <div className="card" style={{ padding: 32 }}>
      <h2>Oyun Bekleme Odası</h2>
      <div style={{ fontSize: 22, marginBottom: 16 }}>PIN: <b>{roomCode}</b></div>
      <div>Katılımcı sayısı: {players}</div>
      <div style={{ margin: '16px 0', fontSize: 18 }}>Oyun {seconds} saniye sonra başlayacak...</div>
      <div style={{ color: '#888', fontSize: 14 }}>Arkadaşlarınıza PIN'i verin, onlar da katılsın!</div>
    </div>
  );
}

export default Lobby;
