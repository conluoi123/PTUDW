import { LogOut, Settings, UserCircle, User, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useEffect, useRef } from 'react';

export function UserDropdown({ isOpen, onClose, user, onProfile, onSettings, onLogout }) {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-72 z-50 animate-in slide-in-from-top-2 fade-in duration-200 transform origin-top-right"
        >
            <div className="rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-2xl shadow-indigo-500/10 overflow-hidden bg-white/90 dark:bg-[#16181d]/90 backdrop-blur-xl">
                {/* User Info Header with Gradient */}
                <div className="relative p-6 pb-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <Avatar className="w-14 h-14 ring-4 ring-white dark:ring-[#16181d]">
                            <AvatarFallback className="bg-gradient-to-tr from-indigo-500 to-purple-500 text-white text-xl font-bold">
                                {user.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg leading-tight">{user.name}</h3>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium truncate mb-1">{user.email}</p>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                                PRO MEMBER
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats / Quick Actions - Optional decorative section */}
                <div className="-mt-4 px-4 pb-2 relative z-20">
                    <div className="bg-white dark:bg-[#1e2025] rounded-xl border border-gray-100 dark:border-white/5 p-3 flex justify-around shadow-sm">
                        <div className="text-center">
                            <p className="text-xs text-gray-400 font-medium">Level</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">42</p>
                        </div>
                        <div className="w-px bg-gray-100 dark:bg-white/5" />
                        <div className="text-center">
                            <p className="text-xs text-gray-400 font-medium">XP</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">12.5k</p>
                        </div>
                        <div className="w-px bg-gray-100 dark:bg-white/5" />
                        <div className="text-center">
                            <p className="text-xs text-gray-400 font-medium">Rank</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">#5</p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="p-2 space-y-1">
                    <Button
                        variant="ghost"
                        className="w-full justify-between h-11 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl group"
                        onClick={() => {
                            onProfile();
                            onClose();
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
                                <UserCircle className="w-4 h-4" />
                            </div>
                            <span>Profile</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-between h-11 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl group"
                        onClick={() => {
                            onSettings();
                            onClose();
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
                                <Settings className="w-4 h-4" />
                            </div>
                            <span>Settings</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </Button>
                </div>

                <div className="h-px bg-gray-100 dark:bg-white/5 my-1 mx-4" />

                <div className="p-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start h-11 px-4 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl group"
                        onClick={() => {
                            onLogout();
                            onClose();
                        }}
                    >
                        <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 mr-3 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </div>
                        Sign out
                    </Button>
                </div>
            </div>
        </div>
    );
}
