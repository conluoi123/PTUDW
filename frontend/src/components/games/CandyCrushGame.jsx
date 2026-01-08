import { useState, useEffect, memo } from 'react';
import { GamePlayContainer } from './GamePlayContainer';
import { Sparkles } from 'lucide-react';



const candyColors = {
    red: { color: 'bg-red-500', icon: '●' },
    blue: { color: 'bg-blue-500', icon: '■' },
    green: { color: 'bg-green-500', icon: '▲' },
    yellow: { color: 'bg-yellow-500', icon: '◆' },
    purple: { color: 'bg-purple-500', icon: '★' },
    orange: { color: 'bg-orange-500', icon: '♥' }
};

export const CandyCrushGame = memo(function CandyCrushGame({ onBack }) {
    const boardSize = 8;
    const [board, setBoard] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(30);
    const [isAnimating, setIsAnimating] = useState(false);
    const [comboCount, setComboCount] = useState(0);

    const candyTypes = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

    const createCandy = () => ({
        type: candyTypes[Math.floor(Math.random() * candyTypes.length)],
        id: Math.floor(Math.random() * 1000000)
    });

    const initializeBoard = () => {
        const newBoard = [];
        for (let i = 0; i < boardSize; i++) {
            newBoard[i] = [];
            for (let j = 0; j < boardSize; j++) {
                newBoard[i][j] = createCandy();
            }
        }
        setBoard(newBoard);
    };

    useEffect(() => {
        initializeBoard();
    }, []);

    const checkMatches = (boardToCheck) => {
        const matches = [];

        // Check horizontal matches
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize - 2; col++) {
                const candy1 = boardToCheck[row][col];
                const candy2 = boardToCheck[row][col + 1];
                const candy3 = boardToCheck[row][col + 2];

                if (candy1.type === candy2.type && candy2.type === candy3.type) {
                    matches.push({ row, col }, { row, col: col + 1 }, { row, col: col + 2 });
                }
            }
        }

        // Check vertical matches
        for (let col = 0; col < boardSize; col++) {
            for (let row = 0; row < boardSize - 2; row++) {
                const candy1 = boardToCheck[row][col];
                const candy2 = boardToCheck[row + 1][col];
                const candy3 = boardToCheck[row + 2][col];

                if (candy1.type === candy2.type && candy2.type === candy3.type) {
                    matches.push({ row, col }, { row: row + 1, col }, { row: row + 2, col });
                }
            }
        }

        return matches;
    };

    const swapCandies = (row1, col1, row2, col2) => {
        if (isAnimating || moves <= 0) return;

        const newBoard = board.map(r => [...r]);
        [newBoard[row1][col1], newBoard[row2][col2]] = [newBoard[row2][col2], newBoard[row1][col1]];

        const matches = checkMatches(newBoard);

        if (matches.length > 0) {
            setBoard(newBoard);
            setMoves(prev => prev - 1);
            const points = matches.length * 10;
            setScore(prev => prev + points);
            setComboCount(prev => prev + 1);
            setTimeout(() => {
                removeMatches(matches);
                setTimeout(() => setComboCount(0), 1000);
            }, 300);
        } else {
            // Swap back if no match
            setSelectedCell(null);
        }
    };

    const removeMatches = (matches) => {
        setIsAnimating(true);
        const newBoard = board.map(r => [...r]);

        // Remove matched candies
        matches.forEach(({ row, col }) => {
            newBoard[row][col] = createCandy();
        });

        setBoard(newBoard);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const handleCellClick = (row, col) => {
        if (isAnimating || moves <= 0) return;

        if (!selectedCell) {
            setSelectedCell({ row, col });
        } else {
            const rowDiff = Math.abs(selectedCell.row - row);
            const colDiff = Math.abs(selectedCell.col - col);

            if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
                swapCandies(selectedCell.row, selectedCell.col, row, col);
            }
            setSelectedCell(null);
        }
    };

    const handleReset = () => {
        initializeBoard();
        setScore(0);
        setMoves(30);
        setSelectedCell(null);
    };

    return (
        <GamePlayContainer
            gameName="Candy Crush"
            score={score}
            onBack={onBack}
            onReset={handleReset}
            statusInfo={
                <div className="bg-black/30 rounded-xl p-3 sm:p-4 border border-green-500/30 hover:border-green-500/60 transition-all hover:scale-105 backdrop-blur-sm group">
                    <p className="text-xs text-gray-400 mb-1 group-hover:text-green-400 transition-colors">Moves Left</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{moves}</p>
                </div>
            }
        >
            <div className="flex flex-col items-center gap-4">
                {moves === 0 && (
                    <div className="w-full bg-purple-500/90 rounded-xl p-4 text-center shadow-2xl border border-purple-500/30">
                        <p className="text-foreground text-xl font-bold flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Game Over! Final Score: {score}
                            <Sparkles className="w-5 h-5" />
                        </p>
                    </div>
                )}

                {comboCount > 1 && (
                    <div className="w-full bg-orange-500/90 rounded-xl p-3 text-center shadow-2xl border border-orange-500/30 animate-bounce">
                        <p className="text-foreground font-bold flex items-center justify-center gap-2">
                            🔥 Combo x{comboCount}! 🔥
                        </p>
                    </div>
                )}

                <div
                    className="grid gap-1.5 sm:gap-2 p-3 sm:p-4 bg-card/50 rounded-xl backdrop-blur-sm border shadow-2xl"
                    style={{
                        gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
                        width: 'min(600px, 90vw)'
                    }}
                >
                    {board.map((row, rowIndex) =>
                        row.map((candy, colIndex) => {
                            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                            const colorConfig = candyColors[candy.type];

                            return (
                                <button
                                    key={`${rowIndex}-${colIndex}-${candy.id}`}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    className={`
                    aspect-square rounded-xl flex items-center justify-center relative
                    ${colorConfig.color}
                    transition-all duration-300
                    hover:scale-110 hover:shadow-2xl hover:z-10
                    ${isSelected ? 'ring-4 ring-white scale-110 z-20 shadow-2xl' : ''}
                    ${isAnimating ? 'pointer-events-none' : ''}
                    active:scale-95
                  `}
                                    style={{ fontSize: '1.5rem' }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl" />
                                    <div className="absolute inset-0 bg-black/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity" />
                                    <span className="relative text-white drop-shadow-2xl font-bold z-10">
                                        {colorConfig.icon}
                                    </span>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Instructions */}
                <div className="bg-black/20 rounded-xl p-4 max-w-md text-center border border-gray-700">
                    <p className="text-sm text-gray-400">
                        Click two adjacent candies to swap them. Match 3 or more of the same type to score points!
                    </p>
                </div>

                {/* Candy Legend */}
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                    {Object.entries(candyColors).map(([type, config]) => (
                        <div key={type} className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2 border border-gray-700 hover:border-gray-500 transition-all hover:scale-105">
                            <div className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center text-white shadow-lg`}>
                                {config.icon}
                            </div>
                            <span className="text-xs text-gray-400 capitalize font-medium">{type}</span>
                        </div>
                    ))}
                </div>
            </div>
        </GamePlayContainer>
    );
});