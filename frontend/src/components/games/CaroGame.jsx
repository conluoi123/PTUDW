import { useState, useEffect, useCallback, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress
} from '@mui/material';
import { 
  RotateCcw, 
  User, 
  Bot, 
  Trophy,
  ArrowLeft
} from 'lucide-react';
import { CaroAI, AI_DIFFICULTY } from '../../utils/caroAI';
import { GameWithRating } from './GameWithRating';
import { QuickSaveButtons } from '../../common';
import { AuthContext } from '../../contexts/AuthContext';
import { handleGameEnd } from '../../services/game_end.services.js';


export function CaroGame({ winCondition = 5 }) {
  const BOARD_SIZE = 15;
  // Map to games table IDs from test.json: 5-in-a-row => 1, 4-in-a-row => 2
  const derivedGameId = winCondition === 4 ? 2 : 1;
  
  // Game state
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [gameMode, setGameMode] = useState(null); // null, 'pvp', 'ai'
  const [aiDifficulty, setAiDifficulty] = useState(AI_DIFFICULTY.MEDIUM);
  const [ai, setAi] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const { user } = useContext(AuthContext);

  // Calculate mock score based on game result and duration
  const calculateScore = (result, durationInSeconds, moveCount) => {
    let baseScore = 0;
    const speedBonus = Math.max(0, 500 - durationInSeconds * 5); // Bonus for quick games
    const difficultyMultiplier = gameMode === 'ai' ? 1.5 : 1.0; // AI games worth more
    
    // Base score varies by result
    if (result === 'win') {
      baseScore = 800;
    } else if (result === 'lose') {
      baseScore = 300;
    } else if (result === 'draw') {
      baseScore = 500;
    }

    // Apply difficulty multiplier (AI games give more points)
    const totalScore = Math.round((baseScore + speedBonus) * difficultyMultiplier);
    return Math.max(50, totalScore); // Minimum score of 50
  };

  // Handle saving the game session when a game ends
  const persistGameEnd = async (gameWinner) => {
    // Only save if a user is logged in and the game has started
    if (!user || !startTime) return;

    const endTime = new Date();
    const durationInSeconds = Math.round((endTime - startTime) / 1000);
    
    // Count moves played
    const moveCount = board.flat().filter(cell => cell !== null).length;

    // Calculate mock score based on result and gameplay
    let result = 'draw';
    if (gameWinner && gameWinner !== 'draw') {
      // Assuming the user is always 'X' for simplicity
      result = gameWinner === 'X' ? 'win' : 'lose';
    }

    const score = calculateScore(result, durationInSeconds, moveCount);

    const saved = await handleGameEnd({
      user,
      gameId: derivedGameId,
      score,
      result,
      duration: durationInSeconds,
    });

    if (saved?.success && saved.data?.achievements_unlocked) {
      console.log("New achievements unlocked:", saved.data.achievements_unlocked);
    }
  };
  
  // This effect runs when the winner state changes
  useEffect(() => {
    if (winner) {
      persistGameEnd(winner);
    }
  }, [winner]);


  // Initialize AI
  useEffect(() => {
    if (gameMode === 'ai') {
      setAi(new CaroAI(BOARD_SIZE, winCondition, aiDifficulty));
    }
  }, [gameMode, aiDifficulty, winCondition]);

  // AI move
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'O' && !winner && ai) {
      setIsAiThinking(true);
      
      const timer = setTimeout(() => {
        const move = ai.getBestMove(board, 'O');
        if (move) {
          handleCellClick(move.row, move.col);
        }
        setIsAiThinking(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameMode, winner, ai, board]);

  const handleCellClick = useCallback((row, col) => {
    if (board[row][col] || winner || isAiThinking) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    const winLine = checkWinner(newBoard, row, col, currentPlayer);
    if (winLine) {
      setWinner(currentPlayer);
      setWinningLine(winLine);
    } else {
      const isBoardFull = newBoard.every(row => row.every(cell => cell !== null));
      if (isBoardFull) {
        setWinner('draw');
      } else {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      }
    }
  }, [board, currentPlayer, winner, isAiThinking, winCondition]);

  const checkWinner = (board, row, col, player) => {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (const [dx, dy] of directions) {
      const line = [];
      let count = 1;

      let r = row + dx, c = col + dy;
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        line.push([r, c]);
        count++;
        r += dx;
        c += dy;
      }

      r = row - dx;
      c = col - dy;
      while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
        line.unshift([r, c]);
        count++;
        r -= dx;
        c -= dy;
      }

      if (count >= winCondition) {
        return [[row, col], ...line];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine([]);
    setStartTime(new Date()); // Reset start time for the new game
  };

  const startNewGame = (mode) => {
    setGameMode(mode);
    resetGame();
  };

  // Game state for save/load
  const gameState = {
    board,
    currentPlayer,
    winner,
    winningLine,
    gameMode,
    aiDifficulty
  };

  const handleLoad = (loadedState) => {
    setBoard(loadedState.board);
    setCurrentPlayer(loadedState.currentPlayer);
    setWinner(loadedState.winner || null);
    setWinningLine(loadedState.winningLine || []);
    setGameMode(loadedState.gameMode);
    setAiDifficulty(loadedState.aiDifficulty || AI_DIFFICULTY.MEDIUM);
    setStartTime(new Date()); // Assume loaded game starts now
  };

  // Game mode selection
  if (!gameMode) {
    return (
      <Box className="max-w-2xl mx-auto">
        <Paper className="p-8">
          <Box className="text-center mb-8">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
            <Typography variant="h4" className="font-bold mb-2">
              Caro Game
            </Typography>
            <Typography variant="body1" className="text-muted-foreground">
              First to {winCondition} wins!
            </Typography>
          </Box>

          <Box className="space-y-4">
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<User className="w-5 h-5" />}
              onClick={() => startNewGame('pvp')}
            >
              Player vs Player
            </Button>

            <Button
              fullWidth
              variant="contained"
              size="large"
              color="secondary"
              startIcon={<Bot className="w-5 h-5" />}
              onClick={() => startNewGame('ai')}
            >
              Player vs AI ({aiDifficulty})
            </Button>

            <Paper className="p-4 bg-accent">
              <Typography variant="subtitle2" className="mb-3 font-semibold">
                AI Difficulty
              </Typography>
              <ToggleButtonGroup
                value={aiDifficulty}
                exclusive
                onChange={(e, value) => value && setAiDifficulty(value)}
                fullWidth
                size="small"
              >
                <ToggleButton value={AI_DIFFICULTY.EASY}>Easy</ToggleButton>
                <ToggleButton value={AI_DIFFICULTY.MEDIUM}>Medium</ToggleButton>
                <ToggleButton value={AI_DIFFICULTY.HARD}>Hard</ToggleButton>
                <ToggleButton value={AI_DIFFICULTY.EXPERT}>Expert</ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Box>
        </Paper>
      </Box>
    );
  }

  // Game board
  return (
    <GameWithRating gameName={`Caro (${winCondition} in a row)`}>
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
          
          <Typography variant="h5" className="font-bold">
            Caro ({winCondition} in a row)
          </Typography>

          <Box className="flex gap-2">
            <QuickSaveButtons
              gameName={`Caro${winCondition}`}
              gameState={gameState}
              onLoad={handleLoad}
            />
            <Button
              onClick={resetGame}
              variant="outlined"
              size="small"
              startIcon={<RotateCcw className="w-4 h-4" />}
            >
              Reset
            </Button>
          </Box>
        </Box>

        {/* Game info */}
        <Paper className="p-4 mb-4">
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-4">
              <Chip
                icon={<User className="w-4 h-4" />}
                label="Player X"
                color={currentPlayer === 'X' && !winner ? 'primary' : 'default'}
                className="font-semibold"
              />
              <Typography variant="body2" className="text-muted-foreground">vs</Typography>
              <Chip
                icon={gameMode === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                label={gameMode === 'ai' ? `AI (${aiDifficulty})` : 'Player O'}
                color={currentPlayer === 'O' && !winner ? 'secondary' : 'default'}
                className="font-semibold"
              />
            </Box>

            {!winner && (
              <Typography variant="body1" className="font-semibold">
                {isAiThinking ? 'AI is thinking...' : `${currentPlayer}'s turn`}
              </Typography>
            )}
          </Box>

          {isAiThinking && <LinearProgress className="mt-2" />}
        </Paper>

        {/* Board - Centered and Full Height */}
        <Box className="flex-1 flex justify-center items-center overflow-auto">
          <Paper className="p-4">
            <Box
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                gap: '2px',
                width: 'min(600px, 90vw)',
                height: 'min(600px, 70vh)',
                aspectRatio: '1/1'
              }}
            >
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isWinningCell = winningLine.some(
                    ([r, c]) => r === rowIndex && c === colIndex
                  );

                  return (
                    <Button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      disabled={!!cell || !!winner || isAiThinking}
                      variant={cell ? 'contained' : 'outlined'}
                      color={
                        isWinningCell ? 'success' :
                        cell === 'X' ? 'primary' : 
                        cell === 'O' ? 'secondary' : 
                        'inherit'
                      }
                      className={`
                        aspect-square font-bold
                        ${isWinningCell ? 'animate-pulse' : ''}
                        ${!cell && !winner && !isAiThinking ? 'hover:bg-accent' : ''}
                      `}
                      sx={{ 
                        minWidth: 0,
                        minHeight: 0,
                        padding: 0,
                        fontSize: 'clamp(0.75rem, 2vw, 1.25rem)'
                      }}
                    >
                      {cell}
                    </Button>
                  );
                })
              )}
            </Box>
          </Paper>
        </Box>

        {/* Winner Dialog */}
        <Dialog open={!!winner} onClose={() => {}}>
          <DialogTitle className="text-center">
            <Trophy className="w-16 h-16 mx-auto mb-2 text-yellow-500" />
            <Typography variant="h5" className="font-bold">
              {winner === 'draw' ? 'It\'s a Draw!' : (winner === 'X' ? 'Player X' : (gameMode === 'ai' ? 'AI' : 'Player O')) + ' Wins!'}
            </Typography>
          </DialogTitle>
          
          <DialogContent className="text-center">
            <Typography variant="body1" className="text-muted-foreground">
              {winner === 'draw' ? 'The board is full.' : `Congratulations! ${winner} got ${winCondition} in a row!`}
            </Typography>
          </DialogContent>

          <DialogActions className="p-4">
            <Button onClick={() => setGameMode(null)} variant="outlined" fullWidth>
              Main Menu
            </Button>
            <Button onClick={resetGame} variant="contained" fullWidth>
              Play Again
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </GameWithRating>
  );
}
