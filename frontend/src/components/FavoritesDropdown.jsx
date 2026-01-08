import { Heart, Play, X } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useState, useRef, useEffect } from 'react';

export function FavoritesDropdown({ isOpen, onClose, onPlayGame }) {
    const dropdownRef = useRef(null);
    const [favorites, setFavorites] = useState([
        {
            id: 'caro5',
            name: 'Caro (5 in a row)',
            plays: 45,
            lastPlayed: 'Hôm nay',
            gradient: 'from-blue-500 to-cyan-600'
        },
        {
            id: 'tictactoe',
            name: 'Tic Tac Toe',
            plays: 32,
            lastPlayed: 'Hôm qua',
            gradient: 'from-green-500 to-emerald-600'
        },
        {
            id: 'snake',
            name: 'Snake Game',
            plays: 16,
            lastPlayed: '2 ngày trước',
            gradient: 'from-emerald-500 to-green-600'
        }
    ]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const removeFavorite = (id) => {
        setFavorites(prev => prev.filter(f => f.id !== id));
    };

    const handlePlayGame = (gameType) => {
        onPlayGame?.(gameType);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] animate-in slide-in-from-top duration-200 z-50"
        >
            <Card className="shadow-xl border-2">
                <CardContent className="p-0">
                    {/* Header */}
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                            <h3 className="font-semibold">Yêu thích</h3>
                        </div>
                    </div>

                    {/* Favorites List */}
                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                        {favorites.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Chưa có trò chơi yêu thích</p>
                                <p className="text-xs mt-1">Thêm trò chơi vào danh sách yêu thích để truy cập nhanh</p>
                            </div>
                        ) : (
                            favorites.map((game) => (
                                <div
                                    key={game.id}
                                    className="p-4 border-b last:border-b-0 hover:bg-accent transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Game Icon */}
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${game.gradient} flex items-center justify-center flex-shrink-0`}>
                                            <Play className="w-6 h-6 text-white" fill="currentColor" />
                                        </div>

                                        {/* Game Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{game.name}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                <span>{game.plays} lượt chơi</span>
                                                <span>•</span>
                                                <span>{game.lastPlayed}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <Button
                                                size="sm"
                                                onClick={() => handlePlayGame(game.id)}
                                                className="h-8 px-3"
                                            >
                                                <Play className="w-3 h-3 mr-1" fill="currentColor" />
                                                Chơi
                                            </Button>
                                            <button
                                                onClick={() => removeFavorite(game.id)}
                                                className="p-2 rounded-lg hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-4 h-4 text-destructive" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {favorites.length > 0 && (
                        <div className="p-3 border-t text-center">
                            <Button variant="ghost" size="sm" className="w-full">
                                Quản lý yêu thích
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
