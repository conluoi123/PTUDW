import { useState, useMemo, useCallback, memo, useEffect, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { UserPlus, UserCheck, UserMinus, Search, Users, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Input, Badge, Card, CardContent } from '@mui/material';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { friendService } from '../../services/friends.services';
import { Pagination } from '@/components/ui/pagination';
import { LoadingOverlay } from '../ui/LoadingOverlay';
const enrichUserData = (user) => ({
    ...user,
    avatar: user.avatar || (user.name ? user.name.substring(0, 2).toUpperCase() : 'UN'),
    level: Math.floor(Math.random() * 50) + 1,
    isOnline: Math.random() > 0.5,
    mutualFriends: Math.floor(Math.random() * 10),
    lastSeen: 'Just now'
});

const OnlineStatusIndicator = memo(({ isOnline }) => (
    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-background ${isOnline ? 'bg-green-500' : 'bg-muted-foreground'}`} />
));

const FriendCard = memo(({ friend, onRemove, showActions = false }) => (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
        <CardContent className="p-4">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src={friend.avatar} alt={friend.name || friend.username} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            {friend.name ? friend.name.substring(0, 2).toUpperCase() : (friend.username ? friend.username.substring(0, 2).toUpperCase() : 'UN')}
                        </AvatarFallback>
                    </Avatar>
                    <OnlineStatusIndicator isOnline={friend.isOnline} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                        {friend.name || friend.username}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                            Level {friend.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {friend.mutualFriends} mutual
                        </span>
                    </div>
                </div>
                {showActions && onRemove && (
                    <Button
                        variant="text"
                        size="small"
                        color="error"
                        onClick={() => onRemove(friend.id)}
                    >
                        <UserMinus className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </CardContent>
    </Card>
));

const FriendRequestCard = memo(({ request, onAccept, onReject }) => (
    <Card className="hover:shadow-lg transition-all duration-200">
        <CardContent className="p-4">
            <div className="flex items-start gap-4">
                <Avatar className="w-14 h-14 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {request.avatar}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{request.name || request.username}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Sent: {new Date(request.requestedAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 mt-3">
                        <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => onAccept(request.id)}
                            className="flex-1"
                        >
                            <UserCheck className="w-4 h-4 mr-1" /> Accept
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => onReject(request.id)}
                            className="flex-1"
                        >
                            <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
));

const SuggestionCard = memo(({ suggestion, onSendRequest }) => (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
        <CardContent className="p-4">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Avatar className="w-14 h-14">
                        <AvatarImage src={suggestion.avatar} alt={suggestion.name || suggestion.username} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            {suggestion.name ? suggestion.name.substring(0, 2).toUpperCase() : (suggestion.username ? suggestion.username.substring(0, 2).toUpperCase() : 'UN')}
                        </AvatarFallback>
                    </Avatar>
                    <OnlineStatusIndicator isOnline={suggestion.isOnline} />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                        {suggestion.name || suggestion.username}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                            Level {suggestion.level}
                        </Badge>
                    </div>
                </div>
                <Button size="small" onClick={() => onSendRequest(suggestion.id)}>
                    <UserPlus className="w-4 h-4" />
                </Button>
            </div>
        </CardContent>
    </Card>
));

export function FriendsPage() {
    const [activeTab, setActiveTab] = useState('friends');
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestionsSearchQuery, setSuggestionsSearchQuery] = useState('');

    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const [totalSuggestions, setTotalSuggestions] = useState(0);

    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    
    // Pagination states
    const [friendsPage, setFriendsPage] = useState(1);
    const [suggestionsPage, setSuggestionsPage] = useState(1);



    const fetchAllData = async (userId) => {
        setLoading(true);
        try {
            const [friendsData, requestsData, suggestionsData] = await Promise.all([
                friendService.getFriendsList(userId, friendsPage),
                friendService.getFriendRequests(userId),
                friendService.getSuggestions(userId, suggestionsPage)
            ]);

            setFriends((friendsData.data || []).map(enrichUserData));
            setFriendRequests((requestsData.data || []).map(enrichUserData));
            setSuggestions((suggestionsData.data || []).map(enrichUserData));
            if (suggestionsData.total) setTotalSuggestions(suggestionsData.total);
            
            if (friendsData.page && friendsData.page !== friendsPage) setFriendsPage(friendsData.page);
            if (suggestionsData.page && suggestionsData.page !== suggestionsPage) setSuggestionsPage(suggestionsData.page);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Initial Fetch when user is available
    useEffect(() => {
        if (user?.id) {
            fetchAllData(user.id);
        }
    }, [user]);

    // Refetch when page changes
    // Refetch when pagination changes
    useEffect(() => {
        if (user?.id) {
            const fetchData = async () => {
                try {
                    // Only fetch the specific tab data needed or all if complex
                    // For simplicity, we can fetch specific lists based on active tab or just specific pagination updates
                    // Here we update friends and suggestions as they are paginated
                    const [friendsData, suggestionsData] = await Promise.all([
                        friendService.getFriendsList(user.id, friendsPage),
                        friendService.getSuggestions(user.id, suggestionsPage)
                    ]);
                    setFriends((friendsData.data || []).map(enrichUserData));
                    setSuggestions((suggestionsData.data || []).map(enrichUserData));
                    if (suggestionsData.total) setTotalSuggestions(suggestionsData.total);

                    if (friendsData.page && friendsData.page !== friendsPage) setFriendsPage(friendsData.page);
                    if (suggestionsData.page && suggestionsData.page !== suggestionsPage) setSuggestionsPage(suggestionsData.page);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }
    }, [friendsPage, suggestionsPage, user]);

    const handleAcceptRequest = useCallback(
        async (requesterId) => {
            if (!user?.id) return;
            try {
                await friendService.acceptRequest(requesterId, user.id);
                const acceptedUser = friendRequests.find((r) => r.id === requesterId);
                setFriendRequests((prev) => prev.filter((r) => r.id !== requesterId));
                if (acceptedUser) {
                    setFriends((prev) => [acceptedUser, ...prev]);
                }
            } catch (error) {
                console.error(error);
            }
        },
        [friendRequests, user?.id]
    );

    const handleRejectOrRemove = useCallback(
        async (targetId) => {
            if (!user?.id) return;
            try {
                await friendService.removeOrReject(targetId, user.id);
                setFriendRequests((prev) => prev.filter((r) => r.id !== targetId));
                setFriends((prev) => prev.filter((f) => f.id !== targetId));
            } catch (error) {
                console.error(error);
            }
        },
        [user?.id]
    );

    const handleSendRequest = useCallback(
        async (targetUserId) => {
            if (!user?.id) return;
            try {
                await friendService.sendRequest(user.id, targetUserId);
                setSuggestions((prev) => prev.filter((s) => s.id !== targetUserId));
                alert('Friend request sent!');
            } catch (error) {
                console.error(error);
            }
        },
        [user?.id]
    );

    const filteredFriends = useMemo(() => {
        if (!searchQuery) return friends;
        return friends.filter(friend =>
            (friend.name || friend.username || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [friends, searchQuery]);

    const filteredSuggestions = useMemo(() => {
        if (!suggestionsSearchQuery) return suggestions;
        return suggestions.filter(suggestion =>
            (suggestion.name || suggestion.username || '').toLowerCase().includes(suggestionsSearchQuery.toLowerCase())
        );
    }, [suggestions, suggestionsSearchQuery]);

    const onlineFriends = useMemo(() =>
        friends.filter(f => f.isOnline).length
        , [friends]);

    if (loading) {
        return <LoadingOverlay message="Loading..." />
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <Card className="border-0 bg-primary text-primary-foreground shadow-xl">
                <CardContent className="p-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary-foreground/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Friends</h1>
                            <p className="text-primary-foreground/80 mt-1">
                                {friends.length} friends • {onlineFriends} online
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="friends" className="flex-1 sm:flex-none">
                        All Friends ({friends.length})
                    </TabsTrigger>
                    <TabsTrigger value="requests" className="flex-1 sm:flex-none">
                        <span className="flex items-center gap-2">
                            Friend Requests
                            {friendRequests.length > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                    {friendRequests.length}
                                </Badge>
                            )}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="suggestions" className="flex-1 sm:flex-none">
                        Suggestions ({totalSuggestions})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="friends" className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search friends..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {filteredFriends.map(friend => (
                            <FriendCard
                                key={friend.id}
                                friend={friend}
                                onRemove={handleRejectOrRemove}
                                showActions={true}
                            />
                        ))}
                    </div>

                    {filteredFriends.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold">
                                    {searchQuery ? 'No friends found' : 'No friends yet'}
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    {searchQuery ? 'Try a different search term' : 'Start adding friends to connect with other players'}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination for friends */}
                    {filteredFriends.length > 0 && !searchQuery && (
                        <Pagination 
                            currentPage={friendsPage} 
                            onPageChange={setFriendsPage} 
                            hasNext={friends.length >= 3}
                            hasPrevious={friendsPage > 1}
                            className="border-t border-border pt-4 mt-4"
                        />
                    )}
                </TabsContent>

                <TabsContent value="requests" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {friendRequests.map(request => (
                            <FriendRequestCard
                                key={request.id}
                                request={request}
                                onAccept={handleAcceptRequest}
                                onReject={handleRejectOrRemove}
                            />
                        ))}
                    </div>

                    {friendRequests.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <UserCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold">No pending requests</h3>
                                <p className="text-muted-foreground mt-2">
                                    You don't have any friend requests at the moment
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="suggestions" className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search suggestions..."
                            value={suggestionsSearchQuery}
                            onChange={(e) => setSuggestionsSearchQuery(e.target.value)}
                            className="pl-12 h-12"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {filteredSuggestions.map(suggestion => (
                            <SuggestionCard
                                key={suggestion.id}
                                suggestion={suggestion}
                                onSendRequest={handleSendRequest}
                            />
                        ))}
                    </div>

                    {filteredSuggestions.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <UserPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold">
                                    {suggestionsSearchQuery ? 'No suggestions found' : 'No suggestions'}
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    {suggestionsSearchQuery ? 'Try a different search term' : "We'll show you friend suggestions based on mutual connections"}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pagination for suggestions */}
                    {filteredSuggestions.length > 0 && !suggestionsSearchQuery && (
                        <Pagination 
                            currentPage={suggestionsPage} 
                            onPageChange={setSuggestionsPage} 
                            hasNext={suggestions.length >= 3}
                            hasPrevious={suggestionsPage > 1}
                            className="border-t border-border pt-4 mt-4"
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}