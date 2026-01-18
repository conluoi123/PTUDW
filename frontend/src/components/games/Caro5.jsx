import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, RotateCcw, Circle, X, User, Cpu, Clock } from "lucide-react";
import { Button, Box, Typography, Paper, Card, CardContent } from "@mui/material";
import { QuickSaveButtons } from './QuickSaveButtons';
import { GameWithRating } from "./GameWithRating";

const BOARD_SIZE = 15;
const WIN_STREAK = 5;

const DIFFICULTIES = {
  easy: { name: "Easy", color: "text-green-500", time: 180 },
  medium: { name: "Medium", color: "text-yellow-500", time: 300 },
  hard: { name: "Hard", color: "text-red-500", time: 600 },
};

const calculateWinner = (squares) => {
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];

  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) continue;

    const x = i % BOARD_SIZE;
    const y = Math.floor(i / BOARD_SIZE);
    const player = squares[i];

    for (let [dx, dy] of directions) {
      let streak = 0;
      let line = [];
      
      for (let k = 0; k < WIN_STREAK; k++) {
        const nx = x + k * dx;
        const ny = y + k * dy;
        const idx = ny * BOARD_SIZE + nx;

        if (
          nx >= 0 && nx < BOARD_SIZE &&
          ny >= 0 && ny < BOARD_SIZE &&
          squares[idx] === player
        ) {
          streak++;
          line.push(idx);
        } else {
          break;
        }
      }

      if (streak === WIN_STREAK) {
        return { winner: player, line };
      }
    }
  }
  
  if (!squares.includes(null)) return { winner: 'draw', line: [] };
  return null;
};

const getBestMove = (squares, difficulty) => {
  const availableMoves = squares.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
  
  if (difficulty === 'easy') {
    const meaningfulMoves = availableMoves.filter(idx => {
      const neighbors = [-1, 1, -BOARD_SIZE, BOARD_SIZE, -BOARD_SIZE-1, -BOARD_SIZE+1, BOARD_SIZE-1, BOARD_SIZE+1];
      return neighbors.some(n => squares[idx + n] !== undefined && squares[idx + n] !== null);
    });
    const pool = meaningfulMoves.length > 0 ? meaningfulMoves : availableMoves;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const scoreMove = (idx, player) => {
    let score = 0;
    const directions = [[1,0], [0,1], [1,1], [1,-1]];
    const x = idx % BOARD_SIZE;
    const y = Math.floor(idx / BOARD_SIZE);

    for (let [dx, dy] of directions) {
      let streak = 0;
      let openEnds = 0;
      
      for (let dir of [1, -1]) {
        for (let k = 1; k < 5; k++) {
          const nx = x + k * dx * dir;
          const ny = y + k * dy * dir;
          const nIdx = ny * BOARD_SIZE + nx;
          
          if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE) {
            if (squares[nIdx] === player) streak++;
            else if (squares[nIdx] === null) { openEnds++; break; }
            else break;
          } else break;
        }
      }
      
      if (streak >= 4) score += 10000;
      else if (streak === 3 && openEnds > 0) score += 1000;
      else if (streak === 2 && openEnds === 2) score += 100;
      else if (streak === 1 && openEnds === 2) score += 10;
    }
    return score;
  };

  let bestScore = -Infinity;
  let move = availableMoves[0];

  const candidateMoves = availableMoves.filter(idx => {
    const neighbors = [-1, 1, -BOARD_SIZE, BOARD_SIZE, -BOARD_SIZE-1, -BOARD_SIZE+1, BOARD_SIZE-1, BOARD_SIZE+1];
    return neighbors.some(n => squares[idx + n] !== undefined && squares[idx + n] !== null);
  });
  
  const searchPool = candidateMoves.length > 0 ? candidateMoves : [Math.floor(squares.length / 2)];

  for (let idx of searchPool) {
    let attackScore = scoreMove(idx, 'O');
    let defenseScore = scoreMove(idx, 'X');
    
    let totalScore = attackScore + (difficulty === 'hard' ? defenseScore * 0.9 : defenseScore * 0.5);
    totalScore += Math.random() * 5;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      move = idx;
    }
  }

  return move;
};

export function Caro5() {
  const location = useLocation();
  const { gameId } = location.state || {};

  const [gameStatus, setGameStatus] = useState("menu");
  const [difficulty, setDifficulty] = useState(null);
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winningLine, setWinningLine] = useState([]);
  const [winner, setWinner] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const startGame = (level) => {
    setDifficulty(level);
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setXIsNext(true);
    setWinningLine([]);
    setWinner(null);
    setLastMove(null);
    setTimeLeft(DIFFICULTIES[level].time);
    setGameStatus("playing");
  };

  useEffect(() => {
    if (gameStatus === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStatus === "playing") {
      setGameStatus("lost");
      setWinner("O");
    }
  }, [timeLeft, gameStatus]);

  const handleCellClick = useCallback((index) => {
    if (gameStatus !== "playing" || board[index] || !xIsNext || winner) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setLastMove(index);
    setXIsNext(false);

    const result = calculateWinner(newBoard);
    if (result) {
      if (result.winner === 'draw') setGameStatus("draw");
      else {
        setWinner('X');
        setWinningLine(result.line);
        setGameStatus("won");
      }
    }
  }, [board, gameStatus, xIsNext, winner]);

  useEffect(() => {
    if (gameStatus === "playing" && !xIsNext && !winner && timeLeft > 0) {
      const timer = setTimeout(() => {
        const move = getBestMove(board, difficulty);
        if (move !== undefined) {
          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);
          setLastMove(move);
          setXIsNext(true);

          const result = calculateWinner(newBoard);
          if (result) {
             if (result.winner === 'draw') setGameStatus("draw");
             else {
               setWinner('O');
               setWinningLine(result.line);
               setGameStatus("lost");
             }
          }
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, gameStatus, winner, board, difficulty, timeLeft]);

  const handleReset = () => {
    setGameStatus("menu");
    setDifficulty(null);
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setTimeLeft(0);
  };

  const gameState = {
    gameStatus: gameStatus === "won" || gameStatus === "lost" || gameStatus === "draw" ? "menu" : gameStatus,
    difficulty,
    board,
    xIsNext,
    lastMove,
    winningLine,
    winner: null,
    timeLeft
  };

  const handleLoad = (loadedState) => {
    setDifficulty(loadedState.difficulty);
    setBoard(loadedState.board);
    setXIsNext(loadedState.xIsNext);
    setLastMove(loadedState.lastMove);
    setWinningLine(loadedState.winningLine || []);
    setWinner(loadedState.winner);
    setTimeLeft(loadedState.timeLeft);
    setGameStatus("playing");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <GameWithRating gameName="Gomoku (Caro)" gameId={gameId}>
      <Box className="h-full flex flex-col">
        <Box className="flex items-center justify-between mb-4">
          <Button
            onClick={() => window.location.href = '/games'}
            variant="outlined"
            size="small"
            startIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Games
          </Button>

          <Typography variant="h4" className="font-bold hidden md:block">
            Gomoku (Caro)
          </Typography>

          <Box className="flex gap-2">
            {gameStatus !== 'menu' && (
              <QuickSaveButtons
                gameName="Gomoku"
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

        <Box className="flex-1 flex flex-col items-center justify-center overflow-hidden p-2 bg-slate-50 rounded-xl">
          
          {gameStatus === "menu" && (
            <Card className="w-full max-w-2xl bg-card shadow-lg">
              <CardContent className="p-8 text-center">
                <Box className="flex justify-center mb-6">
                  <Box className="p-4 bg-primary/10 rounded-full flex gap-2">
                    <X className="w-12 h-12 text-blue-500" />
                    <Circle className="w-12 h-12 text-red-500" />
                  </Box>
                </Box>
                <Typography variant="h4" className="font-bold mb-2">Gomoku Challenge</Typography>
                <Typography variant="body1" className="text-muted-foreground mb-8">
                  Get 5 in a row to win against the AI!
                </Typography>

                <Box className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.entries(DIFFICULTIES).map(([key, { name, color, time }]) => (
                    <Button
                      key={key}
                      onClick={() => startGame(key)}
                      variant="outlined"
                      className="h-auto p-6 flex flex-col gap-2 hover:bg-accent border-2 transition-all hover:scale-105"
                    >
                      <Typography variant="h6" className={`font-bold ${color}`}>{name}</Typography>
                      <Typography variant="caption" className="text-muted-foreground">
                        {key === 'hard' ? 'Advanced AI' : key === 'medium' ? 'Smart Defense' : 'Casual Play'}
                      </Typography>
                      <Box className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3" />
                        {Math.floor(time / 60)} mins
                      </Box>
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {gameStatus !== "menu" && (
            <Box className="flex flex-col items-center w-full h-full">
              <Paper className="w-full max-w-2xl p-3 mb-4 flex justify-between items-center shadow-md rounded-full px-6">
                <Box className="flex items-center gap-4">
                   <Box className="flex items-center gap-2">
                      <User className={`w-5 h-5 ${xIsNext ? 'text-blue-600 font-bold' : 'text-gray-400'}`} />
                      <Typography className={`hidden sm:block ${xIsNext ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                        You
                      </Typography>
                   </Box>
                   <Box className={`flex items-center gap-1 px-3 py-1 rounded-full ${timeLeft < 30 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100'}`}>
                      <Clock className="w-4 h-4" />
                      <Typography className="font-mono font-bold">
                        {formatTime(timeLeft)}
                      </Typography>
                   </Box>
                </Box>
                
                <Box className="bg-slate-200 px-4 py-1 rounded-full font-mono text-sm font-bold">
                  {winner ? (winner === 'X' ? 'VICTORY' : 'DEFEAT') : (gameStatus === 'draw' ? 'DRAW' : (xIsNext ? "YOUR TURN" : "AI THINKING..."))}
                </Box>

                <Box className="flex items-center gap-2">
                   <Typography className={`hidden sm:block ${!xIsNext ? 'font-bold text-red-600' : 'text-gray-500'}`}>
                    AI
                  </Typography>
                  <Cpu className={`w-5 h-5 ${!xIsNext ? 'text-red-600' : 'text-gray-400'}`} />
                </Box>
              </Paper>

              <Box className="overflow-auto max-w-full max-h-[70vh] p-2 border-4 border-slate-300 rounded-lg bg-white shadow-inner">
                <div 
                  className="grid gap-[1px] bg-slate-200"
                  style={{ 
                    gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(20px, 35px))`,
                  }}
                >
                  {board.map((cell, idx) => {
                    const isWinningCell = winningLine.includes(idx);
                    const isLastMove = lastMove === idx;
                    
                    return (
                      <div
                        key={idx}
                        onClick={() => handleCellClick(idx)}
                        className={`
                          aspect-square flex items-center justify-center cursor-pointer text-lg sm:text-xl font-bold transition-colors
                          ${cell === null ? 'bg-white hover:bg-slate-50' : 'bg-white'}
                          ${isWinningCell ? (cell === 'X' ? 'bg-blue-200' : 'bg-red-200') : ''}
                        `}
                      >
                        {cell === 'X' && (
                          <X className={`w-3/4 h-3/4 ${isLastMove ? 'text-blue-600' : 'text-blue-400'} ${isWinningCell ? 'animate-bounce' : ''}`} />
                        )}
                        {cell === 'O' && (
                          <Circle className={`w-3/4 h-3/4 ${isLastMove ? 'text-red-600' : 'text-red-400'} ${isWinningCell ? 'animate-bounce' : ''}`} />
                        )}
                        {!cell && (
                           <div className="w-1 h-1 bg-slate-200 rounded-full" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </Box>

              {(gameStatus === "won" || gameStatus === "lost" || gameStatus === "draw") && (
                <Box className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in">
                  <Card className="w-full max-w-sm m-4 shadow-2xl">
                    <CardContent className="p-8 text-center">
                      <Box className="mb-4 text-6xl animate-bounce">
                        {gameStatus === 'won' ? "🏆" : gameStatus === 'lost' ? "☠️" : "🤝"}
                      </Box>
                      <Typography variant="h4" className="font-bold mb-2">
                        {gameStatus === 'won' ? "You Won!" : gameStatus === 'lost' ? "You Lost!" : "Draw!"}
                      </Typography>
                      <Typography className="text-muted-foreground mb-6">
                        {gameStatus === 'won'
                          ? `Great job beating the ${DIFFICULTIES[difficulty].name} AI!` 
                          : timeLeft === 0 ? "Time's up!" : "Don't give up, try again!"}
                      </Typography>

                      <Box className="flex flex-col gap-3">
                        <Button onClick={() => startGame(difficulty)} variant="contained" fullWidth size="large">
                          Play Again
                        </Button>
                        <Button onClick={handleReset} variant="outlined" fullWidth>
                          Back to Menu
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </GameWithRating>
  );
}