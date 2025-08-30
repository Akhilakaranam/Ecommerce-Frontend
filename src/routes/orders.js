const express = require('express');
const { supabase } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get user's orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            images
          )
        ),
        addresses (
          *
        )
      `)
      .eq('user_id', req.user.id);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            images,
            brand
          )
        ),
        addresses (
          *
        )
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// Create order from cart
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { address_id, payment_method = 'cod' } = req.body;

    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          price,
          stock_quantity,
          is_active
        )
      `)
      .eq('user_id', req.user.id);

    if (cartError) {
      throw cartError;
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate address
    const { data: address, error: addressError } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', address_id)
      .eq('user_id', req.user.id)
      .single();

    if (addressError || !address) {
      return res.status(400).json({
        success: false,
        message: 'Invalid address'
      });
    }

    // Calculate totals and validate stock
    let totalAmount = 0;
    const validItems = [];

    for (const item of cartItems) {
      if (!item.products || !item.products.is_active) {
        continue;
      }

      if (item.products.stock_quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.products.name}`
        });
      }

      totalAmount += item.quantity * item.products.price;
      validItems.push(item);
    }

    if (validItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid items in cart'
      });
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.user.id,
        address_id,
        total_amount: totalAmount,
        payment_method,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order items
    const orderItems = validItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw itemsError;
    }

    // Update product stock
    for (const item of validItems) {
      await supabase
        .from('products')
        .update({
          stock_quantity: item.products.stock_quantity - item.quantity
        })
        .eq('id', item.product_id);
    }

    // Clear cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Cancel order
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .eq('status', 'pending')
      .select()
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or cannot be cancelled'
      });
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

module.exports = router;