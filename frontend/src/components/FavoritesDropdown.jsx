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
            lastPlayed: 'Today',
            gradient: 'from-blue-500 to-cyan-600'
        },
        {
            id: 'tictactoe',
            name: 'Tic Tac Toe',
            plays: 32,
            lastPlayed: 'Yesterday',
            gradient: 'from-green-500 to-emerald-600'
        },
        {
            id: 'snake',
            name: 'Snake Game',
            plays: 16,
            lastPlayed: '2 days ago',
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
            className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] animate-in slide-in-from-top-2 fade-in duration-200 z-50 transform origin-top-right"
        >
            <div className="rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-2xl shadow-indigo-500/10 overflow-hidden bg-white/90 dark:bg-[#16181d]/90 backdrop-blur-xl">
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-pink-500/10 p-1.5 rounded-lg">
                            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                        </div>
                        <h3 className="font-bold text-sm">Favorites</h3>
                    </div>
                    <span className="text-xs font-medium text-gray-400">{favorites.length} items</span>
                </div>

                <div className="max-h-[320px] overflow-y-auto scrollbar-thin p-2">
                    {favorites.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Heart className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">No favorites yet</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Add games to your favorites list for quick access</p>
                        </div>
                    ) : (
                        favorites.map((game) => (
                            <div
                                key={game.id}
                                className="group p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-3 relative"
                            >
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${game.gradient} flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform`}>
                                    <Play className="w-4 h-4 text-white fill-white" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate pr-6">{game.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span>{game.plays} plays</span>
                                        <span className="w-0.5 h-0.5 bg-gray-300 rounded-full" />
                                        <span>{game.lastPlayed}</span>
                                    </div>
                                </div>

                                <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white dark:bg-[#1e2025] shadow-lg rounded-lg p-1 border border-gray-100 dark:border-white/5 z-10">
                                    <Button
                                        size="sm"
                                        onClick={() => handlePlayGame(game.id)}
                                        className="h-7 px-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                                    >
                                        Play
                                    </Button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFavorite(game.id);
                                        }}
                                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 rounded-md transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {favorites.length > 0 && (
                    <div className="p-3 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                        <Button variant="ghost" size="sm" className="w-full text-xs font-medium h-8 rounded-lg text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                            Manage Favorites
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
