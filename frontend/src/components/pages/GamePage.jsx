import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Save,
  FolderOpen,
  Cpu,
  Play,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  CornerUpLeft,
  Gamepad2,
  Trophy,
  HelpCircle,
  MousePointer2,
} from "lucide-react";

// --- CONSTANTS ---
const BOARD_SIZE = 15;
const COLORS = {
  bg: "#0f172a",
  cell: "#334155",
  accent: "#3b82f6",
  playerX: "#3b82f6", // Xanh
  playerO: "#ef4444", // Đỏ
  snake: "#22c55e",
  food: "#ef4444",
};

const GAMES = [
  { id: "caro5", name: "Caro 5", description: "5 in a row" },
  { id: "caro4", name: "Caro 4", description: "Connect 4 (Free)" },
  { id: "tictactoe", name: "Tic Tac Toe", description: "3 in a row" },
  { id: "snake", name: "Snake", description: "Classic Snake" },
  { id: "match3", name: "Match 3", description: "Tile Matching" },
  { id: "memory", name: "Memory", description: "Card Flip" },
  { id: "draw", name: "Free Draw", description: "Pixel Art" },
];

// --- ICONS & LOGIC HELPERS ---
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
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
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

const generateIconGrid = (gameId) => {
  const grid = Array(BOARD_SIZE * BOARD_SIZE).fill(null);
  const icon = ICONS[gameId];
  if (!icon) return grid;
  const iconH = icon.length;
  const iconW = icon[0].length;
  const startRow = Math.floor((BOARD_SIZE - iconH) / 2);
  const startCol = Math.floor((BOARD_SIZE - iconW) / 2);
  for (let r = 0; r < iconH; r++) {
    for (let c = 0; c < iconW; c++) {
      if (icon[r][c])
        grid[(startRow + r) * BOARD_SIZE + (startCol + c)] = "ICON";
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
  // 1. Attack (Win immediately)
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
  // 2. Defend (Block opponent)
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
  // 3. Random
  const empties = board
    .map((v, i) => (v === null ? i : null))
    .filter((v) => v !== null);
  return empties.length > 0
    ? empties[Math.floor(Math.random() * empties.length)]
    : null;
};

const checkMatch3Matches = (board) => {
  let matches = new Set();
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE - 2; c++) {
      const idx = r * BOARD_SIZE + c;
      const v = board[idx];
      if (v && v === board[idx + 1] && v === board[idx + 2]) {
        matches.add(idx);
        matches.add(idx + 1);
        matches.add(idx + 2);
      }
    }
  }
  for (let c = 0; c < BOARD_SIZE; c++) {
    for (let r = 0; r < BOARD_SIZE - 2; r++) {
      const idx = r * BOARD_SIZE + c;
      const v = board[idx];
      if (
        v &&
        v === board[(r + 1) * BOARD_SIZE + c] &&
        v === board[(r + 2) * BOARD_SIZE + c]
      ) {
        matches.add(idx);
        matches.add((r + 1) * BOARD_SIZE + c);
        matches.add((r + 2) * BOARD_SIZE + c);
      }
    }
  }
  return matches;
};

const resolveMatch3Board = (board) => {
  let currentBoard = [...board];
  let totalScore = 0;
  let hasMatches = true;
  let iterations = 0;
  while (hasMatches && iterations < 5) {
    const matches = checkMatch3Matches(currentBoard);
    if (matches.size === 0) hasMatches = false;
    else {
      totalScore += matches.size * 10;
      matches.forEach((idx) => {
        currentBoard[idx] = null;
      });
      for (let c = 0; c < BOARD_SIZE; c++) {
        let writePtr = BOARD_SIZE - 1;
        for (let r = BOARD_SIZE - 1; r >= 0; r--) {
          const idx = r * BOARD_SIZE + c;
          if (currentBoard[idx] !== null) {
            currentBoard[writePtr * BOARD_SIZE + c] = currentBoard[idx];
            if (writePtr !== r) currentBoard[idx] = null;
            writePtr--;
          }
        }
        for (let r = writePtr; r >= 0; r--)
          currentBoard[r * BOARD_SIZE + c] = Math.floor(Math.random() * 5) + 1;
      }
      iterations++;
    }
  }
  return { board: currentBoard, scoreDelta: totalScore };
};

// --- MAIN COMPONENT ---
export const GamesPage = () => {
  const [mode, setMode] = useState("MENU");
  const [gameIdx, setGameIdx] = useState(0);
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  const [cursor, setCursor] = useState(112);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [winner, setWinner] = useState(null);
  const [hintCell, setHintCell] = useState(null);

  // Snake States
  const [snake, setSnake] = useState([[7, 7]]);
  const [food, setFood] = useState(null);
  const [direction, setDirection] = useState("RIGHT");

  // Memory States
  const [memoryRevealed, setMemoryRevealed] = useState([]);
  const [memoryMatched, setMemoryMatched] = useState([]);

  // Match 3 States
  const [match3Selected, setMatch3Selected] = useState(null);

  const gameLoopRef = useRef(null);
  const timerRef = useRef(null);

  // --- LOOPS ---
  useEffect(() => {
    if (mode === "MENU") setBoard(generateIconGrid(GAMES[gameIdx].id));
  }, [mode, gameIdx]);

  useEffect(() => {
    if (mode === "PLAYING" && !isPaused && !winner) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [mode, isPaused, winner]);

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
        newHead[0] >= BOARD_SIZE ||
        newHead[1] < 0 ||
        newHead[1] >= BOARD_SIZE ||
        prev.some((s) => s[0] === newHead[0] && s[1] === newHead[1])
      ) {
        setWinner("GAME OVER");
        return prev;
      }
      const newSnake = [newHead, ...prev];
      const headIdx = newHead[1] * BOARD_SIZE + newHead[0];
      if (headIdx === food) {
        setScore((s) => s + 10);
        let newFood;
        do {
          newFood = Math.floor(Math.random() * 225);
        } while (newSnake.some((s) => s[1] * 15 + s[0] === newFood));
        setFood(newFood);
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [direction, food]);

  useEffect(() => {
    if (
      mode === "PLAYING" &&
      GAMES[gameIdx].id === "snake" &&
      !isPaused &&
      !winner
    ) {
      gameLoopRef.current = setInterval(snakeStep, 150);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [mode, isPaused, winner, snakeStep, gameIdx]);

  // --- INIT ---
  const initGame = (id) => {
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setWinner(null);
    setScore(0);
    setTimer(0);
    setIsPaused(false);
    setHintCell(null);
    setCursor(112);
    if (id === "snake") {
      setSnake([
        [7, 5],
        [7, 6],
        [7, 7],
      ]);
      setDirection("UP");
      setFood(40);
    } else if (id === "memory") {
      const icons = [1, 2, 3, 4, 5, 6, 7, 8];
      setBoard([...icons, ...icons].sort(() => Math.random() - 0.5));
      setMemoryRevealed([]);
      setMemoryMatched([]);
    } else if (id === "match3") {
      const newB = Array(BOARD_SIZE * BOARD_SIZE)
        .fill(null)
        .map(() => Math.floor(Math.random() * 5) + 1);
      const resolved = resolveMatch3Board(newB);
      setBoard(resolved.board);
      setScore(0);
      setMatch3Selected(null);
    }
  };

  // --- CONTROLS ---
  const handleControl = (action) => {
    if (mode === "MENU") {
      if (action === "LEFT")
        setGameIdx((prev) => (prev - 1 + GAMES.length) % GAMES.length);
      if (action === "RIGHT") setGameIdx((prev) => (prev + 1) % GAMES.length);
      if (action === "ENTER") {
        setMode("PLAYING");
        initGame(GAMES[gameIdx].id);
      }
      return;
    }
    if (mode === "PLAYING") {
      if (action === "BACK") {
        setMode("MENU");
        return;
      }
      if (winner) return;
      if (action === "HINT") {
        handleHint();
        return;
      }
      handleGameInput(action);
    }
  };

  // --- LOGIC XỬ LÝ CLICK CHUỘT ---
  const handleMouseClick = (index) => {
    if (mode !== "PLAYING" || isPaused || winner) return;
    if (GAMES[gameIdx].id === "snake") return;
    setCursor(index);
    handleGameInput("ENTER", index);
  };

  // --- CORE GAME INPUT LOGIC ---
  const handleGameInput = (action, overrideCursor = null) => {
    const gameId = GAMES[gameIdx].id;
    const activeCursor = overrideCursor !== null ? overrideCursor : cursor;

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
      if (action === "UP") next -= BOARD_SIZE;
      if (action === "DOWN") next += BOARD_SIZE;
      if (action === "LEFT" && cursor % BOARD_SIZE !== 0) next -= 1;
      if (action === "RIGHT" && (cursor + 1) % BOARD_SIZE !== 0) next += 1;
      if (next >= 0 && next < BOARD_SIZE * BOARD_SIZE) setCursor(next);
    }

    if (action === "ENTER") {
      // LOGIC CHUNG CHO CARO 4, 5, TICTACTOE (Đặt đâu nằm đó)
      if (["caro5", "caro4", "tictactoe"].includes(gameId)) {
        if (board[activeCursor]) return;
        const newB = [...board];
        newB[activeCursor] = "X";
        setBoard(newB);

        // Xác định luật thắng
        let streak = 3;
        if (gameId === "caro5") streak = 5;
        if (gameId === "caro4") streak = 4;

        const w = checkWin(newB, BOARD_SIZE, streak);
        if (w) {
          setWinner(w);
          return;
        }

        setTimeout(() => aiMove(newB, gameId), 300);
      } else if (gameId === "draw") {
        const newB = [...board];
        newB[activeCursor] = newB[activeCursor] ? null : "X";
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
            if (memoryMatched.length + 2 === 16) setWinner("WIN");
          } else {
            setTimeout(() => setMemoryRevealed([]), 1000);
          }
        }
      } else if (gameId === "match3") {
        if (match3Selected === null) {
          setMatch3Selected(activeCursor);
        } else {
          const diff = Math.abs(activeCursor - match3Selected);
          if (diff === 1 || diff === BOARD_SIZE) {
            const newB = [...board];
            const temp = newB[match3Selected];
            newB[match3Selected] = newB[activeCursor];
            newB[activeCursor] = temp;
            const matches = checkMatch3Matches(newB);
            if (matches.size > 0) {
              const result = resolveMatch3Board(newB);
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
      move = findBestMove(currentBoard, BOARD_SIZE, streak, "O", "X");
    }

    if (move !== null) {
      const newB = [...currentBoard];
      newB[move] = "O";
      setBoard(newB);
      const w = checkWin(newB, BOARD_SIZE, streak);
      if (w) setWinner(w);
    }
  };

  const handleHint = useCallback(() => {
    // Tìm các ô trống
    const empties = board
      .map((v, i) => (v === null ? i : null))
      .filter((v) => v !== null);

    if (empties.length > 0) {
      // Logic random nằm trong này là an toàn vì nó chỉ chạy khi người dùng click
      setHintCell(empties[Math.floor(Math.random() * empties.length)]);
      setTimeout(() => setHintCell(null), 1000);
    }
  }, [board]);

  const handleSave = () => {
    localStorage.setItem(
      "retro_save",
      JSON.stringify({
        gameIdx,
        board,
        score,
        timer,
        snake,
        food,
        memoryMatched,
      }),
    );
    alert("Game Saved");
  };

  const handleLoad = () => {
    const data = JSON.parse(localStorage.getItem("retro_save"));
    if (data) {
      setGameIdx(data.gameIdx);
      setBoard(data.board);
      setScore(data.score);
      setTimer(data.timer);
      setSnake(data.snake);
      setFood(data.food);
      setMemoryMatched(data.memoryMatched);
      setMode("PLAYING");
    }
  };

  const renderCell = (i) => {
    const val = board[i];
    const gameId = GAMES[gameIdx].id;
    let color = "transparent";
    let text = "";
    let glow = false;

    const isSnake =
      gameId === "snake" && snake.some((s) => s[1] * 15 + s[0] === i);
    const isSnakeHead =
      gameId === "snake" &&
      snake.length > 0 &&
      snake[0][1] * 15 + snake[0][0] === i;
    const isFood = gameId === "snake" && food === i;
    const isCursor = mode === "PLAYING" && cursor === i;
    const isHint = hintCell === i;
    const isSelected = match3Selected === i;

    // Xác định xem ô có click được không (để hiện con trỏ chuột)
    const isClickable = mode === "PLAYING" && gameId !== "snake";
    const isGridDot = color === "transparent" && !val;

    if (mode === "MENU" && val === "ICON") {
      color = COLORS.accent;
      glow = true;
    }
    if (gameId === "draw" && val) color = "#fff";
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

    return (
      <div
        key={i}
        onClick={() => handleMouseClick(i)}
        className={`
            relative flex items-center justify-center text-xs font-bold transition-all duration-150
            ${isGridDot ? "rounded-full opacity-10 scale-50" : "rounded-md shadow-sm"}
            ${isClickable ? "cursor-pointer hover:bg-white/10" : "cursor-default"} 
        `}
        style={{
          backgroundColor: isCursor
            ? "#fff"
            : isHint
              ? "#fbbf24"
              : color === "transparent"
                ? COLORS.cell
                : color,
          color: isCursor
            ? "#000"
            : gameId === "memory" || gameId === "match3"
              ? isCursor
                ? "#000"
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

  // --- KEYBOARD SUPPORT ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      const keyMap = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        Enter: "ENTER", " ": "ENTER", Escape: "BACK", Backspace: "BACK",
        h: "HINT", p: "PAUSE",
      };
      if (keyMap[e.key]) {
        if(keyMap[e.key] === "PAUSE") { setIsPaused(prev => !prev); return; }
        handleControl(keyMap[e.key]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, gameIdx, cursor, board, snake, direction, isPaused, winner, match3Selected]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-zinc-900 p-4 font-sans select-none">
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
                    : `PLAYING: ${GAMES[gameIdx].name.toUpperCase()}`}
                </span>
                <div className="flex items-center gap-4">
                  {mode === "PLAYING" && GAMES[gameIdx].id !== "snake" && (
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

              <div className="aspect-square w-full max-w-[450px] mx-auto bg-[#0f172a] rounded-lg p-2 grid grid-cols-15 grid-rows-15 gap-1 relative z-10 shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
                {board.map((_, i) => renderCell(i))}

                {winner && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-30 backdrop-blur-sm">
                    <div className="text-center animate-bounce">
                      <Trophy
                        size={48}
                        className="text-yellow-500 mx-auto mb-2"
                      />
                      <div className="text-yellow-500 font-black text-3xl mb-1">
                        {winner === "X" || winner === "WIN"
                          ? "YOU WIN!"
                          : "GAME OVER"}
                      </div>
                      <div className="text-slate-400 text-xs">
                        PRESS BACK TO EXIT
                      </div>
                    </div>
                  </div>
                )}
                {isPaused && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg z-30 backdrop-blur-sm">
                    <div className="text-white font-black text-2xl tracking-widest">
                      PAUSED
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
                {GAMES[gameIdx].name}
              </h3>
              <p className="text-slate-400 text-xs">
                {GAMES[gameIdx].description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

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
                  A
                </span>
              </button>
              <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-[-20px]">
                Enter / Space
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={handleSave}
                className="p-3 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <Save size={16} />
              </button>
              <button
                onClick={handleLoad}
                className="p-3 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <FolderOpen size={16} />
              </button>
              <button
                onClick={handleHint}
                className="p-3 rounded-full bg-slate-800 text-slate-400 hover:text-yellow-400 hover:bg-slate-700"
              >
                <HelpCircle size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
