/**
 * AI Engine for Caro Game (Gomoku)
 * Implements Minimax algorithm with Alpha-Beta pruning
 * Supports multiple difficulty levels
 */

// Difficulty levels
export const AI_DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
    EXPERT: 'expert'
};

// Evaluation scores
const SCORES = {
    FIVE: 100000,      // Win
    OPEN_FOUR: 10000,  // Four in a row with both ends open
    FOUR: 1000,        // Four in a row
    OPEN_THREE: 1000,  // Three in a row with both ends open
    THREE: 100,        // Three in a row
    OPEN_TWO: 100,     // Two in a row with both ends open
    TWO: 10,           // Two in a row
    ONE: 1             // Single piece
};

// Directions for checking patterns
const DIRECTIONS = [
    [0, 1],   // Horizontal
    [1, 0],   // Vertical
    [1, 1],   // Diagonal \
    [1, -1]   // Diagonal /
];

/**
 * Caro AI Class
 */
export class CaroAI {
    constructor(boardSize = 15, winCondition = 5, difficulty = AI_DIFFICULTY.MEDIUM) {
        this.boardSize = boardSize;
        this.winCondition = winCondition;
        this.difficulty = difficulty;
        this.maxDepth = this.getMaxDepth(difficulty);
    }

    getMaxDepth(difficulty) {
        switch (difficulty) {
            case AI_DIFFICULTY.EASY:
                return 1;
            case AI_DIFFICULTY.MEDIUM:
                return 2;
            case AI_DIFFICULTY.HARD:
                return 3;
            case AI_DIFFICULTY.EXPERT:
                return 4;
            default:
                return 2;
        }
    }

    /**
     * Get best move for AI
     */
    getBestMove(board, aiPlayer) {
        const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';

        // Easy mode: Random move with some strategy
        if (this.difficulty === AI_DIFFICULTY.EASY) {
            return this.getEasyMove(board, aiPlayer, humanPlayer);
        }

        // For other difficulties, use Minimax
        const availableMoves = this.getAvailableMoves(board);

        if (availableMoves.length === 0) return null;
        if (availableMoves.length === 1) return availableMoves[0];

        // Check for immediate win
        const winMove = this.findWinningMove(board, aiPlayer);
        if (winMove) return winMove;

        // Check for blocking opponent's win
        const blockMove = this.findWinningMove(board, humanPlayer);
        if (blockMove) return blockMove;

        // Use Minimax for best move
        let bestScore = -Infinity;
        let bestMove = availableMoves[0];

        for (const move of availableMoves) {
            board[move.row][move.col] = aiPlayer;
            const score = this.minimax(board, 0, false, aiPlayer, humanPlayer, -Infinity, Infinity);
            board[move.row][move.col] = null;

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    /**
     * Easy mode: Mix of random and strategic moves
     */
    getEasyMove(board, aiPlayer, humanPlayer) {
        const availableMoves = this.getAvailableMoves(board);

        // 30% chance to make a smart move
        if (Math.random() < 0.3) {
            // Check for win
            const winMove = this.findWinningMove(board, aiPlayer);
            if (winMove) return winMove;

            // Check for block
            const blockMove = this.findWinningMove(board, humanPlayer);
            if (blockMove && Math.random() < 0.7) return blockMove;
        }

        // Otherwise, random move
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    /**
     * Minimax algorithm with Alpha-Beta pruning
     */
    minimax(board, depth, isMaximizing, aiPlayer, humanPlayer, alpha, beta) {
        // Check terminal states
        if (this.checkWin(board, aiPlayer)) return 10000 - depth;
        if (this.checkWin(board, humanPlayer)) return -10000 + depth;
        if (depth >= this.maxDepth) return this.evaluateBoard(board, aiPlayer, humanPlayer);

        const availableMoves = this.getAvailableMoves(board);
        if (availableMoves.length === 0) return 0;

        if (isMaximizing) {
            let maxScore = -Infinity;
            for (const move of availableMoves) {
                board[move.row][move.col] = aiPlayer;
                const score = this.minimax(board, depth + 1, false, aiPlayer, humanPlayer, alpha, beta);
                board[move.row][move.col] = null;
                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break; // Alpha-Beta pruning
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for (const move of availableMoves) {
                board[move.row][move.col] = humanPlayer;
                const score = this.minimax(board, depth + 1, true, aiPlayer, humanPlayer, alpha, beta);
                board[move.row][move.col] = null;
                minScore = Math.min(minScore, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) break; // Alpha-Beta pruning
            }
            return minScore;
        }
    }

    /**
     * Evaluate board position
     */
    evaluateBoard(board, aiPlayer, humanPlayer) {
        let score = 0;

        // Evaluate all positions
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (board[row][col] === aiPlayer) {
                    score += this.evaluatePosition(board, row, col, aiPlayer);
                } else if (board[row][col] === humanPlayer) {
                    score -= this.evaluatePosition(board, row, col, humanPlayer);
                }
            }
        }

        return score;
    }

    /**
     * Evaluate a specific position
     */
    evaluatePosition(board, row, col, player) {
        let score = 0;

        for (const [dx, dy] of DIRECTIONS) {
            const pattern = this.getPattern(board, row, col, dx, dy, player);
            score += this.scorePattern(pattern);
        }

        return score;
    }

    /**
     * Get pattern in a direction
     */
    getPattern(board, row, col, dx, dy, player) {
        let count = 1;
        let openEnds = 0;

        // Check forward
        let r = row + dx;
        let c = col + dy;
        while (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
            if (board[r][c] === player) {
                count++;
            } else if (board[r][c] === null) {
                openEnds++;
                break;
            } else {
                break;
            }
            r += dx;
            c += dy;
        }

        // Check backward
        r = row - dx;
        c = col - dy;
        while (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
            if (board[r][c] === player) {
                count++;
            } else if (board[r][c] === null) {
                openEnds++;
                break;
            } else {
                break;
            }
            r -= dx;
            c -= dy;
        }

        return { count, openEnds };
    }

    /**
     * Score a pattern
     */
    scorePattern({ count, openEnds }) {
        if (count >= this.winCondition) return SCORES.FIVE;
        if (count === 4) return openEnds === 2 ? SCORES.OPEN_FOUR : SCORES.FOUR;
        if (count === 3) return openEnds === 2 ? SCORES.OPEN_THREE : SCORES.THREE;
        if (count === 2) return openEnds === 2 ? SCORES.OPEN_TWO : SCORES.TWO;
        return SCORES.ONE;
    }

    /**
     * Find winning move
     */
    findWinningMove(board, player) {
        const availableMoves = this.getAvailableMoves(board);

        for (const move of availableMoves) {
            board[move.row][move.col] = player;
            const isWin = this.checkWin(board, player);
            board[move.row][move.col] = null;

            if (isWin) return move;
        }

        return null;
    }

    /**
     * Check if player has won
     */
    checkWin(board, player) {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (board[row][col] === player) {
                    for (const [dx, dy] of DIRECTIONS) {
                        if (this.checkDirection(board, row, col, dx, dy, player)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    /**
     * Check direction for win
     */
    checkDirection(board, row, col, dx, dy, player) {
        let count = 0;
        let r = row;
        let c = col;

        while (
            r >= 0 && r < this.boardSize &&
            c >= 0 && c < this.boardSize &&
            board[r][c] === player
        ) {
            count++;
            if (count >= this.winCondition) return true;
            r += dx;
            c += dy;
        }

        return false;
    }

    /**
     * Get available moves (with optimization)
     */
    getAvailableMoves(board) {
        const moves = [];
        const hasMove = board.some(row => row.some(cell => cell !== null));

        if (!hasMove) {
            // First move: center of board
            const center = Math.floor(this.boardSize / 2);
            return [{ row: center, col: center }];
        }

        // Get moves near existing pieces (within 2 cells)
        const checked = new Set();

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (board[row][col] !== null) {
                    // Check surrounding cells
                    for (let dr = -2; dr <= 2; dr++) {
                        for (let dc = -2; dc <= 2; dc++) {
                            const r = row + dr;
                            const c = col + dc;
                            const key = `${r},${c}`;

                            if (
                                r >= 0 && r < this.boardSize &&
                                c >= 0 && c < this.boardSize &&
                                board[r][c] === null &&
                                !checked.has(key)
                            ) {
                                moves.push({ row: r, col: c });
                                checked.add(key);
                            }
                        }
                    }
                }
            }
        }

        return moves;
    }
}
