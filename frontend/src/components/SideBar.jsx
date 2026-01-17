import { Home, Gamepad2, User, Trophy, TrendingUp, Shield, Users, MessageCircle, ChevronRight, Palette, LogOut } from 'lucide-react';

import { memo, useMemo, useState, useContext } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { AuthContext } from '@/contexts/AuthContext';

export const Sidebar = memo(function Sidebar({ currentPage, setCurrentPage, isOpen, onClose, isLoggedIn, onShowLogin }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { user } = useContext(AuthContext);

    const menuItems = useMemo(() => [
        { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" />, requireAuth: false },
        { id: 'games', label: 'Games', icon: <Gamepad2 className="w-5 h-5" />, requireAuth: false },
        { id: 'friends', label: 'Friends', icon: <Users className="w-5 h-5" />, requireAuth: true },
        { id: 'messages', label: 'Messages', icon: <MessageCircle className="w-5 h-5" />, badge: 3, requireAuth: true },
        { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, requireAuth: true },
        { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-5 h-5" />, requireAuth: true },
        { id: 'ranking', label: 'Ranking', icon: <TrendingUp className="w-5 h-5" />, requireAuth: true },
        { id: 'admin', label: 'Admin Portal', icon: <Shield className="w-5 h-5" />, requireAuth: true, adminOnly: true },
    ], []);

    // Filter menu items dựa trên role
    const visibleMenuItems = useMemo(() => {
        return menuItems.filter(item => {
            // Nếu item là admin-only, chỉ show khi user là admin
            if (item.adminOnly) {
                return user?.role === 'admin';
            }
            return true;
        });
    }, [menuItems, user]);

    const handleMenuClick = (page, requireAuth = false) => {
        if (requireAuth && !isLoggedIn) {
            onShowLogin?.();
            onClose();
            return;
        }
        setCurrentPage(page);
        onClose();
    };

    return (
        <aside
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className={`
        fixed top-20 left-4 bottom-4
        bg-white/80 dark:bg-[#16181d]/90
        backdrop-blur-xl
        border border-gray-200/50 dark:border-white/5
        shadow-2xl shadow-gray-200/50 dark:shadow-black/20
        transition-all duration-300 ease-q-out z-40
        rounded-3xl
        overflow-y-auto overflow-x-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-[200%]'}
        ${isExpanded ? 'w-64' : 'w-20'}
        lg:translate-x-0
        scrollbar-none
      `}
        >
            <nav className="p-3 space-y-2 mt-2">
                {visibleMenuItems.map((item) => (
                    <div key={item.id} className="relative group">
                        <Button
                            onClick={() => handleMenuClick(item.id, item.requireAuth)}
                            variant="ghost"
                            className={`
                w-full relative overflow-hidden flex items-center
                ${isExpanded ? 'justify-start px-4' : 'justify-center px-0'}
                ${currentPage === item.id
                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                }
                transition-all duration-200 h-12 rounded-xl group
              `}
                        >
                            <span className={`flex-shrink-0 transition-colors ${currentPage === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                {item.icon}
                            </span>
                            
                            <span className={`
                font-medium whitespace-nowrap transition-all duration-300 ml-3
                ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'}
              `}>
                                {item.label}
                            </span>

                            {item.badge && item.badge > 0 && (
                                <Badge
                                    className={`
                    absolute top-3 right-3 h-2 w-2 p-0 rounded-full bg-red-500
                    ${isExpanded ? 'opacity-100' : 'opacity-100 right-2 top-2'}
                  `}
                                >
                                    <span className="sr-only">New notifications</span>
                                </Badge>
                            )}
                            
                            {/* Active Indicator Bar */}
                            {currentPage === item.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-500 rounded-r-full" />
                            )}
                        </Button>

                        {/* Tooltip for collapsed state */}
                        {!isExpanded && (
                            <div className="hidden lg:block absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-50">
                                {item.label}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Bottom Section */}
            {/* <div className={`
                absolute bottom-4 left-3 right-3
                transition-all duration-300
                ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/10 dark:border-indigo-500/20">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Pro Tip</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Complete daily challenges to earn 2x XP this weekend!
                    </p>
                </div>
            </div> */}
        </aside>
    );
});