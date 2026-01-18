import { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { UserPlus, UserCheck, UserMinus, Search, Users, Clock, X } from 'lucide-react';
import { Button } from '@mui/material';
import { Input } from '@mui/material';
import { Badge } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// configuration
const API_BASE = 'http://localhost:3000/api'

// helper to create mock data for fields missing in the database
const enrichUserData = (user) => ({
  ...user,
  // create initials for avatar if avatar url is missing
  avatar: user.name ? user.name.substring(0, 2).toUpperCase() : 'UN',
  level: Math.floor(Math.random() * 50) + 1, // random level
  isOnline: Math.random() > 0.5, // random online status
  mutualFriends: Math.floor(Math.random() * 10),
  lastSeen: 'Just now'
})

const OnlineStatusIndicator = memo(({ isOnline }) => (
    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-background ${isOnline ? 'bg-green-500' : 'bg-muted-foreground'}`} />
));

const FriendCard = memo(({ friend, onRemove, showActions = false }) => (
  <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
    <CardContent className="p-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-14 h-14">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {friend.avatar}
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
))

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
))

const SuggestionCard = memo(({ suggestion, onSendRequest }) => (
  <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
    <CardContent className="p-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-14 h-14">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {suggestion.avatar}
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
))

export function FriendsPage() {
    const [activeTab, setActiveTab] = useState('friends')
    const [searchQuery, setSearchQuery] = useState('')

    // data states - initialized as empty arrays
    const [friends, setFriends] = useState([])
    const [friendRequests, setFriendRequests] = useState([])
    const [suggestions, setSuggestions] = useState([])
    
    // user state
    const [currentUserId, setCurrentUserId] = useState(null)
    const [loading, setLoading] = useState(true)

    // fetch user_id based on email from localStorage
    useEffect(() => {
        const fetchUserId = async () => {
        const storedId = localStorage.getItem('userId')

        if (!storedId) {
            console.error('No id found in localStorage')
            setLoading(false)
            return
        }

        try {
            // call api to find user by email
            const res = await fetch(`${API_BASE}/friends/find?id=${storedId}`)
            
            if (!res.ok) throw new Error('User not found')

            const data = await res.json()

            if (data.data && data.data.id) {
            setCurrentUserId(data.data.id)
            fetchAllData(data.data.id)
            }
        } catch (error) {
            console.error('Error fetching user ID:', error)
            setLoading(false)
        }
        }

        fetchUserId()
    }, [])

    // fetch all friend-related data
    const fetchAllData = async (userId) => {
        setLoading(true)
        try {
        const [friendsRes, requestsRes, suggestionsRes] = await Promise.all([
            fetch(`${API_BASE}/friends/list?userId=${userId}`),
            fetch(`${API_BASE}/friends/requests?userId=${userId}`),
            fetch(`${API_BASE}/friends/suggestions?userId=${userId}`)
        ])

        const friendsData = await friendsRes.json()
        const requestsData = await requestsRes.json()
        const suggestionsData = await suggestionsRes.json()

        // set state with enriched data
        setFriends(friendsData.data.map(enrichUserData))
        setFriendRequests(requestsData.data.map(enrichUserData))
        setSuggestions(suggestionsData.data.map(enrichUserData))
        } catch (error) {
        console.error('Failed to fetch friends data:', error)
        } finally {
        setLoading(false)
        }
    }

    // handle accepting friend request
    const handleAcceptRequest = useCallback(
        async (requesterId) => {
        if (!currentUserId) return
        try {
            const res = await fetch(`${API_BASE}/friends/accept/${requesterId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentUserId: currentUserId })
            })

            if (res.ok) {
            const acceptedUser = friendRequests.find((r) => r.id === requesterId)
            setFriendRequests((prev) => prev.filter((r) => r.id !== requesterId))
            setFriends((prev) => [acceptedUser, ...prev])
            }
        } catch (error) {
            console.error('Error accepting:', error)
        }
        },
        [friendRequests, currentUserId]
    )

    // handle rejecting request or removing friend
    const handleRejectOrRemove = useCallback(
        async (targetId) => {
        if (!currentUserId) return
        try {
            const res = await fetch(`${API_BASE}/friends/remove/${targetId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentUserId: currentUserId })
            })

            if (res.ok) {
            setFriendRequests((prev) => prev.filter((r) => r.id !== targetId))
            setFriends((prev) => prev.filter((f) => f.id !== targetId))
            }
        } catch (error) {
            console.error('Error removing:', error)
        }
        },
        [currentUserId]
    )

    // handle sending friend request from suggestions
    const handleSendRequest = useCallback(
        async (targetUserId) => {
        if (!currentUserId) return
        try {
            const res = await fetch(`${API_BASE}/friends/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentUserId: currentUserId,
                targetUserId: targetUserId
            })
            })

            if (res.ok) {
            setSuggestions((prev) => prev.filter((s) => s.id !== targetUserId))
            alert('Friend request sent!')
            }
        } catch (error) {
            console.error('Error sending request:', error)
        }
        },
        [currentUserId]
    )

    const filteredFriends = useMemo(() => {
        if (!searchQuery) return friends;
        return friends.filter(friend =>
            friend.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [friends, searchQuery]);

    const onlineFriends = useMemo(() =>
        friends.filter(f => f.isOnline).length
        , [friends]);

    if (loading) {
        return <div className="p-8 text-center">Loading data...</div>
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
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

            {/* Tabs */}
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
                        Suggestions ({suggestions.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="friends" className="space-y-4">
                    {/* Search Bar */}
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

                    {/* Friends Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredFriends.map(friend => (
                            <FriendCard
                                key={friend.id}
                                friend={friend}
                                onRemove={handleRejectOrRemove}
                                showActions={true}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
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
                </TabsContent>

                <TabsContent value="requests" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {friendRequests.map(request => (
                            <FriendRequestCard
                                key={request.id}
                                request={request}
                                onAccept={handleAcceptRequest}
                                onReject={handleRejectOrRemove}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestions.map(suggestion => (
                            <SuggestionCard
                                key={suggestion.id}
                                suggestion={suggestion}
                                onSendRequest={handleSendRequest}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {suggestions.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <UserPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold">No suggestions</h3>
                                <p className="text-muted-foreground mt-2">
                                    We'll show you friend suggestions based on mutual connections
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}