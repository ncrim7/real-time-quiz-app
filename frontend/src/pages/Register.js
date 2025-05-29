// Kullanıcı kayıt (register) sayfası
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../services/api';

function Register() {
  // Kullanıcı adı, email, şifre ve hata mesajı için state'ler
  const [username, setUsername] = useState(''); // Kullanıcı adı
  const [email, setEmail] = useState(''); // Email
  const [password, setPassword] = useState(''); // Şifre
  const [error, setError] = useState(''); // Hata mesajı
  const navigate = useNavigate(); // Yönlendirme için hook

  // Form submit edildiğinde kayıt işlemini yapar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // API ile kayıt isteği gönder
      await register(username, email, password);
      // Kayıt başarılıysa otomatik giriş
      const res = await login(email, password);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', email);
      alert('Kayıt ve giriş başarılı!');
      navigate('/'); // Ana sayfaya yönlendir
    } catch (err) {
      setError('Kayıt başarısız.'); // Hata mesajı göster
    }
  };

  return (
    <div className="card" style={{ padding: 32 }}>
      <h2>Kayıt Ol</h2>
      {/* Kayıt formu */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Kullanıcı Adı:</label><br />
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label><br />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Şifre:</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Kayıt Ol</button>
      </form>
      {/* Hata mesajı varsa göster */}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Register;
