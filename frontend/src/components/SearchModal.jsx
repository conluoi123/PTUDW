import { Search, X, TrendingUp, Clock, Gamepad2, Users } from 'lucide-react';
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
        { id: 'home', type: 'page', title: 'Trang chủ', description: 'Dashboard và tổng quan' },
        { id: 'games', type: 'page', title: 'Trò chơi', description: 'Xem tất cả trò chơi' },
        { id: 'profile', type: 'page', title: 'Hồ sơ', description: 'Xem hồ sơ cá nhân' },
        { id: 'achievements', type: 'page', title: 'Thành tựu', description: 'Xem thành tựu đã mở khóa' },
        { id: 'ranking', type: 'page', title: 'Xếp hạng', description: 'Bảng xếp hạng và thống kê' },
        { id: 'friends', type: 'page', title: 'Bạn bè', description: 'Quản lý bạn bè' },
        { id: 'messages', type: 'page', title: 'Tin nhắn', description: 'Trò chuyện với bạn bè' }
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
                return <Gamepad2 className="w-5 h-5 text-blue-500" />;
            case 'page':
                return <TrendingUp className="w-5 h-5 text-purple-500" />;
            case 'friend':
                return <Users className="w-5 h-5 text-green-500" />;
            default:
                return <Search className="w-5 h-5" />;
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />

            {/* Modal */}
            <div className="fixed inset-x-0 top-20 z-50 px-4 animate-in slide-in-from-top duration-300">
                <div ref={modalRef} className="max-w-2xl mx-auto">
                    <Card className="shadow-2xl border-2">
                        <CardContent className="p-0">
                            {/* Search Input */}
                            <div className="p-4 border-b">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Tìm kiếm trò chơi, trang, bạn bè..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-10 h-12 text-base border-0 focus-visible:ring-0"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-full"
                                        >
                                            <X className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Results */}
                            <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                                {!searchQuery.trim() ? (
                                    /* Recent Searches */
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <p className="text-sm font-medium text-muted-foreground">Tìm kiếm gần đây</p>
                                        </div>
                                        <div className="space-y-1">
                                            {recentSearches.map((search, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSearchQuery(search)}
                                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm"
                                                >
                                                    {search}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : filteredResults.length > 0 ? (
                                    /* Search Results */
                                    <div className="p-2">
                                        {filteredResults.map((result) => (
                                            <button
                                                key={result.id}
                                                onClick={() => handleSelectResult(result)}
                                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                                            >
                                                <div className="flex-shrink-0">
                                                    {getResultIcon(result.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm">{result.title}</p>
                                                    {result.description && (
                                                        <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                                                    )}
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                    {result.type === 'game' ? 'Trò chơi' : result.type === 'page' ? 'Trang' : 'Bạn bè'}
                                                </Badge>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    /* No Results */
                                    <div className="p-8 text-center text-muted-foreground">
                                        <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Không tìm thấy kết quả cho "{searchQuery}"</p>
                                        <p className="text-xs mt-1">Thử tìm kiếm với từ khóa khác</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 border-t bg-muted/30">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-background border">↵</kbd>
                                            để chọn
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-background border">Esc</kbd>
                                            để đóng
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
