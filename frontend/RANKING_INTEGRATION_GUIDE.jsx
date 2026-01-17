// ============================================
// HƯỚNG DẪN TÍCH HỢP RANKING API VÀO RANKINGPAGE
// ============================================

import { rankingService } from '@/services/ranking.services';
import { useEffect, useState } from 'react';

export function RankingPageExample() {
    const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
    const [friendsLeaderboard, setFriendsLeaderboard] = useState([]);
    const [personalStats, setPersonalStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllRankings = async () => {
            try {
                setLoading(true);
                
                // Fetch Global Overall Ranking
                const global = await rankingService.getGlobalOverall();
                setGlobalLeaderboard(global);
                
                // Fetch Friends Overall Ranking (requires auth)
                const friends = await rankingService.getFriendsOverall();
                setFriendsLeaderboard(friends);
                
                // Fetch Personal Stats (requires auth)
                const stats = await rankingService.getPersonalStats();
                setPersonalStats(stats);
                
            } catch (error) {
                console.error("Failed to load rankings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllRankings();
    }, []);

    // ============================================
    // DATA FORMAT EXAMPLES
    // ============================================

    /*
    globalLeaderboard format:
    [
        {
            user_id: "uuid",
            name: "John Doe",
            username: "johndoe",
            avatar: "url-or-null",
            total_score: 12450,  // Tổng điểm tất cả games
            total_games: 156,     // Số games đã chơi
            ranking: 1            // Thứ hạng
        },
        ...
    ]

    friendsLeaderboard format: (giống global)
    
    personalStats format:
    {
        overall: {
            total_games: 156,
            total_wins: 132,
            total_losses: 24,
            total_score: 12450,
            rank: 6,
            bestStreak: 0,
            currentStreak: 0
        },
        byGame: [
            {
                game_id: 1,
                game_name: "Caro",
                played: 45,
                won: 38,
                high_score: 2580
            },
            ...
        ]
    }
    */

    // ============================================
    // MAP DATA TO YOUR EXISTING UI
    // ============================================

    // Map global data to your existing format
    const mappedGlobal = globalLeaderboard.map((player, index) => ({
        rank: player.ranking,
        username: player.name || player.username,
        avatar: player.avatar || player.username?.substring(0, 2).toUpperCase(),
        score: player.total_score,
        games: player.total_games,
        winRate: 0, // Không có trong API
        trend: 'same', // Không có trong API
        change: 0,
        level: Math.floor(player.total_score / 100), // Tính toán đơn giản
        isCurrentUser: false // Set sau khi biết current user
    }));

    // Map friends data tương tự
    const mappedFriends = friendsLeaderboard.map((player) => ({
        rank: player.ranking,
        username: player.name || player.username,
        avatar: player.avatar || player.username?.substring(0, 2).toUpperCase(),
        score: player.total_score,
        games: player.total_games,
        level: Math.floor(player.total_score / 100),
        isCurrentUser: false
    }));

    // Map personal stats
    const mappedPersonalStats = personalStats ? {
        overall: {
            rank: personalStats.overall.rank,
            totalScore: personalStats.overall.total_score,
            totalGames: personalStats.overall.total_games,
            totalWins: personalStats.overall.total_wins,
            totalLosses: personalStats.overall.total_losses,
            winRate: Math.round((personalStats.overall.total_wins / personalStats.overall.total_games) * 100) || 0,
            bestStreak: personalStats.overall.bestStreak,
            currentStreak: personalStats.overall.currentStreak
        },
        byGame: personalStats.byGame.map(game => ({
            game: game.game_name,
            icon: null, // Set icon based on game_name
            played: game.played,
            won: game.won,
            winRate: Math.round((game.won / game.played) * 100) || 0,
            highScore: game.high_score
        }))
    } : null;

    // ============================================
    // FETCH BY SPECIFIC GAME (OPTIONAL)
    // ============================================

    const fetchGameSpecificRanking = async (gameId) => {
        try {
            const global = await rankingService.getGlobalByGame(gameId);
            const friends = await rankingService.getFriendsByGame(gameId);
            const personal = await rankingService.getPersonalByGame(gameId);
            
            // Use these for game-specific tabs
            console.log({ global, friends, personal });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            {loading ? (
                <div>Loading rankings...</div>
            ) : (
                <div>
                    <h2>Global Leaderboard</h2>
                    <pre>{JSON.stringify(mappedGlobal, null, 2)}</pre>
                    
                    <h2>Friends Leaderboard</h2>
                    <pre>{JSON.stringify(mappedFriends, null, 2)}</pre>
                    
                    <h2>Personal Stats</h2>
                    <pre>{JSON.stringify(mappedPersonalStats, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
