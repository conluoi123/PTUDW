import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft,
  Save,
  FolderOpen,
  Menu as MenuIcon,
  Cpu,
  User,
  Clock,
  HelpCircle,
  Play,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  CornerUpLeft,
} from "lucide-react";

const BOARD_SIZE = 15;
const COLORS = {
  bg: "#0f172a",
  boardBg: "#1e293b",
  cell: "#334155",
  accent: "#3b82f6",
  accentHover: "#2563eb",
  text: "#f8fafc",
  playerX: "#3b82f6",
  playerO: "#ef4444",
  snake: "#22c55e",
  food: "#ef4444",
  win: "#fbbf24",
};

const GAMES = [
  { id: "caro5", name: "Caro 5", description: "5 in a row" },
  { id: "caro4", name: "Caro 4", description: "Connect 4" },
  { id: "tictactoe", name: "Tic Tac Toe", description: "3 in a row" },
  { id: "snake", name: "Snake", description: "Classic Snake" },
  { id: "match3", name: "Match 3", description: "Tile Matching" },
  { id: "memory", name: "Memory", description: "Card Flip" },
  { id: "draw", name: "Free Draw", description: "Pixel Art" },
];

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
      if (icon[r][c]) {
        grid[(startRow + r) * BOARD_SIZE + (startCol + c)] = "ICON";
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
        const nx = x + dx,
          ny = y + dy;
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

export const GamesPage = () => {
  const [mode, setMode] = useState("MENU");
  const [gameIdx, setGameIdx] = useState(0);
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  const [cursor, setCursor] = useState(112);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [hintCell, setHintCell] = useState(null);
  const [snake, setSnake] = useState([[7, 7]]);
  const [food, setFood] = useState(null);
  const [direction, setDirection] = useState("RIGHT");
  const [memoryRevealed, setMemoryRevealed] = useState([]);
  const [memoryMatched, setMemoryMatched] = useState([]);
  const [match3Selected, setMatch3Selected] = useState(null);

  const gameLoopRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (mode === "MENU") {
      setBoard(generateIconGrid(GAMES[gameIdx].id));
    }
  }, [mode, gameIdx]);

  useEffect(() => {
    if (mode === "PLAYING" && !isPaused && !winner) {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [mode, isPaused, winner]);

  const snakeStep = () => {
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
  };

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
  }, [mode, isPaused, winner, snake, direction, gameIdx]);

  const initGame = (id) => {
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setWinner(null);
    setScore(0);
    setTimer(0);
    setIsPaused(false);
    setTurn("X");
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
      const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);
      setBoard(deck);
      setMemoryRevealed([]);
      setMemoryMatched([]);
    } else if (id === "match3") {
      const newB = Array(BOARD_SIZE * BOARD_SIZE).fill(null);
      for (let i = 0; i < 64; i++) {
        const r = Math.floor(i / 8) + 3;
        const c = (i % 8) + 3;
        newB[r * 15 + c] = Math.floor(Math.random() * 4) + 1;
      }
      setBoard(newB);
    }
  };

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

  const handleGameInput = (action) => {
    const gameId = GAMES[gameIdx].id;

    if (gameId === "snake") {
      if (action === "LEFT")
        setDirection((prev) =>
          prev === "UP"
            ? "LEFT"
            : prev === "LEFT"
              ? "DOWN"
              : prev === "DOWN"
                ? "RIGHT"
                : "UP",
        );
      if (action === "RIGHT")
        setDirection((prev) =>
          prev === "UP"
            ? "RIGHT"
            : prev === "RIGHT"
              ? "DOWN"
              : prev === "DOWN"
                ? "LEFT"
                : "UP",
        );
      return;
    }

    if (["UP", "DOWN", "LEFT", "RIGHT"].includes(action)) {
      let next = cursor;
      if (action === "UP") next -= BOARD_SIZE;
      if (action === "DOWN") next += BOARD_SIZE;
      if (action === "LEFT") next -= 1;
      if (action === "RIGHT") next += 1;
      if (next >= 0 && next < BOARD_SIZE * BOARD_SIZE) setCursor(next);
    }

    if (action === "ENTER") {
      if (gameId === "caro5" || gameId === "tictactoe") {
        if (board[cursor]) return;
        const newB = [...board];
        newB[cursor] = "X";
        setBoard(newB);
        const w = checkWin(newB, BOARD_SIZE, gameId === "caro5" ? 5 : 3);
        if (w) {
          setWinner(w);
          return;
        }

        setTimeout(() => aiMove(newB, gameId), 300);
      } else if (gameId === "caro4") {
        const col = cursor % BOARD_SIZE;
        let target = -1;
        for (let r = BOARD_SIZE - 1; r >= 0; r--) {
          if (!board[r * BOARD_SIZE + col]) {
            target = r * BOARD_SIZE + col;
            break;
          }
        }
        if (target !== -1) {
          const newB = [...board];
          newB[target] = "X";
          setBoard(newB);
          const w = checkWin(newB, BOARD_SIZE, 4);
          if (w) {
            setWinner(w);
            return;
          }
          setTimeout(() => aiMove(newB, gameId), 300);
        }
      } else if (gameId === "draw") {
        const newB = [...board];
        newB[cursor] = newB[cursor] ? null : "X";
        setBoard(newB);
      } else if (gameId === "memory") {
        if (memoryRevealed.includes(cursor) || memoryMatched.includes(cursor))
          return;
        const newRev = [...memoryRevealed, cursor];
        setMemoryRevealed(newRev);
        if (newRev.length === 2) {
          if (board[newRev[0]] === board[newRev[1]]) {
            setMemoryMatched([...memoryMatched, ...newRev]);
            setScore((s) => s + 1);
            setMemoryRevealed([]);
            if (memoryMatched.length + 2 === 16) setWinner("WIN");
          } else {
            setTimeout(() => setMemoryRevealed([]), 1000);
          }
        }
      } else if (gameId === "match3") {
        if (match3Selected === null) {
          setMatch3Selected(cursor);
        } else {
          const newB = [...board];
          const temp = newB[match3Selected];
          newB[match3Selected] = newB[cursor];
          newB[cursor] = temp;
          setBoard(newB);
          setMatch3Selected(null);
          setScore((s) => s + 5);
        }
      }
    }
  };

  const aiMove = (currentBoard, gameId) => {
    if (winner) return;
    const empties = currentBoard
      .map((v, i) => (v === null ? i : null))
      .filter((v) => v !== null);
    if (empties.length === 0) return;

    let move = empties[Math.floor(Math.random() * empties.length)];

    if (gameId === "caro4") {
      const col = move % BOARD_SIZE;
      for (let r = BOARD_SIZE - 1; r >= 0; r--) {
        if (!currentBoard[r * BOARD_SIZE + col]) {
          move = r * BOARD_SIZE + col;
          break;
        }
      }
    }

    const newB = [...currentBoard];
    newB[move] = "O";
    setBoard(newB);
    const w = checkWin(
      newB,
      BOARD_SIZE,
      gameId === "caro5" ? 5 : gameId === "caro4" ? 4 : 3,
    );
    if (w) setWinner(w);
  };

  const handleHint = () => {
    const empties = board
      .map((v, i) => (v === null ? i : null))
      .filter((v) => v !== null);
    if (empties.length > 0) {
      setHintCell(empties[Math.floor(Math.random() * empties.length)]);
      setTimeout(() => setHintCell(null), 1000);
    }
  };

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
    const isSnake =
      gameId === "snake" && snake.some((s) => s[1] * 15 + s[0] === i);
    const isFood = gameId === "snake" && food === i;
    const isCursor = mode === "PLAYING" && cursor === i;
    const isHint = hintCell === i;

    if (mode === "MENU" && val === "ICON") color = COLORS.accent;
    if (gameId === "draw" && val) color = "#fff";
    if (gameId === "caro5" || gameId === "caro4" || gameId === "tictactoe") {
      if (val === "X") {
        color = COLORS.playerX;
        text = "X";
      }
      if (val === "O") {
        color = COLORS.playerO;
        text = "O";
      }
    }
    if (isSnake) color = COLORS.snake;
    if (isFood) color = COLORS.food;
    if (gameId === "match3" && val) {
      const colors = ["#f472b6", "#22d3ee", "#a78bfa", "#fbbf24"];
      color = colors[val - 1];
    }
    if (gameId === "memory") {
      if (memoryRevealed.includes(i) || memoryMatched.includes(i)) {
        text = val;
        color = "#cbd5e1";
      } else if (val) {
        text = "?";
        color = COLORS.cell;
      }
    }

    return (
      <div
        key={i}
        className="rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200"
        style={{
          backgroundColor: isCursor
            ? "#fff"
            : isHint
              ? "#fbbf24"
              : color === "transparent"
                ? COLORS.cell
                : color,
          color: isCursor ? "#000" : gameId === "memory" ? "#000" : "#fff",
          width: "100%",
          height: "100%",
          opacity: mode === "MENU" && val !== "ICON" ? 0.2 : 1,
          boxShadow: isCursor ? "0 0 10px #fff" : "none",
          transform: isCursor ? "scale(1.1)" : "scale(1)",
        }}
      >
        {text}
      </div>
    );
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec};`;
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-black p-8 font-sans">
      {" "}
      <div className="w-full max-w-5xl bg-[#0f172a] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]">
          <button
            onClick={() => setMode("MENU")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="font-bold">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Cpu size={20} className="text-white" />
            </div>
            <span className="text-blue-500 font-black tracking-widest uppercase">
              {GAMES[gameIdx].name}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={mode !== "PLAYING"}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-700 disabled:opacity-50"
            >
              <Save size={16} /> Save
            </button>
            <button
              onClick={handleLoad}
              disabled={mode !== "PLAYING"}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-700 disabled:opacity-50"
            >
              <FolderOpen size={16} /> Load
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 text-sm font-bold hover:bg-slate-700">
              <MenuIcon size={16} /> Menu
            </button>
          </div>
        </div>

        {/* Info Bar */}
        <div className="h-24 bg-[#020617] flex items-center justify-center gap-8 px-8 border-b border-slate-800">
          {mode === "PLAYING" ? (
            <>
              <div className="flex items-center gap-4 bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <User size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-bold uppercase">
                    You
                  </span>
                  <span className="text-white font-black text-lg">
                    Player X
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-slate-800 px-6 py-2 rounded-full flex items-center gap-2 text-slate-300 font-mono font-bold">
                  <Clock size={16} /> {formatTime(timer)}
                </div>
                <div className="mt-2 text-yellow-500 font-black text-xl">
                  SCORE: {score}
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800">
                <div className="flex flex-col items-end">
                  <span className="text-slate-400 text-xs font-bold uppercase">
                    AI
                  </span>
                  <span className="text-white font-black text-lg">
                    Player O
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                  <Cpu size={20} />
                </div>
              </div>
            </>
          ) : (
            <div className="text-slate-400 font-mono">
              SELECT A GAME TO START
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-1 min-h-[500px]">
          {/* Matrix Board */}
          <div className="flex-1 p-8 flex items-center justify-center bg-[#020617]">
            <div className="aspect-square h-full max-h-[500px] p-4 bg-[#1e293b] rounded-2xl border-4 border-[#334155] shadow-2xl relative">
              <div className="w-full h-full grid grid-cols-15 grid-rows-15 gap-2">
                {board.map((_, i) => renderCell(i))}
              </div>
              {winner && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-xl z-10">
                  <div className="text-center">
                    <div className="text-yellow-500 font-black text-4xl mb-2">
                      {winner === "X" ? "YOU WIN!" : "GAME OVER"}
                    </div>
                    <div className="text-white">Press BACK to exit</div>
                  </div>
                </div>
              )}
              {isPaused && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl z-10 text-white font-black text-2xl">
                  PAUSED
                </div>
              )}
            </div>
          </div>

          {/* Control Panel */}
          <div className="w-80 bg-[#0f172a] border-l border-slate-800 p-8 flex flex-col gap-8">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs font-bold uppercase mb-2">
                Controls
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div />
                <button
                  className="h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 shadow-lg active:translate-y-1 hover:bg-slate-700 transition-all border-b-4 border-slate-950 active:border-b-0"
                  onClick={() => handleControl("UP")}
                >
                  <ArrowUp size={20} />
                </button>
                <div />
                <button
                  className="h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 shadow-lg active:translate-y-1 hover:bg-slate-700 transition-all border-b-4 border-slate-950 active:border-b-0"
                  onClick={() => handleControl("LEFT")}
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  className="h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 shadow-lg active:translate-y-1 hover:bg-slate-700 transition-all border-b-4 border-slate-950 active:border-b-0"
                  onClick={() => handleControl("DOWN")}
                >
                  <ArrowDown size={20} />
                </button>
                <button
                  className="h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300 shadow-lg active:translate-y-1 hover:bg-slate-700 transition-all border-b-4 border-slate-950 active:border-b-0"
                  onClick={() => handleControl("RIGHT")}
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleControl("ENTER")}
                className="w-full h-16 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center gap-3 text-white font-black shadow-lg border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 transition-all"
              >
                <Play size={24} fill="currentColor" /> ENTER
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleControl("BACK")}
                  className="h-14 bg-red-600 hover:bg-red-500 rounded-xl flex items-center justify-center gap-2 text-white font-bold shadow-lg border-b-4 border-red-900 active:border-b-0 active:translate-y-1 transition-all"
                >
                  <CornerUpLeft size={20} /> BACK
                </button>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  disabled={mode !== "PLAYING"}
                  className="h-14 bg-slate-700 hover:bg-slate-600 rounded-xl flex items-center justify-center gap-2 text-white font-bold shadow-lg border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50"
                >
                  <RotateCcw size={20} /> {isPaused ? "RESUME" : "PAUSE"}
                </button>
              </div>

              <button
                onClick={() => handleControl("HINT")}
                disabled={mode !== "PLAYING"}
                className="w-full h-12 bg-yellow-600 hover:bg-yellow-500 rounded-xl flex items-center justify-center gap-2 text-white font-bold shadow-lg border-b-4 border-yellow-900 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50"
              >
                <HelpCircle size={20} /> HINT / HELP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
