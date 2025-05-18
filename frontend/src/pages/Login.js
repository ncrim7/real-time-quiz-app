import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  // AuthContext'ten login fonksiyonunu alıyoruz
  // AuthContext'i kullanarak kullanıcı bilgilerini güncelleyebiliriz

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // 1) Sunucuya istek gönder
    const { data } = await axios.post('/api/auth/login', { email, password });
    
    // 2) Token'ı context'e ve localStorage'a kaydet
    login(data.token);

    // 3) Kullanıcıya bildirim göster
    alert('Giriş başarılı! Hoş geldiniz.');

    // 4) Dashboard'a yönlendir
    navigate('/dashboard');
  } catch (err) {
    alert(err.response?.data?.error || 'Bir hata oluştu');
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Giriş Yap</button>
    </form>
  );
};

export default Login;