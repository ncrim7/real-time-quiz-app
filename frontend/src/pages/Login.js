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
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    
    // Backend'den kullanıcı bilgisini alın
    const userRes = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${res.data.token}` }
    });
    
    // AuthContext'i güncelleyin
    login(userRes.data);
    navigate('/dashboard');
  } catch (error) {
    alert('Giriş başarısız!');
  }
};
  // Giriş işlemi başarılı olduğunda token'ı localStorage'a kaydediyoruz
  // ve kullanıcıyı dashboard sayfasına yönlendiriyoruz
  // Giriş işlemi başarısız olursa bir uyarı gösteriyoruz
  // Giriş formunu oluşturuyoruz
  // Kullanıcıdan email ve şifre alıyoruz
  // Form gönderildiğinde handleSubmit fonksiyonunu çağırıyoruz
  // Giriş işlemi için axios ile POST isteği yapıyoruz
  // Başarılı olursa token'ı localStorage'a kaydediyoruz
  // ve kullanıcı bilgilerini AuthContext'e kaydediyoruz
  // Başarısız olursa bir uyarı gösteriyoruz
  // Formu oluşturuyoruz
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Giriş Yap</button>
    </form>
  );
};

export default Login;