const express = require('express');
const { supabase } = require('../config/database');
const { authenticateToken, requireVendor } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      brand,
      min_price,
      max_price,
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('is_active', true);

    // Apply filters
    if (category) {
      query = query.eq('category_id', category);
    }

    if (brand) {
      query = query.ilike('brand', `%${brand}%`);
    }

    if (min_price) {
      query = query.gte('price', min_price);
    }

    if (max_price) {
      query = query.lte('price', max_price);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting and pagination
    query = query
      .order(sort_by, { ascending: sort_order === 'asc' })
      .range(offset, offset + limit - 1);

    const { data: products, error } = await query;

    if (error) {
      throw error;
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (category) countQuery = countQuery.eq('category_id', category);
    if (brand) countQuery = countQuery.ilike('brand', `%${brand}%`);
    if (min_price) countQuery = countQuery.gte('price', min_price);
    if (max_price) countQuery = countQuery.lte('price', max_price);
    if (search) countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);

    const { count } = await countQuery;

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name
        ),
        reviews (
          id,
          rating,
          comment,
          title,
          created_at,
          users (
            first_name,
            last_name
          )
        )
      `)
      .eq('id', req.params.id)
      .eq('is_active', true)
      .single();

    if (error || !product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Calculate average rating
    if (product.reviews && product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      product.average_rating = totalRating / product.reviews.length;
      product.review_count = product.reviews.length;
    } else {
      product.average_rating = 0;
      product.review_count = 0;
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// Create new product (vendor/admin only)
router.post('/', authenticateToken, requireVendor, validateRequest(schemas.product), async (req, res) => {
  try {
    const productData = {
      ...req.body,
      created_by: req.user.id
    };

    const { data: product, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

// Update product
router.put('/:id', authenticateToken, requireVendor, async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...req.body,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .eq('created_by', req.user.id)
      .select()
      .single();

    if (error || !product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

// Delete product (soft delete)
router.delete('/:id', authenticateToken, requireVendor, async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', req.params.id)
      .eq('created_by', req.user.id)
      .select()
      .single();

    if (error || !product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

module.exports = router;