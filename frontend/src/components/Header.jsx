import { Moon, Sun, Menu, Gamepad2 } from 'lucide-react';
import { memo, useState } from 'react';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';

import { UserDropdown } from './UserDropDown';

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
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const handleUserClick = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
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
                onClick={() => setCurrentPage("home")}
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <span className="hidden sm:block text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400">
                  GameHub
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-indigo-600" />
                )}
              </Button>

              {user ? (
                <div className="relative ml-1">
                  <Avatar
                    className="w-9 h-9 cursor-pointer ring-2 ring-indigo-500/20 hover:ring-indigo-500 transition-all"
                    onClick={handleUserClick}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-[40px] h-[40px] rounded-full object-cover"
                    />
                  </Avatar>

                  <UserDropdown
                    isOpen={isUserDropdownOpen}
                    onClose={() => setIsUserDropdownOpen(false)}
                    user={user}
                    onProfile={() => setCurrentPage("profile")}
                    onSettings={() => setCurrentPage("profile")}
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
      </>
    );
});