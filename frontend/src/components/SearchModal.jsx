import { Search, X, TrendingUp, Clock, Gamepad2, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useState, useRef, useEffect } from 'react';


export function SearchModal({
    isOpen,
    onClose,
    searchQuery,
    setSearchQuery,
    onPlayGame,
    onNavigate
}) {
    const inputRef = useRef(null);
    const modalRef = useRef(null);

    const [recentSearches] = useState([
        'Caro',
        'Snake Game',
        'Achievements'
    ]);

    const allResults = [
        { id: 'caro5', type: 'game', title: 'Caro (5 in a row)', description: 'Classic Gomoku - Connect 5 pieces' },
        { id: 'caro4', type: 'game', title: 'Caro (4 in a row)', description: 'Connect 4 pieces in a row' },
        { id: 'tictactoe', type: 'game', title: 'Tic Tac Toe', description: 'Classic 3x3 grid game' },
        { id: 'candycrush', type: 'game', title: 'Candy Crush', description: 'Match 3 or more candies' },
        { id: 'snake', type: 'game', title: 'Snake Game', description: 'Control the snake and collect food' },
        { id: 'home', type: 'page', title: 'Home', description: 'Dashboard & Overview' },
        { id: 'games', type: 'page', title: 'Games', description: 'Browse all games' },
        { id: 'profile', type: 'page', title: 'Profile', description: 'View your profile' },
        { id: 'achievements', type: 'page', title: 'Achievements', description: 'View unlocked achievements' },
        { id: 'ranking', type: 'page', title: 'Ranking', description: 'Leaderboards & Stats' },
        { id: 'friends', type: 'page', title: 'Friends', description: 'Manage friends' },
        { id: 'messages', type: 'page', title: 'Messages', description: 'Chat with friends' }
    ];

    const filteredResults = searchQuery.trim()
        ? allResults.filter(result =>
            result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }

        function handleEscape(event) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    const handleSelectResult = (result) => {
        if (result.type === 'game') {
            onPlayGame?.(result.id);
        } else if (result.type === 'page') {
            onNavigate?.(result.id);
        }
        onClose();
        setSearchQuery('');
    };

    const getResultIcon = (type) => {
        switch (type) {
            case 'game':
                return <Gamepad2 className="w-5 h-5 text-indigo-500" />;
            case 'page':
                return <TrendingUp className="w-5 h-5 text-pink-500" />;
            case 'friend':
                return <Users className="w-5 h-5 text-green-500" />;
            default:
                return <Search className="w-5 h-5 text-gray-400" />;
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200" />

            {/* Modal */}
            <div className="fixed inset-x-0 top-16 md:top-24 z-50 px-4 animate-in slide-in-from-top-4 duration-300 md:px-0">
                <div ref={modalRef} className="max-w-2xl mx-auto">
                    <div className="bg-white/95 dark:bg-[#16181d]/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-gray-200/50 dark:border-white/10">
                        {/* Search Input */}
                        <div className="relative border-b border-gray-100 dark:border-white/5 p-4">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="What are you looking for?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-12 h-12 bg-transparent text-lg text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Results Area */}
                        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
                            {!searchQuery.trim() ? (
                                /* Recent Searches */
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-3 px-2">
                                        <Clock className="w-4 h-4 text-indigo-500" />
                                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Searches</p>
                                    </div>
                                    <div className="space-y-1">
                                        {recentSearches.map((search, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSearchQuery(search)}
                                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm text-gray-700 dark:text-gray-300 flex items-center justify-between group"
                                            >
                                                <span>{search}</span>
                                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gray-400" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : filteredResults.length > 0 ? (
                                /* Search Results */
                                <div className="p-2 space-y-1">
                                    {filteredResults.map((result) => (
                                        <button
                                            key={result.id}
                                            onClick={() => handleSelectResult(result)}
                                            className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all text-left group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20"
                                        >
                                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/5 group-hover:scale-110 transition-transform duration-300">
                                                {getResultIcon(result.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-gray-900 dark:text-white">{result.title}</p>
                                                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 border-0">
                                                        {result.type}
                                                    </Badge>
                                                </div>
                                                {result.description && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">{result.description}</p>
                                                )}
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2">
                                                <ArrowRight className="w-5 h-5 text-indigo-500" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                /* No Results */
                                <div className="py-12 text-center">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <p className="text-gray-900 dark:text-white font-medium mb-1">No results found</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        No matches found for "{searchQuery}"
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 bg-gray-50/50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-md font-sans text-[10px] font-medium text-gray-500 dark:text-gray-400">↵</kbd>
                                    to select
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-md font-sans text-[10px] font-medium text-gray-500 dark:text-gray-400">↑↓</kbd>
                                    to navigate
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-md font-sans text-[10px] font-medium text-gray-500 dark:text-gray-400">esc</kbd>
                                    to close
                                </span>
                            </div>
                            <span className="hidden sm:inline-block opacity-50">GameHub Search</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
