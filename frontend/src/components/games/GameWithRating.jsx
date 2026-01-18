import { useState } from 'react';
import { Box, Container, Fab, Drawer, IconButton, Typography, Divider } from '@mui/material';
import { Star, X } from 'lucide-react';
import { QuickRatingButton, ReviewsList } from '../../common';

/**
 * Game Wrapper with Rating & Comments
 * Wraps any game component and adds rating/comment functionality
 */
export function GameWithRating({ children, gameName }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box className="relative">
      {/* Game Content */}
      {children}

      {/* Floating Rating Button */}
      <Fab
        color="primary"
        className="fixed bottom-6 right-6 z-50"
        onClick={() => setDrawerOpen(true)}
      >
        <Star className="w-6 h-6" />
      </Fab>

      {/* Rating & Comments Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } }
        }}
      >
        <Box className="h-full flex flex-col">
          {/* Header */}
          <Box className="p-4 border-b flex items-center justify-between">
            <Typography variant="h6" className="font-bold">
              Rate {gameName}
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <X className="w-5 h-5" />
            </IconButton>
          </Box>

          {/* Content */}
          <Box className="flex-1 overflow-y-auto p-4">
            {/* Quick Rating Button */}
            <Box className="mb-4">
              <QuickRatingButton gameName={gameName} className="w-full" />
            </Box>

            <Divider className="my-4" />

            {/* Reviews List */}
            <ReviewsList gameName={gameName} />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
