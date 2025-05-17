
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const quizController = require('../controllers/quizController'); // Bu satır eksikse ekleyin


// POST /api/quizzes (Sadece öğretmenler)
router.post('/', auth('teacher'), quizController.createQuiz); 

// GET /api/quizzes (Tüm kullanıcılar)
router.get('/', auth(), quizController.getAllQuizzes); 

module.exports = router;