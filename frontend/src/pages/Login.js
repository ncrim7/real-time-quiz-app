// Kullanıcı giriş (login) sayfası
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import LoginIcon from '@mui/icons-material/Login';

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
      // Başarılıysa token, email ve rol localStorage'a kaydedilir
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', email);
      localStorage.setItem('role', res.data.user.role); // rol bilgisini ekle
      alert('Giriş başarılı!');
      navigate('/'); // Ana sayfaya yönlendir
    } catch (err) {
      setError('Giriş başarısız.'); // Hata mesajı göster
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
      minHeight: '100vh',
      padding: '32px 0',
    }}>
      <div className="card" style={{ maxWidth: 400, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0001', padding: 32 }}>
        <h2 style={{ display: 'flex', alignItems: 'center', color: '#3b3b5c', fontWeight: 700, fontSize: 28, marginBottom: 24 }}>
          <LoginIcon style={{ marginRight: 10, color: '#6a11cb' }} /> Giriş Yap
        </h2>
        {/* Giriş formu */}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label><br />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd', padding: 8, marginBottom: 10 }} />
          </div>
          <div>
            <label>Şifre:</label><br />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd', padding: 8, marginBottom: 10 }} />
          </div>
          <button type="submit" className="auth-btn">
            <LoginIcon style={{ marginRight: 4, fontSize: 18 }} /> Giriş
          </button>
        </form>
        {/* Hata mesajı varsa göster */}
        {error && <div className="error" style={{ color: 'var(--danger)', marginTop: 12 }}>{error}</div>}
      </div>
    </div>
  );
}

export default Login;
