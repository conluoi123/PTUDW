import { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react';
import { MessageCircle, Send, Search, MoreVertical, Phone, Video, Image, Smile, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';

// Mock data
const baseConversations = [
    {
        id: 'c1',
        userId: 'u1',
        userName: 'Alice Johnson',
        avatar: 'AJ',
        isOnline: true,
        lastMessage: "Let's play Caro later!",
        lastMessageTime: '5m',
        unreadCount: 2,
        messages: [
            { id: 'm1', senderId: 'u1', content: 'Hey! How are you?', timestamp: '10:30 AM', isRead: true },
            { id: 'm2', senderId: 'me', content: 'Hi! I\'m good, thanks! You?', timestamp: '10:32 AM', isRead: true },
            { id: 'm3', senderId: 'u1', content: 'Great! I just unlocked a new achievement', timestamp: '10:35 AM', isRead: true },
            { id: 'm4', senderId: 'me', content: 'Awesome! Which one?', timestamp: '10:36 AM', isRead: true },
            { id: 'm5', senderId: 'u1', content: 'The "Game Master" achievement for winning 100 games!', timestamp: '10:38 AM', isRead: true },
            { id: 'm6', senderId: 'me', content: 'Wow, congratulations! 🎉', timestamp: '10:40 AM', isRead: true },
            { id: 'm7', senderId: 'u1', content: 'By the way, did you check the new leaderboards?', timestamp: '10:42 AM', isRead: true },
            { id: 'm8', senderId: 'me', content: 'Not yet, I was busy playing Snake.', timestamp: '10:43 AM', isRead: true },
            { id: 'm9', senderId: 'u1', content: 'You should! There are some insane scores there.', timestamp: '10:44 AM', isRead: true },
            { id: 'm10', senderId: 'me', content: 'I bet. I need to practice more if I want to climb up.', timestamp: '10:45 AM', isRead: true },
            { id: 'm11', senderId: 'u1', content: 'We can practice together sometime.', timestamp: '10:46 AM', isRead: true },
            { id: 'm12', senderId: 'me', content: 'Sounds like a plan! How about this weekend?', timestamp: '10:47 AM', isRead: true },
            { id: 'm13', senderId: 'u1', content: 'Sure, Saturday works for me.', timestamp: '10:48 AM', isRead: true },
            { id: 'm14', senderId: 'me', content: 'Perfect. See you then!', timestamp: '10:49 AM', isRead: true },
            { id: 'm15', senderId: 'u1', content: "Let's play Caro later!", timestamp: '2m ago', isRead: false },
            { id: 'm16', senderId: 'u1', content: 'Are you free?', timestamp: '1m ago', isRead: false },
        ],
    },
    {
        id: 'c2',
        userId: 'u2',
        userName: 'Bob Smith',
        avatar: 'BS',
        isOnline: true,
        lastMessage: 'GG! That was a great game',
        lastMessageTime: '15m',
        unreadCount: 0,
        messages: [
            { id: 'm1', senderId: 'u2', content: 'Want to play Snake?', timestamp: '9:00 AM', isRead: true },
            { id: 'm2', senderId: 'me', content: 'Sure! Let me finish this round', timestamp: '9:02 AM', isRead: true },
            { id: 'm3', senderId: 'u2', content: 'No rush, take your time', timestamp: '9:03 AM', isRead: true },
            { id: 'm4', senderId: 'me', content: 'Ready now!', timestamp: '9:10 AM', isRead: true },
            { id: 'm5', senderId: 'u2', content: 'GG! That was a great game', timestamp: '15m ago', isRead: true },
        ],
    },
    {
        id: 'c3',
        userId: 'u3',
        userName: 'Diana Prince',
        avatar: 'DP',
        isOnline: false,
        lastMessage: 'Thanks for the tips!',
        lastMessageTime: '1h',
        unreadCount: 0,
        messages: [
            { id: 'm1', senderId: 'u3', content: 'How do you play Candy Crush so well?', timestamp: 'Yesterday', isRead: true },
            { id: 'm2', senderId: 'me', content: 'Focus on creating special candies and combos', timestamp: 'Yesterday', isRead: true },
            { id: 'm3', senderId: 'u3', content: 'Thanks for the tips!', timestamp: '1h ago', isRead: true },
        ],
    },
    {
        id: 'c4',
        userId: 'u4',
        userName: 'Charlie Brown',
        avatar: 'CB',
        isOnline: false,
        lastMessage: 'See you tomorrow!',
        lastMessageTime: '2h',
        unreadCount: 0,
        messages: [
            { id: 'm1', senderId: 'me', content: 'Up for a Tic Tac Toe match?', timestamp: '2h ago', isRead: true },
            { id: 'm2', senderId: 'u4', content: 'Not right now, maybe tomorrow?', timestamp: '2h ago', isRead: true },
            { id: 'm3', senderId: 'me', content: 'Sure, no problem!', timestamp: '2h ago', isRead: true },
            { id: 'm4', senderId: 'u4', content: 'See you tomorrow!', timestamp: '2h ago', isRead: true },
        ],
    },
    {
        id: 'c5',
        userId: 'u5',
        userName: 'Ethan Hunt',
        avatar: 'EH',
        isOnline: true,
        lastMessage: 'Check out the new ranking!',
        lastMessageTime: '3h',
        unreadCount: 1,
        messages: [
            { id: 'm1', senderId: 'u5', content: 'Did you see the new ranking?', timestamp: '3h ago', isRead: true },
            { id: 'm2', senderId: 'me', content: 'Not yet, why?', timestamp: '3h ago', isRead: true },
            { id: 'm3', senderId: 'u5', content: 'Check out the new ranking!', timestamp: '3h ago', isRead: false },
        ],
    },
];

// Generate more conversations to demonstrate scrolling
const mockConversations = [
    ...baseConversations,
    ...Array.from({ length: 15 }).map((_, i) => ({
        id: `c${i + 10}`,
        userId: `u${i + 10}`,
        userName: `Player ${i + 1}`,
        avatar: `P${i + 1}`,
        isOnline: i % 3 === 0,
        lastMessage: 'Anyone up for a game?',
        lastMessageTime: `${i + 1}d`,
        unreadCount: 0,
        messages: []
    }))
];

const OnlineIndicator = memo(({ isOnline }) => (
    <div className={`w-3 h-3 rounded-full border-2 border-white dark:border-[#16181d] ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
));

const ConversationItem = memo(({
    conversation,
    isActive,
    onClick
}) => (
    <div
        onClick={onClick}
        className={`
            p-4 cursor-pointer transition-all duration-200 border-l-4 
            hover:bg-gray-50 dark:hover:bg-white/5
            ${isActive
                ? 'bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-500'
                : 'border-transparent'
            }
        `}
    >
        <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
                <Avatar className="w-12 h-12 ring-2 ring-gray-100 dark:ring-white/10">
                    <AvatarFallback className={`${isActive ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-white/10 dark:text-gray-300'} font-bold`}>
                        {conversation.avatar}
                    </AvatarFallback>
                </Avatar>
                {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0">
                        <OnlineIndicator isOnline={true} />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold truncate text-sm ${conversation.unreadCount > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                        {conversation.userName}
                    </h3>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                        {conversation.lastMessageTime}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <p className={`text-xs truncate max-w-[140px] ${conversation.unreadCount > 0 ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                        <Badge className="ml-2 text-[10px] h-5 min-w-[1.25rem] flex items-center justify-center rounded-full px-1 bg-red-500 hover:bg-red-600 border-0">
                            {conversation.unreadCount}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    </div>
));

const MessageBubble = memo(({
    message,
    isSentByMe
}) => (
    <div className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'} mb-4 animate-in slide-in-from-bottom-2 duration-300`}>
        <div className={`max-w-[75%] ${isSentByMe ? 'items-end' : 'items-start'} flex flex-col`}>
            <div className={`
                px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed
                ${isSentByMe
                    ? 'bg-indigo-500 text-white rounded-br-sm'
                    : 'bg-white dark:bg-[#1e2025] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/5 rounded-bl-sm'
                }
            `}>
                <p className="break-words">{message.content}</p>
            </div>
            <div className="flex items-center gap-1 mt-1 px-1">
                <p className="text-[10px] text-gray-400">
                    {message.timestamp}
                </p>
                {isSentByMe && (
                    <span className="text-indigo-500 dark:text-indigo-400">
                        {message.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                    </span>
                )}
            </div>
        </div>
    </div>
));

const ChatHeader = memo(({
    conversation,
    onBack
}) => (
    <div className="h-16 px-6 bg-white/80 dark:bg-[#16181d]/80 backdrop-blur-md border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="lg:hidden text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
            >
                <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="relative">
                <Avatar className="w-10 h-10 ring-2 ring-indigo-500/20">
                    <AvatarFallback className="bg-indigo-500 text-white font-bold text-sm">
                        {conversation.avatar}
                    </AvatarFallback>
                </Avatar>
                {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#16181d]" />
                )}
            </div>

            <div>
                <h2 className="font-bold text-gray-900 dark:text-white leading-tight">
                    {conversation.userName}
                </h2>
                <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${conversation.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {conversation.isOnline ? 'Active now' : 'Offline'}
                    </span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-1 mt-2 mb-2">
            <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 rounded-full">
                <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 rounded-full">
                <Video className="w-5 h-5" />
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-2" />
            <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                <MoreVertical className="w-5 h-5" />
            </Button>
        </div>
    </div>
));

export function MessagesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [conversations, setConversations] = useState(mockConversations);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedConversation?.messages]);

    const filteredConversations = useMemo(() => {
        if (!searchQuery) return conversations;
        return conversations.filter(conv =>
            conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [conversations, searchQuery]);

    const totalUnread = useMemo(() =>
        conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
        , [conversations]);

    const handleSendMessage = useCallback(() => {
        if (!newMessage.trim() || !selectedConversation) return;

        const newMsg = {
            id: `m${Date.now()}`,
            senderId: 'me',
            content: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            isRead: true,
        };

        setConversations(prev => prev.map(conv => {
            if (conv.id === selectedConversation.id) {
                return {
                    ...conv,
                    messages: [...conv.messages, newMsg],
                    lastMessage: newMessage.trim(),
                    lastMessageTime: 'Just now',
                };
            }
            return conv;
        }));

        setSelectedConversation(prev => {
            if (!prev) return null;
            return {
                ...prev,
                messages: [...prev.messages, newMsg],
            };
        });

        setNewMessage('');
    }, [newMessage, selectedConversation]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const handleSelectConversation = useCallback((conversation) => {
        // Mark as read
        setConversations(prev => prev.map(conv =>
            conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
        ));
        setSelectedConversation(conversation);
    }, []);

    const handleBackToList = useCallback(() => {
        setSelectedConversation(null);
    }, []);

    return (
        <div className="h-[calc(100vh-8rem)] rounded-3xl overflow-hidden shadow-2xl shadow-black/5 bg-white dark:bg-[#16181d] border border-gray-200 dark:border-white/5 flex flex-col lg:flex-row animate-in fade-in duration-500">
            {/* Conversations Sidebar */}
            <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'
                } flex-col w-full lg:w-80 border-r border-gray-200 dark:border-white/5 bg-white/50 dark:bg-[#16181d]/50 backdrop-blur-sm min-h-0 overflow-hidden`}>
                
                {/* Sidebar Header */}
                <div className="p-5 border-b border-gray-200/50 dark:border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            {/* <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <MessageCircle className="w-5 h-5 text-white" />
                            </div> */}
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-none">Chat</h1>
                                {totalUnread > 0 && (
                                    <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mt-1">
                                        {totalUnread} new messages
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        <Input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 bg-gray-100/50 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-black/20 focus:border-indigo-500/30 rounded-xl transition-all"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <ScrollArea className="flex-1 bg-white/30 dark:bg-transparent h-[calc(100vh-200px)]" type='always'>
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {filteredConversations.map(conversation => (
                            <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                isActive={selectedConversation?.id === conversation.id}
                                onClick={() => handleSelectConversation(conversation)}
                            />
                        ))}
                    </div>

                    {filteredConversations.length === 0 && (
                        <div className="text-center py-12 px-6">
                            <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                No chats found
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Try searching for a different user
                            </p>
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className={`${selectedConversation ? 'flex' : 'hidden lg:flex'
                } flex-col flex-1 bg-gray-50/50 dark:bg-[#0f1115]/50 backdrop-blur-xl relative min-h-0 overflow-hidden`}>
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

                {selectedConversation ? (
                    <>
                        <ChatHeader
                            conversation={selectedConversation}
                            onBack={handleBackToList}
                        />

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-4 lg:p-6 h-[calc(100vh-200px)]" type='always'>
                            <div className="max-w-screen mx-auto space-y-6">
                                <div className="text-center py-6">
                                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                        Today, {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                                {selectedConversation.messages.map((message) => (
                                    <MessageBubble
                                        key={message.id}
                                        message={message}
                                        isSentByMe={message.senderId === 'me'}
                                    />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-[#16181d] border-t border-gray-200/50 dark:border-white/5 backdrop-blur-md">
                            <div className="max-w-screen mx-auto bg-gray-100 dark:bg-white/5 p-2 rounded-3xl flex items-end gap-2 border border-transparent focus-within:border-indigo-500/30 focus-within:bg-white dark:focus-within:bg-black/20 transition-all shadow-inner">
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-indigo-500 hover:bg-transparent rounded-full h-10 w-10">
                                    <Smile className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="hidden sm:flex text-gray-400 hover:text-pink-500 hover:bg-transparent rounded-full h-10 w-10">
                                    <Image className="w-5 h-5" />
                                </Button>

                                <div className="flex-1 py-2">
                                    <input
                                        type="text"
                                        placeholder="Nhập tin nhắn..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400 max-h-32 overflow-y-auto resize-none"
                                        style={{ height: '24px' }}
                                    />
                                </div>

                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    size="icon"
                                    className={`
                                        h-10 w-10 rounded-full transition-all duration-300 shadow-lg
                                        ${newMessage.trim() 
                                            ? 'bg-indigo-500 text-white hover:scale-105 active:scale-95' 
                                            : 'bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <div className="w-16 h-16 bg-white dark:bg-[#16181d] rounded-full flex items-center justify-center shadow-lg">
                                <MessageCircle className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Design Your Strategy
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
                            Select a friend from the sidebar to verify strategies, accept challenges, or just chat.
                        </p>
                        <Button className="bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">
                            Start a New Chat
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}