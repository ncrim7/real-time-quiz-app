import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuizCard from '../components/QuizCard';
import CreateQuizModal from '../components/CreateQuizModal';
import '../styles/dashboardStyles.css';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // isTeacher değişkenini user.role'e göre hesapla
  const isTeacher = user?.role === 'teacher'; // <- Bu satırı ekleyin

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        const quizRes = await axios.get('http://localhost:5000/api/quizzes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuizzes(quizRes.data);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="dashboard-container">
      <header>
        <h1>{isTeacher ? 'Quiz Yönetim Paneli' : 'Katılabileceğiniz Quizler'}</h1>
        {isTeacher && (
          <button onClick={() => setShowModal(true)} className="create-btn">
            + Yeni Quiz
          </button>
        )}
      </header>

      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <QuizCard 
            key={quiz._id} 
            quiz={quiz} 
            isTeacher={isTeacher} // <- isTeacher prop'unu gönder
            onJoin={() => navigate(`/quiz/${quiz._id}`)}
          />
        ))}
      </div>

      {showModal && <CreateQuizModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Dashboard;