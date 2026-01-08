import { Lock, Check, Gamepad2, Zap, Star, Activity, Users, Bug, UserCog, Target } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

export function AchievementsPage() {
    const achievements = [
        {
            id: 1,
            name: 'First Steps',
            description: 'Complete your first game',
            icon: Gamepad2,
            unlocked: true,
            progress: 100,
            points: 50,
            date: '2024-03-15',
            rarity: 'common'
        },
        {
            id: 2,
            name: 'Speed Demon',
            description: 'Complete a game in under 5 minutes',
            icon: Zap,
            unlocked: true,
            progress: 100,
            points: 100,
            date: '2024-03-18',
            rarity: 'rare'
        },
        {
            id: 3,
            name: 'Perfect Score',
            description: 'Achieve 100% accuracy in any game',
            icon: Star,
            unlocked: true,
            progress: 100,
            points: 150,
            date: '2024-03-22',
            rarity: 'epic'
        },
        {
            id: 4,
            name: 'Marathon Runner',
            description: 'Play for 10 hours straight',
            icon: Activity,
            unlocked: true,
            progress: 100,
            points: 200,
            date: '2024-04-01',
            rarity: 'legendary'
        },
        {
            id: 5,
            name: 'Team Player',
            description: 'Win 50 multiplayer matches',
            icon: Users,
            unlocked: false,
            progress: 68,
            points: 150,
            rarity: 'epic'
        },
        {
            id: 6,
            name: 'Bug Exterminator',
            description: 'Find and fix 100 bugs in Debug Master',
            icon: Bug,
            unlocked: false,
            progress: 42,
            points: 250,
            rarity: 'legendary'
        },
        {
            id: 7,
            name: 'Code Ninja',
            description: 'Complete all algorithm challenges',
            icon: UserCog,
            unlocked: false,
            progress: 15,
            points: 300,
            rarity: 'legendary'
        },
        {
            id: 8,
            name: 'Git Master',
            description: 'Complete all Git Quest levels',
            icon: Target,
            unlocked: false,
            progress: 0,
            points: 200,
            rarity: 'epic'
        },
    ];

    const getRarityVariant = (rarity) => {
        switch (rarity) {
            case 'common':
                return 'secondary';
            case 'rare':
            case 'epic':
            case 'legendary':
                return 'default';
            default:
                return 'secondary';
        }
    };

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="mb-2">Achievements</h1>
                <p className="text-muted-foreground">Track your progress and unlock rewards</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                        <p className="text-3xl font-bold mb-1">{unlockedCount}/{achievements.length}</p>
                        <p className="text-sm text-muted-foreground">Unlocked</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                        <p className="text-3xl font-bold mb-1">{totalPoints}</p>
                        <p className="text-sm text-muted-foreground">Total Points</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                        <p className="text-3xl font-bold mb-1">{Math.round((unlockedCount / achievements.length) * 100)}%</p>
                        <p className="text-sm text-muted-foreground">Completion</p>
                    </CardContent>
                </Card>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                    <Card
                        key={achievement.id}
                        className={`transition-all duration-300 ${achievement.unlocked
                            ? 'hover:shadow-lg hover:scale-[1.02]'
                            : 'opacity-75'
                            }`}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className={`
                  w-16 h-16 rounded-xl flex items-center justify-center shadow-lg
                  ${achievement.unlocked
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                    }
                `}>
                                    {achievement.unlocked ? (
                                        <achievement.icon className="w-8 h-8" />
                                    ) : (
                                        <Lock className="w-6 h-6 text-muted-foreground" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-1">
                                        <h3 className="font-semibold">
                                            {achievement.name}
                                        </h3>
                                        {achievement.unlocked && (
                                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-3">
                                        {achievement.description}
                                    </p>

                                    {/* Progress Bar */}
                                    {!achievement.unlocked && (
                                        <div className="mb-3">
                                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                <span>Progress</span>
                                                <span>{achievement.progress}%</span>
                                            </div>
                                            <Progress value={achievement.progress} className="h-2" />
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between text-xs">
                                        <Badge variant={getRarityVariant(achievement.rarity)} className="capitalize">
                                            {achievement.rarity}
                                        </Badge>
                                        <span className="text-muted-foreground font-medium">
                                            {achievement.points} pts
                                        </span>
                                    </div>

                                    {achievement.unlocked && achievement.date && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Unlocked: {achievement.date}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}