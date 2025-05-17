const mongoose = require('mongoose');
const quizSchema = new mongoose.Schema({
  title: String,
  questions: [{
    text: String,
    options: [String],
    correctAnswer: Number,
    mediaUrl: String
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Quiz', quizSchema);