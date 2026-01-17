import { useState, useMemo, useCallback, memo, useRef, useEffect, useContext } from 'react';
import { MessageCircle, Send, Search, MoreVertical, Phone, Video, Image, Smile, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { MessageService } from '@/services/message.services';
import { AuthContext } from '@/contexts/AuthContext';



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
                    {/* <span className={`w-1.5 h-1.5 rounded-full ${conversation.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} /> */}
                    {/* <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {conversation.isOnline ? 'Active now' : 'Offline'}
                    </span> */}
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
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const { user } = useContext(AuthContext);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fetch conversations list
    useEffect(() => {
        // Guard: Don't fetch if user is not loaded yet
        if (!user?.id) {
            setIsLoading(false);
            return;
        }

        const fetchConversations = async () => {
            try {
                const data = await MessageService.getConversations(user.id);
                
                // Map backend data to UI format
                const formattedConversations = data.map(conv => ({
                    id: conv.partner_id, // Use partner_id as conversation id
                    userId: conv.partner_id,
                    userName: conv.name || conv.username,
                    avatar: (conv.name || conv.username || '?').charAt(0).toUpperCase(),
                    isOnline: false, // Online status not yet implemented in backend
                    lastMessage: conv.last_message || 'No messages yet',
                    lastMessageTime: conv.last_message_at 
                        ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '',
                    unreadCount: parseInt(conv.unread_count) || 0,
                    messages: [] // Will fetch on select
                }));
                
                setConversations(formattedConversations);
            } catch (error) {
                console.error("Error loading conversations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
        
        // Vì ko realtime nên setInterval 10s sẽ useEffect một lần
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, [user?.id]); // Add user.id to dependency

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

    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const messageContent = newMessage.trim();
        // Optimistic UI update
        const tempId = `temp-${Date.now()}`;
        const newMsgOptimistic = {
            id: tempId,
            sender_id: user?.id, // Use backend field name format
            senderId: 'me', // Keep UI format for rendering logic consistency if needed, or unify
            content: messageContent,
            sent_at: new Date().toISOString(),
            isRead: true, // Self messages are read
        };

        // Update UI immediately
        setNewMessage('');
        
        setSelectedConversation(prev => {
            if (!prev) return null;
            return {
                ...prev,
                messages: [...(prev.messages || []), newMsgOptimistic],
            };
        });

        setConversations(prev => prev.map(conv => {
            if (conv.id === selectedConversation.id) {
                return {
                    ...conv,
                    lastMessage: messageContent,
                    lastMessageTime: 'Just now',
                };
            }
            return conv;
        }));

        try {
            await MessageService.sendMessage(user.id, selectedConversation.userId, messageContent);
            // Re-fetch conversation to keep in sync or handle response typically
            // For now, optimistic update is fine.
        } catch (error) {
            console.error("Error sending message:", error);
            // Could revert optimistic update here
        }

    }, [newMessage, selectedConversation, user]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const handleSelectConversation = useCallback(async (conversation) => {
        // Optimistically set selected to show UI immediately
        setSelectedConversation({ ...conversation, messages: [] });
        
        // Mark as read in UI
        setConversations(prev => prev.map(conv =>
            conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv
        ));

        // Mark as read in Backend
        try {
            await MessageService.markAsRead(conversation.userId, user.id);
        } catch (err) {
            console.error("Error marking read:", err);
        }

        // Fetch Message History
        try {
            const history = await MessageService.getHistory(user.id, conversation.userId, 50);
            
            // update trạng thái đã xem
            setSelectedConversation(prev => {
                if (prev && prev.id === conversation.id) {
                    return {
                        ...prev,
                        messages: history.map(msg => ({
                            id: msg.id,
                            senderId: msg.sender_id === user.id ? 'me' : msg.sender_id,
                            content: msg.content,
                            timestamp: new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            isRead: msg.status === 'read'
                        }))
                    };
                }
                return prev;
            });
        } catch (error) {
            console.error("Error fetching history:", error);
        }

    }, [user]);

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
                        {isLoading ? (
                             <div className="p-8 text-center text-gray-500 text-sm">Loading conversations...</div>
                        ) : filteredConversations.map(conversation => (
                            <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                isActive={selectedConversation?.id === conversation.id}
                                onClick={() => handleSelectConversation(conversation)}
                            />
                        ))}
                    </div>

                    {!isLoading && filteredConversations.length === 0 && (
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
                                        Bây giờ
                                    </span>
                                </div>
                                {selectedConversation.messages && selectedConversation.messages.map((message) => (
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