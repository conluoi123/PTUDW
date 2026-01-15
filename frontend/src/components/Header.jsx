import { Moon, Sun, Menu, Search, User, Bell, Heart, LogOut, Settings, UserCircle, Gamepad2 } from 'lucide-react';
import { memo, useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Card, CardContent } from './ui/card';

import { NotificationsDropdown } from './NotificationsDropdown';
import { FavoritesDropdown } from './FavoritesDropdown';
import { SearchModal } from './SearchModal';
import { UserDropdown } from './UserDropDown'; // Changed import manually to match file on disk if needed, assuming user created UserDropDown.jsx

export const Header = memo(function Header({
    isDarkMode,
    toggleDarkMode,
    onMenuClick,
    currentPage,
    setCurrentPage,
    onPlayGame,
    user,
    onLogout,
    onShowLogin,
    onShowRegister
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications] = useState(3);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const handleProfileClick = () => {
        setCurrentPage('profile');
    };

    const handleNotificationClick = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        setIsFavoritesOpen(false);
        setIsUserDropdownOpen(false);
    };

    const handleFavoriteClick = () => {
        setIsFavoritesOpen(!isFavoritesOpen);
        setIsNotificationsOpen(false);
        setIsUserDropdownOpen(false);
    };

    const handleUserClick = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
        setIsNotificationsOpen(false);
        setIsFavoritesOpen(false);
    };

    const handleSearchFocus = () => {
        setIsSearchModalOpen(true);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchModalOpen(true);
        }
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md border-b border-gray-200/50 dark:border-white/5 z-50 transition-all duration-300">
                <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between max-w-7xl mx-auto">
                    {/* Left: Menu + Logo */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>

                        <div 
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => setCurrentPage('home')}
                        >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                                <Gamepad2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="hidden sm:block text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400">
                                GameHub
                            </span>
                        </div>
                    </div>

                    {/* Center: Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                            <Input
                                type="text"
                                placeholder="Search games, players..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={handleSearchFocus}
                                className="w-full pl-10 h-10 bg-gray-100/50 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-black/20 focus:border-indigo-500/50 transition-all rounded-xl"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex gap-1">
                                <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white dark:bg-white/10 rounded border border-gray-200 dark:border-white/10">Ctrl</kbd>
                                <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white dark:bg-white/10 rounded border border-gray-200 dark:border-white/10">K</kbd>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl"
                            onClick={() => setIsSearchModalOpen(true)}
                        >
                            <Search className="w-5 h-5" />
                        </Button>

                        <div className="relative hidden sm:block">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors"
                                onClick={handleNotificationClick}
                            >
                                <Bell className="w-5 h-5" />
                                {notifications > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0f1115]" />
                                )}
                            </Button>
                            <NotificationsDropdown
                                isOpen={isNotificationsOpen}
                                onClose={() => setIsNotificationsOpen(false)}
                            />
                        </div>

                        <div className="relative hidden sm:block">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-500/10 rounded-xl transition-colors"
                                onClick={handleFavoriteClick}
                            >
                                <Heart className="w-5 h-5" />
                            </Button>
                            <FavoritesDropdown
                                isOpen={isFavoritesOpen}
                                onClose={() => setIsFavoritesOpen(false)}
                                onPlayGame={onPlayGame}
                            />
                        </div>

                        <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1 hidden sm:block" />

                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl"
                            onClick={toggleDarkMode}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-indigo-600" />}
                        </Button>

                        {user ? (
                            <div className="relative ml-1">
                                <Avatar
                                    className="w-9 h-9 cursor-pointer ring-2 ring-indigo-500/20 hover:ring-indigo-500 transition-all"
                                    onClick={handleUserClick}
                                >
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-xs">
                                        {user.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <UserDropdown
                                    isOpen={isUserDropdownOpen}
                                    onClose={() => setIsUserDropdownOpen(false)}
                                    user={user}
                                    onProfile={() => setCurrentPage('profile')}
                                    onSettings={() => setCurrentPage('profile')}
                                    onLogout={onLogout}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-2">
                                <Button
                                    variant="ghost"
                                    className="hidden lg:flex font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white"
                                    onClick={onShowLogin}
                                >
                                    Log in
                                </Button>
                                <Button
                                    className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold rounded-xl px-4 shadow-lg shadow-indigo-500/20"
                                    onClick={onShowRegister}
                                >
                                    Sign up
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onPlayGame={onPlayGame}
                onNavigate={setCurrentPage}
            />
        </>
    );
});