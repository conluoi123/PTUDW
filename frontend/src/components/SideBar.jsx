import { Home, Gamepad2, User, Trophy, TrendingUp, Shield, Users, MessageCircle, ChevronRight, Palette } from 'lucide-react';

import { memo, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

export const Sidebar = memo(function Sidebar({ currentPage, setCurrentPage, isOpen, onClose, isLoggedIn, onShowLogin }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const menuItems = useMemo(() => [
        { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" />, requireAuth: false },
        { id: 'games', label: 'Games', icon: <Gamepad2 className="w-5 h-5" />, requireAuth: false },
        { id: 'mui-demo', label: 'MUI Demo', icon: <Palette className="w-5 h-5" />, requireAuth: true },
        { id: 'friends', label: 'Friends', icon: <Users className="w-5 h-5" />, requireAuth: true },
        { id: 'messages', label: 'Messages', icon: <MessageCircle className="w-5 h-5" />, badge: 3, requireAuth: true },
        { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, requireAuth: true },
        { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-5 h-5" />, requireAuth: true },
        { id: 'ranking', label: 'Ranking', icon: <TrendingUp className="w-5 h-5" />, requireAuth: true },
        { id: 'admin', label: 'Admin Portal', icon: <Shield className="w-5 h-5" />, requireAuth: true },
    ], []);

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
        fixed top-16 left-0 bottom-0
        bg-gradient-to-b from-sidebar/98 via-sidebar/95 to-sidebar/98
        backdrop-blur-xl
        border-r border-sidebar-border
        shadow-2xl shadow-primary/5
        transition-all duration-300 ease-in-out z-40
        overflow-y-auto overflow-x-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isExpanded ? 'w-56 sm:w-64' : 'w-20'}
        lg:translate-x-0
        scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent
      `}
        >
            {/* Toggle Button - Desktop only */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden lg:flex absolute top-4 -right-3 w-6 h-6 bg-card border border-border rounded-full items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all z-50 shadow-md text-muted-foreground"
            >
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            <nav className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
                {menuItems.map((item) => (
                    <div key={item.id} className="relative group">
                        <Button
                            onClick={() => handleMenuClick(item.id, item.requireAuth)}
                            variant={currentPage === item.id ? "default" : "ghost"}
                            className={`
                w-full relative overflow-hidden
                ${isExpanded ? 'justify-start gap-2.5 sm:gap-3 px-3 sm:px-4' : 'justify-center px-0'}
                ${currentPage === item.id
                                    ? 'shadow-lg shadow-primary/20'
                                    : ''
                                }
                transition-all duration-200 h-11 sm:h-12
              `}
                        >
                            {/* Glow effect for active item */}
                            {currentPage === item.id && (
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-pulse"></div>
                            )}

                            <span className={`flex-shrink-0 relative ${currentPage === item.id ? 'text-primary-foreground' : ''}`}>
                                {item.icon}
                            </span>
                            <span className={`
                font-medium whitespace-nowrap transition-all duration-300 relative text-sm sm:text-base
                ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
                ${currentPage === item.id ? 'text-primary-foreground' : ''}
              `}>
                                {item.label}
                            </span>
                            {item.badge && item.badge > 0 && (
                                <Badge
                                    variant="destructive"
                                    className={`
                    h-5 min-w-5 flex items-center justify-center p-0 px-1.5 text-xs font-bold
                    transition-all duration-300
                    ${isExpanded ? 'ml-auto opacity-100' : 'absolute -top-1 -right-1 opacity-100'}
                  `}
                                >
                                    {item.badge}
                                </Badge>
                            )}
                        </Button>

                        {/* Tooltip for collapsed state - Desktop only */}
                        {!isExpanded && (
                            <div className="hidden lg:block absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-popover text-popover-foreground text-sm font-medium rounded-lg shadow-xl border-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                                {item.label}
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-popover"></div>
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* User Info Section */}
            <div className={`
        absolute bottom-0 left-0 right-0 p-2 sm:p-3 
        border-t border-sidebar-border
        bg-gradient-to-t from-sidebar/98 to-sidebar/90
        backdrop-blur-md
        transition-all duration-300
      `}>
                <div className={`
          flex items-center rounded-lg 
          bg-gradient-to-r from-sidebar-accent/80 to-sidebar-accent/60
          hover:from-sidebar-accent hover:to-sidebar-accent/80
          hover:shadow-lg hover:shadow-primary/10
          transition-all cursor-pointer
          ${isExpanded ? 'gap-2 sm:gap-3 p-2.5 sm:p-3' : 'justify-center p-2.5 sm:p-3'}
        `}>
                    <Avatar className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm">
                            JD
                        </AvatarFallback>
                    </Avatar>
                    <div className={`
            flex-1 min-w-0 transition-all duration-300
            ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
          `}>
                        <p className="text-xs sm:text-sm font-medium truncate">John Doe</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">Level 42 • Pro</p>
                    </div>
                </div>
            </div>
        </aside>
    );
});