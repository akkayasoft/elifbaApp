import { useNavigate, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import { lessons } from '../data/elifba';

export default function LessonSelect() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we came from "play" button to determine target path
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode') || 'learn'; // 'learn' or 'play'

  const handleLessonSelect = (lessonId) => {
    navigate(`/${mode}/${lessonId}`);
  };

  return (
    <div className="page-container animate-bounce-in">
      <div className="header">
        <button className="btn-icon" onClick={() => navigate('/')}>
          <Home size={28} />
        </button>
        <h1 className="title">Ders Seçimi</h1>
        <div style={{ width: 60 }}></div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', overflowY: 'auto', paddingBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
          Hangi dersi {mode === 'play' ? 'oynamak' : 'öğrenmek'} istiyorsun?
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', maxWidth: '900px' }}>
          {lessons.map(lesson => (
            <div 
              key={lesson.id}
              className="glass-panel"
              style={{ 
                width: '200px', 
                height: '200px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                gap: '10px'
              }}
              onClick={() => handleLessonSelect(lesson.id)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            >
              <div style={{ fontSize: '4rem' }}>{lesson.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent)', fontFamily: '"Baloo 2", cursive' }}>
                {lesson.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
