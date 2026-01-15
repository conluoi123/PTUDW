import { Gamepad2, Grid3x3, Grid2x2, X, Candy, Worm, Sparkles, Moon, Sun, CheckCircle2, ChevronRight, Zap, Trophy, Users } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '@mui/material';
import { GameService } from '../../services/game.services.js';
import { useEffect, useState } from 'react';

const ICON_MAP = {
    Grid3x3: Grid3x3,
    Grid2x2: Grid2x2,
    X: X,
    Candy: Candy,
    Worm: Worm,
    Sparkles: Sparkles
};

export function WelcomePage({ onShowLogin, onShowRegister, onViewGames }) {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [games, setGames] = useState([]);
    
    useEffect(() => {
        const fetchGames = async () => {
            const games = await GameService.getAllGames();
            setGames(games);
        };
        fetchGames();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1115] text-gray-900 dark:text-white transition-colors duration-300 font-sans selection:bg-indigo-500/30">
            {/* Animated Background Mesh */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-0 w-[30rem] h-[30rem] bg-purple-500/20 rounded-full blur-[120px] animate-pulse-slower" />
            </div>

            {/* Navigation Bar */}
            <header className="fixed top-0 inset-x-0 h-20 z-50 transition-all duration-300 backdrop-blur-md border-b border-gray-200/50 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Gamepad2 className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400">
                            GameHub
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {toggleDarkMode && (
                            <button
                                onClick={toggleDarkMode}
                                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-all active:scale-95"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                            </button>
                        )}
                        <Button
                            variant="text"
                            className="hidden sm:flex font-semibold text-gray-600 dark:text-gray-300 hover:bg-transparent hover:text-indigo-600 dark:hover:text-white px-4"
                            onClick={onShowLogin}
                        >
                            Log in
                        </Button>
                        <Button
                            variant="contained"
                            className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 font-bold px-6 py-2.5 rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
                            onClick={onShowRegister}
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </header>

            <main className="relative pt-32 pb-20 px-6">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto text-center mb-32">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-8 animate-fade-in-up">
                        <Zap className="w-4 h-4 fill-current" />
                        <span>Next Gen Gaming Platform</span>
                    </div>
                    
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[1.1]">
                        Play. Compete. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                            Conquer.
                        </span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Experience a collection of addictive mini-games designed to challenge your skills. 
                        Join thousands of players, climb the leaderboards, and prove your mastery.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
                        <button 
                            onClick={onShowRegister}
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            Start Playing Now
                            <ChevronRight className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={onViewGames}
                            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            Explore Games
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-10 border-t border-gray-200/50 dark:border-white/5">
                        {[
                            { label: 'Active Players', value: '10K+', icon: Users },
                            { label: 'Weekly Tournaments', value: '50+', icon: Trophy },
                            { label: 'Mini Games', value: '5+', icon: Gamepad2 }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <stat.icon className="w-6 h-6 text-gray-400 mb-1" />
                                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                                    {stat.value}
                                </span>
                                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Games Grid */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Games</h2>
                            <p className="text-gray-600 dark:text-gray-400">Curated collection of our most popular challenges</p>
                        </div>
                        <Button 
                            className="hidden md:flex gap-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 font-bold"
                            endIcon={<ChevronRight className="w-4 h-4" />}
                        >
                            View All
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {games.map((game, index) => {
                            const config = game.config || {};
                            const Icon = ICON_MAP[config.icon] || Gamepad2;
                            const colors = {
                                blue: 'from-blue-500/20 to-cyan-500/20 text-blue-500',
                                purple: 'from-purple-500/20 to-pink-500/20 text-purple-500',
                                green: 'from-emerald-500/20 to-teal-500/20 text-emerald-500', 
                                orange: 'from-orange-500/20 to-red-500/20 text-orange-500',
                                indigo: 'from-indigo-500/20 to-violet-500/20 text-indigo-500'
                            };
                            
                            // Map config color to style object (simple mapping demo)
                            const colorKey = config.iconColor?.includes('blue') ? 'blue' 
                                : config.iconColor?.includes('pink') ? 'purple'
                                : config.iconColor?.includes('green') ? 'green' 
                                : config.iconColor?.includes('yellow') ? 'orange'
                                : 'indigo';
                                
                            const themeStyle = colors[colorKey];

                            return (
                                <div 
                                    key={game.id}
                                    className="group relative bg-white dark:bg-[#16181d] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-black/20 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-2 flex flex-col h-full overflow-hidden"
                                >
                                    <div className={`absolute top-0 right-0 p-32 bg-gradient-to-br ${themeStyle.split(' ')[0]} blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    
                                    <div className="relative z-10 flex-1">
                                        <div className={`w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-inset ring-black/5 dark:ring-white/10 ${themeStyle.split(' ').pop()}`}>
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        
                                        <div className="mb-2">
                                            <span className={`text-xs font-bold uppercase tracking-wider ${themeStyle.split(' ').pop()}`}>
                                                {config.tagline || 'Strategy'}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {game.name}
                                        </h3>
                                        
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3">
                                            {game.description}
                                        </p>

                                        <div className="space-y-3 mb-8">
                                            {(config.howToPlay || []).slice(0, 2).map((step, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                    <CheckCircle2 className={`w-4 h-4 ${themeStyle.split(' ').pop()}`} />
                                                    <span className="truncate">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="relative z-10 pt-6 mt-auto border-t border-gray-100 dark:border-white/5">
                                        <button 
                                            onClick={onShowRegister}
                                            className="w-full py-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600"
                                        >
                                            Play Now
                                            <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer simple */}
                <div className="mt-32 border-t border-gray-200 dark:border-white/5 pt-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        © 2024 GameHub Platform. All rights reserved.
                    </p>
                </div>
            </main>
        </div>
    );
}
