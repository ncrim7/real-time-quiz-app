import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const navLinks = [
  {
    href: "/",
    label: "Ana Sayfa",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{marginRight:4}}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/></svg>
    ),
  },
  {
    href: "/quiz-list",
    label: "Quizler",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{marginRight:4}}><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4z" fill="currentColor"/><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-5.99 13c-.59 0-1.05-.47-1.05-1.05 0-.59.47-1.04 1.05-1.04.59 0 1.04.45 1.04 1.04-.01.58-.45 1.05-1.04 1.05m2.5-6.17c-.63.93-1.23 1.21-1.56 1.81-.13.24-.18.4-.18 1.18h-1.52c0-.41-.06-1.08.26-1.65.41-.73 1.18-1.16 1.63-1.8.48-.68.21-1.94-1.14-1.94-.88 0-1.32.67-1.5 1.23l-1.37-.57C11.51 5.96 12.52 5 13.99 5c1.23 0 2.08.56 2.51 1.26.37.61.58 1.73.01 2.57" fill="currentColor"/></svg>
    ),
  },
  {
    href: "/quiz-create",
    label: "Quiz Oluştur",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{marginRight:4}}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z" fill="currentColor"/></svg>
    ),
  },
  {
    href: "/live-quiz",
    label: "Canlı Quiz",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{marginRight:4}}><path d="M21 6h-7.59l3.29-3.29L16 2l-4 4-4-4-.71.71L10.59 6H3c-1.1 0-2 .89-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.11-.9-2-2-2m0 14H3V8h18zM9 10v8l7-4z" fill="currentColor"/></svg>
    ),
  },
  {
    href: "/profile",
    label: "Profilim",
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{marginRight:4}}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4" fill="currentColor"/></svg>
    ),
  },
];

const Header = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const onStorage = () => {
      setEmail(localStorage.getItem('email') || '');
      setRole(localStorage.getItem('role') || '');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setEmail('');
    setRole('');
    navigate("/");
  };

  return (
    <header className="header" style={{padding: 0, background: "none"}}>
      <nav style={{
        padding: "1rem",
        background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 2px 8px #0001",
        borderRadius: 12,
        margin: 16,
        maxWidth: 1550,
        marginLeft: "auto",
        marginRight: "auto",
        justifyContent: "space-between",
        minHeight: 64
      }}>
        {/* Sol blok: logo + menü */}
        <div style={{display: "flex", alignItems: "center", gap: 0}}>
          <div className="logo" style={{marginRight: 32}}>
            <div className="logo-icon">🧠</div>
            <span style={{color: "#fff"}}>QuizMaster</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 0}}>
            <a href="/" className="nav-item" style={{marginRight: 18, color: "#fff", display: "flex", alignItems: "center", fontWeight: 600, fontSize: 18, textDecoration: "none", height: 44, lineHeight: '44px'}}>Ana Sayfa</a>
            <a href="/quiz-list" className="nav-item" style={{marginRight: 18, color: "#fff", display: "flex", alignItems: "center", fontWeight: 600, fontSize: 18, textDecoration: "none", height: 44, lineHeight: '44px'}}>Quizler</a>
            <a href="/quiz-create" className="nav-item" style={{marginRight: 18, color: "#fff", display: "flex", alignItems: "center", fontWeight: 600, fontSize: 18, textDecoration: "none", height: 44, lineHeight: '44px'}}>Quiz Oluştur</a>
            <a href="/live-quiz" className="nav-item" style={{marginRight: 18, color: "#fff", display: "flex", alignItems: "center", fontWeight: 600, fontSize: 18, textDecoration: "none", height: 44, lineHeight: '44px'}}>Canlı Quiz</a>
          </div>
        </div>
        {/* Ortada boşluk */}
        <div style={{flex: 1}}></div>
        {/* Sağ blok: dinamik butonlar */}
        <div style={{display: "flex", alignItems: "center", gap: 0}}>
          {token ? (
            <>
              <a href="/profile" className="nav-item" style={{marginRight: 18, color: "#fff", display: "flex", alignItems: "center", textDecoration: "none", height: 44, lineHeight: '44px'}}>Profilim</a>
              {role === 'admin' && (
                <a href="/admin" className="nav-item" style={{marginRight: 18, color: "#fff", display: "flex", alignItems: "center", textDecoration: "none", height: 44, lineHeight: '44px'}}>Admin</a>
              )}
              <span style={{marginLeft: 20, marginRight: 10, fontWeight: "bold", color: "#fff", fontSize: 16, height: 44, display: 'flex', alignItems: 'center'}}>{email}</span>
              <button onClick={handleLogout} style={{background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", fontWeight: 600, fontSize: 16, height: 44, lineHeight: '44px'}}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{marginRight:4}}><path d="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z" fill="currentColor"/></svg>
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={{background: "none", border: "1px solid #fff", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", fontWeight: 600, fontSize: 16, height: 44, lineHeight: '44px', borderRadius: 8, padding: '0 18px', marginRight: 10}}>Giriş Yap</button>
              <button onClick={() => navigate('/register')} style={{background: "#fff", border: "none", color: "#2575fc", cursor: "pointer", display: "flex", alignItems: "center", fontWeight: 600, fontSize: 16, height: 44, lineHeight: '44px', borderRadius: 8, padding: '0 18px'}}>Kayıt Ol</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
