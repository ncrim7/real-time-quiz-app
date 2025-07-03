// Kullanıcıya ait profil ve quiz geçmişi sayfası
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListIcon from '@mui/icons-material/List';
import HistoryIcon from '@mui/icons-material/History';
import TrophyIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import PieChartIcon from '@mui/icons-material/PieChart';

const sections = [
  { key: 'overview', label: 'Overview', icon: <PieChartIcon /> },
  { key: 'quizzes', label: 'My Quizzes', icon: <ListIcon /> },
  { key: 'history', label: 'Quiz History', icon: <HistoryIcon /> },
  { key: 'achievements', label: 'Achievements', icon: <TrophyIcon /> },
  { key: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

function Profile() {
  const [user, setUser] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [quizTitles, setQuizTitles] = useState({});
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('https://quiz-master-backend-p6bs.onrender.com/api/user/me', {
        headers: { Authorization: 'Bearer ' + token }
      }).then(res => {
        setUser(res.data);
        setQuizHistory(res.data.quizHistory || []);
      });
    }
  }, []);

  useEffect(() => {
    async function fetchTitles() {
      const missing = quizHistory.filter(q => q.quizId && !quizTitles[q.quizId]);
      const promises = missing.map(q =>
        axios.get('https://quiz-master-backend-p6bs.onrender.com/api/quiz/' + q.quizId)
          .then(res => ({ id: q.quizId, title: res.data.title }))
          .catch(() => ({ id: q.quizId, title: 'Quiz bulunamadı' }))
      );
      const results = await Promise.all(promises);
      if (results.length > 0) {
        setQuizTitles(prev => {
          const updated = { ...prev };
          results.forEach(r => { updated[r.id] = r.title; });
          return updated;
        });
      }
    }
    if (quizHistory.length > 0) fetchTitles();
    // eslint-disable-next-line
  }, [quizHistory]);

  if (!user) return <div style={{ padding: 32 }}>Yükleniyor...</div>;

  // Stat hesaplamaları
  const quizzesTaken = quizHistory.length;
  const quizzesCreated = user.createdQuizzes ? user.createdQuizzes.length : 0;
  const avgScore = quizHistory.length > 0 ? Math.round(quizHistory.reduce((a, b) => a + (b.score || 0), 0) / quizHistory.length) : 0;
  const totalPoints = quizHistory.reduce((a, b) => a + (b.score || 0), 0);
  const recent = quizHistory.slice(-3).reverse();
  const initials = user.name ? user.name.split(' ').map(x => x[0]).join('').slice(0,2).toUpperCase() : (user.username||'')[0]?.toUpperCase();

  return (
    <div id="profile" className="page" style={{ minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(120deg, #6a11cb 0%, #2575fc 100%)', padding: 0, margin: 0 }}>
      <div className="dashboard" style={{ display: 'flex', maxWidth: 1200, margin: '0 auto', minHeight: '80vh', padding: '32px 0' }}>
        <aside className="sidebar" style={{ width: 240, minWidth: 180, background: 'rgba(255,255,255,0.04)', borderRadius: 18, padding: '2.5rem 1.2rem 2rem 1.2rem', marginRight: 32, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', boxShadow: '0 2px 12px #6366f111', height: 'fit-content', position: 'sticky', top: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', fontWeight: 700, marginBottom: 10 }}>{initials}</div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 18, marginBottom: 2 }}>{user.name || user.username}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 2 }}>@{user.username}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Üyelik Tarihi: {new Date(user.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}</div>
          </div>
          <ul className="sidebar-menu" style={{ width: '100%', listStyle: 'none', padding: 0, margin: 0 }}>
            {sections.map(sec => (
              <li key={sec.key} style={{ width: '100%', marginBottom: 6 }}>
                <button className={activeSection === sec.key ? 'active' : ''} onClick={e => { e.preventDefault(); setActiveSection(sec.key); }} style={{ background: activeSection === sec.key ? 'rgba(255,255,255,0.13)' : 'none', border: 'none', color: 'white', padding: '0.7rem 1rem', fontSize: '1rem', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.7rem', borderRadius: 10, fontWeight: 600, cursor: 'pointer', transition: 'background 0.18s' }}>
                  {sec.icon} {sec.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main className="dashboard-content" style={{ flex: 1, minWidth: 0 }}>
          {/* Overview */}
          {activeSection === 'overview' && (
            <div className="profile-section">
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="stat-card">
                  <div className="stat-number">{quizzesTaken}</div>
                  <div>Katılan Quizler</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{quizzesCreated}</div>
                  <div>Oluşturulan Quizler</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{avgScore}%</div>
                  <div>Ortalama Puan</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{totalPoints}</div>
                  <div>Toplam Puan</div>
                </div>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>Son Aktivite</h3>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 15, padding: '1.5rem' }}>
                  {recent.length === 0 && <div style={{ color: 'rgba(255,255,255,0.7)' }}>No recent activity.</div>}
                  {recent.map((q, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: i < recent.length-1 ? '1rem' : 0, paddingBottom: i < recent.length-1 ? '1rem' : 0, borderBottom: i < recent.length-1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                      <div>
                        <h4 style={{ color: 'white', marginBottom: 4 }}>{quizTitles[q.quizId] || '...'}</h4>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Tamamlandı {timeAgo(q.date)}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#ffd93d', fontWeight: 600 }}>{q.score}%</div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{q.score * 5} puan</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* My Quizzes */}
          {activeSection === 'quizzes' && (
            <div className="profile-section">
              <h2 style={{ color: 'white', marginBottom: '2rem' }}>Oluşturduğum Quizler</h2>
              <div className="quiz-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                {(user.createdQuizzes && user.createdQuizzes.length > 0) ? user.createdQuizzes.map((quiz, idx) => (
                  <div className="quiz-card" key={quiz._id || idx} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.5rem', boxShadow: '0 2px 8px #6366f111' }}>
                    <div className="quiz-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <h3 style={{ color: 'white', fontSize: 18 }}>{quiz.title}</h3>
                      <span className="quiz-status status-live" style={{ color: '#10b981', fontWeight: 600, fontSize: 13 }}>AKTİF</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>{quiz.description}</p>
                    <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                      <span style={{ marginRight: 16 }}><i className="fas fa-users"></i> {quiz.participants || 0} katılımcı</span>
                      <span><i className="fas fa-eye" style={{ marginLeft: 8 }}></i> {quiz.views || 0} görüntüleme</span>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                        <i className="fas fa-edit"></i> Düzenle
                      </button>
                      <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                        <i className="fas fa-chart-bar"></i> Analiz
                      </button>
                    </div>
                  </div>
                )) : <div style={{ color: 'rgba(255,255,255,0.7)' }}>No quizzes created.</div>}
              </div>
            </div>
          )}
          {/* Quiz History */}
          {activeSection === 'history' && (
            <div className="profile-section">
              <h2 style={{ color: 'white', marginBottom: '2rem' }}>Quiz Geçmişi</h2>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 15, padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  <div>Quiz Adı</div>
                  <div>Puan</div>
                  <div>Tarih</div>
                  <div>Mod</div>
                </div>
                {quizHistory.length === 0 && <div style={{ color: 'rgba(255,255,255,0.7)' }}>No quiz history.</div>}
                {quizHistory.slice().reverse().map((q, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white' }}>
                    <div>{quizTitles[q.quizId] || '...'}</div>
                    <div style={{ color: '#ffd93d' }}>{q.score}%</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>{new Date(q.date).toLocaleDateString('tr-TR')}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>{q.mode === 'canli' ? 'Canlı' : 'Solo'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Achievements */}
          {activeSection === 'achievements' && (
            <div className="profile-section">
              <h2 style={{ color: 'white', marginBottom: '2rem' }}>Başarımlar</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 15, padding: '1.5rem', textAlign: 'center', border: '2px solid #ffd93d' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
                  <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Quiz Master</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)' }}>10+ quiz oluşturdu</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 15, padding: '1.5rem', textAlign: 'center', border: '2px solid #ff6b6b' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                  <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Perfect Score</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)' }}>Bir quizde %100 puan aldı</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 15, padding: '1.5rem', textAlign: 'center', border: '2px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                  <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Speed Demon</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)' }}>10 soruyu 30 saniye içinde yanıtla</p>
                </div>
              </div>
            </div>
          )}
          {/* Settings */}
          {activeSection === 'settings' && (
            <div className="profile-section">
              <h2 style={{ color: 'white', marginBottom: '2rem' }}>Ayarlar</h2>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 15, padding: '2rem', maxWidth: 400 }}>
                <div className="form-group">
                  <label>Görünen Ad</label>
                  <input type="text" className="form-control" value={user.name || ''} readOnly />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" value={user.email || ''} readOnly />
                </div>
                <div className="form-group">
                  <label>Kullanıcı Adı</label>
                  <input type="text" className="form-control" value={user.username || ''} readOnly />
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                    <input type="checkbox" style={{ accentColor: '#ff6b6b' }} checked readOnly />
                    Email bildirimleri
                  </label>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                    <input type="checkbox" style={{ accentColor: '#ff6b6b' }} checked readOnly />
                    Profilin herkese açık
                  </label>
                </div>
                <button className="btn btn-primary" disabled>
                  <i className="fas fa-save"></i>
                  Değişiklikleri Kaydet
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Yardımcı: Zamanı "2 hours ago" gibi göster
function timeAgo(date) {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff/86400)} days ago`;
  return d.toLocaleDateString('en-US');
}

export default Profile;
