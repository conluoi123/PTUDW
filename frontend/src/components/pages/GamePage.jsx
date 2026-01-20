import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useLocation } from 'react-router-dom';
import {
  Save,
  FolderOpen,
  Play,
  CornerUpLeft,
  Gamepad2,
  Trophy,
  HelpCircle,
  MousePointer2,
  MessageSquare,
  Star,
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Palette,
} from "lucide-react";
import { ratingService } from "../../services/gamePage.services";
import { GameService } from "../../services/game.services";
import { AuthContext } from "../../contexts/AuthContext";
import { handleGameEnd } from "../../services/game_end.services.js";

const DEFAULT_BOARD_SIZE = 15;

// --- Scoring (modeled after Caro4.jsx) ---
// Note: GamePage currently doesn't have difficulty levels, so we keep it simple + game-specific multipliers.
const calculateScore = (result, durationInSeconds, moveCount, logicKey) => {
  const safeDuration = Math.max(0, Number(durationInSeconds) || 0);
  const safeMoves = Math.max(0, Number(moveCount) || 0);

  // Base score by result
  let baseScore = 0;
  if (result === "win") baseScore = 800;
  else if (result === "draw") baseScore = 500;
  else if (result === "lose") baseScore = 0;

  // Faster completion -> higher bonus (cap at 0)
  const speedBonus = Math.max(0, 500 - safeDuration * 5);

  // Small reward for "meaningful" play; keeps snake/match3 from being only time-based.
  const moveBonus = Math.min(300, safeMoves * 3);

  // Game-specific balancing
  const gameMultipliers = {
    caro5: 1.2,
    caro4: 1.1,
    tictactoe: 1.0,
    memory: 1.0,
    snake: 1.0,
    match3: 1.0,
    draw: 0.0,
  };
  const mult = gameMultipliers[logicKey] ?? 1.0;

  return Math.max(0, Math.round((baseScore + speedBonus + moveBonus) * mult));
};

const COLORS = {
  bg: "#0f172a",
  cell: "#334155",
  accent: "#3b82f6",
  playerX: "#3b82f6",
  playerO: "#ef4444",
  snake: "#22c55e",
  food: "#ef4444",
};

const DRAW_COLORS = [
  "#ffffff", 
  "#ef4444", 
  "#3b82f6", 
  "#22c55e", 
  "#eab308", 
  "#a855f7", 
  "#f97316", 
  "#ec4899", 
];

const MEMORY_ICONS = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
  "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐙", "🐵",
  "🐔", "🐧", "🐦", "🦆", "🦅", "🦉", "🦇", "🐺",
  "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞",
  "🐜", "🦟", "🦗", "🕷", "🦂", "🐢", "🐍", "🦎",
  "🦖", "🦕", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍",
  "🦧", "🦣", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒",
  "🦘", "🦬", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏",
  "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🦮", "🐕‍🦺",
  "🐈", "🐈‍⬛", "🐓", "🦃", "🦚", "🦜", "🦢", "🦩",
  "🕊", "🐇", "🦝", "🦨", "🦡", "🦦", "🦥", "🐁",
  "🐀", "🐿", "🦔", "🐉", "🐲", "🌵", "🎄", "🌲",
  "🌳", "🌴", "🌱", "🌿", "☘️", "🍀", "🎍", "🎋",
  "🍃", "🍂", "🍁", "🍄", "🌾", "💐", "🌷", "🌹",
  "🥀", "🌺", "🌸", "🌼", "🌻", "🌞", "🌝", "🌛", 
  "🌜", "🌚", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒"
];

const FALLBACK_GAMES = [
  { id: "caro5", name: "Caro 5", description: "5 in a row", config: { board_size: "15*15" }, status: "active", instruction: "Win by getting 5 in a row." },
];


const GAME_DB_IDS = {
  "caro5": 1,
  "caro4": 2,
  "tictactoe": 3,
  "snake": 4,
  "match3": 5,
  "memory": 6,
  "draw": 7,
};

const ICONS = {
  caro5: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  caro4: [
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ],
  tictactoe: [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
  ],
  snake: [
    [0, 0, 1, 1, 0],
    [0, 1, 0, 0, 1],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ],
  match3: [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
  ],
  memory: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  draw: [
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
  ],
};



const generateIconGrid = (gameId, boardSize) => {
  const grid = Array(boardSize * boardSize).fill(null);
  const icon = ICONS[gameId];
  if (!icon) return grid;
  const iconH = icon.length;
  const iconW = icon[0].length;
  const startRow = Math.floor((boardSize - iconH) / 2);
  const startCol = Math.floor((boardSize - iconW) / 2);
  for (let r = 0; r < iconH; r++) {
    for (let c = 0; c < iconW; c++) {
      if (icon[r][c]) {
        const idx = (startRow + r) * boardSize + (startCol + c);
        if (idx >= 0 && idx < grid.length) grid[idx] = "ICON";
      }
    }
  }
  return grid;
};

const checkWin = (board, size, streak) => {
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) continue;
    const x = i % size;
    const y = Math.floor(i / size);
    for (let [dx, dy] of directions) {
      let count = 0;
      for (let k = 0; k < streak; k++) {
        const nx = x + dx * k;
        const ny = y + dy * k;
        if (
          nx >= 0 &&
          nx < size &&
          ny >= 0 &&
          ny < size &&
          board[ny * size + nx] === board[i]
        )
          count++;
        else break;
      }
      if (count === streak) return board[i];
    }
  }
  return null;
};

const findBestMove = (board, size, streak, playerTag, opponentTag) => {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = playerTag;
      if (checkWin(board, size, streak)) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = opponentTag;
      if (checkWin(board, size, streak)) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  const empties = board
    .map((v, i) => (v === null ? i : null))
    .filter((v) => v !== null);
  return empties.length > 0
    ? empties[Math.floor(Math.random() * empties.length)]
    : null;
};

const checkMatch3Matches = (board, boardSize) => {
  let matches = new Set();
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize - 2; c++) {
      const idx = r * boardSize + c;
      const v = board[idx];
      if (v && v === board[idx + 1] && v === board[idx + 2]) {
        matches.add(idx);
        matches.add(idx + 1);
        matches.add(idx + 2);
      }
    }
  }
  for (let c = 0; c < boardSize; c++) {
    for (let r = 0; r < boardSize - 2; r++) {
      const idx = r * boardSize + c;
      const v = board[idx];
      if (
        v &&
        v === board[(r + 1) * boardSize + c] &&
        v === board[(r + 2) * boardSize + c]
      ) {
        matches.add(idx);
        matches.add((r + 1) * boardSize + c);
        matches.add((r + 2) * boardSize + c);
      }
    }
  }
  return matches;
};

const resolveMatch3Board = (board, boardSize) => {
  let currentBoard = [...board];
  let totalScore = 0;
  let hasMatches = true;
  let iterations = 0;
  while (hasMatches && iterations < 5) {
    const matches = checkMatch3Matches(currentBoard, boardSize);
    if (matches.size === 0) hasMatches = false;
    else {
      totalScore += matches.size * 10;
      matches.forEach((idx) => {
        currentBoard[idx] = null;
      });
      for (let c = 0; c < boardSize; c++) {
        let writePtr = boardSize - 1;
        for (let r = boardSize - 1; r >= 0; r--) {
          const idx = r * boardSize + c;
          if (currentBoard[idx] !== null) {
            currentBoard[writePtr * boardSize + c] = currentBoard[idx];
            if (writePtr !== r) currentBoard[idx] = null;
            writePtr--;
          }
        }
        for (let r = writePtr; r >= 0; r--)
          currentBoard[r * boardSize + c] = Math.floor(Math.random() * 5) + 1;
      }
      iterations++;
    }
  }
  return { board: currentBoard, scoreDelta: totalScore };
};

export const GamesPage = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState("MENU");
  const [games, setGames] = useState([]);
  const [gameIdx, setGameIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Toast State
  const [toast, setToast] = useState(null); // { message, type }

  // Instruction Modal State
  const [showInstruction, setShowInstruction] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await GameService.getAllGames(1, 100);
        if (response && response.data) {
           // We need to ensure the games have the correct 'logic key' for our frontend ICONS/Rules.
           // Since we don't have a 'code' field in the DB schema shown earlier, we might have to map by ID or Name.
           // Schema: id, name, description, instruction, thumbnail, status, create_at, config
           // Hardcoded mapping for now to link DB ID to UI Logic:
           const LOGIC_MAP = {
             1: "caro5",
             2: "caro4",
             3: "tictactoe",
             4: "snake", 
             5: "match3",
             6: "memory",
             7: "draw"
           };
           
           const mappedGames = response.data.map(g => ({
             ...g,
             logicKey: LOGIC_MAP[g.id] || "unknown" 
           }));
           setGames(mappedGames);
        } else {
           setGames(FALLBACK_GAMES.map(g => ({...g, logicKey: g.id})));
        }
      } catch (error) {
        console.error("Failed to fetch games", error);
        setGames(FALLBACK_GAMES.map(g => ({...g, logicKey: g.id})));
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    if (games.length > 0 && location.state?.gameId) {
      const targetIndex = games.findIndex(g => g.id === location.state.gameId);
      if (targetIndex !== -1) {
        setGameIdx(targetIndex);
      }
    }
  }, [location.state, games]);

  // Toast Helper
  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const currentGame = games[gameIdx];
  // Safe access to derived props
  const logicKey = currentGame?.logicKey || "caro5"; 
  const configBoardSize = currentGame?.config?.board_size;
  const parsedSize = configBoardSize ? parseInt(configBoardSize.split('*')[0]) : DEFAULT_BOARD_SIZE;
  const currentBoardSize = isNaN(parsedSize) ? DEFAULT_BOARD_SIZE : parsedSize;

  const [board, setBoard] = useState(Array(DEFAULT_BOARD_SIZE * DEFAULT_BOARD_SIZE).fill(null));
  const [cursor, setCursor] = useState(112);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [winner, setWinner] = useState(null);
  const [hintCell, setHintCell] = useState(null);
  const [finalScore, setFinalScore] = useState(null); // computed when a game ends (win/draw/lose)
  const endHandledRef = useRef(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [endResult, setEndResult] = useState(null); // 'win' | 'lose' | 'draw'
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const exitAfterEndRef = useRef(false);

  const [snake, setSnake] = useState([[7, 7]]);
  const [food, setFood] = useState(null);
  const [direction, setDirection] = useState("RIGHT");

  const [memoryRevealed, setMemoryRevealed] = useState([]);
  const [memoryMatched, setMemoryMatched] = useState([]);

  const [match3Selected, setMatch3Selected] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [drawColor, setDrawColor] = useState("#ffffff");
  const dragAction = useRef(null);

  const [showRating, setShowRating] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentRating, setCurrentRating] = useState(5);
  const [commentText, setCommentText] = useState("");

  // Save/Load States
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [savedGames, setSavedGames] = useState([]);
  const [loadPage, setLoadPage] = useState(1);
  const LOAD_LIMIT = 2;

  const gameLoopRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (mode === "MENU" && logicKey) {
      setBoard(generateIconGrid(logicKey, currentBoardSize));
      setWinner(null);
    }
  }, [mode, gameIdx, logicKey, currentBoardSize]);

  useEffect(() => {
    if (showRating || mode === "PLAYING") {
      const backendId = currentGame?.id;

      if (backendId) {
        ratingService
          .getRatingsByGame(backendId)
          .then((data) => setReviews(data))
          .catch((err) => console.error(err));
      }
    }
  }, [gameIdx, showRating, mode]);

  useEffect(() => {
    if (mode === "PLAYING" && !isPaused && !winner && !showRating) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [mode, isPaused, winner, showRating]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      dragAction.current = null;
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const snakeStep = useCallback(() => {
    setSnake((prev) => {
      const head = prev[0];
      let newHead = [...head];
      if (direction === "UP") newHead[1] -= 1;
      if (direction === "DOWN") newHead[1] += 1;
      if (direction === "LEFT") newHead[0] -= 1;
      if (direction === "RIGHT") newHead[0] += 1;

      if (
        newHead[0] < 0 ||
        newHead[0] >= currentBoardSize ||
        newHead[1] < 0 ||
        newHead[1] >= currentBoardSize ||
        prev.some((s) => s[0] === newHead[0] && s[1] === newHead[1])
      ) {
        setWinner("GAME OVER");
        return prev;
      }
      const newSnake = [newHead, ...prev];
      const headIdx = newHead[1] * currentBoardSize + newHead[0];
      if (headIdx === food) {
        setScore((s) => s + 10);
        let newFood;
        do {
          newFood = Math.floor(Math.random() * currentBoardSize * currentBoardSize);
        } while (newSnake.some((s) => s[1] * currentBoardSize + s[0] === newFood));
        setFood(newFood);
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [direction, food, currentBoardSize]);

  useEffect(() => {
    if (
      mode === "PLAYING" &&
      logicKey === "snake" &&
      !isPaused &&
      !winner &&
      !showRating
    ) {
      gameLoopRef.current = setInterval(snakeStep, 150);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [mode, isPaused, winner, snakeStep, gameIdx, showRating]);

  const initGame = (id) => {
    const totalCells = currentBoardSize * currentBoardSize;
    setBoard(Array(totalCells).fill(null));
    setWinner(null);
    setScore(0);
    setTimer(0);
    setIsPaused(false);
    setHintCell(null);
    setCursor(Math.floor(totalCells / 2)); // Dynamic center
    setIsDragging(false);
    dragAction.current = null;
    setStartTime(new Date());
    setFinalScore(null);
    endHandledRef.current = false;
    exitAfterEndRef.current = false;
    setShowEndPopup(false);
    setEndResult(null);
    setUnlockedAchievements([]);
    if (id === "snake") {
      setSnake([
        [7, 5],
        [7, 6],
        [7, 7],
      ]);
      setDirection("UP");
      setFood(40);
    } else if (id === "memory") {
      const pairCount = Math.floor(totalCells / 2);
      let deck = [];
      while (deck.length < pairCount) {
        deck = [...deck, ...MEMORY_ICONS];
      }
      deck = deck.slice(0, pairCount);
      deck = [...deck, ...deck];
      deck.sort(() => Math.random() - 0.5);
      
      const newBoard = Array(totalCells).fill(null);
      let deckIdx = 0;
      for (let i = 0; i < totalCells; i++) {
        if (totalCells % 2 !== 0 && i === Math.floor(totalCells / 2)) {
            newBoard[i] = null;
        } else {
            if (deckIdx < deck.length) {
                newBoard[i] = deck[deckIdx];
                deckIdx++;
            }
        }
      }
      setBoard(newBoard);
      setMemoryRevealed([]);
      setMemoryMatched([]);
    } else if (id === "match3") {
      const newB = Array(totalCells)
        .fill(null)
        .map(() => Math.floor(Math.random() * 5) + 1);
      const resolved = resolveMatch3Board(newB, currentBoardSize);
      setBoard(resolved.board);
      setScore(0);
      setMatch3Selected(null);
    }
  };

  // When a game ends, compute a final score (win/draw/lose) once.
  useEffect(() => {
    if (!winner) return;
    if (finalScore !== null) return;

    const endTime = new Date();
    const durationInSeconds = startTime ? Math.round((endTime - startTime) / 1000) : timer;

    let moveCount = 0;
    if (["caro5", "caro4", "tictactoe"].includes(logicKey)) {
      moveCount = board.filter((c) => c !== null).length;
    } else if (logicKey === "memory") {
      moveCount = memoryMatched.length + memoryRevealed.length;
    } else if (logicKey === "draw") {
      moveCount = board.filter((c) => c !== null).length;
    } else if (logicKey === "snake" || logicKey === "match3") {
      moveCount = score;
    }

    // Determine result
    let result = "draw";
    if (winner === "X" || winner === "WIN") result = "win";
    else if (winner === "O" || winner === "GAME OVER") result = "lose";
    else if (winner === "draw") result = "draw";

    const computed = calculateScore(result, durationInSeconds, moveCount, logicKey);

    // For score-based games, keep the higher of computed score and gameplay score (so snake/match3 feel right).
    const scoreBased = logicKey === "snake" || logicKey === "match3";
    const finalVal = scoreBased ? Math.max(computed, score) : computed;
    setFinalScore(finalVal);
  }, [winner, finalScore, startTime, timer, logicKey, board, score, memoryMatched, memoryRevealed]);

  // Step 2: When the game completes, show a popup with the score, then save a game session via handleGameEnd().
  useEffect(() => {
    if (!winner) return;
    if (finalScore === null) return;
    if (endHandledRef.current) return;

    endHandledRef.current = true;

    const endTime = new Date();
    const durationInSeconds = startTime ? Math.round((endTime - startTime) / 1000) : timer;

    let result = "draw";
    if (winner === "X" || winner === "WIN") result = "win";
    else if (winner === "O" || winner === "GAME OVER") result = "lose";
    else if (winner === "draw") result = "draw";

    setEndResult(result);
    setShowEndPopup(true);

    // Send sessionData (only if logged in)
    (async () => {
      const gameId = currentGame?.id;
      if (!gameId) return;
      const res = await handleGameEnd({
        user,
        gameId,
        score: finalScore,
        result,
        duration: durationInSeconds,
      });
      const unlocked = res?.data?.achievements_unlocked || [];
      setUnlockedAchievements(Array.isArray(unlocked) ? unlocked : []);
    })();
  }, [winner, finalScore, user, currentGame, startTime, timer]);

  const handleControl = (action) => {
    if (showRating) return;

    if (mode === "MENU") {
      if (action === "LEFT")
        setGameIdx((prev) => (prev - 1 + games.length) % games.length);
      if (action === "RIGHT") setGameIdx((prev) => (prev + 1) % games.length);
      if (action === "ENTER") {
        if (currentGame.status !== "active") {
             showToast("Game is disabled");
             return;
        }
        setMode("PLAYING");
        initGame(logicKey);
      }
      return;
    }
    if (mode === "PLAYING") {
      if (winner) {
        if (action === "ENTER") {
          initGame(logicKey);
        }
        if (action === "BACK") {
          setWinner(null);
          setMode("MENU");
        }
        return;
      }
      if (action === "BACK") {
        // For these games, exiting should still calculate score + submit session + show popup.
        if (["memory", "match3", "draw"].includes(logicKey)) {
          exitAfterEndRef.current = true;
          setIsPaused(true);
          setWinner("draw");
          return;
        }
        setWinner(null);
        setMode("MENU");
        return;
      }
      if (action === "HINT") {
        handleHint();
        return;
      }
      handleGameInput(action);
    }
  };

  const handleMouseClick = (index) => {
    if (mode !== "PLAYING" || isPaused || winner || showRating) return;
    if (logicKey === "snake") return;
    setCursor(index);
    handleGameInput("ENTER", index);
  };

  const handleDrawStart = (index) => {
    if (mode !== "PLAYING" || isPaused || winner || showRating) return;
    setIsDragging(true);
    setCursor(index);

    if (logicKey === "draw") {
      dragAction.current = "PAINT";
      const newB = [...board];
      newB[index] = drawColor;
      setBoard(newB);
    } else {
      const action = board[index] ? "REMOVE" : "ADD";
      dragAction.current = action;
      const newB = [...board];
      newB[index] = action === "ADD" ? "X" : null;
      setBoard(newB);
    }
  };

  const handleDrawMove = (index) => {
    if (!isDragging || mode !== "PLAYING" || isPaused || winner || showRating)
      return;
    setCursor(index);
    const newB = [...board];

    if (logicKey === "draw" && dragAction.current === "PAINT") {
      newB[index] = drawColor;
    } else if (dragAction.current === "ADD") newB[index] = "X";
    else if (dragAction.current === "REMOVE") newB[index] = null;

    setBoard(newB);
  };

  const handleSaveGame = async () => {
    if (!saveName.trim()) {
      showToast("Please enter a name");
      return;
    }
    const dataToSave = {
      board,
      score,
      timer,
      winner, // Save if game is over too? usually valid.
      logicKey,
      currentBoardSize
    };

    if (logicKey === "snake") {
        dataToSave.snake = snake;
        dataToSave.food = food;
        dataToSave.direction = direction;
    }
    // For Memory: revealed, matched
    if (logicKey === "memory") {
        dataToSave.memoryRevealed = memoryRevealed;
        dataToSave.memoryMatched = memoryMatched;
    }
    
    // Call Service
    const res = await GameService.saveGame(currentGame.id, saveName, JSON.stringify(dataToSave));
    if (res) {
        showToast("Game saved successfully!");
        setShowSaveDialog(false);
        setSaveName("");
    } else {
        showToast("Failed to save game");
    }
  };

  const openSaveDialog = () => {
      setSaveName(`Save ${new Date().toLocaleString()}`);
      setShowSaveDialog(true);
  };

  const handleLoadGame = async () => {
      const res = await GameService.loadGames();
      if (res && res.data) {
          const relevantGames = res.data.filter(g => g.game_id === currentGame.id);
          setSavedGames(relevantGames);
          setLoadPage(1);
          setShowLoadDialog(true);
      } else {
          showToast("Failed to load games");
      }
  };

  const handleSelectSavedGame = async (gameState) => {
      try {
          // Delete save after selecting (Load Once / Permadeath)
          const delRes = await GameService.deleteSavedGame(gameState.id);
          if (!delRes) {
             showToast("Error: Could not load (delete failed)");
             return;
          }

          let data = gameState.data;
          if (typeof data === 'string') {
              data = JSON.parse(data);
          }

          setBoard(data.board);
          setScore(data.score || 0);
          setTimer(data.timer || 0);
          setWinner(data.winner || null);
          // Align "startTime" so duration uses the restored timer value.
          setStartTime(new Date(Date.now() - (data.timer || 0) * 1000));
          endHandledRef.current = false;
          
          if (data.snake) setSnake(data.snake);
          if (data.food) setFood(data.food);
          if (data.direction) setDirection(data.direction);
          
          if (data.memoryRevealed) setMemoryRevealed(data.memoryRevealed);
          if (data.memoryMatched) setMemoryMatched(data.memoryMatched);

          setShowLoadDialog(false);
          setMode("PLAYING");
          setIsPaused(true); 
          showToast(`Loaded "${gameState.name}"`);
      } catch (err) {
          console.error("Error restoring game:", err);
          showToast("Failed to restore game");
      }
  };

  const totalLoadPages = Math.ceil(savedGames.length / LOAD_LIMIT);
  const currentLoadItems = savedGames.slice((loadPage - 1) * LOAD_LIMIT, loadPage * LOAD_LIMIT);

  const handleGameInput = (action, overrideCursor = null) => {
    const gameId = logicKey;
    const activeCursor = overrideCursor !== null ? overrideCursor : cursor;
    const totalCells = currentBoardSize * currentBoardSize;

    if (gameId === "snake") {
      if (["UP", "DOWN", "LEFT", "RIGHT"].includes(action)) {
        const invalid = {
          UP: "DOWN",
          DOWN: "UP",
          LEFT: "RIGHT",
          RIGHT: "LEFT",
        };
        if (direction !== invalid[action]) setDirection(action);
      }
      return;
    }

    if (["UP", "DOWN", "LEFT", "RIGHT"].includes(action)) {
      let next = cursor;
      if (action === "UP") next -= currentBoardSize;
      if (action === "DOWN") next += currentBoardSize;
      if (action === "LEFT" && cursor % currentBoardSize !== 0) next -= 1;
      if (action === "RIGHT" && (cursor + 1) % currentBoardSize !== 0) next += 1;
      if (next >= 0 && next < totalCells) setCursor(next);
    }

    if (action === "ENTER") {
      if (["caro5", "caro4", "tictactoe"].includes(gameId)) {
        if (board[activeCursor]) return;
        const newB = [...board];
        newB[activeCursor] = "X";
        setBoard(newB);

        let streak = 3;
        if (gameId === "caro5") streak = 5;
        if (gameId === "caro4") streak = 4;

        const w = checkWin(newB, currentBoardSize, streak);
        if (w) {
          setWinner(w);
          return;
        }

        // No winner: if board is full, it's a draw (fixes TicTacToe/Caro not ending).
        const hasEmpty = newB.some((c) => c === null);
        if (!hasEmpty) {
          setWinner("draw");
          return;
        }

        setTimeout(() => aiMove(newB, gameId), 300);
      } else if (gameId === "draw") {
        const newB = [...board];
        newB[activeCursor] = newB[activeCursor] ? null : drawColor;
        setBoard(newB);
      } else if (gameId === "memory") {
        if (
          memoryRevealed.includes(activeCursor) ||
          memoryMatched.includes(activeCursor)
        )
          return;
        const newRev = [...memoryRevealed, activeCursor];
        setMemoryRevealed(newRev);
        if (newRev.length === 2) {
          if (board[newRev[0]] === board[newRev[1]]) {
            setMemoryMatched([...memoryMatched, ...newRev]);
            setScore((s) => s + 10);
            setMemoryRevealed([]);
            const totalPlayable = totalCells - (totalCells % 2);
            if (memoryMatched.length + 2 === totalPlayable) setWinner("WIN");
          } else {
            setTimeout(() => setMemoryRevealed([]), 1000);
          }
        }
      } else if (gameId === "match3") {
        if (match3Selected === null) {
          setMatch3Selected(activeCursor);
        } else {
          const diff = Math.abs(activeCursor - match3Selected);
          if (diff === 1 || diff === currentBoardSize) {
            const newB = [...board];
            const temp = newB[match3Selected];
            newB[match3Selected] = newB[activeCursor];
            newB[activeCursor] = temp;
            const matches = checkMatch3Matches(newB, currentBoardSize);
            if (matches.size > 0) {
              const result = resolveMatch3Board(newB, currentBoardSize);
              setBoard(result.board);
              setScore((s) => s + result.scoreDelta);
            }
          }
          setMatch3Selected(null);
        }
      }
    }
  };

  const aiMove = (currentBoard, gameId) => {
    if (winner) return;

    let move = null;
    let streak = 3;
    if (gameId === "caro5") streak = 5;
    if (gameId === "caro4") streak = 4;

    if (["caro5", "caro4", "tictactoe"].includes(gameId)) {
      // If no moves left, it's a draw.
      if (!currentBoard.some((c) => c === null)) {
        setWinner("draw");
        return;
      }
      move = findBestMove(currentBoard, currentBoardSize, streak, "O", "X");
    }

    if (move !== null) {
      const newB = [...currentBoard];
      newB[move] = "O";
      setBoard(newB);
      const w = checkWin(newB, currentBoardSize, streak);
      if (w) {
        setWinner(w);
        return;
      }
      // No winner after AI move: if board full -> draw.
      if (!newB.some((c) => c === null)) setWinner("draw");
    }
  };

  const handleHint = useCallback(() => {
    const empties = board
      .map((v, i) => (v === null ? i : null))
      .filter((v) => v !== null);

    if (empties.length > 0) {
      setHintCell(empties[Math.floor(Math.random() * empties.length)]);
      setTimeout(() => setHintCell(null), 1000);
    }
  }, [board]);



  const toggleRating = () => {
    if (mode === "PLAYING") setIsPaused(true);
    setShowRating(!showRating);
  };

  const submitReview = async () => {
    if (!commentText.trim()) return;
    try {
      const backendId = currentGame?.id;

      if (!backendId) {
        alert("Lỗi: Không tìm thấy ID game trong database.");
        return;
      }

      await ratingService.submitRating(backendId, {
        point: currentRating,
        comment: commentText,
      });
      setCommentText("");
      const updatedRatings = await ratingService.getRatingsByGame(backendId);
      setReviews(updatedRatings);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to submit rating");
    }
  };

  const renderCell = (i) => {
    const val = board[i];
    const gameId = logicKey;
    let color = "transparent";
    let text = "";
    let glow = false;

    // --- MENU MODE LOGIC ---
    if (mode === "MENU") {
      if (val === "ICON") {
        color = COLORS.accent;
        glow = true;
      }
    } else {
      // --- PLAYING MODE LOGIC ---
      
      const isSnake =
        gameId === "snake" && snake.some((s) => s[1] * currentBoardSize + s[0] === i);
      const isSnakeHead =
        gameId === "snake" &&
        snake.length > 0 &&
        snake[0][1] * currentBoardSize + snake[0][0] === i;
      const isFood = gameId === "snake" && food === i;

      if (gameId === "draw" && val) color = val;

      if (["caro5", "caro4", "tictactoe"].includes(gameId)) {
        if (val === "X") {
          color = COLORS.playerX;
          text = "X";
          glow = true;
        }
        if (val === "O") {
          color = COLORS.playerO;
          text = "O";
          glow = true;
        }
      }

      if (isSnake) color = isSnakeHead ? "#4ade80" : COLORS.snake;
      if (isFood) {
        color = COLORS.food;
        glow = true;
      }

      if (gameId === "match3" && val) {
        const colors = ["#ef4444", "#3b82f6", "#eab308", "#a855f7", "#22c55e"];
        color = colors[val - 1] || "#fff";
        text = ["●", "■", "▲", "◆", "★"][val - 1];
      }

      if (gameId === "memory") {
        if (memoryRevealed.includes(i) || memoryMatched.includes(i)) {
          text = val;
          color = "#cbd5e1";
          glow = true;
        } else if (val) {
          text = "?";
          color = COLORS.cell;
        }
      }
    }

    const isCursor = mode === "PLAYING" && cursor === i && gameId !== "snake";
    const isHint = hintCell === i;
    const isSelected = match3Selected === i;

    const isClickable = mode === "PLAYING" && gameId !== "snake";
    const isGridDot = color === "transparent" && !val;

    const isMatch3Cursor = gameId === "match3" && isCursor;
    
    const cellBackgroundColor = (gameId === "draw" && val)
      ? val
      : isMatch3Cursor
      ? (color === "transparent" ? "rgba(255,255,255,0.1)" : color)
      : isCursor
      ? "#fff"
      : isHint
      ? "#fbbf24"
      : (color === "transparent" ? COLORS.cell : color);

    const cellFilter =
      gameId === "match3" && (isCursor || isSelected)
        ? "brightness(1.5)"
        : "none";

    const textSizeClass = gameId === "memory" ? "text-2xl" : "text-xs";

    return (
      <div
        key={i}
        onMouseDown={
          gameId === "draw" && mode === "PLAYING"
            ? () => handleDrawStart(i)
            : null
        }
        onMouseEnter={
          gameId === "draw" && mode === "PLAYING"
            ? () => handleDrawMove(i)
            : null
        }
        onClick={
          gameId !== "draw" && mode === "PLAYING"
            ? () => handleMouseClick(i)
            : null
        }
        className={`
            relative flex items-center justify-center ${textSizeClass} font-bold transition-all duration-150
            ${
              isGridDot
                ? "rounded-full opacity-10 scale-50"
                : "rounded-md shadow-sm"
            }
            ${
              isClickable ? "cursor-pointer hover:bg-white/10" : "cursor-default"
            } 
        `}
        style={{
          backgroundColor: cellBackgroundColor,
          filter: cellFilter,
          color:
            isCursor && gameId !== "match3"
              ? "#000"
              : gameId === "memory" || gameId === "match3"
              ? isCursor
                ? "#fff"
                : "rgba(0,0,0,0.6)"
              : "#fff",
          width: "100%",
          height: "100%",
          opacity: mode === "MENU" && val !== "ICON" ? 0.1 : 1,
          boxShadow: glow || isSelected ? `0 0 10px ${color}` : "none",
          transform: isCursor
            ? "scale(1.15) translateZ(10px)"
            : isSelected
            ? "scale(0.9)"
            : "scale(1)",
          zIndex: isCursor ? 10 : 1,
          border: isSelected ? "2px solid white" : "none",
        }}
      >
        {(!isGridDot || mode === "MENU") && text}
      </div>
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showRating) return;

      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      )
        e.preventDefault();
      const keyMap = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        Enter: "ENTER",
        " ": "ENTER",
        Escape: "BACK",
        Backspace: "BACK",
        h: "HINT",
        p: "PAUSE",
      };
      if (keyMap[e.key]) {
        if (keyMap[e.key] === "PAUSE") {
          setIsPaused((prev) => !prev);
          return;
        }
        handleControl(keyMap[e.key]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    mode,
    gameIdx,
    cursor,
    board,
    snake,
    direction,
    isPaused,
    winner,
    match3Selected,
    showRating,
  ]);

  if (loading || games.length === 0) {
      return (
        <div className="w-full min-h-screen flex items-center justify-center bg-zinc-900 text-white font-mono">
           LOADING SYSTEM...
        </div>
      );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-zinc-900 p-4 font-sans select-none relative">
      {/* Custom Toast */}
      {toast && (
          <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-[100] flex items-center gap-4 animate-bounce">
              <span className="font-bold">{toast.message}</span>
              <button onClick={() => setToast(null)}><X size={18} /></button>
          </div>
      )}

      {/* Instruction Modal */}
      {showInstruction && (
        <div className="absolute inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-slate-800 border border-slate-600 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
              <button 
                  onClick={() => setShowInstruction(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                  <X size={24} />
              </button>
              
              <div className="text-center mb-6">
                  <h2 className="text-2xl font-black text-blue-500 mb-2 uppercase tracking-widest">{currentGame.name}</h2>
                  <p className="text-slate-400 italic">{currentGame.description}</p>
              </div>
              
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 text-slate-300 text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
                  {currentGame.instruction || "No instructions available."}
              </div>
              
              <div className="mt-6 flex justify-center">
                  <button 
                      onClick={() => setShowInstruction(false)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-full font-bold shadow-lg transition-all active:scale-95"
                  >
                      GOT IT
                  </button>
              </div>
           </div>
        </div>
      )}

      <div className="relative w-full max-w-4xl bg-[#1e293b] rounded-[3rem] p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border-4 border-[#334155] ring-8 ring-[#0f172a]">
        <div className="absolute top-0 left-0 w-full h-full rounded-[2.5rem] bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-50"></div>

        <div className="flex flex-col md:flex-row gap-6 h-full">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between items-center px-4 pt-2">
              <div className="flex items-center gap-2">
                <Gamepad2 className="text-blue-500" />
                <span className="font-black text-slate-400 tracking-widest text-sm">
                  RETRO<span className="text-blue-500">BOY</span>
                </span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>

            <div className="flex-1 bg-black rounded-xl p-4 md:p-6 shadow-inner border-[1px] border-slate-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>

              <div className="flex justify-between items-center mb-4 text-slate-400 font-mono text-xs z-10 relative border-b border-slate-800 pb-2">
                <span>
                  {mode === "MENU"
                    ? "SYSTEM READY"
                    : `PLAYING: ${currentGame.name.toUpperCase()}`}
                </span>
                <div className="flex items-center gap-4">
                  {mode === "PLAYING" && logicKey !== "snake" && (
                    <span className="flex items-center gap-1 text-[10px] text-blue-400">
                      <MousePointer2 size={10} /> MOUSE ON
                    </span>
                  )}
                  <span>
                    {Math.floor(timer / 60)}:
                    {(timer % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>

              <div 
                className="aspect-square w-full max-w-[450px] mx-auto bg-[#0f172a] rounded-lg p-2 grid gap-1 relative z-10 shadow-[inset_0_0_20px_rgba(0,0,0,1)]"
                style={{
                  gridTemplateColumns: `repeat(${currentBoardSize}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${currentBoardSize}, minmax(0, 1fr))`
                }}
              >
                {board.map((_, i) => renderCell(i))}

                {winner && !showEndPopup && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-30 backdrop-blur-sm">
                    <div className="text-center animate-bounce">
                      <Trophy
                        size={48}
                        className="text-yellow-500 mx-auto mb-2"
                      />
                      <div className="text-yellow-500 font-black text-3xl mb-4">
                        {winner === "X" || winner === "WIN"
                          ? "YOU WIN!"
                          : "GAME OVER"}
                      </div>
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => {
                            setWinner(null);
                            setMode("MENU");
                          }}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-bold text-xs shadow-lg transition-all"
                        >
                          BACK (Esc)
                        </button>
                        <button
                          onClick={() => initGame(logicKey)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-xs shadow-lg transition-all"
                        >
                          PLAY AGAIN (Enter)
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {showEndPopup && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-[60] backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 text-white shadow-2xl">
                      <div className="text-center mb-3">
                        <div className="text-slate-400 text-xs uppercase tracking-widest">
                          Game Result
                        </div>
                        <div className="font-black text-2xl mt-1">
                          {(endResult || "draw").toUpperCase()}
                        </div>
                        <div className="text-emerald-400 font-mono text-3xl mt-2">
                          +{finalScore ?? 0}
                        </div>
                      </div>

                      {unlockedAchievements.length > 0 && (
                        <div className="mt-4 bg-slate-800/50 border border-slate-700 rounded-xl p-3">
                          <div className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-2">
                            New Achievements
                          </div>
                          <div className="space-y-1 text-sm">
                            {unlockedAchievements.map((a) => (
                              <div key={a.id} className="text-slate-200">
                                - {a.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-5 flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setShowEndPopup(false);
                            setUnlockedAchievements([]);
                            if (exitAfterEndRef.current) {
                              exitAfterEndRef.current = false;
                              setWinner(null);
                              setIsPaused(false);
                              setMode("MENU");
                            }
                          }}
                          className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {isPaused && !showRating && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg z-30 backdrop-blur-sm">
                    <div className="text-white font-black text-2xl tracking-widest">
                      PAUSED
                    </div>
                  </div>
                )}

                {showRating && (
                  <div className="absolute inset-0 bg-slate-900/95 z-50 rounded-lg flex flex-col p-4 text-white overflow-hidden">
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-2">
                      <h3 className="font-bold flex items-center gap-2">
                        <MessageSquare size={16} className="text-blue-500" />
                        Rating & Comments
                      </h3>
                      <button
                        onClick={() => setShowRating(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 scrollbar-thin scrollbar-thumb-slate-600">
                      {reviews.length === 0 ? (
                        <div className="text-center text-slate-500 text-xs mt-10">
                          No comments yet. Be the first!
                        </div>
                      ) : (
                        reviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="bg-slate-800 p-2 rounded text-xs border border-slate-700"
                          >
                            <div className="flex justify-between text-slate-400 mb-1 text-[10px]">
                              <span>
                                {rev.user_name ||
                                  rev.user_username ||
                                  "Anonymous User"}
                              </span>
                              <span>
                                {new Date(rev.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex mb-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={10}
                                  className={
                                    s <= rev.point
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-slate-600"
                                  }
                                />
                              ))}
                            </div>
                            <p className="text-slate-200">{rev.comment}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="border-t border-slate-700 pt-2">
                      <div className="flex justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            onClick={() => setCurrentRating(s)}
                            className="focus:outline-none transition-transform active:scale-90"
                          >
                            <Star
                              size={20}
                              className={
                                s <= currentRating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-slate-600"
                              }
                            />
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 mb-2"
                      />
                      <button
                        onClick={submitReview}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded text-xs font-bold transition-colors"
                      >
                        SUBMIT
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between items-end z-10 relative">
                <div className="text-slate-500 text-xs">LVL: 1</div>
                <div className="text-right">
                  <div className="text-slate-500 text-[10px] uppercase">
                    Score
                  </div>
                  <div className="text-emerald-400 font-mono text-xl leading-none">
                    {score.toString().padStart(6, "0")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-72 bg-[#1e293b] p-4 flex flex-col justify-end gap-8 relative">
            <div className="bg-[#0f172a] p-4 rounded-xl border-l-4 border-blue-500 shadow-lg">
              <h3 className="text-white font-bold text-lg mb-1">
                {currentGame.name}
              </h3>
              <p className="text-slate-400 text-xs">
                {currentGame.description}
              </p>
            </div>

              <button
                onClick={() => handleControl("BACK")}
                className="h-12 bg-slate-700 rounded-full shadow-[0_4px_0_rgb(30,41,59)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 text-slate-300 font-bold text-xs"
              >
                <CornerUpLeft size={16} /> BACK (Esc)
              </button>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="h-12 bg-slate-700 rounded-full shadow-[0_4px_0_rgb(30,41,59)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 text-slate-300 font-bold text-xs"
              >
                <Play size={16} /> PAUSE (P)
              </button>


            {/* Save Dialog */}
            {showSaveDialog && (
                <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4 rounded-xl">
                    <div className="bg-slate-800 p-4 rounded-lg w-full max-w-sm border border-slate-700">
                        <h3 className="text-white font-bold mb-2">Save Game</h3>
                        <input 
                            type="text" 
                            value={saveName}
                            onChange={e => setSaveName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white mb-4 text-sm"
                            placeholder="Save Name..."
                        />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => setShowSaveDialog(false)} className="px-3 py-1 text-slate-400 text-xs">Cancel</button>
                            <button onClick={handleSaveGame} className="px-3 py-1 bg-blue-600 rounded text-white text-xs font-bold">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Load Dialog */}
            {showLoadDialog && (
                <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4 rounded-xl">
                    <div className="bg-slate-800 p-4 rounded-lg w-full max-w-sm border border-slate-700 flex flex-col max-h-[400px]">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-white font-bold">Load Game</h3>
                            <button onClick={() => setShowLoadDialog(false)}><X size={16} className="text-slate-400" /></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto min-h-[150px]">
                            {savedGames.length === 0 ? (
                                <p className="text-slate-500 text-sm text-center py-4">No saved games found.</p>
                            ) : (
                                <div className="space-y-2">
                                    {currentLoadItems.map(save => (
                                        <button 
                                            key={save.id}
                                            onClick={() => handleSelectSavedGame(save)}
                                            className="w-full bg-slate-700/50 hover:bg-slate-700 p-2 rounded text-left border border-slate-600 transition-colors"
                                        >
                                            <div className="text-white text-sm font-bold truncate">{save.name}</div>
                                            <div className="text-slate-400 text-[10px]">{new Date(save.update_at || save.create_at).toLocaleString()}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {savedGames.length > 0 && (
                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-700">
                                <button 
                                    disabled={loadPage === 1}
                                    onClick={() => setLoadPage(p => p - 1)}
                                    className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                                >
                                    <ArrowLeft size={14} />
                                </button>
                                <span className="text-xs text-slate-500">{loadPage} / {totalLoadPages}</span>
                                <button 
                                    disabled={loadPage === totalLoadPages}
                                    onClick={() => setLoadPage(p => p + 1)}
                                    className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                                >
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {mode === "PLAYING" && logicKey === "draw" && (
              <div className="min-h-[320px] flex flex-col justify-center mb-4">
                <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-2 font-bold">
                    <Palette size={12} /> PALETTE
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {DRAW_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setDrawColor(c)}
                        className={`w-8 h-8 rounded-md transition-transform active:scale-90 ${
                          drawColor === c
                            ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900"
                            : ""
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!(mode === "PLAYING" && logicKey === "draw") && (
              <div className="flex flex-col items-center gap-8 mb-4">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 bg-[#0f172a] rounded-full opacity-50 blur-xl"></div>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <button
                      className="absolute top-0 w-12 h-14 bg-[#334155] rounded-t-lg hover:bg-[#475569] active:bg-blue-600 transition-colors flex items-start justify-center pt-2 shadow-lg"
                      onClick={() => handleControl("UP")}
                    >
                      <ArrowUp size={24} className="text-slate-900" />
                    </button>
                    <button
                      className="absolute bottom-0 w-12 h-14 bg-[#334155] rounded-b-lg hover:bg-[#475569] active:bg-blue-600 transition-colors flex items-end justify-center pb-2 shadow-lg"
                      onClick={() => handleControl("DOWN")}
                    >
                      <ArrowDown size={24} className="text-slate-900" />
                    </button>
                    <button
                      className="absolute left-0 h-12 w-14 bg-[#334155] rounded-l-lg hover:bg-[#475569] active:bg-blue-600 transition-colors flex items-center justify-start pl-2 shadow-lg"
                      onClick={() => handleControl("LEFT")}
                    >
                      <ArrowLeft size={24} className="text-slate-900" />
                    </button>
                    <button
                      className="absolute right-0 h-12 w-14 bg-[#334155] rounded-r-lg hover:bg-[#475569] active:bg-blue-600 transition-colors flex items-center justify-end pr-2 shadow-lg"
                      onClick={() => handleControl("RIGHT")}
                    >
                      <ArrowRight size={24} className="text-slate-900" />
                    </button>
                    <div className="w-12 h-12 bg-[#334155] z-10"></div>
                  </div>
                </div>

                <button
                  onClick={() => handleControl("ENTER")}
                  className="w-24 h-24 rounded-full bg-gradient-to-b from-blue-500 to-blue-700 shadow-[0_6px_0_rgb(30,58,138),0_15px_20px_rgba(0,0,0,0.4)] active:shadow-none active:translate-y-1.5 transition-all flex items-center justify-center border-4 border-[#1e293b]"
                >
                  <span className="font-black text-white text-xl tracking-wider">
                    Play
                  </span>
                </button>
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-[-20px]">
                  Enter / Space
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-center">
              <button
                onClick={openSaveDialog}
                className="p-3 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <Save size={16} />
              </button>
              <button
                onClick={handleLoadGame}
                className="p-3 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <FolderOpen size={16} />
              </button>
              <button
                onClick={() => setShowInstruction(true)}
                className="p-3 rounded-full bg-slate-800 text-slate-400 hover:text-yellow-400 hover:bg-slate-700"
              >
                <HelpCircle size={16} />
              </button>
              <button
                onClick={toggleRating}
                className="p-3 rounded-full bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700"
              >
                <MessageSquare size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};