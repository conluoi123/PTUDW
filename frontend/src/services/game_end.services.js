import GameSessionService from "./gameSession.service.js";

// Score calculation function (modeled after Caro4.jsx)
const calculateScore = (result, durationInSeconds, moveCount, difficulty) => {
  let baseScore = 0;
  const speedBonus = Math.max(0, 500 - durationInSeconds * 5);

  const difficultyMultipliers = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
  };
  const difficultyMultiplier = difficultyMultipliers[difficulty] || 1.0;

  if (result === "win") baseScore = 800;
  else if (result === "lose") baseScore = 0;
  else if (result === "draw") baseScore = 500;

  // Tiny move bonus so longer games don't feel strictly worse
  const moveBonus = Math.min(300, (moveCount || 0) * 3);

  const totalScore = Math.round((baseScore + speedBonus + moveBonus) * difficultyMultiplier);
  return Math.max(0, totalScore);
};

/**
 * Persist a finished game session.
 *
 * Supports:
 * - `Caro5.jsx`-style calls: { user, gameId, startTime, moveCount, difficulty, winner, playerSymbol }
 * - `GamePage.jsx`-style calls: { user, gameId, score, result, duration }
 */
export const handleGameEnd = async (params = {}) => {
  const {
    user,
    gameId,
    startTime,
    moveCount = 0,
    difficulty,
    winner,
    playerSymbol = "X",
    // Optional overrides:
    score: scoreOverride,
    result: resultOverride,
    duration: durationOverride,
  } = params;

  // Only save if a user is logged in and we know which game this is.
  if (!user || !gameId) return { success: false, error: "NOT_AUTHENTICATED_OR_MISSING_GAME" };

  const endTime = new Date();
  const durationInSeconds =
    typeof durationOverride === "number"
      ? Math.max(0, Math.round(durationOverride))
      : startTime
      ? Math.max(0, Math.round((endTime - startTime) / 1000))
      : 0;

  let result = resultOverride;
  if (!result) {
    if (!winner || winner === "draw") result = "draw";
    else if (winner === playerSymbol || winner === "WIN") result = "win";
    else result = "lose";
  }

  const score =
    typeof scoreOverride === "number"
      ? Math.max(0, Math.round(scoreOverride))
      : calculateScore(result, durationInSeconds, moveCount, difficulty);

  const sessionData = {
    game_id: gameId,
    score,
    result,
    duration: durationInSeconds,
  };

  try {
    const data = await GameSessionService.create(sessionData);
    return { success: true, score, data };
  } catch (error) {
    console.error("Failed to save game session:", error);
    return { success: false, error };
  }
};