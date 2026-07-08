import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-container animate-bounce-in">
      <div className="home-container">
        <div className="hero-image animate-float">
          🎨
        </div>
        
        <h1 className="title" style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '20px' }}>
          Elifba Öğreniyorum
        </h1>
        
        <div className="menu-buttons">
          <button 
            className="btn menu-btn" 
            onClick={() => navigate('/lessons?mode=learn')}
          >
            📚 Öğren
          </button>
          
          <button 
            className="btn btn-secondary menu-btn" 
            onClick={() => navigate('/lessons?mode=play')}
          >
            🎮 Oyna
          </button>
        </div>
      </div>
    </div>
  );
}
