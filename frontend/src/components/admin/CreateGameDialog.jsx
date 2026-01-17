import { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { GameService } from '@/services/game.services';

export function CreateGameDialog({ isOpen, onClose, onGameCreated }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        config: {}
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        console.log("Form submitted with data:", formData);
        
        // Validation
        if (!formData.name.trim()) {
            setError('Game name is required');
            return;
        }
        
        try {
            setIsSubmitting(true);
            
            // Prepare data with proper structure
            const gameData = {
                name: formData.name,
                description: formData.description,
                config: JSON.stringify({
                    image: formData.image // Image nested in config
                })
            };
            
            console.log("Calling API with:", gameData);
            const result = await GameService.createGame(gameData);
            console.log("API response:", result);
            
            // Reset form
            setFormData({ name: '', description: '', image: '', config: {} });
            onGameCreated?.();
            onClose();
        } catch (err) {
            console.error('Failed to create game:', err);
            setError(err.response?.data?.message || 'Failed to create game. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card dark:bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-2xl font-bold">Create New Game</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Game Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Game Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="e.g., Caro hàng 5"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                            rows="3"
                            placeholder="Describe the game..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Image URL
                        </label>
                        <Input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                        {formData.image && (
                            <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-border">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Create Game
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
