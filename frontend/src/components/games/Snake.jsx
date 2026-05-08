import { useState, useEffect, useCallback, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, RotateCcw, Trophy, Play, Menu, Skull, Grid3x3, Save, FolderOpen, Pause, Clock } from "lucide-react";
import { Button, Box, Typography, Paper } from "@mui/material";
import { GameWithRating } from "./GameWithRating";
import { AuthContext } from '../../contexts/AuthContext';
import { handleGameEnd } from '../../services/game_end.services.js';

const BOARD_SIZE = 20;
const SAVE_KEY = "snake_save_state";

// Score calculation function
const calculateScore = (result, durationInSeconds, foodEaten, difficulty) => {
  let baseScore = 0;
  const speedBonus = Math.max(0, 500 - durationInSeconds * 5); // Bonus for quick games
  const foodBonus = foodEaten * 100; // Points for each food eaten
  
  // Difficulty multiplier
  const difficultyMultipliers = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0
  };
  const difficultyMultiplier = difficultyMultipliers[difficulty] || 1.0;
  
  // Base score varies by result
  if (result === 'win') {
    baseScore = 800;
  } else if (result === 'lose') {
    baseScore = 0; // Set score to 0 when user loses
  } else if (result === 'timeout') {
    baseScore = 300; // Partial credit for timeout
  }

  // Apply difficulty multiplier (harder games give more points)
  const totalScore = Math.round((baseScore + speedBonus + foodBonus) * difficultyMultiplier);
  return Math.max(0, totalScore); // Minimum score of 0
};

const DIFFICULTIES = {
  easy: { 
    name: "EASY", 
    description: "Relax & Play",
    color: "text-emerald-600 dark:text-emerald-400", 
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-100 dark:border-emerald-800/50",
    hover: "hover:border-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40",
    icon: Play,
    time: 120,
    speed: 150 // milliseconds per move
  },
  medium: { 
    name: "MEDIUM", 
    description: "Challenge Yourself",
    color: "text-amber-600 dark:text-amber-400", 
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-100 dark:border-amber-800/50",
    hover: "hover:border-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40",
    icon: Trophy,
    time: 180,
    speed: 100 // milliseconds per move
  },
  hard: { 
    name: "HARD", 
    description: "Master Mind",
    color: "text-rose-600 dark:text-rose-400", 
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-100 dark:border-rose-800/50",
    hover: "hover:border-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40",
    icon: Skull,
    time: 240,
    speed: 70 // milliseconds per move
  },
};

// Generate random food position
const generateFood = (snakePositions) => {
  let newFood;
  let isValid = false;
  while (!isValid) {
    newFood = Math.floor(Math.random() * (BOARD_SIZE * BOARD_SIZE));
    isValid = !snakePositions.includes(newFood);
  }
  return newFood;
};

export function Snake() {
  const location = useLocation();
  const { gameId } = location.state || {};
  const { user } = useContext(AuthContext);

  const [gameStatus, setGameStatus] = useState("menu");
  const [difficulty, setDifficulty] = useState(null);
  const [snake, setSnake] = useState([210, 209, 208]); // Start in middle
  const [food, setFood] = useState(null);
  const [direction, setDirection] = useState(1); // 1=right, -1=left, BOARD_SIZE=down, -BOARD_SIZE=up
  const [nextDirection, setNextDirection] = useState(1);
  const [foodEaten, setFoodEaten] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [gameOverReason, setGameOverReason] = useState(null);

  // 1. Initialize the ref to control input speed
  const canChangeDir = useRef(true);

  // Initialize food on game start
  useEffect(() => {
    if (gameStatus === "playing" && food === null) {
      setFood(generateFood(snake));
    }
  }, [gameStatus]);

  // Handle saving the game session when a game ends
  const persistGameEnd = async (reason) => {
    if (!user || !startTime) return;

    const endTime = new Date();
    const durationInSeconds = Math.round((endTime - startTime) / 1000);

    // Backend only allows: win/lose/draw
    const result = reason === 'food_target' ? 'win' : 'lose';

    // Keep Snake's custom scoring by passing an override
    const score = calculateScore(reason, durationInSeconds, foodEaten, difficulty);

    await handleGameEnd({
      user,
      gameId: gameId || 4, // Snake ID from games table
      score,
      result,
      duration: durationInSeconds,
    });
  };

  useEffect(() => {
    if (gameOverReason) {
      persistGameEnd(gameOverReason);
    }
  }, [gameOverReason]);

  const startGame = (level) => {
    setDifficulty(level);
    setSnake([210, 209, 208]);
    setDirection(1);
    setNextDirection(1);
    setFoodEaten(0);
    setTimeLeft(DIFFICULTIES[level].time);
    setStartTime(new Date());
    setFood(null);
    setGameOverReason(null);
    setGameStatus("playing");
    canChangeDir.current = true; // Reset lock
  };

  // Timer countdown
  useEffect(() => {
    if (gameStatus === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStatus === "playing") {
      setGameStatus("lost");
      setGameOverReason("timeout");
    }
  }, [timeLeft, gameStatus]);

  // Keyboard Controls with Lock - only process one direction at a time
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent browser scrolling
      if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      if (gameStatus === "playing") {
        // 2. Check the lock before processing input
        if (!canChangeDir.current) return;

        let newDir = null;
        const currentDir = nextDirection;
        const isMovingHorizontally = currentDir === 1 || currentDir === -1;
        const isMovingVertically = currentDir === BOARD_SIZE || currentDir === -BOARD_SIZE;

        // Only allow perpendicular direction changes (no diagonal movement)
        switch (e.key) {
          case 'ArrowUp':
            // Only allow up if currently moving horizontally and not already moving up
            if (isMovingHorizontally && currentDir !== -BOARD_SIZE) {
              newDir = -BOARD_SIZE;
            }
            break;
          case 'ArrowDown':
            // Only allow down if currently moving horizontally and not already moving down
            if (isMovingHorizontally && currentDir !== BOARD_SIZE) {
              newDir = BOARD_SIZE;
            }
            break;
          case 'ArrowLeft':
            // Only allow left if currently moving vertically and not already moving left
            if (isMovingVertically && currentDir !== -1) {
              newDir = -1;
            }
            break;
          case 'ArrowRight':
            // Only allow right if currently moving vertically and not already moving right
            if (isMovingVertically && currentDir !== 1) {
              newDir = 1;
            }
            break;
          case 'Enter':
            setGameStatus("paused");
            break;
          default:
            break;
        }

        // If a valid move was made, update direction and LOCK input
        if (newDir !== null) {
            setNextDirection(newDir);
            canChangeDir.current = false;
        }

      } else if (gameStatus === "paused" && e.key === 'Enter') {
        setGameStatus("playing");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, nextDirection]); // Dependency on nextDirection is important
  // Snake movement
  useEffect(() => {
    if (gameStatus !== "playing") return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        setDirection(nextDirection);
        
        const head = prevSnake[0];
        const x = head % BOARD_SIZE;
        const y = Math.floor(head / BOARD_SIZE);
        
        let newHeadX = x + nextDirection % BOARD_SIZE;
        let newHeadY = y + Math.floor(nextDirection / BOARD_SIZE);
        
        const newHead = newHeadY * BOARD_SIZE + newHeadX;
        
        // Check collision with walls
        if (newHeadX < 0 || newHeadX >= BOARD_SIZE || newHeadY < 0 || newHeadY >= BOARD_SIZE) {
          setGameStatus("lost");
          setGameOverReason("collision");
          return prevSnake;
        }
        
        // Check self collision
        if (prevSnake.includes(newHead)) {
          setGameStatus("lost");
          setGameOverReason("self_collision");
          return prevSnake;
        }
        
        let newSnake = [newHead, ...prevSnake];
        
        // Check food collision
        if (newHead === food) {
          setFoodEaten((prev) => {
            const newCount = prev + 1;
            if (newCount >= 5) {
              setGameStatus("won");
              setGameOverReason("food_target");
            }
            return newCount;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); 
        }

        // 3. Unlock input AFTER the move has been processed
        canChangeDir.current = true;
        
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, DIFFICULTIES[difficulty]?.speed || 100);
    return () => clearInterval(interval);
  }, [gameStatus, nextDirection, food, difficulty, foodEaten]);

  const handleReset = () => {
    setGameStatus("menu");
    setDifficulty(null);
    setSnake([210, 209, 208]);
    setFood(null);
    setTimeLeft(0);
    setStartTime(null);
    setFoodEaten(0);
    setGameOverReason(null);
    canChangeDir.current = true; // Reset lock
  };

  const gameState = {
    gameStatus: gameStatus === "won" || gameStatus === "lost" ? "menu" : (gameStatus === "paused" ? "playing" : gameStatus),
    difficulty,
    snake,
    food,
    direction,
    foodEaten,
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
        setSnake(loadedState.snake);
        setFood(loadedState.food);
        setDirection(loadedState.direction);
        setNextDirection(loadedState.direction);
        setFoodEaten(loadedState.foodEaten);
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

  const boardCellStyle = "w-full aspect-square rounded-sm transition-all duration-100 border border-slate-200 dark:border-slate-700";

  return (
    <GameWithRating gameName="Snake" gameId={gameId}>
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
                SNAKE
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
                  Eat <span className="text-blue-600 dark:text-blue-400 font-bold">5 pieces of food</span> to win. Select your challenge level below.
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

          {(gameStatus === "playing" || gameStatus === "paused" || gameStatus === "won" || gameStatus === "lost") && (
            <div className="w-full max-w-2xl flex flex-col items-center gap-6 animate-in fade-in duration-500 py-4">
              
              <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">FOOD</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{foodEaten}/5</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className={`px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${timeLeft < 30 ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 animate-pulse' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(timeLeft)}
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">LENGTH</span>
                  <span className="text-2xl font-black text-slate-600 dark:text-slate-300">{snake.length}</span>
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
                  className="grid gap-0 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 mx-auto"
                  style={{ 
                    gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                    width: 'min(100%, 400px)',
                    aspectRatio: '1/1'
                  }}
                >
                  {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, idx) => {
                    const isSnakeHead = snake[0] === idx;
                    const isSnakeBody = snake.includes(idx);
                    const isFood = food === idx;
                    
                    return (
                      <div
                        key={idx}
                        className={`
                          ${boardCellStyle}
                          ${isSnakeHead ? 'bg-blue-600 dark:bg-blue-500 shadow-lg' : 
                            isSnakeBody ? 'bg-blue-400 dark:bg-blue-400' : 
                            isFood ? 'bg-red-500 dark:bg-red-400' : 
                            'bg-white dark:bg-slate-900'}
                        `}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center w-full">
                <Typography className="text-slate-400 dark:text-slate-500 text-sm font-bold tracking-wide flex items-center gap-2">
                  Use <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">Arrow Keys</span> to Move • Press <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">Enter</span> to Pause
                </Typography>
              </div>

              {(gameStatus === "won" || gameStatus === "lost") && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                  <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-slate-100 dark:border-slate-800">
                    
                    <div className={`w-full h-32 flex items-end justify-center pb-4 ${gameStatus === 'won' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <div className="transform translate-y-8">
                        {gameStatus === 'won' ? (
                          <div className="p-6 bg-white dark:bg-slate-900 rounded-full shadow-lg ring-4 ring-blue-50 dark:ring-blue-900/30 animate-bounce">
                            <Trophy className="w-12 h-12 text-blue-500 dark:text-blue-400 fill-blue-500 dark:fill-blue-400" />
                          </div>
                        ) : (
                          <div className="p-6 bg-white dark:bg-slate-900 rounded-full shadow-lg ring-4 ring-red-50 dark:ring-red-900/30">
                            <Skull className="w-12 h-12 text-red-500 dark:text-red-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-8 pt-12 pb-8 text-center">
                      <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3 mt-10">
                        {gameStatus === 'won' ? "VICTORY!" : "GAME OVER"}
                      </h2>
                      
                      <p className="text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed">
                        {gameStatus === 'won' && "Amazing! You collected all the food!"}
                        {gameStatus === 'lost' && (
                          gameOverReason === 'timeout' 
                            ? "Time's up! Try again with a faster strategy."
                            : gameOverReason === 'self_collision'
                            ? "Oops! You hit yourself!"
                            : "Oops! You hit the wall!"
                        )}
                      </p>

                      <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Final Score</div>
                        <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                          {Math.round((gameStatus === 'won' ? 800 : gameOverReason === 'timeout' ? 300 : 0) * (gameStatus === 'won' ? ({ easy: 1.0, medium: 1.5, hard: 2.0 }[difficulty] || 1.0) : 1) + foodEaten * 100 * (gameStatus === 'won' ? ({ easy: 1.0, medium: 1.5, hard: 2.0 }[difficulty] || 1.0) : 1))}
                        </div>
                      </div>

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