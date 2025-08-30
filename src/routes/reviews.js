const express = require('express');
const { supabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (
          first_name,
          last_name
        )
      `)
      .eq('product_id', req.params.productId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Get review count and average rating
    const { data: stats, error: statsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', req.params.productId);

    if (statsError) {
      throw statsError;
    }

    const totalReviews = stats.length;
    const averageRating = totalReviews > 0 
      ? stats.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    res.json({
      success: true,
      data: {
        reviews,
        stats: {
          total_reviews: totalReviews,
          average_rating: parseFloat(averageRating.toFixed(1))
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalReviews
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
});

// Create review
router.post('/', authenticateToken, validateRequest(schemas.review), async (req, res) => {
  try {
    const { product_id, rating, comment, title } = req.body;

    // Check if user has purchased this product
    const { data: orderItem, error: orderError } = await supabase
      .from('order_items')
      .select(`
        *,
        orders (
          user_id,
          status
        )
      `)
      .eq('product_id', product_id)
      .eq('orders.user_id', req.user.id)
      .eq('orders.status', 'delivered')
      .single();

    if (orderError || !orderItem) {
      return res.status(400).json({
        success: false,
        message: 'You can only review products you have purchased'
      });
    }

    // Check if user has already reviewed this product
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .single();

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Create review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        user_id: req.user.id,
        product_id,
        rating,
        comment,
        title
      })
      .select(`
        *,
        users (
          first_name,
          last_name
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: { review }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
});

// Update review
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { rating, comment, title } = req.body;

    const { data: review, error } = await supabase
      .from('reviews')
      .update({
        rating,
        comment,
        title,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error || !review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
});

// Delete review
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
});

module.exports = router;