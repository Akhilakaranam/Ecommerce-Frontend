const express = require('express');
const { supabase } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select(`
        *,
        parent:parent_id (
          id,
          name
        )
      `)
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Get category hierarchy
router.get('/hierarchy', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw error;
    }

    // Build hierarchy
    const categoryMap = new Map();
    const rootCategories = [];

    // First pass: create map
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Second pass: build hierarchy
    categories.forEach(category => {
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryMap.get(category.id));
        }
      } else {
        rootCategories.push(categoryMap.get(category.id));
      }
    });

    res.json({
      success: true,
      data: { categories: rootCategories }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category hierarchy',
      error: error.message
    });
  }
});

// Create new category (admin only)
router.post('/', authenticateToken, requireAdmin, validateRequest(schemas.category), async (req, res) => {
  try {
    const { data: category, error } = await supabase
      .from('categories')
      .insert(req.body)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
});

// Update category
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: category, error } = await supabase
      .from('categories')
      .update({
        ...req.body,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
});

module.exports = router;