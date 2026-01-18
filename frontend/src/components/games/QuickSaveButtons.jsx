import { useState } from 'react';
import { Button, Tooltip, IconButton } from '@mui/material';
import { Save, FolderOpen } from 'lucide-react';

export const QuickSaveButtons = ({ gameName, gameState, onLoad }) => {
    const [savedGames, setSavedGames] = useState(() => {
        const saved = localStorage.getItem(`saved_games_${gameName}`);
        return saved ? JSON.parse(saved) : {};
    });

    const handleSave = () => {
        const timestamp = new Date().toISOString();
        const newSave = {
            ...gameState,
            timestamp
        };
        const updatedSaves = { ...savedGames, [timestamp]: newSave };
        setSavedGames(updatedSaves);
        localStorage.setItem(`saved_games_${gameName}`, JSON.stringify(updatedSaves));
        alert('Game Saved!');
    };

    const handleLoad = () => {
        const keys = Object.keys(savedGames);
        if (keys.length === 0) {
            alert('No saved games found');
            return;
        }
        // Load latest save for simplicity, or implement a modal to choose
        const latestKey = keys.sort().pop();
        if (latestKey) {
            onLoad(savedGames[latestKey]);
            alert('Game Loaded!');
        }
    };

    return (
        <div className="flex gap-2">
            <Tooltip title="Save Game">
                <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={handleSave}
                    startIcon={<Save className="w-4 h-4" />}
                >
                    Save
                </Button>
            </Tooltip>
            <Tooltip title="Load Last Save">
                <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={handleLoad}
                    startIcon={<FolderOpen className="w-4 h-4" />}
                >
                    Load
                </Button>
            </Tooltip>
        </div>
    );
};
