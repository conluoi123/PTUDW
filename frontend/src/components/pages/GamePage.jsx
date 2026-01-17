import { Play, Search, TrendingUp, Users, Star, Sparkles } from 'lucide-react';
import { memo, useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { LoadingOverlay } from '../ui/LoadingOverlay';
import { GameService } from '@/services/game.services';

export const GamesPage = memo(function GamesPage({ onPlayGame }) {
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Fetch games from API
    useEffect(() => {
        const fetchGames = async () => {
            try {
                setIsLoading(true);
                const response = await GameService.getAllGames();
                const gamesData = response?.data || [];
                const mappedGames = gamesData.map((game, index) => ({
                    id: game.id,
                    name: game.name,
                    description: game.description || 'Play this exciting game!',
                    image: game.config?.image || game.thumbnail || game.image,
                    rating: (4.0 + Math.random()).toFixed(1), // Mock rating
                    players: Math.floor(Math.random() * 5000) + 500, // Mock player count
                    isNew: index < 2, 
                    isTrending: index === 0 
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

    // Filter and search games
    const filteredGames = useMemo(() => {
        return games.filter(game => {
            const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = selectedFilter === 'all' || 
                (selectedFilter === 'new' && game.isNew) ||
                (selectedFilter === 'trending' && game.isTrending);
            return matchesSearch && matchesFilter;
        });
    }, [games, searchQuery, selectedFilter]);

    // Stats
    const stats = useMemo(() => ({
        total: games.length,
        new: games.filter(g => g.isNew).length,
        trending: games.filter(g => g.isTrending).length
    }), [games]);

    // Skeleton Loading Component
    const SkeletonCard = () => (
        <div className="relative h-72 rounded-2xl overflow-hidden bg-muted animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header with Stats */}
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">Game Library</h1>
                    <p className="text-base sm:text-lg text-muted-foreground">
                        Discover and play amazing games
                    </p>
                </div>

                {/* Quick Stats */}
                {!isLoading && (
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <img src="https://cdn-icons-png.flaticon.com/512/5930/5930147.png" className="w-8 h-8 text-blue-500" />
                                    <div>
                                        <p className="text-2xl font-bold">{stats.total}</p>
                                        <p className="text-xs text-muted-foreground">Total Games</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <img src="https://cdn-icons-png.flaticon.com/512/5978/5978092.png" className="w-8 h-8 text-green-500" />
                                    <div>
                                        <p className="text-2xl font-bold">{stats.trending}</p>
                                        <p className="text-xs text-muted-foreground">Trending</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <img src="https://png.pngtree.com/png-vector/20240129/ourmid/pngtree-cute-yellow-star-smile-face-has-big-eyes-and-little-light-png-image_11562458.png" className="w-8 h-8 text-purple-500" />
                                    <div>
                                        <p className="text-2xl font-bold">{stats.new}</p>
                                        <p className="text-xs text-muted-foreground">New Games</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search games..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                        {['all', 'trending', 'new'].map(filter => (
                            <Button
                                key={filter}
                                variant={selectedFilter === filter ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedFilter(filter)}
                                className="capitalize"
                            >
                                {filter}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {isLoading ? (
                    // Skeleton Loading
                    Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                ) : filteredGames.length === 0 ? (
                    // Empty State
                    <div className="col-span-full text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                            <Search className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No games found</h3>
                        <p className="text-muted-foreground">
                            {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
                        </p>
                    </div>
                ) : (
                    // Game Cards
                    filteredGames.map((game, index) => (
                        <Card
                            key={game.id}
                            className="group overflow-hidden border-0 bg-transparent cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                                {/* Badges */}
                                <div className="absolute top-3 left-3 z-20 flex gap-2">
                                    {game.isTrending && (
                                        <span className="px-2 py-1 rounded-md bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            Trending
                                        </span>
                                    )}
                                    {game.isNew && (
                                        <span className="px-2 py-1 rounded-md bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold">
                                            New
                                        </span>
                                    )}
                                </div>

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
                                        {/* Stats Row */}
                                        <div className="flex items-center gap-3 mb-3 text-xs text-gray-300">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                <span>{game.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                <span>{game.players > 1000 ? `${(game.players / 1000).toFixed(1)}k` : game.players}</span>
                                            </div>
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
                                            Play Now
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
