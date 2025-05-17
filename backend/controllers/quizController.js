// backend/controllers/quizController.js
const Quiz = require('../models/Quiz');

exports.createQuiz = async (req, res) => { // Fonksiyon tanımı
  try {
    const { title, questions } = req.body;
    const quiz = new Quiz({ title, questions, createdBy: req.user._id });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
};