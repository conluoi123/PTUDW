import { Bell, Trophy, Users, Gamepad2, MessageCircle, X, Check } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useRef, useEffect } from 'react';

export function NotificationsDropdown({ isOpen, onClose }) {
    const dropdownRef = useRef(null);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'achievement',
            title: 'New Achievement!',
            message: 'You have unlocked "Speed Demon"',
            time: '5 min ago',
            read: false
        },
        {
            id: 2,
            type: 'friend',
            title: 'Friend Request',
            message: 'Alice Smith sent you a friend request',
            time: '10 min ago',
            read: false
        },
        {
            id: 3,
            type: 'message',
            title: 'New Message',
            message: 'Bob Johnson: "Want to play Caro?"',
            time: '15 min ago',
            read: false
        },
        {
            id: 4,
            type: 'game',
            title: 'Challenge Received',
            message: 'Carol White challenged you in Tic Tac Toe',
            time: '30 min ago',
            read: true
        },
        {
            id: 5,
            type: 'achievement',
            title: 'Milestone',
            message: 'You played 100 matches!',
            time: '1 hour ago',
            read: true
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

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'achievement':
                return <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-500"><Trophy className="w-5 h-5" /></div>;
            case 'friend':
                return <div className="p-2 rounded-full bg-blue-500/10 text-blue-500"><Users className="w-5 h-5" /></div>;
            case 'game':
                return <div className="p-2 rounded-full bg-purple-500/10 text-purple-500"><Gamepad2 className="w-5 h-5" /></div>;
            case 'message':
                return <div className="p-2 rounded-full bg-green-500/10 text-green-500"><MessageCircle className="w-5 h-5" /></div>;
            default:
                return <div className="p-2 rounded-full bg-gray-500/10 text-gray-500"><Bell className="w-5 h-5" /></div>;
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] animate-in slide-in-from-top-2 fade-in duration-200 z-50 transform origin-top-right"
        >
            <div className="rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-2xl shadow-indigo-500/10 overflow-hidden bg-white/90 dark:bg-[#16181d]/90 backdrop-blur-xl">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 h-5 px-1.5 min-w-[1.25rem] flex items-center justify-center">
                                {unreadCount}
                            </Badge>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllAsRead}
                            className="text-xs h-7 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium"
                        >
                            Mark all read
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Bell className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">No notifications</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">You're all caught up!</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                className={`
                                    relative p-4 border-b border-gray-50 dark:border-white/5 last:border-b-0 
                                    hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group
                                    ${!notification.read ? 'bg-indigo-50/50 dark:bg-indigo-500/5' : ''}
                                `}
                            >
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm ${!notification.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                                                {notification.title}
                                            </p>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap">{notification.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                            {notification.message}
                                        </p>
                                    </div>
                                    
                                    {/* Unread Indicator */}
                                    {!notification.read && (
                                        <div className="absolute top-1/2 right-3 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-50 dark:ring-indigo-500/10"></div>
                                    )}

                                    {/* Delete Action */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                            }}
                                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                        <Button variant="ghost" size="sm" className="w-full text-xs font-medium h-8 rounded-lg text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                            View All Notifications
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
