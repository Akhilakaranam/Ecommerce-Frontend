const express = require('express');
const { supabase } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get user statistics
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get product statistics
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get order statistics
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get revenue statistics
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'delivered');

    if (revenueError) {
      throw revenueError;
    }

    const totalRevenue = revenueData.reduce((sum, order) => sum + order.total_amount, 0);

    res.json({
      success: true,
      data: {
        stats: {
          total_users: totalUsers || 0,
          total_products: totalProducts || 0,
          total_orders: totalOrders || 0,
          pending_orders: pendingOrders || 0,
          total_revenue: totalRevenue || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
});

// Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, role, is_active, created_at, last_login');

    if (role) {
      query = query.eq('role', role);
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }

    const { data: users, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Update user status
router.patch('/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { is_active } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({ is_active })
      .eq('id', req.params.id)
      .select('id, email, first_name, last_name, is_active')
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
});

// Get all orders for admin
router.get('/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, user_id } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('orders')
      .select(`
        *,
        users (
          id,
          email,
          first_name,
          last_name
        ),
        order_items (
          *,
          products (
            id,
            name
          )
        )
      `);

    if (status) {
      query = query.eq('status', status);
    }

    if (user_id) {
      query = query.eq('user_id', user_id);
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

// Update order status
router.patch('/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// Get product statistics
router.get('/products/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get products by category
    const { data: categoryStats, error: categoryError } = await supabase
      .from('products')
      .select(`
        category_id,
        categories (
          name
        )
      `)
      .eq('is_active', true);

    if (categoryError) {
      throw categoryError;
    }

    // Group by category
    const categoryMap = {};
    categoryStats.forEach(product => {
      const categoryName = product.categories?.name || 'Unknown';
      categoryMap[categoryName] = (categoryMap[categoryName] || 0) + 1;
    });

    // Get low stock products
    const { data: lowStockProducts, error: stockError } = await supabase
      .from('products')
      .select('id, name, stock_quantity')
      .eq('is_active', true)
      .lt('stock_quantity', 10)
      .order('stock_quantity');

    if (stockError) {
      throw stockError;
    }

    res.json({
      success: true,
      data: {
        products_by_category: categoryMap,
        low_stock_products: lowStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product statistics',
      error: error.message
    });
  }
});

module.exports = router;