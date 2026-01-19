import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import adminService from '@/services/admin.services';

export function UpdateUserDialog({ isOpen, onClose, userId, onUserUpdated }) {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        role: 'user',
        avatar: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Load user data when dialog opens
    useEffect(() => {
        if (isOpen && userId) {
            const fetchUser = async () => {
                try {
                    setIsLoading(true);
                    const user = await adminService.getUserById(userId);
                    setFormData({
                        name: user.name || '',
                        username: user.username || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        role: user.role || 'user',
                        avatar: user.avatar || '',
                        password: '' 
                    });
                } catch (error) {
                    console.error("Failed to fetch user details:", error);
                    alert("Failed to load user data");
                    onClose();
                } finally {
                    setIsLoading(false);
                }
            };
            fetchUser();
        }
    }, [isOpen, userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            
            // Only send password if it's not empty
            const dataToSend = { ...formData };
            if (!dataToSend.password) {
                delete dataToSend.password;
            }

            await adminService.updateUser(userId, dataToSend);
            onUserUpdated();
            onClose();
            alert("User updated successfully");
        } catch (error) {
            console.error("Failed to update user:", error);
            alert("Failed to update user");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-card dark:bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-2xl font-bold">Edit User (ID: {userId})</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <Input
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-medium">Role</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.role} 
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Avatar URL</label>
                        <Input
                            value={formData.avatar}
                            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="space-y-2 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-md border border-yellow-200 dark:border-yellow-800">
                        <label className="text-sm font-medium">New Password (Optional)</label>
                        <Input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Leave empty to keep current"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
