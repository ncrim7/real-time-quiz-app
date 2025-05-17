module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('startQuiz', (quizId) => {
      const quiz = getQuiz(quizId);
      quiz.questions.forEach((question, index) => {
        setTimeout(() => {
          socket.emit('newQuestion', question);
        }, index * 20000); // Her soru 20 saniye
      });
    });
  });
};