import { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react';
import { MessageCircle, Send, Search, MoreVertical, Phone, Video, Image, Smile, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';

// Mock data
const mockConversations = [
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
            { id: 'm7', senderId: 'u1', content: "Let's play Caro later!", timestamp: '2m ago', isRead: false },
            { id: 'm8', senderId: 'u1', content: 'Are you free?', timestamp: '1m ago', isRead: false },
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

const OnlineIndicator = memo(({ isOnline }) => (
    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-muted-foreground'}`} />
));

const ConversationItem = memo(({
    conversation,
    isActive,
    onClick
}) => (
    <div
        onClick={onClick}
        className={`p-4 cursor-pointer transition-all duration-200 border-l-4 ${isActive
            ? 'bg-accent border-primary'
            : 'hover:bg-accent/50 border-transparent'
            }`}
    >
        <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
                <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {conversation.avatar}
                    </AvatarFallback>
                </Avatar>
                {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold truncate ${conversation.unreadCount > 0 ? '' : 'text-foreground/80'
                        }`}>
                        {conversation.userName}
                    </h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {conversation.lastMessageTime}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-semibold' : 'text-muted-foreground'
                        }`}>
                        {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                        <Badge variant="default" className="ml-2 text-xs h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">
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
    <div className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'} mb-3 animate-slideUp`}>
        <div className={`max-w-[70%] ${isSentByMe ? 'order-2' : 'order-1'}`}>
            <div className={`px-4 py-2.5 rounded-2xl ${isSentByMe
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'bg-muted rounded-bl-md'
                }`}>
                <p className="text-sm break-words">{message.content}</p>
            </div>
            <p className={`text-xs text-muted-foreground mt-1 px-1 ${isSentByMe ? 'text-right' : 'text-left'
                }`}>
                {message.timestamp}
            </p>
        </div>
    </div>
));

const ChatHeader = memo(({
    conversation,
    onBack
}) => (
    <div className="p-4 bg-card border-b flex items-center gap-3">
        <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="lg:hidden -ml-2"
        >
            <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="relative flex-shrink-0">
            <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {conversation.avatar}
                </AvatarFallback>
            </Avatar>
            {conversation.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            )}
        </div>

        <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">
                {conversation.userName}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <OnlineIndicator isOnline={conversation.isOnline} />
                <span>{conversation.isOnline ? 'Online' : 'Offline'}</span>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
                <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
                <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
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
        <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-0 -m-6 sm:-m-8 animate-fadeIn">
            {/* Conversations List */}
            <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'
                } flex-col w-full lg:w-96 bg-card border-r`}>
                {/* Header */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Messages</h1>
                                {totalUnread > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        {totalUnread} unread message{totalUnread > 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10"
                        />
                    </div>
                </div>

                {/* Conversations */}
                <ScrollArea className="flex-1">
                    <div className="divide-y">
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
                        <div className="text-center py-12 px-4">
                            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">
                                No conversations found
                            </h3>
                            <p className="text-muted-foreground mt-2">
                                Try a different search term
                            </p>
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className={`${selectedConversation ? 'flex' : 'hidden lg:flex'
                } flex-col flex-1 bg-background`}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <ChatHeader
                            conversation={selectedConversation}
                            onBack={handleBackToList}
                        />

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4">
                            <div className="max-w-4xl mx-auto">
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

                        {/* Message Input */}
                        <div className="p-4 bg-card border-t">
                            <div className="max-w-4xl mx-auto flex items-end gap-2">
                                <Button variant="ghost" size="sm" className="flex-shrink-0">
                                    <Image className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="flex-shrink-0">
                                    <Smile className="w-5 h-5" />
                                </Button>

                                <div className="flex-1 relative">
                                    <Input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="pr-12"
                                    />
                                </div>

                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="flex-shrink-0"
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                <MessageCircle className="w-12 h-12 text-primary-foreground" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">
                                Your Messages
                            </h2>
                            <p className="text-muted-foreground">
                                Select a conversation to start chatting
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}