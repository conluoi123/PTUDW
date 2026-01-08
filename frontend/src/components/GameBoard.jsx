import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Check,
    ArrowLeft,
    HelpCircle,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function GameBoard({
    rows = 8,
    cols = 8,
}) {
    const { isDarkMode } = useTheme();
    const [grid, setGrid] = useState(
        Array(rows)
            .fill(null)
            .map(() => Array(cols).fill("empty")),
    );
    const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
    const [currentColor, setCurrentColor] =
        useState("blue");

    const colors = [
        {
            state: "red",
            class: "from-red-500 to-red-600",
            label: "Red",
        },
        {
            state: "blue",
            class: "from-blue-500 to-blue-600",
            label: "Blue",
        },
        {
            state: "yellow",
            class: "from-yellow-400 to-yellow-500",
            label: "Yellow",
        },
        {
            state: "green",
            class: "from-green-500 to-green-600",
            label: "Green",
        },
        {
            state: "purple",
            class: "from-purple-500 to-purple-600",
            label: "Purple",
        },
        {
            state: "orange",
            class: "from-orange-500 to-orange-600",
            label: "Orange",
        },
    ];

    const getCellColor = (state) => {
        const color = colors.find((c) => c.state === state);
        return color ? color.class : "from-muted to-muted/80";
    };

    const handleCellClick = (row, col) => {
        setSelectedCell({ row, col });
    };

    const handleEnter = () => {
        const newGrid = [...grid];
        newGrid[selectedCell.row][selectedCell.col] = currentColor;
        setGrid(newGrid);
    };

    const handleLeft = () => {
        setSelectedCell((prev) => ({
            ...prev,
            col: Math.max(0, prev.col - 1),
        }));
    };

    const handleRight = () => {
        setSelectedCell((prev) => ({
            ...prev,
            col: Math.min(cols - 1, prev.col + 1),
        }));
    };

    const handleBack = () => {
        const newGrid = [...grid];
        newGrid[selectedCell.row][selectedCell.col] = "empty";
        setGrid(newGrid);
    };

    const handleHint = () => {
        // Mock hint functionality
        alert(
            "Hint: Try matching 3 or more cells of the same color!",
        );
    };

    const handleReset = () => {
        setGrid(
            Array(rows)
                .fill(null)
                .map(() => Array(cols).fill("empty")),
        );
        setSelectedCell({ row: 0, col: 0 });
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Game Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-card to-card/90 border-2 border-cyan-500/30 rounded-xl p-4 shadow-lg">
                    <p className="text-xs text-muted-foreground mb-1">Score</p>
                    <p className="text-2xl font-bold text-foreground">1,250</p>
                </div>
                <div className="bg-gradient-to-br from-card to-card/90 border-2 border-purple-500/30 rounded-xl p-4 shadow-lg">
                    <p className="text-xs text-muted-foreground mb-1">Level</p>
                    <p className="text-2xl font-bold text-foreground">5</p>
                </div>
                <div className="bg-gradient-to-br from-card to-card/90 border-2 border-yellow-500/30 rounded-xl p-4 shadow-lg">
                    <p className="text-xs text-muted-foreground mb-1">Moves</p>
                    <p className="text-2xl font-bold text-foreground">23</p>
                </div>
            </div>

            {/* Game Board */}
            <div className="bg-gradient-to-br from-card to-card/90 rounded-2xl p-6 border-2 border-border shadow-2xl mb-6">
                {/* Grid Container */}
                <div
                    className="grid gap-2 p-4 bg-accent/30 rounded-xl backdrop-blur-sm"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                    }}
                >
                    {grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => {
                            const isSelected =
                                selectedCell.row === rowIndex &&
                                selectedCell.col === colIndex;
                            const cellColor = getCellColor(cell);

                            return (
                                <button
                                    key={`${rowIndex}-${colIndex}`}
                                    onClick={() =>
                                        handleCellClick(rowIndex, colIndex)
                                    }
                                    className={`
                    aspect-square rounded-full relative
                    transition-all duration-200
                    ${cell === "empty"
                                            ? "bg-gradient-to-br from-muted to-muted/80 hover:from-muted/80 hover:to-muted/60"
                                            : `bg-gradient-to-br ${cellColor} shadow-lg`
                                        }
                    ${isSelected ? "ring-4 ring-primary ring-offset-2 ring-offset-background scale-110" : "hover:scale-105"}
                  `}
                                >
                                    {/* Glow effect for colored cells */}
                                    {cell !== "empty" && (
                                        <div
                                            className={`absolute inset-0 rounded-full bg-gradient-to-br ${cellColor} opacity-50 blur-md`}
                                        />
                                    )}

                                    {/* Inner shine */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                                </button>
                            );
                        }),
                    )}
                </div>

                {/* Color Selector */}
                <div className="mt-6 flex items-center justify-center gap-3 p-4 bg-accent/30 rounded-xl">
                    <span className="text-sm text-muted-foreground mr-2">
                        Select Color:
                    </span>
                    {colors.map((color) => (
                        <button
                            key={color.state}
                            onClick={() => setCurrentColor(color.state)}
                            className={`
                w-10 h-10 rounded-full bg-gradient-to-br ${color.class}
                transition-all duration-200
                ${currentColor === color.state
                                    ? "ring-4 ring-primary ring-offset-2 ring-offset-background scale-110"
                                    : "hover:scale-105 opacity-70 hover:opacity-100"
                                }
              `}
                            title={color.label}
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Control Panel */}
            <div className="bg-gradient-to-br from-card to-card/90 rounded-2xl p-6 border-2 border-border shadow-2xl">
                <div className="grid grid-cols-5 gap-4">
                    {/* Left Button */}
                    <button
                        onClick={handleLeft}
                        className="group aspect-square bg-gradient-to-br from-muted to-muted/80 hover:from-blue-600 hover:to-blue-700 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 border-2 border-border hover:border-blue-500"
                    >
                        <ChevronLeft className="w-8 h-8 text-muted-foreground group-hover:text-white transition-colors" />
                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">
                            Left
                        </span>
                    </button>

                    {/* Right Button */}
                    <button
                        onClick={handleRight}
                        className="group aspect-square bg-gradient-to-br from-muted to-muted/80 hover:from-blue-600 hover:to-blue-700 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 border-2 border-border hover:border-blue-500"
                    >
                        <ChevronRight className="w-8 h-8 text-muted-foreground group-hover:text-white transition-colors" />
                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">
                            Right
                        </span>
                    </button>

                    {/* ENTER Button */}
                    <button
                        onClick={handleEnter}
                        className="group aspect-square bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/50 border-2 border-green-500"
                    >
                        <Check className="w-8 h-8 text-white transition-colors" />
                        <span className="text-xs text-white transition-colors">
                            ENTER
                        </span>
                    </button>

                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="group aspect-square bg-gradient-to-br from-muted to-muted/80 hover:from-red-600 hover:to-red-700 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 border-2 border-border hover:border-red-500"
                    >
                        <ArrowLeft className="w-8 h-8 text-muted-foreground group-hover:text-white transition-colors" />
                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">
                            Back
                        </span>
                    </button>

                    {/* Hint/Help Button */}
                    <button
                        onClick={handleHint}
                        className="group aspect-square bg-gradient-to-br from-muted to-muted/80 hover:from-yellow-600 hover:to-yellow-700 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/50 border-2 border-border hover:border-yellow-500"
                    >
                        <HelpCircle className="w-8 h-8 text-muted-foreground group-hover:text-white transition-colors" />
                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">
                            Hint
                        </span>
                    </button>
                </div>

                {/* Additional Controls */}
                <div className="mt-4 flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex-1 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl text-primary-foreground font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
                    >
                        Reset Game
                    </button>
                    <button className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50">
                        New Challenge
                    </button>
                </div>
            </div>
        </div>
    );
}