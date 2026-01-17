import { Play } from 'lucide-react';
import { memo, useState, useEffect } from 'react';
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
                    image: game.config?.image || game.thumbnail || game.image // Use image from API
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
                    games.map((game) => (
                        <Card
                            key={game.id}
                            className="group overflow-hidden border-0 bg-transparent cursor-pointer"
                        >
                            {/* Game Image Card */}
                            <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <img 
                                        src={game.image} 
                                        alt={game.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />
                                </div>
                                
                                {/* Content */}
                                <CardContent className="relative h-full p-6 flex flex-col justify-end z-10">
                                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        {/* Badge */}
                                        <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="px-2 py-1 rounded-md bg-primary/90 text-primary-foreground text-xs font-bold uppercase">
                                                Play Now
                                            </span>
                                        </div>
                                        
                                        {/* Title */}
                                        <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                                            {game.name}
                                        </h3>
                                        
                                        {/* Description */}
                                        <p className="text-gray-200 text-sm line-clamp-2 mb-4 drop-shadow-md opacity-90">
                                            {game.description}
                                        </p>
                                        
                                        {/* Play Button */}
                                        <Button
                                            onClick={() => onPlayGame?.(game.id)}
                                            className="w-full py-3 font-semibold shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                                            size="lg"
                                        >
                                            <Play className="w-5 h-5 mr-2" fill="currentColor" />
                                            Start Game
                                        </Button>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
});
