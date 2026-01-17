import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal, Award, Target, Dices, Circle, Candy, Worm } from 'lucide-react';
import { useState, useContext, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';
import { Badge } from '@mui/material';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { rankingService } from '@/services/ranking.services';
import { AuthContext } from '@/contexts/AuthContext';

export function RankingPage() {
    const [activeTab, setActiveTab] = useState('global');
    const { user } = useContext(AuthContext);
    const [globalRanking, setGlobalRanking] = useState([]);
    const [friendsRanking, setFriendsRanking] = useState([]);
    const [personalStatsData, setPersonalStatsData] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchRankings = async () => {
            try {
                setIsLoading(true);
                const global = await rankingService.getGlobalOverall();
                setGlobalRanking(global || []);

                // lấy ranking bạn bè và cá nhân 
                if (user) {
                    try {
                        // bạn bè
                        const friends = await rankingService.getFriendsOverall();
                        setFriendsRanking(friends || []);
                        // cá nhân 
                        const stats = await rankingService.getPersonalStats();
                        setPersonalStatsData(stats || {});

                    } catch (err) {
                        console.error("Lỗi lấy dữ liệu bạn bè + cá nhân", err);
                    }
                }
            } catch (err) {
                console.error("Lỗi lấy dữ liệu ở FE ", err);

            } finally {
                setIsLoading(false);
            }
        }
        fetchRankings();
    }, [user]);

    console.log("personnal", personalStatsData);
    console.log("globalRanking", globalRanking);
    console.log("friendsRanking", friendsRanking)

    // Helper: Map API data to UI format
    const mapRankingData = (apiData, currentUserId) => {
        return apiData.map((player) => ({
            rank: player.ranking,
            username: player.name || player.username,
            avatar: player.username?.substring(0, 2).toUpperCase() || 'U',
            score: player.total_score || player.max_score,
            games: player.total_games,
            winRate: 0, // Không có từ API, để 0 hoặc tính toán
            trend: 'same', // Không có từ API
            change: 0,
            level: Math.floor((player.total_score || player.max_score || 0) / 100),
            isCurrentUser: player.user_id === currentUserId
        }));
    };

    // Map personal stats
    const mapPersonalStats = (statsData) => {
        if (!statsData) return getMockPersonalStats(); // Fallback to mock data

        return {
            overall: {
                rank: statsData.overall.rank || 0,
                totalScore: parseInt(statsData.overall.total_score) || 0,
                totalGames: parseInt(statsData.overall.total_games) || 0,
                totalWins: parseInt(statsData.overall.total_wins) || 0,
                totalLosses: parseInt(statsData.overall.total_losses) || 0,
                winRate: Math.round((parseInt(statsData.overall.total_wins) / parseInt(statsData.overall.total_games) * 100)) || 0,
                bestStreak: statsData.overall.bestStreak || 0,
                currentStreak: statsData.overall.currentStreak || 0
            },
            byGame: statsData.byGame?.map(game => ({
                game: game.game_name,
                icon: getGameIcon(game.game_name), // Helper function bên dưới
                played: parseInt(game.played) || 0,
                won: parseInt(game.won) || 0,
                winRate: Math.round((parseInt(game.won) / parseInt(game.played) * 100)) || 0,
                highScore: parseInt(game.high_score) || 0
            })) || []
        };
    };

    // Helper: Get icon based on game name
    const getGameIcon = (gameName) => {
        const name = gameName?.toLowerCase() || '';
        if (name.includes('caro') && name.includes('5')) return Target;
        if (name.includes('caro')) return Dices;
        if (name.includes('tic') || name.includes('tac')) return Circle;
        if (name.includes('candy')) return Candy;
        if (name.includes('snake')) return Worm;
        return Target; // Default icon
    };

    // Helper: Mock personal stats when no data
    const getMockPersonalStats = () => ({
        overall: {
            rank: 0,
            totalScore: 0,
            totalGames: 0,
            totalWins: 0,
            totalLosses: 0,
            winRate: 0,
            bestStreak: 0,
            currentStreak: 0
        },
        byGame: []
    });

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-4 h-4 text-green-500" />;
            case 'down':
                return <TrendingDown className="w-4 h-4 text-destructive" />;
            default:
                return <Minus className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const getRankBadge = (rank) => {
        if (rank === 1) {
            return (
                <div className="w-12 h-12 rounded-xl bg-yellow-500 flex items-center justify-center shadow-lg">
                    <Crown className="w-6 h-6 text-white" />
                </div>
            );
        }
        if (rank === 2) {
            return (
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shadow-lg">
                    <Trophy className="w-6 h-6 text-muted-foreground" />
                </div>
            );
        }
        if (rank === 3) {
            return (
                <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg">
                    <Medal className="w-6 h-6 text-white" />
                </div>
            );
        }
        return (
            <div className="w-12 h-12 rounded-xl bg-muted border-2 border-border flex items-center justify-center font-semibold">
                #{rank}
            </div>
        );
    };

    const globalLeaderboard = isLoading ? [] : (globalRanking.length > 0 ? mapRankingData(globalRanking, user?.id) : []);
    const friendsLeaderboard = isLoading ? [] : (friendsRanking.length > 0 ? mapRankingData(friendsRanking, user?.id) : []);
    const personalStats = isLoading ? null : (personalStatsData?.overall ? mapPersonalStats(personalStatsData) : getMockPersonalStats());

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="mb-2">Leaderboard</h1>
                <p className="text-muted-foreground">Track rankings across the platform</p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
                <TabsList>
                    <TabsTrigger value="global">
                        <Trophy className="w-4 h-4 mr-2" />
                        Global
                    </TabsTrigger>
                    <TabsTrigger value="friends">
                        <Award className="w-4 h-4 mr-2" />
                        Friends
                    </TabsTrigger>
                    <TabsTrigger value="personal">
                        <Crown className="w-4 h-4 mr-2" />
                        Personal Stats
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="global" className="space-y-6">
                    {/* Top 3 Podium */}
                    {globalLeaderboard.length >= 3 && (
                    <div className="grid grid-cols-3 gap-4">
                        {/* 2nd Place */}
                        <div className="flex flex-col items-center pt-12">
                            <Avatar className="w-20 h-20 mb-3 shadow-lg">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                                    {globalLeaderboard[1].avatar}
                                </AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-semibold truncate w-full text-center mb-1">
                                {globalLeaderboard[1].username}
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                                {globalLeaderboard[1].score.toLocaleString()}
                            </p>
                            <Card className="w-full h-32 rounded-t-2xl bg-muted/50">
                                <CardContent className="flex flex-col items-center justify-start pt-4 h-full">
                                    <Trophy className="w-8 h-8 text-muted-foreground mb-2" />
                                    <span className="text-3xl font-bold">#2</span>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 1st Place */}
                        <div className="flex flex-col items-center">
                            <Crown className="w-10 h-10 text-yellow-500 mb-2 animate-pulse" />
                            <Avatar className="w-24 h-24 mb-3 shadow-2xl ring-4 ring-yellow-500/30">
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                                    {globalLeaderboard[0].avatar}
                                </AvatarFallback>
                            </Avatar>
                            <p className="font-semibold truncate w-full text-center mb-1">
                                {globalLeaderboard[0].username}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                                {globalLeaderboard[0].score.toLocaleString()}
                            </p>
                            <Card className="w-full h-40 rounded-t-2xl bg-yellow-500 text-white border-yellow-400">
                                <CardContent className="flex flex-col items-center justify-start pt-4 h-full">
                                    <Crown className="w-10 h-10 mb-2" />
                                    <span className="text-4xl font-bold">#1</span>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 3rd Place */}
                        <div className="flex flex-col items-center pt-16">
                            <Avatar className="w-20 h-20 mb-3 shadow-lg">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                                    {globalLeaderboard[2].avatar}
                                </AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-semibold truncate w-full text-center mb-1">
                                {globalLeaderboard[2].username}
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                                {globalLeaderboard[2].score.toLocaleString()}
                            </p>
                            <Card className="w-full h-28 rounded-t-2xl bg-orange-500 text-white border-orange-400">
                                <CardContent className="flex flex-col items-center justify-start pt-4 h-full">
                                    <Medal className="w-8 h-8 mb-2" />
                                    <span className="text-3xl font-bold">#3</span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    )}

                    {/* Full Leaderboard Table */}
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-accent border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
                                            Rank
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
                                            Player
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
                                            Score
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
                                            Games
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
                                            Win Rate
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
                                            Trend
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {globalLeaderboard.map((player) => (
                                        <tr
                                            key={player.rank}
                                            className={`transition-colors duration-200 ${player.isCurrentUser
                                                ? 'bg-primary/10 border-l-4 border-primary'
                                                : 'hover:bg-accent/50'
                                                }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getRankBadge(player.rank)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-12 h-12">
                                                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                                            {player.avatar}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold">
                                                            {player.username}
                                                            {player.isCurrentUser && (
                                                                <Badge variant="secondary" className="ml-2">You</Badge>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">Level {player.level}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-lg font-semibold">{player.score.toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                                {player.games}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Progress value={player.winRate} className="w-24 h-2" />
                                                    <span className="font-semibold">{player.winRate}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {getTrendIcon(player.trend)}
                                                    {player.change !== 0 && (
                                                        <span className={`text-sm font-semibold ${player.trend === 'up' ? 'text-green-500' : 'text-destructive'
                                                            }`}>
                                                            {Math.abs(player.change)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="friends" className="space-y-6">
                    {/* Top 3 Podium */}
                    {friendsLeaderboard.length >= 3 && (
                    <div className="grid grid-cols-3 gap-4">
                        {/* 2nd Place */}
                        <div className="flex flex-col items-center pt-12">
                            <Avatar className="w-20 h-20 mb-3 shadow-lg">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                                    {friendsLeaderboard[1].avatar}
                                </AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-semibold truncate w-full text-center mb-1">
                                {friendsLeaderboard[1].username}
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                                {friendsLeaderboard[1].score.toLocaleString()}
                            </p>
                            <Card className="w-full h-32 rounded-t-2xl bg-muted/50">
                                <CardContent className="flex flex-col items-center justify-start pt-4 h-full">
                                    <Trophy className="w-8 h-8 text-muted-foreground mb-2" />
                                    <span className="text-3xl font-bold">#2</span>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 1st Place */}
                        <div className="flex flex-col items-center">
                            <Crown className="w-10 h-10 text-yellow-500 mb-2 animate-pulse" />
                            <Avatar className="w-24 h-24 mb-3 shadow-2xl ring-4 ring-yellow-500/30">
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                                    {friendsLeaderboard[0].avatar}
                                </AvatarFallback>
                            </Avatar>
                            <p className="font-semibold truncate w-full text-center mb-1">
                                {friendsLeaderboard[0].username}
                            </p>
                            <p className="text-sm text-muted-foreground mb-2">
                                {friendsLeaderboard[0].score.toLocaleString()}
                            </p>
                            <Card className="w-full h-40 rounded-t-2xl bg-yellow-500 text-white border-yellow-400">
                                <CardContent className="flex flex-col items-center justify-start pt-4 h-full">
                                    <Crown className="w-10 h-10 mb-2" />
                                    <span className="text-4xl font-bold">#1</span>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 3rd Place */}
                        <div className="flex flex-col items-center pt-16">
                            <Avatar className="w-20 h-20 mb-3 shadow-lg">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                                    {friendsLeaderboard[2].avatar}
                                </AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-semibold truncate w-full text-center mb-1">
                                {friendsLeaderboard[2].username}
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                                {friendsLeaderboard[2].score.toLocaleString()}
                            </p>
                            <Card className="w-full h-28 rounded-t-2xl bg-orange-500 text-white border-orange-400">
                                <CardContent className="flex flex-col items-center justify-start pt-4 h-full">
                                    <Medal className="w-8 h-8 mb-2" />
                                    <span className="text-3xl font-bold">#3</span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    )}

                    {/* Full Leaderboard Table */}
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-accent border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
                                            Rank
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
                                            Player
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
                                            Score
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
                                            Games
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs text-muted-foreground uppercase tracking-wider">
                                            Win Rate
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {friendsLeaderboard.map((player) => (
                                        <tr
                                            key={player.rank}
                                            className={`transition-colors duration-200 ${player.isCurrentUser
                                                ? 'bg-primary/10 border-l-4 border-primary'
                                                : 'hover:bg-accent/50'
                                                }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getRankBadge(player.rank)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-12 h-12">
                                                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                                            {player.avatar}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold">
                                                            {player.username}
                                                            {player.isCurrentUser && (
                                                                <Badge variant="secondary" className="ml-2">You</Badge>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">Level {player.level}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-lg font-semibold">{player.score.toLocaleString()}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                                                {player.games}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Progress value={player.winRate} className="w-24 h-2" />
                                                    <span className="font-semibold">{player.winRate}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="personal" className="space-y-6">
                    {!personalStats || !personalStats.overall ? (
                        <div className="text-center py-12">
                            <Crown className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground">No personal stats available. Play some games first!</p>
                        </div>
                    ) : (
                        <>
                    {/* Overall Stats */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="mb-6 flex items-center gap-2 font-semibold">
                                <Trophy className="w-5 h-5 text-primary" />
                                Overall Performance
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="bg-accent/50">
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Global Rank</p>
                                        <p className="text-3xl font-bold">#{personalStats?.overall?.rank || 0}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-accent/50">
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Total Score</p>
                                        <p className="text-3xl font-bold">{(personalStats?.overall?.totalScore || 0).toLocaleString()}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-accent/50">
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                                        <p className="text-3xl font-bold">{personalStats?.overall?.winRate || 0}%</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-accent/50">
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Best Streak</p>
                                        <p className="text-3xl font-bold">{personalStats?.overall?.bestStreak || 0}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Total Games</p>
                                        <p className="text-2xl font-bold">{personalStats?.overall?.totalGames || 0}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Wins</p>
                                        <p className="text-2xl font-bold text-green-500">{personalStats?.overall?.totalWins || 0}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Losses</p>
                                        <p className="text-2xl font-bold text-destructive">{personalStats?.overall?.totalLosses || 0}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Current Streak</p>
                                        <p className="text-2xl font-bold text-orange-500">{personalStats?.overall?.currentStreak || 0} 🔥</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>

                    {/* By Game Stats */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="mb-6 flex items-center gap-2 font-semibold">
                                <Award className="w-5 h-5 text-primary" />
                                Performance by Game
                            </h3>
                            <div className="space-y-4">
                                {(personalStats?.byGame || []).length > 0 ? (
                                    personalStats.byGame.map((game, index) => (
                                    <Card
                                        key={index}
                                        className="hover:shadow-lg transition-all"
                                    >
                                        <CardContent className="p-5">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                                                        <game.icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{game.game}</p>
                                                        <p className="text-xs text-muted-foreground">{game.played} games played</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold">{game.winRate}%</p>
                                                    <p className="text-xs text-muted-foreground">Win Rate</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Wins</p>
                                                    <p className="text-lg font-semibold text-green-500">{game.won}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Losses</p>
                                                    <p className="text-lg font-semibold text-destructive">{game.played - game.won}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">High Score</p>
                                                    <p className="text-lg font-semibold text-yellow-500">{game.highScore}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>No games played yet</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}