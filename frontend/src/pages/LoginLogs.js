import React, { useEffect, useState } from "react";
import axios from "axios";

const LoginLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("/api/login-logs")
      .then(res => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Loglar alınamadı");
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container">
      <h2 className="page-title">Kullanıcı Giriş Logları</h2>
      {loading && <div>Yükleniyor...</div>}
      {error && <div style={{color: 'red'}}>{error}</div>}
      {!loading && !error && (
        <div style={{overflowX: 'auto', width: '100%'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #6366f122'}}>
            <thead>
              <tr style={{background: '#f3f4f6'}}>
                <th style={{padding: '10px 8px', textAlign: 'left'}}>Kullanıcı</th>
                <th style={{padding: '10px 8px', textAlign: 'left'}}>Email</th>
                <th style={{padding: '10px 8px', textAlign: 'left'}}>IP</th>
                <th style={{padding: '10px 8px', textAlign: 'left'}}>Konum</th>
                <th style={{padding: '10px 8px', textAlign: 'left'}}>Tarayıcı</th>
                <th style={{padding: '10px 8px', textAlign: 'left'}}>Zaman</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} style={{borderBottom: '1px solid #e5e7eb'}}>
                  <td style={{padding: '8px 6px'}}>{log.user?.username || '-'}</td>
                  <td style={{padding: '8px 6px'}}>{log.user?.email || '-'}</td>
                  <td style={{padding: '8px 6px'}}>{log.ip}</td>
                  <td style={{padding: '8px 6px'}}>{log.location || '-'}</td>
                  <td style={{padding: '8px 6px', maxWidth: 220, fontSize: 13, color: '#6b7280'}}>{log.userAgent?.slice(0, 60) || '-'}</td>
                  <td style={{padding: '8px 6px'}}>{new Date(log.time).toLocaleString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoginLogs;
