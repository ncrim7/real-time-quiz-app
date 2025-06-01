import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizList from './pages/QuizList';
import QuizCreate from './pages/QuizCreate';
import LiveQuiz from './pages/LiveQuiz';
import PlayQuiz from './pages/PlayQuiz';
import Profile from './pages/Profile';
import Lobby from './pages/Lobby';

function App() {
  // Kullanıcı oturum bilgisini tutan state
  const [user, setUser] = useState(null);

  // Sayfa yüklendiğinde localStorage'dan kullanıcıyı kontrol et
  useEffect(() => {
    // JWT token ve email localStorage'dan alınır
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
      setUser({ email }); // Kullanıcı oturumu varsa state'e yazılır
    } else {
      setUser(null); // Oturum yoksa kullanıcı null yapılır
    }
  }, []);

  // Çıkış yap butonu fonksiyonu
  const handleLogout = () => {
    localStorage.removeItem('token'); // Token silinir
    localStorage.removeItem('email'); // Email silinir
    setUser(null); // Kullanıcı state'i sıfırlanır
    window.location.reload(); // Sayfa yenilenir
  };

  return (
    <Router>
      <div className="App">
        {/* Uygulama başlığı ve logo */}
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        {/* Navigasyon menüsü */}
        <nav style={{ padding: '1rem', background: '#f5f5f5', display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ marginRight: 10 }}>Ana Sayfa</Link>
          <Link to="/quiz-list" style={{ marginRight: 10 }}>Quizler</Link>
          <Link to="/quiz-create" style={{ marginRight: 10 }}>Quiz Oluştur</Link>
          <Link to="/live-quiz" style={{ marginRight: 10 }}>Canlı Quiz</Link>
          {/* Kullanıcı giriş yaptıysa profil linki */}
          {user && <Link to="/profile" style={{ marginRight: 10 }}>Profilim</Link>}
          {/* Kullanıcı giriş yapmamışsa giriş/kayıt linkleri */}
          {!user && <><Link to="/login" style={{ marginRight: 10 }}>Giriş</Link>
          <Link to="/register">Kayıt Ol</Link></>}
          {/* Kullanıcı giriş yaptıysa email ve çıkış butonu */}
          {user && (
            <>
              <span style={{ marginLeft: 20, marginRight: 10, fontWeight: 'bold' }}>{user.email}</span>
              <button onClick={handleLogout}>Çıkış Yap</button>
            </>
          )}
        </nav>
        {/* Sayfa yönlendirmeleri (routing) */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz-list" element={<QuizList />} />
          <Route path="/quiz-create" element={<QuizCreate />} />
          <Route path="/live-quiz" element={<LiveQuiz />} />
          <Route path="/play-quiz/:id" element={<PlayQuiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
