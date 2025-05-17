// src/pages/QuizList.js
const [quizzes, setQuizzes] = useState([]);

useEffect(() => {
  const fetchQuizzes = async () => {
    const res = await axios.get('http://localhost:5000/api/quizzes', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setQuizzes(res.data);
  };
  fetchQuizzes();
}, []);