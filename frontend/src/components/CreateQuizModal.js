import React, { useState } from 'react';
import axios from 'axios';

const CreateQuizModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', ''], correctAnswer: 0 }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/quizzes', { title, questions }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onClose();
      window.location.reload(); // Listeyi güncelle
    } catch (error) {
      alert('Quiz oluşturulamadı: ' + error.response?.data?.error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Yeni Quiz Oluştur</h2>
        <form onSubmit={handleSubmit}>
          {/* Form elemanları buraya */}
          <button type="submit">Kaydet</button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizModal;