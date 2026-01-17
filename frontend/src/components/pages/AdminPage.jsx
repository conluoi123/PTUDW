import {
    Users,
    Gamepad2,
    BarChart3,
    Settings,
    Search,
    ChevronDown,
    ChevronUp,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Save
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import adminService from '@/services/admin.services';
import { GameService } from '@/services/game.services';

// Mock data
const mockUsers = [
    { id: 1, username: 'CodeMaster99', email: 'code@example.com', level: 99, totalGames: 342, winRate: 94, status: 'active', joinDate: '2024-01-15' },
    { id: 2, username: 'AlgoQueen', email: 'algo@example.com', level: 95, totalGames: 298, winRate: 92, status: 'active', joinDate: '2024-01-20' },
    { id: 3, username: 'DevNinja', email: 'dev@example.com', level: 92, totalGames: 315, winRate: 89, status: 'active', joinDate: '2024-02-01' },
    { id: 4, username: 'SpamBot123', email: 'spam@example.com', level: 12, totalGames: 45, winRate: 23, status: 'banned', joinDate: '2024-06-10' },
    { id: 5, username: 'InactiveUser', email: 'inactive@example.com', level: 35, totalGames: 120, winRate: 65, status: 'inactive', joinDate: '2024-03-15' },
];

export function AdminPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [users, setUsers] = useState([]);
    const [gameConfigs, setGameConfigs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [usersData, gamesData] = await Promise.all([
                    adminService.getAllUsers(),
                    GameService.getAllGames()
                ]);
                
                // Map users data to match UI format
                const mappedUsers = usersData.map(user => ({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    level: user.level || 1,
                    totalGames: user.total_games || 0,
                    winRate: user.win_rate || 0,
                    status: user.role === 'admin' ? 'active' : (user.status || 'active'),
                    joinDate: user.create_at ? new Date(user.create_at).toISOString().split('T')[0] : 'N/A'
                }));
                
                setUsers(mappedUsers);
                
                // Map games data
                if (gamesData?.data) {
                    const mappedGames = gamesData.data.map(game => ({
                        id: game.id,
                        name: game.name,
                        enabled: game.status === 'active',
                        boardSize: game.config?.boardSize || 'N/A',
                        maxPlayers: game.config?.maxPlayers || 2,
                        timeLimit: game.config?.timeLimit || 0,
                        difficulty: game.config?.difficulty || 'medium'
                    }));
                    setGameConfigs(mappedGames);
                }
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Mock data for charts (keep for now)
    const dailyActiveUsers = [
        { date: 'Mon', users: 1200 },
        { date: 'Tue', users: 1350 },
        { date: 'Wed', users: 1180 },
        { date: 'Thu', users: 1450 },
        { date: 'Fri', users: 1680 },
        { date: 'Sat', users: 2100 },
        { date: 'Sun', users: 1950 },
    ];

    const gamePopularity = [
        { name: 'Caro 5x5', plays: 4500 },
        { name: 'Caro 4x4', plays: 3200 },
        { name: 'Tic Tac Toe', plays: 2800 },
        { name: 'Candy Crush', plays: 3500 },
        { name: 'Snake', plays: 2100 },
    ];

    const userDistribution = [
        { name: 'Active', value: 68, color: '#10B981' },
        { name: 'Inactive', value: 22, color: '#6B7280' },
        { name: 'Banned', value: 10, color: '#EF4444' },
    ];

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleToggleGame = async (gameId) => {
        try {
            const game = gameConfigs.find(g => g.id === gameId);
            const newStatus = game.enabled ? 'inactive' : 'active';
            
            await adminService.updateGame(gameId, { status: newStatus });
            
            setGameConfigs(prev => prev.map(g =>
                g.id === gameId ? { ...g, enabled: !g.enabled } : g
            ));
        } catch (error) {
            console.error("Error toggling game:", error);
            alert("Failed to toggle game status");
        }
    };

    const handleUpdateGameConfig = (gameId, field, value) => {
        setGameConfigs(prev => prev.map(game =>
            game.id === gameId ? { ...game, [field]: value } : game
        ));
    };

    const handleUserAction = async (userId, action) => {
        try {
            if (action === 'delete') {
                await adminService.deleteUser(userId);
                setUsers(prev => prev.filter(user => user.id !== userId));
                alert("User deleted successfully");
            } else if (action === 'ban') {
                await adminService.updateUser(userId, { status: 'banned' });
                setUsers(prev => prev.map(user =>
                    user.id === userId ? { ...user, status: 'banned' } : user
                ));
                alert("User banned successfully");
            } else if (action === 'activate') {
                await adminService.updateUser(userId, { status: 'active' });
                setUsers(prev => prev.map(user =>
                    user.id === userId ? { ...user, status: 'active' } : user
                ));
                alert("User activated successfully");
            }
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
            alert(`Failed to ${action} user`);
        }
    };

    const filteredUsers = users
        .filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    const SortIcon = ({ field }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ?
            <ChevronUp className="w-4 h-4 inline" /> :
            <ChevronDown className="w-4 h-4 inline" />;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-gray-900 dark:text-white mb-2">Admin Portal</h1>
                    <p className="text-gray-600 dark:text-gray-400">System management and analytics</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    System Online
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-card dark:bg-card border border-border dark:border-border rounded-lg p-1 inline-flex gap-1">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${activeTab === 'overview'
                        ? 'bg-primary dark:bg-primary text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                >
                    <BarChart3 className="w-4 h-4" />
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${activeTab === 'users'
                        ? 'bg-primary dark:bg-primary text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                >
                    <Users className="w-4 h-4" />
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('games')}
                    className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${activeTab === 'games'
                        ? 'bg-primary dark:bg-primary text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                >
                    <Gamepad2 className="w-4 h-4" />
                    Games Analytics
                </button>
                <button
                    onClick={() => setActiveTab('config')}
                    className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${activeTab === 'config'
                        ? 'bg-primary dark:bg-primary text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                >
                    <Settings className="w-4 h-4" />
                    Configuration
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-card dark:bg-card border border-border dark:border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-3xl text-gray-900 dark:text-white">2,547</p>
                            <p className="text-sm text-green-600 mt-1">+12% from last month</p>
                        </div>
                        <div className="bg-card dark:bg-card border border-border dark:border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Active Games</p>
                                <Gamepad2 className="w-5 h-5 text-green-500" />
                            </div>
                            <p className="text-3xl text-gray-900 dark:text-white">5</p>
                            <p className="text-sm text-gray-500 mt-1">All systems operational</p>
                        </div>
                        <div className="bg-card dark:bg-card border border-border dark:border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Plays</p>
                                <BarChart3 className="w-5 h-5 text-purple-500" />
                            </div>
                            <p className="text-3xl text-gray-900 dark:text-white">16,100</p>
                            <p className="text-sm text-green-600 mt-1">+8% from last week</p>
                        </div>
                        <div className="bg-card dark:bg-card border border-border dark:border-border rounded-lg p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Session</p>
                                <Settings className="w-5 h-5 text-orange-500" />
                            </div>
                            <p className="text-3xl text-gray-900 dark:text-white">24m</p>
                            <p className="text-sm text-green-600 mt-1">+3m from average</p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Daily Active Users */}
                        <div className="bg-card dark:bg-card border border-border dark:border-border rounded-lg p-6">
                            <h3 className="text-gray-900 dark:text-white mb-4">Daily Active Users</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={dailyActiveUsers}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="date" stroke="#9CA3AF" />
                                    <YAxis stroke="#9CA3AF" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: '1px solid #374151',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                    <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* User Status Distribution */}
                        <div className="bg-card dark:bg-card border border-border dark:border-border rounded-lg p-6">
                            <h3 className="text-gray-900 dark:text-white mb-4">User Status Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={userDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${value}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {userDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1F2937',
                                            border: '1px solid #374151',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="bg-card dark:bg-card border border-border dark:border-border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users by username or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-card dark:bg-card border border-border dark:border-border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-accent dark:bg-accent border-b border-border dark:border-border">
                                    <tr>
                                        <th
                                            onClick={() => handleSort('id')}
                                            className="px-6 py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                                        >
                                            ID <SortIcon field="id" />
                                        </th>
                                        <th
                                            onClick={() => handleSort('username')}
                                            className="px-6 py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                                        >
                                            Username <SortIcon field="username" />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th
                                            onClick={() => handleSort('level')}
                                            className="px-6 py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                                        >
                                            Level <SortIcon field="level" />
                                        </th>
                                        <th
                                            onClick={() => handleSort('totalGames')}
                                            className="px-6 py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                                        >
                                            Games <SortIcon field="totalGames" />
                                        </th>
                                        <th
                                            onClick={() => handleSort('winRate')}
                                            className="px-6 py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                                        >
                                            Win Rate <SortIcon field="winRate" />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                                Loading users...
                                            </td>
                                        </tr>
                                    ) : filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                                No users found
                                            </td>
                                        </tr>
                                    ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-accent/50 dark:hover:bg-accent/50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {user.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {user.username}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {user.level}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {user.totalGames}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {user.winRate}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                    user.status === 'banned' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                        'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground'
                                                    }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleUserAction(user.id, 'activate')}
                                                        className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                                                        title="Activate"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUserAction(user.id, 'ban')}
                                                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                                        title="Ban"
                                                    >
                                                        <EyeOff className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUserAction(user.id, 'delete')}
                                                        className="p-1 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Games Analytics Tab */}
            {activeTab === 'games' && (
                <div className="space-y-6">
                    {/* Game Popularity Chart */}
                    <div className="bg-card dark:bg-card border border-border dark:border-border rounded-lg p-6">
                        <h3 className="text-gray-900 dark:text-white mb-4">Game Popularity (Total Plays)</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={gamePopularity}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Bar dataKey="plays" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Game Stats Table */}
                    <div className="bg-card dark:bg-card border border-border dark:border-border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-accent dark:bg-accent border-b border-border dark:border-border">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Game
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Total Plays
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Avg. Session
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Completion Rate
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {gameConfigs.map((game, index) => (
                                        <tr key={game.id} className="hover:bg-accent/50 dark:hover:bg-accent/50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {game.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {gamePopularity[index]?.plays.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {15 + index * 2}m
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {85 - index * 3}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${game.enabled
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground'
                                                    }`}>
                                                    {game.enabled ? 'Active' : 'Disabled'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Configuration Tab */}
            {activeTab === 'config' && (
                <div className="space-y-4">
                    <div className="bg-card dark:bg-card border border-border dark:border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-900 dark:text-white">Game Configuration</h3>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                                <Save className="w-4 h-4" />
                                Save All Changes
                            </button>
                        </div>
                    </div>

                    {gameConfigs.map((game) => (
                        <div
                            key={game.id}
                            className="bg-card dark:bg-card border border-border dark:border-border rounded-lg p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg text-gray-900 dark:text-white mb-1">{game.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Configure game parameters</p>
                                </div>
                                <button
                                    onClick={() => handleToggleGame(game.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${game.enabled
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                        : 'border-gray-300 dark:border-gray-700 bg-accent dark:bg-accent text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    {game.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    {game.enabled ? 'Enabled' : 'Disabled'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Board Size
                                    </label>
                                    <input
                                        type="text"
                                        value={game.boardSize}
                                        onChange={(e) => handleUpdateGameConfig(game.id, 'boardSize', e.target.value)}
                                        className="w-full px-3 py-2 bg-accent dark:bg-accent border border-border dark:border-border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Max Players
                                    </label>
                                    <input
                                        type="number"
                                        value={game.maxPlayers}
                                        onChange={(e) => handleUpdateGameConfig(game.id, 'maxPlayers', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 bg-accent dark:bg-accent border border-border dark:border-border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Time Limit (seconds)
                                    </label>
                                    <input
                                        type="number"
                                        value={game.timeLimit}
                                        onChange={(e) => handleUpdateGameConfig(game.id, 'timeLimit', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 bg-accent dark:bg-accent border border-border dark:border-border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Difficulty
                                    </label>
                                    <select
                                        value={game.difficulty}
                                        onChange={(e) => handleUpdateGameConfig(game.id, 'difficulty', e.target.value)}
                                        className="w-full px-3 py-2 bg-accent dark:bg-accent border border-border dark:border-border rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
