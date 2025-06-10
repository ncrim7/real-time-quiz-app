// Admin Paneli ana sayfası
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ListIcon from '@mui/icons-material/List';
import BarChartIcon from '@mui/icons-material/BarChart';
import FlagIcon from '@mui/icons-material/Flag';

const sections = [
  { key: 'overview', label: 'Dashboard', icon: <DashboardIcon /> },
  { key: 'users', label: 'Users', icon: <PeopleIcon /> },
  { key: 'quizzes', label: 'Quizzes', icon: <ListIcon /> },
  { key: 'analytics', label: 'Analytics', icon: <BarChartIcon /> },
  { key: 'reports', label: 'Reports', icon: <FlagIcon /> },
];

function AdminPanel() {
  const [tab, setTab] = useState('overview');
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (tab === 'quizzes') {
      axios.get('/api/admin/quizzes', { headers: { Authorization: 'Bearer ' + token } })
        .then(res => setQuizzes(res.data));
    } else if (tab === 'users') {
      axios.get('/api/admin/users', { headers: { Authorization: 'Bearer ' + token } })
        .then(res => setUsers(res.data));
    } else if (tab === 'analytics' || tab === 'overview') {
      axios.get('/api/admin/analytics', { headers: { Authorization: 'Bearer ' + token } })
        .then(res => setAnalytics(res.data));
    }
  }, [tab, token]);

  return (
    <div id="admin" className="page" style={{ minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(120deg, #6a11cb 0%, #2575fc 100%)', padding: 0, margin: 0 }}>
      <div className="dashboard">
        <div className="sidebar">
          <h3 style={{ color: 'white', marginBottom: '2rem' }}>Admin Panel</h3>
          <ul className="sidebar-menu">
            {sections.map(sec => (
              <li key={sec.key}>
                <a href="#" className={tab === sec.key ? 'active' : ''} onClick={e => { e.preventDefault(); setTab(sec.key); }}>
                  {sec.icon} {sec.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="dashboard-content">
          {/* Overview */}
          {tab === 'overview' && (
            <div className="admin-section">
              <h2 style={{ color: 'white', marginBottom: '2rem' }}>Gösterge Paneli Genel Bakış</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{analytics.userCount || '—'}</div>
                  <div>Toplam Kullanıcı</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{analytics.quizCount || '—'}</div>
                  <div>Aktif Quizler</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{analytics.sessionCount || '—'}</div>
                  <div>Quiz Oturumları</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{analytics.uptime || '—'}%</div>
                  <div>Çalışma Süresi</div>
                </div>
              </div>
            </div>
          )}
          {/* Users */}
          {tab === 'users' && (
            <div className="admin-section">
              <h2 style={{ color: 'white', marginBottom: '2rem' }}>Kullanıcı Yönetimi</h2>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 15, padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  <div>Kullanıcı</div>
                  <div>Katılma Tarihi</div>
                  <div>Quizler</div>
                  <div>İşlemler</div>
                </div>
                {users.map((u, i) => (
                  <div key={u._id || i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{u.name || u.username}</div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{u.email}</div>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div>{u.createdQuizzes ? u.createdQuizzes.length : 0}</div>
                    <div>
                      <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
                        <i className="fas fa-edit"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Quizzes */}
          {tab === 'quizzes' && (
            <div className="admin-section">
              <h2 style={{ color: 'white', marginBottom: '2rem' }}>Tüm Quizler</h2>
              <div className="quiz-grid">
                {quizzes.map(q => (
                  <div className="quiz-card" key={q._id}>
                    <div className="quiz-header">
                      <h3>{q.title}</h3>
                      <span className="quiz-status status-live">{q.isActive ? 'LIVE' : 'PASSIVE'}</span>
                    </div>
                    <p>{q.description}</p>
                    <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                      <span style={{ marginRight: 16 }}><i className="fas fa-users"></i> {q.participants || 0} participants</span>
                      <span><i className="fas fa-eye" style={{ marginLeft: 8 }}></i> {q.views || 0} views</span>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Edit</button>
                      <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Delete</button>
                      <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Start Live</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Analytics */}
          {tab === 'analytics' && (
            <div className="admin-section">
              <h2 style={{ color: 'white', marginBottom: '2rem' }}>Analiz</h2>
              <div>Toplam Quiz: {analytics.quizCount}</div>
              <div>Toplam Kullanıcı: {analytics.userCount}</div>
              <div>En Çok Oynanan Quizler:</div>
              <ul>
                {(analytics.mostPlayed || []).map((q, i) => (
                  <li key={i}>{q._id} ({q.count} kez)</li>
                ))}
              </ul>
            </div>
          )}
          {/* Reports */}
          {tab === 'reports' && (
            <div className="admin-section">
              <h2 style={{ color: 'white', marginBottom: '2rem' }}>Reports</h2>
              <div style={{ color: 'rgba(255,255,255,0.7)' }}>
                Raporlama ve moderasyon özellikleri buraya eklenecek.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
