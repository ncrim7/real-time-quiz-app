
/*
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const QuizSession = ({ quizId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const socket = io('http://localhost:5000'); // Backend URL

  useEffect(() => {
    // Quiz oturumuna katıl
    socket.emit('joinQuiz', quizId);

    // Yeni soru geldiğinde
    socket.on('newQuestion', (question) => {
      setCurrentQuestion(question);
    });

    // Skor güncellemesi
    socket.on('scoreUpdate', (scores) => {
      setLeaderboard(scores);
    });

    return () => {
      socket.disconnect(); // Component kaldırıldığında bağlantıyı kes
    };
  }, [quizId]);

  const handleAnswer = (selectedOption) => {
    socket.emit('submitAnswer', {
      quizId,
      questionIndex: currentQuestion.index,
      answer: selectedOption
    });
    // src/pages/QuizSession.js
    socket.emit('startQuiz', quizId);
    socket.on('newQuestion', (question) => {
      setCurrentQuestion(question);
    });
  };

  return (
    <div>
      <h2>{currentQuestion?.text}</h2>
      {currentQuestion?.options.map((option, index) => (
        <button key={index} onClick={() => handleAnswer(index)}>
          {option}
        </button>
      ))}
      <h3>Skor Tablosu</h3>
      {leaderboard.map((user, index) => (
        <div key={user.id}>{index + 1}. {user.name}: {user.score}</div>
      ))}
    </div>
  );
};

export default QuizSession;
*/


// src/pages/QuizSession.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

const QuizSession = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // QuizSession.js içinde
  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.emit('joinQuiz', quizId);
    socket.on('participantUpdate', (data) => {
      console.log(`Aktif katılımcı sayısı: ${data.count}`);
    });

    return () => socket.disconnect();
  }, [quizId]);

  return (
    <div className="quiz-session">
      <h2>{quiz?.title}</h2>
      {currentQuestion ? (
        <div className="question-container">
          <h3>{currentQuestion.text}</h3>
          {/*Seçenekler ve zamanlayıcı buraya */}
        </div>
      ) : (
        <button onClick={() => setCurrentQuestion(quiz.questions[0])}>
          Quiz'i Başlat
        </button>
      )}
    </div>
  );
};

export default QuizSession;

