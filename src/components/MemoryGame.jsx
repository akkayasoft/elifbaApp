import { useState, useCallback, useEffect } from 'react';
import { Play as PlayIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getLettersByLesson } from '../data/elifba';
import { playAudio } from '../utils/audio';

export default function MemoryGame({ lessonId, setScore }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchesFound, setMatchesFound] = useState(0);

  const startNewRound = useCallback(() => {
    const allLetters = getLettersByLesson(lessonId);
    
    // Choose 4 random unique items
    const shuffledLetters = [...allLetters].sort(() => Math.random() - 0.5);
    const selectedLetters = shuffledLetters.slice(0, Math.min(4, shuffledLetters.length));
    
    // Create 2 cards per item (Arabic and Turkish)
    const newCards = [];
    selectedLetters.forEach((item, index) => {
      newCards.push({
        id: `arabic_${index}_${item.id}`,
        itemRef: item,
        type: 'arabic',
        content: item.letter,
        isFlipped: false,
        isMatched: false
      });
      newCards.push({
        id: `turkish_${index}_${item.id}`,
        itemRef: item,
        type: 'turkish',
        content: item.name,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    newCards.sort(() => Math.random() - 0.5);
    
    setCards(newCards);
    setFlippedIndices([]);
    setMatchesFound(0);
    setIsProcessing(false);
  }, [lessonId]);

  const handleStartGame = () => {
    setHasStarted(true);
    startNewRound();
  };

  const handleCardClick = (index) => {
    if (isProcessing) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    // Play sound for the item
    playAudio(cards[index].itemRef.letter, cards[index].itemRef.name);

    const newFlippedIndices = [...flippedIndices, index];
    
    // Flip the card
    setCards(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isFlipped: true };
      return updated;
    });

    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setIsProcessing(true);
      const [firstIndex, secondIndex] = newFlippedIndices;
      
      const isMatch = cards[firstIndex].itemRef.id === cards[secondIndex].itemRef.id;

      if (isMatch) {
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIndex] = { ...updated[firstIndex], isMatched: true };
            updated[secondIndex] = { ...updated[secondIndex], isMatched: true };
            return updated;
          });
          
          setFlippedIndices([]);
          setMatchesFound(m => m + 1);
          setScore(s => s + 1);
          setIsProcessing(false);
          
          // Check win condition
          if (matchesFound + 1 === cards.length / 2) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => {
              startNewRound();
            }, 2000);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIndex] = { ...updated[firstIndex], isFlipped: false };
            updated[secondIndex] = { ...updated[secondIndex], isFlipped: false };
            return updated;
          });
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="play-content animate-bounce-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' }}>
      {!hasStarted ? (
        <div className="start-overlay text-center" style={{ marginTop: '50px' }}>
          <h2 style={{ color: 'white', fontSize: '3rem', marginBottom: '30px' }}>Kartları Eşleştirelim!</h2>
          <button 
            className="btn glass-panel" 
            style={{ fontSize: '2.5rem', padding: '20px 40px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '15px' }}
            onClick={handleStartGame}
          >
            <PlayIcon size={40} /> Başla!
          </button>
        </div>
      ) : (
        <div className="options-container" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '600px' }}>
          {cards.map((card, idx) => (
            <div 
              key={card.id} 
              className={`memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
              style={{ 
                width: card.content.length > 40 ? '100%' : card.content.length > 20 ? '300px' : card.content.length > 10 ? '200px' : '130px', 
                minHeight: '130px' 
              }}
              onClick={() => handleCardClick(idx)}
            >
              <div className="memory-card-inner">
                <div className="memory-card-front">
                  ❓
                </div>
                <div className="memory-card-back" style={{ 
                  fontSize: card.type === 'arabic' ? (card.content.length > 40 ? '1.2rem' : card.content.length > 20 ? '1.8rem' : card.content.length > 10 ? '2.5rem' : '4rem') : '1.2rem', 
                  fontWeight: card.type === 'turkish' ? 'bold' : 'normal',
                  padding: '10px',
                  textAlign: 'center',
                  lineHeight: '1.4'
                }}>
                  {card.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
