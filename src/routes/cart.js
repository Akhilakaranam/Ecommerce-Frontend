const express = require('express');
const { supabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          price,
          images,
          stock_quantity,
          is_active
        )
      `)
      .eq('user_id', req.user.id);

    if (error) {
      throw error;
    }

    // Calculate totals
    let totalItems = 0;
    let totalAmount = 0;

    const validCartItems = cartItems.filter(item => 
      item.products && item.products.is_active
    );

    validCartItems.forEach(item => {
      totalItems += item.quantity;
      totalAmount += item.quantity * item.products.price;
    });

    res.json({
      success: true,
      data: {
        cart_items: validCartItems,
        summary: {
          total_items: totalItems,
          total_amount: totalAmount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Check if product exists and is active
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, stock_quantity, is_active')
      .eq('id', product_id)
      .single();

    if (productError || !product || !product.is_active) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unavailable'
      });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .single();

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock_quantity < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock for requested quantity'
        });
      }

      const { data: updatedItem, error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return res.json({
        success: true,
        message: 'Cart updated successfully',
        data: { cart_item: updatedItem }
      });
    }

    // Add new item to cart
    const { data: cartItem, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: req.user.id,
        product_id,
        quantity
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: { cart_item: cartItem }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
});

// Update cart item quantity
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    const { data: cartItem, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error || !cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: { cart_item: cartItem }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message
    });
  }
});

// Remove item from cart
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
});

// Clear entire cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
});

module.exports = router;