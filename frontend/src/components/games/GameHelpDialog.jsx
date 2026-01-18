import { Dialog, DialogContent, Button, Typography, Box, IconButton } from '@mui/material';
import { HelpCircle, X, Lightbulb, Target, Zap } from 'lucide-react';

export function GameHelpDialog({ open, onClose, title, instructions, tips = [] }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        className: "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden"
      }}
    >
      {/* Header with gradient */}
      <Box className="relative p-6 pb-4">
        <Box className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
        
        <Box className="relative flex items-center justify-between">
          <Box className="flex items-center gap-3">
            <Box className="p-3 rounded-xl bg-blue-500/20 backdrop-blur-sm border border-blue-400/30">
              <HelpCircle className="w-6 h-6 text-blue-400" />
            </Box>
            <Box>
              <Typography variant="h5" className="font-bold">
                {title || "How to Play"}
              </Typography>
              <Typography variant="caption" className="text-blue-200">
                Master the game with these tips
              </Typography>
            </Box>
          </Box>
          
          <IconButton 
            onClick={onClose} 
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </IconButton>
        </Box>
      </Box>
      
      <DialogContent className="px-6 pb-6 space-y-6">
        {/* Instructions */}
        <Box className="space-y-3">
          <Box className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-emerald-400" />
            <Typography variant="h6" className="font-semibold text-emerald-400">
              Game Rules
            </Typography>
          </Box>
          
          {instructions.map((instruction, index) => (
            <Box 
              key={index} 
              className="flex gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
            >
              <Box className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold shadow-lg">
                {index + 1}
              </Box>
              <Typography variant="body1" className="text-gray-200 leading-relaxed">
                {instruction}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Tips Section */}
        {tips.length > 0 && (
          <Box className="space-y-3 pt-4 border-t border-white/10">
            <Box className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <Typography variant="h6" className="font-semibold text-yellow-400">
                Pro Tips
              </Typography>
            </Box>
            
            {tips.map((tip, index) => (
              <Box 
                key={index}
                className="flex gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
              >
                <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                <Typography variant="body2" className="text-yellow-100">
                  {tip}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Action Button */}
        <Button 
          onClick={onClose} 
          variant="contained" 
          fullWidth
          className="mt-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-semibold text-lg shadow-lg"
        >
          Got it! Let's Play 🎮
        </Button>
      </DialogContent>
    </Dialog>
  );
}
