import { Play, Grid3x3, Grid2x2, X, Candy, Worm, Brain, Palette } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

export const GamesPage = memo(function GamesPage({ onPlayGame }) {
    const games = useMemo(() => [
        {
            id: 'caro5',
            name: 'Caro (5 in a row)',
            description: 'Classic Gomoku - Connect 5 pieces in a row to win',
            icon: Grid3x3,
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-500',
            borderColor: 'border-blue-500/20',
            hoverBorder: 'hover:border-blue-500/50'
        },
        {
            id: 'caro4',
            name: 'Caro (4 in a row)',
            description: 'Connect 4 pieces in a row on smaller board',
            icon: Grid2x2,
            bgColor: 'bg-purple-500/10',
            iconColor: 'text-purple-500',
            borderColor: 'border-purple-500/20',
            hoverBorder: 'hover:border-purple-500/50'
        },
        {
            id: 'tictactoe',
            name: 'Tic Tac Toe',
            description: 'Classic 3x3 grid game - Get three in a row',
            icon: X,
            bgColor: 'bg-green-500/10',
            iconColor: 'text-green-500',
            borderColor: 'border-green-500/20',
            hoverBorder: 'hover:border-green-500/50'
        },
        {
            id: 'candycrush',
            name: 'Candy Crush',
            description: 'Match 3 or more candies to crush them',
            icon: Candy,
            bgColor: 'bg-pink-500/10',
            iconColor: 'text-pink-500',
            borderColor: 'border-pink-500/20',
            hoverBorder: 'hover:border-pink-500/50'
        },
        {
            id: 'snake',
            name: 'Snake Game',
            description: 'Control the snake and collect food to grow',
            icon: Worm,
            bgColor: 'bg-emerald-500/10',
            iconColor: 'text-emerald-500',
            borderColor: 'border-emerald-500/20',
            hoverBorder: 'hover:border-emerald-500/50'
        },
        {
            id: 'memory',
            name: 'Memory Card Game',
            description: 'Match all pairs of cards before time runs out',
            icon: Brain,
            bgColor: 'bg-orange-500/10',
            iconColor: 'text-orange-500',
            borderColor: 'border-orange-500/20',
            hoverBorder: 'hover:border-orange-500/50'
        },
        {
            id: 'drawing',
            name: 'Drawing Board',
            description: 'Express your creativity with digital drawing tools',
            icon: Palette,
            bgColor: 'bg-indigo-500/10',
            iconColor: 'text-indigo-500',
            borderColor: 'border-indigo-500/20',
            hoverBorder: 'hover:border-indigo-500/50'
        }
    ], []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold">Games</h1>
                <p className="text-base sm:text-lg text-muted-foreground">Choose your favorite game and start playing</p>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {games.map((game) => {
                    const IconComponent = game.icon;
                    return (
                        <Card
                            key={game.id}
                            className={`group border-2 ${game.borderColor} ${game.hoverBorder} overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-100`}
                        >
                            {/* Game Icon */}
                            <div className={`h-36 sm:h-40 ${game.bgColor} flex items-center justify-center relative`}>
                                <div className="relative transform group-hover:scale-110 transition-transform duration-300">
                                    <IconComponent className={`w-16 h-16 sm:w-20 sm:h-20 ${game.iconColor}`} strokeWidth={1.5} />
                                </div>
                            </div>

                            {/* Game Info */}
                            <CardContent className="p-5 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold mb-2">{game.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4 min-h-[40px] line-clamp-2">
                                    {game.description}
                                </p>

                                {/* Play Button */}
                                <Button
                                    onClick={() => onPlayGame?.(game.id)}
                                    className="w-full py-2.5 sm:py-3 font-semibold shadow-md hover:shadow-lg transition-all"
                                    size="lg"
                                >
                                    <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" />
                                    Play Now
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
});