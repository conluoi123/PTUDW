import { Activity, Clock, Star, Zap, Trophy } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

export const HomePage = memo(function HomePage() {
    const stats = useMemo(() => [
        { icon: Zap, label: 'Total Score', value: '12,450' },
        { icon: Trophy, label: 'Achievements', value: '28' },
        { icon: Activity, label: 'Games Played', value: '156' },
        { icon: Clock, label: 'Hours Played', value: '342' },
    ], []);

    const recentActivities = useMemo(() => [
        { game: 'Code Warriors', action: 'Completed Level 25', time: '2 hours ago', score: '+500' },
        { game: 'Algorithm Battle', action: 'Won a match', time: '5 hours ago', score: '+350' },
        { game: 'Syntax Quest', action: 'New High Score', time: '1 day ago', score: '+720' },
        { game: 'Debug Master', action: 'Achievement Unlocked', time: '2 days ago', score: '+200' },
    ], []);

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Welcome Section */}
            <Card className="border-0 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                <CardContent className="p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back, John! 👋</h1>
                    <p className="text-primary-foreground/90 text-sm sm:text-base">Ready to level up your coding skills today?</p>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <Card
                            key={index}
                            className="border-border/50 hover:border-primary/30 bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                        >
                            <CardContent className="p-4 sm:p-6">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground mb-3 sm:mb-4 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <p className="text-xl sm:text-2xl font-bold mb-1 text-card-foreground">{stat.value}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <Card className="border-border/50 hover:border-primary/20 bg-card hover:shadow-xl transition-all">
                <div className="p-4 sm:p-6 border-b border-border bg-gradient-to-r from-accent/50 to-accent/30">
                    <h2 className="text-xl sm:text-2xl font-bold text-card-foreground">Recent Activity</h2>
                </div>
                <div className="divide-y divide-border">
                    {recentActivities.map((activity, index) => (
                        <div key={index} className="p-4 sm:p-6 hover:bg-accent/30 transition-all group">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm sm:text-base font-semibold mb-1 truncate text-card-foreground">{activity.game}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">{activity.action}</p>
                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                                <Badge variant="secondary" className="whitespace-nowrap group-hover:scale-110 transition-transform shadow-sm">
                                    {activity.score}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
});