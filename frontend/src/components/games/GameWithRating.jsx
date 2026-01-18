import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Rating, TextField, Tooltip, Avatar, Paper } from '@mui/material';
import { Star, User, Calendar, MessageSquare, Send, Edit2, Trash2 } from 'lucide-react';
import { ratingService } from '../../services/rating.services';
import { AuthContext } from '@/contexts/AuthContext';
export const GameWithRating = ({ gameName, gameId, children }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null); // Track which review is being edited
  const { user } = useContext(AuthContext);

  const targetId = gameId || gameName;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingReview(null);
    setRating(0);
    setComment('');
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
    setOpen(true);
  };

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
        try {
            const data = await ratingService.getRatingsByGame(targetId);

            const reviewsList = Array.isArray(data) ? data : (data.ratings || []);
            
            const mappedReviews = reviewsList.map(r => {
                const reviewId = r._id || r.id;
                if (!reviewId) {
                    console.warn('Review missing ID:', r);
                }
                return {
                    id: reviewId,
                    userId: r.user_id?.id || r.user_id || r.user?.id,
                    user: r.user_id?.name || r.user?.name || 'Anonymous User',
                    avatarUrl: r.user_id?.avatar || r.user?.avatar,
                    avatar: (r.user_id?.name || r.user?.name || 'A')[0]?.toUpperCase(),
                    rating: r.point,
                    date: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : 'Recently',
                    comment: r.comment
                };
            });
            
            setReviews(mappedReviews);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        }
    };
    if (targetId) {
        fetchReviews();
    }
  }, [targetId]);

  const handleSubmit = async () => {
    try {
        if (!user) {
            alert("Please login to submit a review");
            return;
        }

        const newRatingData = {
            point: rating,
            comment: comment,
        };

        if (editingReview) {
            await ratingService.updateRating(editingReview.id, {
                point: rating,
                comment: comment
            });

            const freshData = await ratingService.getRatingsByGame(targetId);
            const reviewsList = Array.isArray(freshData) ? freshData : (freshData.ratings || []);
            
            const mappedReviews = reviewsList.map(r => {
                const reviewId = r._id || r.id;
                return {
                    id: reviewId,
                    userId: r.user_id?.id || r.user_id || r.user?.id,
                    user: r.user_id?.name || r.user?.name || 'Anonymous User',
                    avatarUrl: r.user_id?.avatar || r.user?.avatar,
                    avatar: (r.user_id?.name || r.user?.name || 'A')[0]?.toUpperCase(),
                    rating: r.point,
                    date: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : 'Recently',
                    comment: r.comment
                };
            });
            
            setReviews(mappedReviews);
        } else {
            // Create new review
            await ratingService.submitRating(targetId, newRatingData);
            
            // Refresh reviews from backend to get real IDs
            const freshData = await ratingService.getRatingsByGame(targetId);
            const reviewsList = Array.isArray(freshData) ? freshData : (freshData.ratings || []);
            
            const mappedReviews = reviewsList.map(r => {
                const reviewId = r._id || r.id;
                return {
                    id: reviewId,
                    userId: r.user_id?.id || r.user_id || r.user?.id,
                    user: r.user_id?.name || r.user?.name || 'Anonymous User',
                    avatarUrl: r.user_id?.avatar || r.user?.avatar,
                    avatar: (r.user_id?.name || r.user?.name || 'A')[0]?.toUpperCase(),
                    rating: r.point,
                    date: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : 'Recently',
                    comment: r.comment
                };
            });
            
            setReviews(mappedReviews);
        }
        
        handleClose();
        setComment('');
        setRating(0);
    } catch (error) {
        console.error("Failed to submit review", error);
        alert("Failed to submit review. Please try again.");
    }
  };
  return (
    <Box className="w-full h-full flex flex-col overflow-auto bg-gray-50 dark:bg-gray-950">
      {/* Game Content Area */}
      <Box className="w-full flex-1 min-h-[600px] relative">
        {children}
      </Box>

      {/* Reviews Section */}
      <Box className="w-full p-6 mt-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <Box className="max-w-4xl mx-auto">
            
            {/* Header & Action */}
            <Box className="flex items-center justify-between mb-8">
                <Box>
                    <Typography variant="h5" className="font-bold flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                        Ratings & Reviews
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        See what others are saying about {gameName}
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<MessageSquare className="w-4 h-4" />}
                    onClick={handleOpen}
                >
                    Write a Review
                </Button>
            </Box>

            {/* Reviews Grid */}
            <div className="grid gap-4">
                {reviews.map((review) => (
                    <Paper key={review.id} elevation={0} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/20">
                        <Box className="flex items-start gap-4">
                            <Avatar 
                                src={review.avatarUrl} 
                                className="bg-gradient-to-br from-blue-500 to-purple-600"
                            >
                                {!review.avatarUrl && review.avatar}
                            </Avatar>
                            <Box className="flex-1">
                                <Box className="flex items-center justify-between mb-1">
                                    <Typography variant="subtitle1" className="font-bold">
                                        {review.user}
                                    </Typography>
                                    <Box className="flex items-center gap-2">
                                        <Typography variant="caption" color="text.secondary" className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {review.date}
                                        </Typography>
                                        {/* Edit button - only for own reviews */}
                                        {review.userId === user?.id && (
                                            <Tooltip title="Edit your review">
                                                <Button 
                                                    size="small" 
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => {
                                                        console.log('Edit clicked!', review);
                                                        handleEdit(review);
                                                    }}
                                                    startIcon={<Edit2 className="w-4 h-4" />}
                                                >
                                                    Edit
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </Box>
                                <Rating value={review.rating} readOnly size="small" className="mb-2" />
                                <Typography variant="body2" className="text-gray-700 dark:text-gray-300">
                                    {review.comment}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </div>
        </Box>
      </Box>

      {/* Rating Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle className="text-center font-bold">
          {editingReview ? 'Edit Your Review' : `Rate ${gameName}`}
        </DialogTitle>
        <DialogContent>
          <Box className="flex flex-col items-center gap-4 py-4">
            <Typography component="legend">How was your experience?</Typography>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
            />
            <TextField
              label="Leave a comment (optional)"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-4"
              placeholder="Tell us what you liked or didn't like..."
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-100 dark:border-gray-800">
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!rating}
            startIcon={<Send className="w-4 h-4" />}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
