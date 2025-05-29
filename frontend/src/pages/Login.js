// Kullanıcı giriş (login) sayfası
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

function Login() {
  // Email, şifre ve hata mesajı için state'ler
  const [email, setEmail] = useState(''); // Kullanıcı emaili
  const [password, setPassword] = useState(''); // Kullanıcı şifresi
  const [error, setError] = useState(''); // Hata mesajı
  const navigate = useNavigate(); // Yönlendirme için hook

  // Form submit edildiğinde giriş işlemini yapar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // API ile giriş isteği gönder
      const res = await login(email, password);
      // Başarılıysa token ve email localStorage'a kaydedilir
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', email);
      alert('Giriş başarılı!');
      navigate('/'); // Ana sayfaya yönlendir
    } catch (err) {
      setError('Giriş başarısız.'); // Hata mesajı göster
    }
  };

  return (
    <div className="card" style={{ padding: 32 }}>
      <h2>Giriş Yap</h2>
      {/* Giriş formu */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Şifre:</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Giriş</button>
      </form>
      {/* Hata mesajı varsa göster */}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Login;
