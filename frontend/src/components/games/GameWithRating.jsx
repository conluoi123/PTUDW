import React from 'react';
import { Box, Typography } from '@mui/material';

export const GameWithRating = ({ gameName, children }) => {
  return (
    <Box className="w-full h-full flex flex-col p-4">
      {/* 
      <Box className="mb-4">
        <Typography variant="h5" className="font-bold text-gray-800 dark:text-gray-100">
          {gameName}
        </Typography>
      </Box>
      */}
      <Box className="flex-1 w-full h-full">
        {children}
      </Box>
    </Box>
  );
};
