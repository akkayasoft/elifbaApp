import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Home, Headphones, Puzzle } from 'lucide-react';
import QuizGame from '../components/QuizGame';
import MemoryGame from '../components/MemoryGame';

export default function Play() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  
  const [gameMode, setGameMode] = useState(null); // 'quiz' or 'puzzle'
  const [score, setScore] = useState(0);

  return (
    <div className="page-container animate-bounce-in">
      <div className="header">
        <button className="btn-icon" onClick={() => navigate('/')}>
          <Home size={28} />
        </button>
        <h1 className="title">Oyna</h1>
        {gameMode && (
          <div className="score" style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold' }}>
            ⭐ {score}
          </div>
        )}
      </div>

      {!gameMode ? (
        <div className="game-mode-selector" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '30px' }}>
          <h2 style={{ color: 'white', fontSize: '3rem', textShadow: '2px 2px 4px rgba(0,0,0,0.2)', marginBottom: '20px' }}>Oyun Modunu Seç</h2>
          
          <button 
            className="glass-panel"
            style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '30px', width: '300px', cursor: 'pointer', transition: 'transform 0.2s', border: 'none', textAlign: 'left' }}
            onClick={() => setGameMode('quiz')}
          >
            <div style={{ background: 'var(--primary)', padding: '15px', borderRadius: '50%', color: 'white' }}>
              <Headphones size={40} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>Sesi Bul</div>
              <div style={{ fontSize: '1rem', color: '#666' }}>Sesi dinle, doğru kartı bul!</div>
            </div>
          </button>

          <button 
            className="glass-panel"
            style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '30px', width: '300px', cursor: 'pointer', transition: 'transform 0.2s', border: 'none', textAlign: 'left' }}
            onClick={() => setGameMode('puzzle')}
          >
            <div style={{ background: '#A18CD1', padding: '15px', borderRadius: '50%', color: 'white' }}>
              <Puzzle size={40} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>Eşleştir</div>
              <div style={{ fontSize: '1rem', color: '#666' }}>Kartları çevir, eşini bul!</div>
            </div>
          </button>
        </div>
      ) : (
        <>
          {gameMode === 'quiz' && <QuizGame lessonId={lessonId} setScore={setScore} />}
          {gameMode === 'puzzle' && <MemoryGame lessonId={lessonId} setScore={setScore} />}
        </>
      )}
    </div>
  );
}
