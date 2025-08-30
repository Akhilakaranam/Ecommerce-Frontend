const express = require('express');
const bcrypt = require('bcryptjs');
const { supabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, role, created_at, last_login')
      .eq('id', req.user.id)
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { first_name, last_name, phone } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({
        first_name,
        last_name,
        phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.user.id)
      .select('id, email, first_name, last_name, phone, role')
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    // Get current user with password
    const { data: user, error } = await supabase
      .from('users')
      .select('password')
      .eq('id', req.user.id)
      .single();

    if (error) {
      throw error;
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(current_password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 12);

    // Update password
    await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', req.user.id);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
});

// Get user addresses
router.get('/addresses', authenticateToken, async (req, res) => {
  try {
    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', req.user.id)
      .order('is_default', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: { addresses }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch addresses',
      error: error.message
    });
  }
});

// Add new address
router.post('/addresses', authenticateToken, validateRequest(schemas.address), async (req, res) => {
  try {
    const addressData = {
      ...req.body,
      user_id: req.user.id
    };

    // If this is set as default, remove default from other addresses
    if (req.body.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', req.user.id);
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .insert(addressData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: { address }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add address',
      error: error.message
    });
  }
});

// Update address
router.put('/addresses/:id', authenticateToken, async (req, res) => {
  try {
    // If this is set as default, remove default from other addresses
    if (req.body.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', req.user.id);
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .update({
        ...req.body,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error || !address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: { address }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message
    });
  }
});

// Delete address
router.delete('/addresses/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message
    });
  }
});

module.exports = router;