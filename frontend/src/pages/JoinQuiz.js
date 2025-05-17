const [quizId, setQuizId] = useState('');

const handleJoin = () => {
  socket.emit('joinQuiz', quizId);
  navigate(`/quiz/${quizId}`);
};
return (
  <div>
    <h1>Quiz'e Katıl</h1>
    <input
      type="text"
      placeholder="Quiz ID"
      value={quizId}
      onChange={(e) => setQuizId(e.target.value)}
    />
    <button onClick={handleJoin}>Katıl</button>
  </div>
);
