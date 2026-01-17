import { Play, Grid3x3, Grid2x2, X, Candy, Worm, Brain, Palette } from 'lucide-react';
import { memo, useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { LoadingOverlay } from '../ui/LoadingOverlay';
import { GameService } from '@/services/game.services';

export const GamesPage = memo(function GamesPage({ onPlayGame }) {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch games from API
    useEffect(() => {
        const fetchGames = async () => {
            try {
                setIsLoading(true);
                const response = await GameService.getAllGames();
                const gamesData = response?.data || [];
                
                // Map backend data to UI format
                const mappedGames = gamesData.map(game => ({
                    id: game.id,
                    name: game.name,
                    description: game.description || 'Play this exciting game!',
                    ...getGameIconConfig(game.name) // Get icon and colors based on game name
                }));
                
                setGames(mappedGames);
            } catch (error) {
                console.error("Failed to load games:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchGames();
    }, []);

    // Helper function to map game names to icons and colors
    const getGameIconConfig = (gameName) => {
        const name = gameName?.toLowerCase() || '';
        
        if (name.includes('caro') && name.includes('5')) {
            return {
                icon: Grid3x3,
                bgColor: 'bg-blue-500/10',
                iconColor: 'text-blue-500',
                borderColor: 'border-blue-500/20',
                hoverBorder: 'hover:border-blue-500/50'
            };
        } else if (name.includes('caro') && name.includes('4')) {
            return {
                icon: Grid2x2,
                bgColor: 'bg-purple-500/10',
                iconColor: 'text-purple-500',
                borderColor: 'border-purple-500/20',
                hoverBorder: 'hover:border-purple-500/50'
            };
        } else if (name.includes('tic') || name.includes('tac') || name.includes('toe')) {
            return {
                icon: X,
                bgColor: 'bg-green-500/10',
                iconColor: 'text-green-500',
                borderColor: 'border-green-500/20',
                hoverBorder: 'hover:border-green-500/50'
            };
        } else if (name.includes('candy') || name.includes('crush') || name.includes('ghép')) {
            return {
                icon: Candy,
                bgColor: 'bg-pink-500/10',
                iconColor: 'text-pink-500',
                borderColor: 'border-pink-500/20',
                hoverBorder: 'hover:border-pink-500/50'
            };
        } else if (name.includes('snake') || name.includes('rắn')) {
            return {
                icon: Worm,
                bgColor: 'bg-emerald-500/10',
                iconColor: 'text-emerald-500',
                borderColor: 'border-emerald-500/20',
                hoverBorder: 'hover:border-emerald-500/50'
            };
        } else if (name.includes('memory') || name.includes('trí nhớ')) {
            return {
                icon: Brain,
                bgColor: 'bg-orange-500/10',
                iconColor: 'text-orange-500',
                borderColor: 'border-orange-500/20',
                hoverBorder: 'hover:border-orange-500/50'
            };
        } else if (name.includes('draw') || name.includes('vẽ')) {
            return {
                icon: Palette,
                bgColor: 'bg-indigo-500/10',
                iconColor: 'text-indigo-500',
                borderColor: 'border-indigo-500/20',
                hoverBorder: 'hover:border-indigo-500/50'
            };
        }
        
        // Default fallback
        return {
            icon: Play,
            bgColor: 'bg-gray-500/10',
            iconColor: 'text-gray-500',
            borderColor: 'border-gray-500/20',
            hoverBorder: 'hover:border-gray-500/50'
        };
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Loading Overlay */}
            {isLoading && (
                <LoadingOverlay 
                    message="Loading Games" 
                    description="Fetching available games..." 
                />
            )}

            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold">Games</h1>
                <p className="text-base sm:text-lg text-muted-foreground">
                    Choose your favorite game and start playing
                </p>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {games.length === 0 && !isLoading ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground text-lg">No games available</p>
                    </div>
                ) : (
                    games.map((game) => {
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
                    })
                )}
            </div>
        </div>
    );
});
