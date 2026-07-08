import { useState, useCallback, useEffect } from 'react';
import { Volume2, Play as PlayIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLettersByLesson } from '../data/elifba';
import { playAudio } from '../utils/audio';

export default function QuizGame({ lessonId, setScore }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isProcessingClick, setIsProcessingClick] = useState(false);
  const [targetState, setTargetState] = useState(null);

  const startNewRound = useCallback(() => {
    const currentLetters = getLettersByLesson(lessonId);
    
    // Pick a random target letter
    const targetIdx = Math.floor(Math.random() * currentLetters.length);
    const target = currentLetters[targetIdx];
    
    // Pick 2 other random letters
    const otherOptions = [];
    while (otherOptions.length < 2) {
      const randomIdx = Math.floor(Math.random() * currentLetters.length);
      if (randomIdx !== targetIdx && !otherOptions.includes(currentLetters[randomIdx])) {
        otherOptions.push(currentLetters[randomIdx]);
      }
    }
    
    // Combine and shuffle
    const allOptions = [target, ...otherOptions].sort(() => Math.random() - 0.5);
    
    setTargetState(target);
    setOptions(allOptions);
    setFeedback('Sesi dinle ve doğru harfi bul!');
    setIsProcessingClick(false);
    
    // Play the sound after a tiny delay
    setTimeout(() => {
      playAudio(target.letter, target.name);
    }, 100);
  }, [lessonId]);

  const handleStartGame = () => {
    setHasStarted(true);
    startNewRound();
  };

  const handleOptionClick = (option) => {
    if (isProcessingClick) return;
    
    if (option.id === targetState.id) {
      setFeedback('🎉 Harika! Doğru bildin!');
      setScore(s => s + 1);
      setIsProcessingClick(true);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        startNewRound();
      }, 2000);
    } else {
      setFeedback('😅 Yanlış oldu, tekrar dene!');
      playAudio(targetState.letter, targetState.name);
    }
  };

  return (
    <div className="play-content animate-bounce-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' }}>
      {!hasStarted ? (
        <div className="start-overlay text-center" style={{ marginTop: '50px' }}>
          <h2 style={{ color: 'white', fontSize: '3rem', marginBottom: '30px' }}>Hazır mısın?</h2>
          <button 
            className="btn glass-panel" 
            style={{ fontSize: '2.5rem', padding: '20px 40px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '15px' }}
            onClick={handleStartGame}
          >
            <PlayIcon size={40} /> Başla!
          </button>
        </div>
      ) : (
        <>
          <div className="feedback-text text-center" style={{ marginBottom: '20px' }}>
            {feedback}
          </div>

          <button 
            className="btn-icon sound-btn" 
            style={{ background: 'var(--primary)', color: 'white', border: '4px solid white', marginBottom: '40px' }}
            onClick={() => playAudio(targetState.letter, targetState.name)}
          >
            <Volume2 size={60} />
          </button>

          <div className="options-container" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {options.map((option, idx) => (
              <div 
                key={idx} 
                className="glass-panel option-btn"
                style={{ 
                  width: option.letter.length > 40 ? '100%' : option.letter.length > 20 ? '300px' : option.letter.length > 10 ? '200px' : '150px', 
                  minHeight: '150px', 
                  padding: '10px',
                  fontSize: option.letter.length > 40 ? '1.5rem' : option.letter.length > 20 ? '2rem' : option.letter.length > 10 ? '3rem' : '6rem', 
                  textAlign: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', cursor: 'pointer' 
                }}
                onClick={() => handleOptionClick(option)}
              >
                {option.letter}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
