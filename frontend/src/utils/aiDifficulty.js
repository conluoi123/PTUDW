/**
 * AI Difficulty Levels for Caro Games
 * Supports: Caro 5, Caro 4, Tic Tac Toe
 */

// ============================================
// EASY AI - Random moves with basic blocking
// ============================================
export const easyAI = (board, boardSize, streak, aiSymbol, playerSymbol) => {
    const emptyCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) emptyCells.push(i);
    }

    if (emptyCells.length === 0) return null;

    // 30% chance to block immediate winning move
    if (Math.random() < 0.3) {
        const blockMove = findImmediateWin(board, boardSize, streak, playerSymbol);
        if (blockMove !== null) return blockMove;
    }

    // Otherwise, random move
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

// ============================================
// MEDIUM AI - Current logic (block + attack)
// ============================================
export const mediumAI = (board, boardSize, streak, aiSymbol, playerSymbol) => {
    // 1. Check if AI can win
    const winMove = findImmediateWin(board, boardSize, streak, aiSymbol);
    if (winMove !== null) return winMove;

    // 2. Block player's winning move
    const blockMove = findImmediateWin(board, boardSize, streak, playerSymbol);
    if (blockMove !== null) return blockMove;

    // 3. Strategic positioning
    return findBestMove(board, boardSize, streak, aiSymbol, playerSymbol);
};

// ============================================
// HARD AI - Minimax with alpha-beta pruning
// ============================================
export const hardAI = (board, boardSize, streak, aiSymbol, playerSymbol) => {
    // 1. Check if AI can win immediately
    const winMove = findImmediateWin(board, boardSize, streak, aiSymbol);
    if (winMove !== null) return winMove;

    // 2. Block player's winning move
    const blockMove = findImmediateWin(board, boardSize, streak, playerSymbol);
    if (blockMove !== null) return blockMove;

    // 3. Use minimax for strategic play (limited depth for performance)
    const depth = boardSize <= 3 ? 6 : 3; // Deeper for smaller boards
    return minimaxMove(board, boardSize, streak, aiSymbol, playerSymbol, depth);
};

// ============================================
// HELPER: Find immediate winning move
// ============================================
function findImmediateWin(board, boardSize, streak, symbol) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = symbol;
            if (checkWinFromMove(board, boardSize, streak, i, symbol)) {
                board[i] = null;
                return i;
            }
            board[i] = null;
        }
    }
    return null;
}

// ============================================
// HELPER: Check win from specific move
// ============================================
function checkWinFromMove(board, boardSize, streak, index, symbol) {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    // Check all 4 directions
    const directions = [
        [0, 1],   // Horizontal
        [1, 0],   // Vertical
        [1, 1],   // Diagonal \
        [1, -1],  // Diagonal /
    ];

    for (const [dr, dc] of directions) {
        let count = 1;

        // Check forward
        for (let i = 1; i < streak; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r < 0 || r >= boardSize || c < 0 || c >= boardSize) break;
            if (board[r * boardSize + c] !== symbol) break;
            count++;
        }

        // Check backward
        for (let i = 1; i < streak; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (r < 0 || r >= boardSize || c < 0 || c >= boardSize) break;
            if (board[r * boardSize + c] !== symbol) break;
            count++;
        }

        if (count >= streak) return true;
    }

    return false;
}

// ============================================
// HELPER: Find best strategic move (Medium AI)
// ============================================
function findBestMove(board, boardSize, streak, aiSymbol, playerSymbol) {
    const emptyCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) emptyCells.push(i);
    }

    if (emptyCells.length === 0) return null;

    // Score each empty cell
    let bestScore = -Infinity;
    let bestMove = null;

    for (const cell of emptyCells) {
        const score = evaluateMove(board, boardSize, streak, cell, aiSymbol, playerSymbol);
        if (score > bestScore) {
            bestScore = score;
            bestMove = cell;
        }
    }

    return bestMove || emptyCells[0];
}

// ============================================
// HELPER: Evaluate move quality
// ============================================
function evaluateMove(board, boardSize, streak, index, aiSymbol, playerSymbol) {
    let score = 0;
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    // Prefer center positions
    const centerRow = Math.floor(boardSize / 2);
    const centerCol = Math.floor(boardSize / 2);
    const distanceFromCenter = Math.abs(row - centerRow) + Math.abs(col - centerCol);
    score += (boardSize - distanceFromCenter) * 2;

    // Check potential lines
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

    for (const [dr, dc] of directions) {
        let aiCount = 0;
        let playerCount = 0;
        let empty = 0;

        // Check line in both directions
        for (let i = -(streak - 1); i < streak; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r < 0 || r >= boardSize || c < 0 || c >= boardSize) continue;

            const cellIndex = r * boardSize + c;
            if (cellIndex === index) continue;

            if (board[cellIndex] === aiSymbol) aiCount++;
            else if (board[cellIndex] === playerSymbol) playerCount++;
            else empty++;
        }

        // Score based on potential
        if (playerCount === 0) {
            score += aiCount * aiCount * 10;
        }
        if (aiCount === 0) {
            score += playerCount * playerCount * 5; // Block potential
        }
    }

    return score;
}

// ============================================
// MINIMAX ALGORITHM (Hard AI)
// ============================================
function minimaxMove(board, boardSize, streak, aiSymbol, playerSymbol, maxDepth) {
    const emptyCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) emptyCells.push(i);
    }

    if (emptyCells.length === 0) return null;

    // Limit search space for performance
    const cellsToEvaluate = emptyCells.length > 15
        ? getStrategicCells(board, boardSize, emptyCells, 15)
        : emptyCells;

    let bestScore = -Infinity;
    let bestMove = null;

    for (const cell of cellsToEvaluate) {
        board[cell] = aiSymbol;
        const score = minimax(board, boardSize, streak, aiSymbol, playerSymbol, 0, maxDepth, false, -Infinity, Infinity);
        board[cell] = null;

        if (score > bestScore) {
            bestScore = score;
            bestMove = cell;
        }
    }

    return bestMove || emptyCells[0];
}

// ============================================
// MINIMAX with Alpha-Beta Pruning
// ============================================
// ============================================
// MINIMAX with Alpha-Beta Pruning (Optimized)
// ============================================
function minimax(board, boardSize, streak, aiSymbol, playerSymbol, depth, maxDepth, isMaximizing, alpha, beta) {
    // Check terminal states
    const aiWin = checkWinner(board, boardSize, streak, aiSymbol);
    const playerWin = checkWinner(board, boardSize, streak, playerSymbol);

    if (aiWin) return 1000 - depth;
    if (playerWin) return -1000 + depth;
    if (depth >= maxDepth || isBoardFull(board)) return evaluateBoard(board, boardSize, streak, aiSymbol, playerSymbol);

    // OPTIMIZATION: Only check cells that are neighbors to existing pieces
    // This reduces the branching factor significantly for large boards like 15x15
    const candidateCells = getNeighborCells(board, boardSize);

    // If no neighbors (empty board), pick center
    if (candidateCells.length === 0) {
        const center = Math.floor((boardSize * boardSize) / 2);
        if (board[center] === null) return 0; // Should be handled by opening move logic
    }

    if (isMaximizing) {
        let maxScore = -Infinity;
        for (const cell of candidateCells) {
            board[cell] = aiSymbol;
            const score = minimax(board, boardSize, streak, aiSymbol, playerSymbol, depth + 1, maxDepth, false, alpha, beta);
            board[cell] = null;
            maxScore = Math.max(maxScore, score);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break; // Pruning
        }
        return maxScore;
    } else {
        let minScore = Infinity;
        for (const cell of candidateCells) {
            board[cell] = playerSymbol;
            const score = minimax(board, boardSize, streak, aiSymbol, playerSymbol, depth + 1, maxDepth, true, alpha, beta);
            board[cell] = null;
            minScore = Math.min(minScore, score);
            beta = Math.min(beta, score);
            if (beta <= alpha) break; // Pruning
        }
        return minScore;
    }
}

// ============================================
// HELPER: Get empty cells adjacent to existing pieces
// ============================================
function getNeighborCells(board, boardSize) {
    const neighbors = new Set();
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (let i = 0; i < board.length; i++) {
        if (board[i] !== null) {
            const r = Math.floor(i / boardSize);
            const c = i % boardSize;

            // Check all 8 directions around this piece
            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;

                if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize) {
                    const neighborIdx = nr * boardSize + nc;
                    if (board[neighborIdx] === null) {
                        neighbors.add(neighborIdx);
                    }
                }
            }
        }
    }
    return Array.from(neighbors);
}

// ============================================
// HELPER: Check if board is full
// ============================================
function isBoardFull(board) {
    return board.every(cell => cell !== null);
}

// ============================================
// HELPER: Check winner
// ============================================
function checkWinner(board, boardSize, streak, symbol) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === symbol && checkWinFromMove(board, boardSize, streak, i, symbol)) {
            return true;
        }
    }
    return false;
}

// ============================================
// HELPER: Evaluate board state
// ============================================
function evaluateBoard(board, boardSize, streak, aiSymbol, playerSymbol) {
    let score = 0;

    // Evaluate all possible lines
    for (let i = 0; i < board.length; i++) {
        if (board[i] !== null) continue;

        const aiScore = evaluateMove(board, boardSize, streak, i, aiSymbol, playerSymbol);
        score += aiScore;
    }

    return score;
}

// ============================================
// HELPER: Get strategic cells for evaluation
// ============================================
function getStrategicCells(board, boardSize, emptyCells, limit) {
    // Score each cell and return top N
    const scored = emptyCells.map(cell => ({
        cell,
        score: evaluateMove(board, boardSize, 5, cell, 'O', 'X')
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(item => item.cell);
}
