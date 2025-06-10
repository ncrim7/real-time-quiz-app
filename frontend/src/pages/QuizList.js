// Tüm quizleri listeleyen sayfa
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { deleteQuiz, updateQuiz } from '../services/api';
import QuizIcon from '@mui/icons-material/Quiz';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function QuizList() {
  // Quiz listesini tutan state
  const [quizzes, setQuizzes] = useState([]);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('email'));
  const [editQuiz, setEditQuiz] = useState(null); // Düzenlenen quiz
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editQuestions, setEditQuestions] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate(); // Yönlendirme için hook

  // Sayfa yüklendiğinde quizleri backend'den çek
  useEffect(() => {
    axios.get('http://localhost:5000/api/quiz')
      .then(res => setQuizzes(res.data)) // Başarılıysa quizleri state'e yaz
      .catch(() => setQuizzes([])); // Hata olursa boş dizi
  }, []);

  // Quiz silme fonksiyonu
  const handleDelete = async (id) => {
    if (window.confirm('Bu quiz silinsin mi?')) {
      try {
        await deleteQuiz(id, localStorage.getItem('token'));
        setQuizzes(quizzes.filter(q => q._id !== id));
      } catch {
        alert('Quiz silinemedi. Sadece kendi oluşturduğunuz quizleri silebilirsiniz.');
      }
    }
  };

  // Quiz düzenleme formunu aç
  const handleEdit = (quiz) => {
    setEditQuiz(quiz);
    setEditTitle(quiz.title);
    setEditDescription(quiz.description);
    setEditQuestions(JSON.parse(JSON.stringify(quiz.questions)));
    setShowEdit(true);
  };

  // Quiz güncelleme işlemi
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        title: editTitle,
        description: editDescription,
        questions: editQuestions
      };
      const res = await updateQuiz(editQuiz._id, updated, localStorage.getItem('token'));
      setQuizzes(quizzes.map(q => q._id === editQuiz._id ? res.data : q));
      setShowEdit(false);
      setEditQuiz(null);
    } catch {
      alert('Quiz güncellenemedi. Sadece kendi oluşturduğunuz quizleri güncelleyebilirsiniz.');
    }
  };

  // Soru ve şık düzenleme yardımcıları
  const handleEditQuestionChange = (idx, field, value) => {
    const updated = [...editQuestions];
    if (field === 'text') updated[idx].text = value;
    setEditQuestions(updated);
  };
  const handleEditOptionChange = (qIdx, optIdx, value) => {
    const updated = [...editQuestions];
    updated[qIdx].options[optIdx] = value;
    setEditQuestions(updated);
  };
  const handleEditCorrectChange = (qIdx, optIdx) => {
    const updated = [...editQuestions];
    updated[qIdx].correctIndex = optIdx;
    setEditQuestions(updated);
  };

  // Quiz düzenleme modalı için gelişmiş yardımcılar
  const handleEditAddQuestion = () => {
    setEditQuestions([
      ...editQuestions,
      { text: '', options: ['', '', '', ''], correctIndex: 0 }
    ]);
  };
  const handleEditDeleteQuestion = (idx) => {
    if (editQuestions.length === 1) {
      alert('En az bir soru olmalı!');
      return;
    }
    if (window.confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
      setEditQuestions(editQuestions.filter((_, i) => i !== idx));
    }
  };

  // Modal kapatıldığında state sıfırlama
  const handleCloseEdit = () => {
    setShowEdit(false);
    setEditQuiz(null);
    setEditTitle('');
    setEditDescription('');
    setEditQuestions([]);
  };

  // Quiz başlatma fonksiyonu
  const handleStart = async (quizId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/quiz/${quizId}/start`);
      const roomCode = res.data.roomCode;
      navigate('/lobby', { state: { roomCode, isOwner: true } });
    } catch {
      alert('Quiz başlatılamadı.');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
      minHeight: '100vh',
      padding: '32px 0',
    }}>
      <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #0001', padding: 32 }}>
        <h2 style={{ display: 'flex', alignItems: 'center', color: '#3b3b5c', fontWeight: 700, fontSize: 28, marginBottom: 24 }}>
          <QuizIcon style={{ marginRight: 10, color: '#6a11cb' }} /> Quizler
        </h2>
        {/* Her quiz için kart görünümü */}
        {quizzes.map(quiz => (
          <div className="quiz-card" key={quiz._id} style={{ background: '#f7f8fa', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 20, marginBottom: 18 }}>
            <h3 style={{ marginBottom: 8, color: '#2575fc' }}>{quiz.title}</h3>
            <div style={{ color: '#888', marginBottom: 8 }}>{quiz.description}</div>
            <div style={{ fontSize: 14, color: '#aaa', marginBottom: 8 }}>Oluşturan: {quiz.createdBy?.email || 'Bilinmiyor'}</div>
            <button onClick={() => navigate(`/play-quiz/${quiz._id}`)} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>
              <QuizIcon style={{ marginRight: 4, fontSize: 18 }} /> Quiz Oyna
            </button>
            {/* Eğer quiz kullanıcınınsa düzenle, sil ve başlat butonları göster */}
            {quiz.createdBy?.email === userEmail && (
              <>
                <button style={{ background: 'var(--secondary)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 600, marginLeft: 8, cursor: 'pointer' }} onClick={() => handleEdit(quiz)}>Düzenle</button>
                <button style={{ background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 600, marginLeft: 8, cursor: 'pointer' }} onClick={() => handleDelete(quiz._id)}>Sil</button>
                <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 600, marginLeft: 8, cursor: 'pointer' }} onClick={() => handleStart(quiz._id)}>Başlat (Canlı)</button>
              </>
            )}
          </div>
        ))}
        {/* Quiz düzenleme modalı */}
        {showEdit && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ maxWidth: 500, width: '100%', position: 'relative', maxHeight: '90vh', overflowY: 'auto', borderRadius: 16, boxShadow: '0 4px 24px #0002', background: '#fff', padding: 24 }}>
              <button style={{ position: 'absolute', top: 8, right: 12, background: '#eee', color: '#333', fontWeight: 700, border: 'none', borderRadius: 8, padding: '2px 10px', cursor: 'pointer' }} onClick={() => setShowEdit(false)}>X</button>
              <h2 style={{ color: '#2575fc', fontWeight: 700 }}>Quiz Düzenle</h2>
              <form onSubmit={handleUpdate}>
                <div>
                  <label>Başlık:</label><br />
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)} required style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd', padding: 8, marginBottom: 10 }} />
                </div>
                <div>
                  <label>Açıklama:</label><br />
                  <input value={editDescription} onChange={e => setEditDescription(e.target.value)} required style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd', padding: 8, marginBottom: 10 }} />
                </div>
                <h4 style={{ color: '#3b3b5c', marginTop: 18 }}>Sorular</h4>
                {editQuestions.map((q, idx) => (
                  <div key={idx} style={{ marginBottom: 16, background: '#f7f8fa', borderRadius: 8, padding: 12 }}>
                    <b>Soru {idx + 1}:</b><br />
                    <input value={q.text} onChange={e => handleEditQuestionChange(idx, 'text', e.target.value)} placeholder="Soru metni" required style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd', padding: 8, marginBottom: 8 }} />
                    <div style={{ marginTop: 6 }}>
                      {q.options.map((opt, i) => (
                        <span key={i} style={{ display: 'inline-block', marginRight: 8 }}>
                          <input value={opt} onChange={e => handleEditOptionChange(idx, i, e.target.value)} placeholder={`Seçenek ${i + 1}`} required style={{ width: 120, borderRadius: 8, border: '1px solid #ddd', padding: 6 }} />
                          <input type="radio" name={`edit-correct-${idx}`} checked={q.correctIndex === i} onChange={() => handleEditCorrectChange(idx, i)} />
                          <span style={{ fontSize: 13, color: '#888' }}>Doğru</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <button type="submit" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, marginTop: 10 }}>Kaydet</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizList;
