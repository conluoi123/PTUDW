import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal, Award, Target, Dices, Circle, Candy, Worm } from 'lucide-react';
import { useState, useContext } from 'react';
import { Card, CardContent } from '@mui/material';
import { Badge } from '@mui/material';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { rankingService } from '@/services/ranking.services';
import {AuthContext} from '@/context/auth.context';

export function RankingPage() {
    const [activeTab, setActiveTab] = useState('global');

   
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
                                        <p className="text-3xl font-bold">#{personalStats.overall.rank}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-accent/50">
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Total Score</p>
                                        <p className="text-3xl font-bold">{personalStats.overall.totalScore.toLocaleString()}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-accent/50">
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                                        <p className="text-3xl font-bold">{personalStats.overall.winRate}%</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-accent/50">
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Best Streak</p>
                                        <p className="text-3xl font-bold">{personalStats.overall.bestStreak}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <Card>
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Total Games</p>
                                        <p className="text-2xl font-bold">{personalStats.overall.totalGames}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Wins</p>
                                        <p className="text-2xl font-bold text-green-500">{personalStats.overall.totalWins}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Losses</p>
                                        <p className="text-2xl font-bold text-destructive">{personalStats.overall.totalLosses}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4">
                                        <p className="text-xs text-muted-foreground mb-1">Current Streak</p>
                                        <p className="text-2xl font-bold text-orange-500">{personalStats.overall.currentStreak} 🔥</p>
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
                                {personalStats.byGame.map((game, index) => (
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
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}