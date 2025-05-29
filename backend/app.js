// Kahoot-Clone backend ana uygulama dosyası
// Express.js, Socket.io, MongoDB ve JWT tabanlı kimlik doğrulama ile gerçek zamanlı quiz platformu sunar
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js'; // Kimlik doğrulama endpointleri
import userRoutes from './routes/user.js'; // Kullanıcı endpointleri
import quizRoutes from './routes/quiz.js'; // Quiz endpointleri
import Quiz from './models/Quiz.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
// Socket.io sunucusu başlatılır
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// API route'ları
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/quiz', quizRoutes);

// Oda skorları ve quiz state'leri için bellek içi objeler
const roomScores = {};
const roomQuizState = {};

// Socket.io ile gerçek zamanlı quiz eventleri
io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı:', socket.id);

  // Kullanıcı quiz odasına katılır
  socket.on('joinRoom', async ({ roomCode, username }) => {
    socket.join(roomCode);
    // Oda için quiz ve state başlat
    if (!roomQuizState[roomCode]) {
      const quiz = await Quiz.findOne({ roomCode, isActive: true });
      if (quiz) {
        roomQuizState[roomCode] = {
          quiz,
          currentQ: 0,
          scores: {}, // { userId: { score, username } }
          answered: new Set()
        };
      }
    }
    // Kullanıcıyı skor tablosuna ekle (ilk girişte)
    if (roomQuizState[roomCode]) {
      if (!roomQuizState[roomCode].scores[socket.id]) {
        roomQuizState[roomCode].scores[socket.id] = { score: 0, username };
      }
    }
    socket.to(roomCode).emit('userJoined', socket.id);
    // Skor tablosu gönder
    const scores = Object.entries(roomQuizState[roomCode]?.scores || {}).map(([userId, data]) => ({ userId, username: data.username, score: data.score }));
    io.to(roomCode).emit('updateScores', scores);
  });

  // Oda için mevcut soruyu gönder
  socket.on('getQuestion', (roomCode) => {
    const state = roomQuizState[roomCode];
    if (state && state.quiz.questions[state.currentQ]) {
      io.to(roomCode).emit('question', {
        index: state.currentQ,
        question: state.quiz.questions[state.currentQ]
      });
      state.answered = new Set();
    }
  });

  // Kullanıcı cevap gönderdiğinde
  socket.on('sendAnswer', ({ roomCode, answer, userId }) => {
    const state = roomQuizState[roomCode];
    if (!state || state.answered.has(userId)) return;
    state.answered.add(userId);
    const q = state.quiz.questions[state.currentQ];
    const isCorrect = q.options[q.correctIndex] === answer;
    if (!state.scores[userId]) state.scores[userId] = { score: 0, username: "?" };
    if (isCorrect) state.scores[userId].score += 1;
    io.to(roomCode).emit('receiveAnswer', { userId, answer, isCorrect });
    // Skor tablosu gönder
    const scores = Object.entries(state.scores).map(([userId, data]) => ({ userId, username: data.username, score: data.score }));
    io.to(roomCode).emit('updateScores', scores);
  });

  // Sonraki soruya geç
  socket.on('nextQuestion', (roomCode) => {
    const state = roomQuizState[roomCode];
    if (state) {
      state.currentQ += 1;
      state.answered = new Set();
      if (state.quiz.questions[state.currentQ]) {
        io.to(roomCode).emit('question', {
          index: state.currentQ,
          question: state.quiz.questions[state.currentQ]
        });
      } else {
        // Quiz bittiğinde skorları kullanıcıya kaydet
        const quizId = state.quiz._id;
        const scoresArr = Object.entries(state.scores).map(([userId, data]) => ({ userId, username: data.username, score: data.score }));
        // Her kullanıcı için quizHistory'ye ekle
        scoresArr.forEach(async ({ userId, score }) => {
          // userId socket.id, username ile eşleşen User'ı bul
          const user = await User.findOne({ username: state.scores[userId]?.username });
          if (user) {
            user.quizHistory.push({ quizId, score, date: new Date() });
            await user.save();
          }
        });
        io.to(roomCode).emit('quizEnd', { scores: scoresArr });
      }
    }
  });

  // Kullanıcı bağlantıyı kopardığında
  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id);
    // Kullanıcı ayrıldığında skor tablosundan çıkar
    for (const roomId in roomScores) {
      roomScores[roomId] = roomScores[roomId].filter(s => s.userId !== socket.id);
      io.to(roomId).emit('updateScores', roomScores[roomId]);
    }
  });
});

// MongoDB bağlantısı ve sunucu başlatma
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected to', process.env.MONGODB_URI);
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});
