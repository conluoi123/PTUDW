import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, RotateCcw, Circle, X, User, Cpu, Clock, Trophy, Play, Menu, Skull, Frown, Grid3x3, Save, FolderOpen, Pause } from "lucide-react";
import { Button, Box, Typography, Paper, Card, CardContent } from "@mui/material";
import { QuickSaveButtons } from './QuickSaveButtons';
import { GameWithRating } from "./GameWithRating";

const BOARD_SIZE = 12;
const WIN_STREAK = 4;
const SAVE_KEY = "caro4_save_state";

const DIFFICULTIES = {
  easy: { 
    name: "EASY", 
    description: "Relax & Play",
    color: "text-emerald-600 dark:text-emerald-400", 
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-100 dark:border-emerald-800/50",
    hover: "hover:border-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
    icon: Play,
    time: 180 
  },
  medium: { 
    name: "MEDIUM", 
    description: "Challenge Yourself",
    color: "text-amber-600 dark:text-amber-400", 
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-100 dark:border-amber-800/50",
    hover: "hover:border-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40",
    icon: Cpu,
    time: 300 
  },
  hard: { 
    name: "HARD", 
    description: "Master Mind",
    color: "text-rose-600 dark:text-rose-400", 
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-100 dark:border-rose-800/50",
    hover: "hover:border-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40",
    icon: Trophy,
    time: 600 
  },
};

const calculateWinner = (squares) => {
  const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
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
        if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && squares[idx] === player) {
          streak++;
          line.push(idx);
        } else break;
      }
      if (streak === WIN_STREAK) return { winner: player, line };
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
        for (let k = 1; k < 4; k++) {
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
      if (streak >= 3) score += 10000;
      else if (streak === 2 && openEnds > 0) score += 1000;
      else if (streak === 1 && openEnds === 2) score += 100;
      else if (streak === 0 && openEnds === 2) score += 10;
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
    let totalScore = attackScore + (difficulty === 'hard' ? defenseScore * 0.95 : defenseScore * 0.6);
    totalScore += Math.random() * 5;
    if (totalScore > bestScore) {
      bestScore = totalScore;
      move = idx;
    }
  }
  return move;
};

export function Caro4() {
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
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (gameStatus === 'playing') {
          setGameStatus('paused');
        } else if (gameStatus === 'paused') {
          setGameStatus('playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus]);

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
    gameStatus: gameStatus === "won" || gameStatus === "lost" || gameStatus === "draw" ? "menu" : (gameStatus === "paused" ? "playing" : gameStatus),
    difficulty,
    board,
    xIsNext,
    lastMove,
    winningLine,
    winner: null,
    timeLeft
  };

  const handleSaveGame = () => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
      alert("Game saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleLoadGame = () => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const loadedState = JSON.parse(saved);
        setDifficulty(loadedState.difficulty);
        setBoard(loadedState.board);
        setXIsNext(loadedState.xIsNext);
        setLastMove(loadedState.lastMove);
        setWinningLine(loadedState.winningLine || []);
        setWinner(loadedState.winner);
        setTimeLeft(loadedState.timeLeft);
        setGameStatus("playing");
      } else {
        alert("No saved game found.");
      }
    } catch (error) {
      console.error("Load failed:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const btnStyle = "flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg active:scale-95 active:translate-y-0 active:shadow-sm bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer shadow-sm";

  const boardCellStyle = "aspect-square w-full rounded-lg flex items-center justify-center text-2xl transition-all duration-200 shadow-sm border border-slate-200 dark:border-slate-700";

  return (
    <GameWithRating gameName="Caro 4" gameId={gameId}>
      <Box className="h-full flex flex-col font-sans selection:bg-blue-100 bg-slate-50 dark:bg-slate-950">
        
        <Box className="w-full px-6 py-4 flex items-center justify-between sticky top-0 z-10 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-100 dark:border-slate-800">
          <button onClick={() => window.location.href = '/games'} className={btnStyle}>
            <ArrowLeft className="w-4 h-4 stroke-[3px]" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <Box className="flex flex-col items-center">
            <Typography className="text-5xl md:text-6xl font-black uppercase tracking-widest flex items-center gap-4">
              <Grid3x3 className="w-10 h-10 md:w-12 md:h-12 text-blue-600 dark:text-blue-500" />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                CARO 4
              </span>
            </Typography>
          </Box>

          <Box className="flex gap-3">
            {gameStatus !== 'menu' && (
              <>
                <button onClick={handleSaveGame} className={btnStyle}>
                  <Save className="w-4 h-4 stroke-[3px]" />
                  <span className="hidden lg:inline">Save</span>
                </button>
                <button onClick={handleLoadGame} className={btnStyle}>
                  <FolderOpen className="w-4 h-4 stroke-[3px]" />
                  <span className="hidden lg:inline">Load</span>
                </button>
              </>
            )}
            <button onClick={handleReset} className={btnStyle}>
              {gameStatus === 'menu' ? <RotateCcw className="w-4 h-4 stroke-[3px]" /> : <Menu className="w-4 h-4 stroke-[3px]" />}
              <span className="hidden sm:inline">{gameStatus === 'menu' ? 'Reset' : 'Menu'}</span>
            </button>
          </Box>
        </Box>

        <Box className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto relative">
          
          {gameStatus === "menu" && (
            <div className="w-full max-w-5xl animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white mb-4 tracking-tighter">
                  Ready to Play?
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                  Connect <span className="text-blue-600 dark:text-blue-400 font-bold">4 pieces</span> to win. Select your challenge level below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                {Object.entries(DIFFICULTIES).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <div 
                      key={key}
                      onClick={() => startGame(key)}
                      className={`
                        group cursor-pointer relative overflow-hidden
                        bg-white dark:bg-slate-900 rounded-[2rem] p-8
                        border-2 ${config.border} ${config.hover}
                        transition-all duration-300 ease-out
                        hover:-translate-y-2 hover:shadow-xl
                        active:scale-95 active:translate-y-0
                        flex flex-col items-center text-center
                      `}
                    >
                      <div className={`p-5 rounded-2xl ${config.bg} ${config.color} mb-6 transition-transform group-hover:scale-110 duration-300`}>
                        <Icon className="w-10 h-10 stroke-[2px]" />
                      </div>
                      
                      <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-wide">
                        {config.name}
                      </h3>
                      <p className="text-slate-400 dark:text-slate-500 font-medium mb-8">
                        {config.description}
                      </p>

                      <div className="mt-auto w-full pt-6 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-sm">
                          <Clock className="w-4 h-4" />
                          {Math.floor(config.time / 60)} mins
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(gameStatus === "playing" || gameStatus === "paused" || gameStatus === "won" || gameStatus === "lost" || gameStatus === "draw") && (
            <div className="w-full max-w-2xl flex flex-col items-center gap-6 animate-in fade-in duration-500 py-4">
              
              <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-colors ${xIsNext ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-transparent'}`}>
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase">You</span>
                    <span className={`font-black ${xIsNext ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>Player X</span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className={`px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${timeLeft < 30 ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 animate-pulse' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(timeLeft)}
                  </div>
                </div>

                <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl transition-colors ${!xIsNext ? 'bg-red-50 dark:bg-red-900/20' : 'bg-transparent'}`}>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase">AI</span>
                    <span className={`font-black ${!xIsNext ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>Player O</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 w-full overflow-hidden relative">
                
                {gameStatus === 'paused' && (
                  <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-sm animate-in fade-in">
                     <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl border-2 border-slate-100 dark:border-slate-700 flex flex-col items-center">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
                           <Pause className="w-8 h-8 text-blue-600 dark:text-blue-400 stroke-[3px]" />
                        </div>
                        <Typography variant="h5" className="font-black text-slate-800 dark:text-white mb-2">GAME PAUSED</Typography>
                        <Typography className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">Press Enter to Resume</Typography>
                     </div>
                  </div>
                )}

                <div 
                  className="grid gap-1 p-2 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800"
                  style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
                >
                  {board.map((cell, idx) => {
                    const isWinning = winningLine.includes(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleCellClick(idx)}
                        className={`
                          ${boardCellStyle}
                          ${!cell ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer' : 'bg-white dark:bg-slate-900 cursor-default'}
                          ${isWinning ? (cell === 'X' ? 'ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/30 z-10' : 'ring-2 ring-red-400 bg-red-50 dark:bg-red-900/30 z-10') : ''}
                        `}
                      >
                        {cell === 'X' && <X className={`w-3/5 h-3/5 text-blue-500 dark:text-blue-400 stroke-[3px] ${isWinning ? 'animate-bounce' : 'animate-in zoom-in'}`} />}
                        {cell === 'O' && <Circle className={`w-3/5 h-3/5 text-red-500 dark:text-red-400 stroke-[3px] ${isWinning ? 'animate-bounce' : 'animate-in zoom-in'}`} />}
                        {!cell && <div className="w-1 h-1 rounded-full bg-slate-100 dark:bg-slate-800" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center w-full">
                <Typography className="text-slate-400 dark:text-slate-500 text-sm font-bold tracking-wide flex items-center gap-2">
                  Press <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">Enter</span> to Pause
                </Typography>
              </div>

              {(gameStatus === "won" || gameStatus === "lost" || gameStatus === "draw") && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                  <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-slate-100 dark:border-slate-800">
                    
                    <div className={`w-full h-32 flex items-end justify-center pb-4 ${gameStatus === 'won' ? 'bg-blue-50 dark:bg-blue-900/20' : gameStatus === 'lost' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
                      <div className="transform translate-y-8">
                        {gameStatus === 'won' ? (
                          <div className="p-6 bg-white dark:bg-slate-900 rounded-full shadow-lg ring-4 ring-blue-50 dark:ring-blue-900/30 animate-bounce">
                            <Trophy className="w-12 h-12 text-blue-500 dark:text-blue-400 fill-blue-500 dark:fill-blue-400" />
                          </div>
                        ) : gameStatus === 'lost' ? (
                          <div className="p-6 bg-white dark:bg-slate-900 rounded-full shadow-lg ring-4 ring-red-50 dark:ring-red-900/30">
                            <Skull className="w-12 h-12 text-red-500 dark:text-red-400" />
                          </div>
                        ) : (
                          <div className="p-6 bg-white dark:bg-slate-900 rounded-full shadow-lg ring-4 ring-slate-50 dark:ring-slate-800">
                            <Frown className="w-12 h-12 text-slate-500 dark:text-slate-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-8 pt-12 pb-8 text-center">
                      <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3 mt-10">
                        {gameStatus === 'won' ? "VICTORY!" : gameStatus === 'lost' ? "DEFEATED" : "DRAW"}
                      </h2>
                      
                      <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
                        {gameStatus === 'won' && "Awesome! You outsmarted the AI."}
                        {gameStatus === 'lost' && (timeLeft === 0 ? "Time's up! Think faster next time." : "The AI got the better of you.")}
                        {gameStatus === 'draw' && "It's a tie! Well played both sides."}
                      </p>

                      <div className="flex flex-col gap-4">
                        <button 
                          onClick={() => startGame(difficulty)}
                          className="w-full py-4 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold text-lg hover:bg-slate-800 dark:hover:bg-blue-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                        >
                          Play Again
                        </button>
                        <button 
                          onClick={handleReset}
                          className="w-full py-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-lg hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-800 dark:hover:text-white transition-all duration-200 active:scale-95"
                        >
                          Back to Menu
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </Box>
      </Box>
    </GameWithRating>
  );
}