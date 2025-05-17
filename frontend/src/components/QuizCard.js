import React, { useState } from 'react';
import axios from 'axios';
// src/components/QuizCard.js
const QuizCard = ({ quiz, isTeacher, onJoin }) => {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      // API'ye katılım isteği gönder (isteğe bağlı)
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/quizzes/${quiz._id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onJoin(); // Quiz sayfasına yönlendir
    } catch (error) {
      alert('Katılım başarısız: ' + error.response?.data?.error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="quiz-card">
      <h3>{quiz.title}</h3>
      <p>{quiz.questions.length} soru • {quiz.participants || 0} katılımcı</p>
      {!isTeacher && (
        <button 
          onClick={handleJoin} 
          disabled={isJoining}
          className={`join-btn ${isJoining ? 'loading' : ''}`}
        >
          {isJoining ? 'Katılıyor...' : 'Katıl'}
        </button>
      )}
    </div>
  );
};

export default QuizCard;
