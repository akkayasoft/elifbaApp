import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LessonSelect from './pages/LessonSelect';
import Learn from './pages/Learn';
import Play from './pages/Play';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lessons" element={<LessonSelect />} />
        <Route path="/learn/:lessonId" element={<Learn />} />
        <Route path="/play/:lessonId" element={<Play />} />
      </Routes>
    </Router>
  );
}

export default App;
