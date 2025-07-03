import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizList from './pages/QuizList';
import QuizCreate from './pages/QuizCreate';
import LiveQuiz from './pages/LiveQuiz';
import PlayQuiz from './pages/PlayQuiz';
import Profile from './pages/Profile';
import Lobby from './pages/Lobby';
import AdminPanel from './pages/AdminPanel';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        {/* Sayfa yönlendirmeleri (routing) */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/quiz-list" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
          <Route path="/quiz-create" element={<ProtectedRoute><QuizCreate /></ProtectedRoute>} />
          <Route path="/live-quiz" element={<ProtectedRoute><LiveQuiz /></ProtectedRoute>} />
          <Route path="/play-quiz/:id" element={<ProtectedRoute><PlayQuiz /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/lobby" element={<ProtectedRoute><Lobby /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
