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
import { UserDropdown } from './UserDropdown';



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
            <header className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-card/98 via-card/95 to-card/98 backdrop-blur-xl border-b border-border/50 z-50 transition-all duration-300 shadow-lg shadow-primary/5">
                <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 max-w-screen-2xl mx-auto">
                    {/* Left: Menu + Logo */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
                        {/* Mobile menu button */}
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-all active:scale-95 flex-shrink-0"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Logo */}
                        <button
                            onClick={() => setCurrentPage('home')}
                            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity min-w-0"
                        >
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow flex-shrink-0">
                                <Gamepad2 className="text-primary-foreground w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="hidden sm:block min-w-0">
                                <h1 className="text-sm sm:text-base font-bold leading-tight truncate bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                    Game Hub
                                </h1>
                            </div>
                        </button>
                    </div>

                    {/* Center: Search Bar */}
                    <div className="flex-1 max-w-xl lg:max-w-2xl hidden md:block mx-4">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <Input
                                type="text"
                                placeholder="Tìm kiếm trò chơi... (Ctrl+K)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={handleSearchFocus}
                                className="pl-10 pr-4 bg-accent/50 border-0 focus-visible:ring-1 cursor-pointer h-9"
                            />
                        </form>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        {/* Search Icon for Mobile */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden p-2 h-9 w-9"
                            onClick={() => setIsSearchModalOpen(true)}
                        >
                            <Search className="w-5 h-5" />
                        </Button>

                        {/* User Profile Icon - Hidden on mobile */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hidden lg:flex p-2 h-9 w-9"
                            onClick={handleProfileClick}
                        >
                            <User className="w-5 h-5" />
                        </Button>

                        {/* Notification with Badge */}
                        <div className="relative hidden md:block">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="relative p-2 h-9 w-9"
                                onClick={handleNotificationClick}
                            >
                                <Bell className="w-5 h-5" />
                                {notifications > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                                    >
                                        {notifications}
                                    </Badge>
                                )}
                            </Button>
                            <NotificationsDropdown
                                isOpen={isNotificationsOpen}
                                onClose={() => setIsNotificationsOpen(false)}
                            />
                        </div>

                        {/* Favorite/Heart Icon */}
                        <div className="relative hidden md:block">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 h-9 w-9"
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

                        {/* Dark Mode Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 h-9 w-9 hover:bg-primary/10 transition-colors"
                            onClick={toggleDarkMode}
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <Sun className="w-5 h-5 text-yellow-500 hover:text-yellow-400" />
                            ) : (
                                <Moon className="w-5 h-5 text-primary hover:text-primary/80" />
                            )}
                        </Button>

                        {/* User Menu or Login/Register */}
                        {user ? (
                            <div className="relative">
                                {/* Desktop & Mobile: Avatar with Dropdown */}
                                <Avatar
                                    className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-primary/50 ring-offset-2 ring-offset-background transition-all flex-shrink-0"
                                    onClick={handleUserClick}
                                >
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-semibold">
                                        {user.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                {/* User Dropdown */}
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
                            <>
                                {/* Login/Register Buttons - Desktop */}
                                <div className="hidden lg:flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        className="h-9 px-4 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                                        onClick={onShowLogin}
                                    >
                                        Đăng nhập
                                    </Button>
                                    <Button
                                        className="h-9 px-4 text-sm font-bold text-primary-foreground bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all border-0"
                                        onClick={onShowRegister}
                                    >
                                        Đăng ký
                                    </Button>
                                </div>

                                {/* Mobile: Login Icon */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="lg:hidden p-2 h-9 w-9"
                                    onClick={onShowLogin}
                                >
                                    <User className="w-5 h-5" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Search Modal */}
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