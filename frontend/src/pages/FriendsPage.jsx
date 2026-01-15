import { useState, useMemo, useCallback, memo } from 'react';
import { UserPlus, UserCheck, UserMinus, Search, Users, Clock, X } from 'lucide-react';
import { Button } from '@mui/material';
import { Input } from '@mui/material';
import { Badge } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// Mock data
const mockFriends = [
    { id: '1', name: 'Alice Johnson', avatar: 'AJ', level: 38, isOnline: true, mutualFriends: 12 },
    { id: '2', name: 'Bob Smith', avatar: 'BS', level: 45, isOnline: true, mutualFriends: 8 },
    { id: '3', name: 'Charlie Brown', avatar: 'CB', level: 29, isOnline: false, lastSeen: '2 hours ago', mutualFriends: 15 },
    { id: '4', name: 'Diana Prince', avatar: 'DP', level: 52, isOnline: true, mutualFriends: 20 },
    { id: '5', name: 'Ethan Hunt', avatar: 'EH', level: 41, isOnline: false, lastSeen: '1 day ago', mutualFriends: 5 },
    { id: '6', name: 'Fiona Green', avatar: 'FG', level: 33, isOnline: false, lastSeen: '3 hours ago', mutualFriends: 10 },
    { id: '7', name: 'George Wilson', avatar: 'GW', level: 47, isOnline: true, mutualFriends: 7 },
    { id: '8', name: 'Hannah Lee', avatar: 'HL', level: 36, isOnline: false, lastSeen: '5 minutes ago', mutualFriends: 18 },
];

const mockFriendRequests = [
    { id: '1', userId: 'u1', name: 'Ivan Petrov', avatar: 'IP', level: 25, mutualFriends: 3, requestedAt: '2 days ago' },
    { id: '2', userId: 'u2', name: 'Julia Roberts', avatar: 'JR', level: 31, mutualFriends: 5, requestedAt: '1 week ago' },
    { id: '3', userId: 'u3', name: 'Kevin Hart', avatar: 'KH', level: 28, mutualFriends: 8, requestedAt: '3 days ago' },
];

const mockSuggestions = [
    { id: 's1', name: 'Luna Martinez', avatar: 'LM', level: 40, isOnline: true, mutualFriends: 15 },
    { id: 's2', name: 'Max Turner', avatar: 'MT', level: 35, isOnline: false, lastSeen: '1 hour ago', mutualFriends: 10 },
    { id: 's3', name: 'Nina Patel', avatar: 'NP', level: 42, isOnline: true, mutualFriends: 22 },
    { id: 's4', name: 'Oscar Chen', avatar: 'OC', level: 38, isOnline: false, lastSeen: '2 days ago', mutualFriends: 7 },
    { id: 's5', name: 'Paula Diaz', avatar: 'PD', level: 44, isOnline: true, mutualFriends: 12 },
];

const OnlineStatusIndicator = memo(({ isOnline }) => (
    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-background ${isOnline ? 'bg-green-500' : 'bg-muted-foreground'}`} />
));

const FriendCard = memo(({
    friend,
    onRemove,
    showActions = false
}) => (
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
                    <h3 className="font-semibold truncate">{friend.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">Level {friend.level}</Badge>
                        {friend.mutualFriends && (
                            <span className="text-xs text-muted-foreground">
                                {friend.mutualFriends} mutual friends
                            </span>
                        )}
                    </div>
                    {!friend.isOnline && friend.lastSeen && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{friend.lastSeen}</span>
                        </div>
                    )}
                </div>

                {showActions && onRemove && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(friend.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <UserMinus className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </CardContent>
    </Card>
));

export function FriendsPage() { return <div>Loading...</div> }