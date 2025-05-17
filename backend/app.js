require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000' }
});

function getQuizFromDB(quizId) {
  return {
    questions: [
      { text: "Soru 1?" },
      { text: "Soru 2?" },
    ]
  };
}

function getParticipantCount(quizId) {
  return 1;
}

io.on('connection', (socket) => {
  // tüm socket event'leri burada
});

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB bağlandı!'))
  .catch(err => console.error('❌ MongoDB bağlantı hatası:', err));

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Sunucu ${port} portunda çalışıyor!`));
