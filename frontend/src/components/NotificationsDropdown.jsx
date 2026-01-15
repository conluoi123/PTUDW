import { Bell, Trophy, Users, Gamepad2, MessageCircle, X } from 'lucide-react';
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
            title: 'Thành tựu mới!',
            message: 'Bạn đã mở khóa "Speed Demon"',
            time: '5 phút trước',
            read: false
        },
        {
            id: 2,
            type: 'friend',
            title: 'Lời mời kết bạn',
            message: 'Alice Smith đã gửi lời mời kết bạn',
            time: '10 phút trước',
            read: false
        },
        {
            id: 3,
            type: 'message',
            title: 'Tin nhắn mới',
            message: 'Bob Johnson: "Chơi Caro không?"',
            time: '15 phút trước',
            read: false
        },
        {
            id: 4,
            type: 'game',
            title: 'Thách đấu',
            message: 'Carol White thách đấu bạn trong Tic Tac Toe',
            time: '30 phút trước',
            read: true
        },
        {
            id: 5,
            type: 'achievement',
            title: 'Cột mốc mới',
            message: 'Bạn đã chơi 100 trận!',
            time: '1 giờ trước',
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
                return <Trophy className="w-5 h-5 text-yellow-500" />;
            case 'friend':
                return <Users className="w-5 h-5 text-blue-500" />;
            case 'game':
                return <Gamepad2 className="w-5 h-5 text-purple-500" />;
            case 'message':
                return <MessageCircle className="w-5 h-5 text-green-500" />;
            default:
                return <Bell className="w-5 h-5" />;
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] animate-in slide-in-from-top duration-200 z-50"
        >
            <Card className="shadow-xl border-2">
                <CardContent className="p-0">
                    {/* Header */}
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold">Thông báo</h3>
                            {unreadCount > 0 && (
                                <Badge variant="destructive" className="h-5 px-2">
                                    {unreadCount}
                                </Badge>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={markAllAsRead}
                                className="text-xs h-7"
                            >
                                Đánh dấu tất cả đã đọc
                            </Button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Không có thông báo mới</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => markAsRead(notification.id)}
                                    className={`p-4 border-b last:border-b-0 hover:bg-accent transition-colors cursor-pointer group relative ${!notification.read ? 'bg-accent/50' : ''
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-medium text-sm">{notification.title}</p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification(notification.id);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                >
                                                    <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                                </button>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                                        </div>
                                        {!notification.read && (
                                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t text-center">
                            <Button variant="ghost" size="sm" className="w-full">
                                Xem tất cả thông báo
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
