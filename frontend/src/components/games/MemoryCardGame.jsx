import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, RotateCcw, Trophy, Clock, Star, Play, Pause } from "lucide-react";
import { Button, Box, Typography, Paper, Chip, Card, CardContent } from "@mui/material";
import { QuickSaveButtons } from './QuickSaveButtons';
import { GameWithRating } from "./GameWithRating";

// Card symbols/emojis
const CARD_SYMBOLS = [
  "🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎬", "🎸", "🎺", "🎻", "🎹", "🎤"
];

// Difficulty levels
const DIFFICULTIES = {
  easy: { pairs: 6, time: 60, name: "Easy" },
  medium: { pairs: 8, time: 90, name: "Medium" },
  hard: { pairs: 12, time: 120, name: "Hard" },
};

export function MemoryCardGame() {
  const location = useLocation();
  const { gameId, gameName } = location.state || {};
  
  const [difficulty, setDifficulty] = useState(null);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStatus, setGameStatus] = useState("menu"); // menu, playing, won, lost, paused
  const [score, setScore] = useState(0);

  // Initialize game
  const startGame = (level) => {
    const { pairs, time } = DIFFICULTIES[level];
    const selectedSymbols = CARD_SYMBOLS.slice(0, pairs);
    const gameCards = [...selectedSymbols, ...selectedSymbols]
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setDifficulty(level);
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimeLeft(time);
    setGameStatus("playing");
    setScore(0);
  };

  // Timer
  useEffect(() => {
    if (gameStatus === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStatus === "playing") {
      setGameStatus("lost");
    }
  }, [timeLeft, gameStatus]);

  // Handle card click
  const handleCardClick = (cardId) => {
    if (
      gameStatus !== "playing" ||
      flippedCards.length === 2 ||
      flippedCards.includes(cardId) ||
      matchedCards.includes(cardId)
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find((card) => card.id === firstCardId);
      const secondCard = cards.find((card) => card.id === secondCardId);

      if (firstCard.symbol === secondCard.symbol) {
        // Match found
        const newMatchedCards = [...matchedCards, firstCard.id, secondCard.id];
        setMatchedCards(newMatchedCards);
        setFlippedCards([]);

        // Calculate score
        const timeBonus = Math.floor(timeLeft / 10);
        const moveBonus = Math.max(0, 50 - moves);
        setScore(score + 100 + timeBonus + moveBonus);

        // Check if won
        if (newMatchedCards.length === cards.length) {
          setGameStatus("won");
        }
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleReset = () => {
    setGameStatus("menu");
    setDifficulty(null);
  };

  // Save/Load Logic
  const gameState = {
    difficulty,
    cards,
    flippedCards,
    matchedCards,
    moves,
    timeLeft,
    gameStatus: gameStatus === "lost" || gameStatus === "won" ? "menu" : gameStatus, // Avoid saving lost/won states as is
    score
  };

  const handleLoad = (loadedState) => {
    setDifficulty(loadedState.difficulty);
    setCards(loadedState.cards);
    setFlippedCards(loadedState.flippedCards || []);
    setMatchedCards(loadedState.matchedCards || []);
    setMoves(loadedState.moves);
    setTimeLeft(loadedState.timeLeft);
    setScore(loadedState.score);
    // When loading, allow state to be 'playing' or 'paused'. Default to 'playing' but maybe pause for UX?
    setGameStatus("playing"); 
  };

  // Toggle Pause
  const togglePause = () => {
    if (gameStatus === "playing") setGameStatus("paused");
    else if (gameStatus === "paused") setGameStatus("playing");
  };

  const gridCols =
    difficulty === "easy"
      ? "grid-cols-4"
      : difficulty === "medium"
      ? "grid-cols-4"
      : "grid-cols-6";

  return (
    <GameWithRating gameName="Memory Card" gameId={gameId}>
      <Box className="h-full flex flex-col">
        {/* Header */}
        <Box className="flex items-center justify-between mb-4">
            <Button
                onClick={() => window.location.href = '/games'}
                variant="outlined"
                size="small"
                startIcon={<ArrowLeft className="w-4 h-4" />}
            >
                Back to Games
            </Button>

            <Typography variant="h4" className="font-bold">
                Memory Card
            </Typography>

            <Box className="flex gap-2">
                {gameStatus !== 'menu' && (
                    <QuickSaveButtons
                        gameName="MemoryCard"
                        gameState={gameState}
                        onLoad={handleLoad}
                    />
                )}
                <Button
                    onClick={handleReset}
                    variant="outlined"
                    size="small"
                    startIcon={<RotateCcw className="w-4 h-4" />}
                >
                    {gameStatus === 'menu' ? 'Reset' : 'Menu'}
                </Button>
            </Box>
        </Box>

        {/* Content */}
        <Box className="flex-1 flex flex-col items-center justify-center overflow-auto p-2">
            
            {/* MENU STATE */}
            {gameStatus === "menu" && (
                <Card className="w-full max-w-2xl bg-card">
                    <CardContent className="p-8 text-center">
                        <Box className="flex justify-center mb-6">
                            <Box className="p-4 bg-primary/10 rounded-full">
                                <Star className="w-12 h-12 text-primary" />
                            </Box>
                        </Box>
                        <Typography variant="h4" className="font-bold mb-2">Memory Challenge</Typography>
                        <Typography variant="body1" className="text-muted-foreground mb-8">
                            Match all pairs before time runs out!
                        </Typography>

                        <Box className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {Object.entries(DIFFICULTIES).map(([key, { pairs, time, name }]) => (
                                <Button
                                    key={key}
                                    onClick={() => startGame(key)}
                                    variant="outlined"
                                    className="h-auto p-6 flex flex-col gap-2 hover:bg-accent border-2"
                                >
                                    <Typography variant="h6" className="font-bold">{name}</Typography>
                                    <Typography variant="caption" className="text-muted-foreground">
                                        {pairs} pairs • {time}s
                                    </Typography>
                                </Button>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* PLAYING STATE */}
            {gameStatus !== "menu" && (
                <>
                    {/* Stats Bar */}
                    <Paper className="w-full max-w-4xl p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Box className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <Typography variant="h6">{timeLeft}s</Typography>
                        </Box>
                        <Box className="flex items-center gap-2">
                            <Typography className="text-muted-foreground">Moves:</Typography>
                            <Typography variant="h6">{moves}</Typography>
                        </Box>
                        <Box className="flex items-center gap-2">
                            <Typography className="text-muted-foreground">Score:</Typography>
                            <Typography variant="h6">{score}</Typography>
                        </Box>
                        <Box className="flex justify-end">
                             <Button 
                                size="small" 
                                onClick={togglePause}
                                startIcon={gameStatus === 'paused' ? <Play className="w-4 h-4"/> : <Pause className="w-4 h-4"/>}
                             >
                                {gameStatus === 'paused' ? 'Resume' : 'Pause'}
                             </Button>
                        </Box>
                    </Paper>

                    {/* Game Grid */}
                    <Paper className={`p-4 ${gameStatus === 'paused' ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className={`grid ${gridCols} gap-3`}>
                            {cards.map((card) => {
                                const isFlipped = flippedCards.includes(card.id) || matchedCards.includes(card.id);
                                const isMatched = matchedCards.includes(card.id);

                                return (
                                    <button
                                        key={card.id}
                                        onClick={() => handleCardClick(card.id)}
                                        disabled={isMatched || gameStatus === 'paused'}
                                        className={`
                                            aspect-square w-16 sm:w-20 md:w-24 rounded-xl transition-all duration-300 transform perspective-1000
                                            ${isFlipped ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"}
                                            ${isMatched ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95"}
                                            border-2 ${isFlipped ? "border-primary" : "border-border"}
                                            flex items-center justify-center text-3xl sm:text-4xl shadow-md
                                        `}
                                        style={{
                                            transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
                                            transformStyle: "preserve-3d",
                                        }}
                                    >
                                        <span style={{ backfaceVisibility: 'hidden' }}>
                                             {isFlipped ? card.symbol : "❓"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </Paper>

                    {/* Check for Win/Loss Overlay */}
                    {(gameStatus === "won" || gameStatus === "lost") && (
                        <Box className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                            <Card className="w-full max-w-md animate-in zoom-in duration-300">
                                <CardContent className="p-8 text-center">
                                    <Box className="mb-4 text-6xl">
                                        {gameStatus === "won" ? "🎉" : "😢"}
                                    </Box>
                                    <Typography variant="h4" className="font-bold mb-2">
                                        {gameStatus === "won" ? "You Won!" : "Time's Up!"}
                                    </Typography>
                                    <Typography className="text-muted-foreground mb-6">
                                        {gameStatus === "won"
                                            ? `Congratulations! You completed ${DIFFICULTIES[difficulty].name} difficulty in ${moves} moves.`
                                            : "Better luck next time!"}
                                    </Typography>
                                    
                                    {gameStatus === "won" && (
                                        <Box className="bg-muted p-4 rounded-lg mb-6">
                                            <Typography variant="caption" className="text-muted-foreground uppercase tracking-wider">Final Score</Typography>
                                            <Typography variant="h3" className="font-bold text-primary">{score}</Typography>
                                        </Box>
                                    )}

                                    <Box className="flex gap-3">
                                        <Button onClick={() => startGame(difficulty)} variant="contained" fullWidth>
                                            Play Again
                                        </Button>
                                        <Button onClick={handleReset} variant="outlined" fullWidth>
                                            Menu
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    )}
                </>
            )}
        </Box>
      </Box>
    </GameWithRating>
  );
}
