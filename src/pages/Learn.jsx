import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Home } from 'lucide-react';
import { getLettersByLesson } from '../data/elifba';
import { playAudio } from '../utils/audio';

export default function Learn() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [animatingId, setAnimatingId] = useState(null);

  const currentLetters = getLettersByLesson(lessonId);

  const handlePlaySound = (letterObj) => {
    setAnimatingId(letterObj.id);
    playAudio(letterObj.letter, letterObj.name);
    setTimeout(() => setAnimatingId(null), 600);
  };

  return (
    <div className="page-container animate-bounce-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="header">
        <button className="btn-icon" onClick={() => navigate('/')}>
          <Home size={28} />
        </button>
        <h1 className="title">Öğren</h1>
        <div style={{ width: 60 }}></div> {/* Spacer for centering */}
      </div>

      <div 
        className="learn-grid" 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
          padding: '20px 20px 60px 20px',
          overflowY: 'auto',
          flex: 1,
          alignContent: 'flex-start'
        }}
      >
        {currentLetters.map((letterObj) => (
          <div 
            key={letterObj.id}
            className={`glass-panel grid-item ${animatingId === letterObj.id ? 'animate-shake' : ''}`}
            onClick={() => handlePlaySound(letterObj)}
            style={{
              width: letterObj.letter.length > 40 ? '100%' : letterObj.letter.length > 20 ? '300px' : letterObj.letter.length > 10 ? '200px' : '120px',
              minHeight: '140px',
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              border: '2px solid rgba(255,255,255,0.4)',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
          >
            <div className="arabic-letter" style={{ 
              fontSize: letterObj.letter.length > 40 ? '2rem' : letterObj.letter.length > 20 ? '2.5rem' : letterObj.letter.length > 10 ? '3rem' : '4rem', 
              lineHeight: '1.4', 
              color: '#2c3e50', 
              marginBottom: '10px' 
            }}>
              {letterObj.letter}
            </div>
            <div className="letter-name" style={{ fontSize: '1.4rem', color: '#e74c3c', fontWeight: 'bold' }}>
              {letterObj.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
