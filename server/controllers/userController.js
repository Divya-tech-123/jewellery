const User = require('../models/User');
const { getDBStatus } = require('../config/db');
const { memoryStore } = require('../seed/seedData');

// @desc    Get current user profile
// @route   GET /api/users/profile
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (getDBStatus()) {
      const user = await User.findById(userId).select('-password');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, user });
    } else {
      const user = memoryStore.users.find(u => u._id === userId || u.email === req.user.email);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      const { password, ...userWithoutPass } = user;
      return res.json({ success: true, user: userWithoutPass });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, phone, addresses } = req.body;

    if (getDBStatus()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (addresses) user.addresses = addresses;

      await user.save();
      const updated = await User.findById(userId).select('-password');
      return res.json({ success: true, user: updated });
    } else {
      const index = memoryStore.users.findIndex(u => u._id === userId || u.email === req.user.email);
      if (index === -1) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) memoryStore.users[index].name = name;
      if (phone) memoryStore.users[index].phone = phone;
      if (addresses) memoryStore.users[index].addresses = addresses;

      const { password, ...userWithoutPass } = memoryStore.users[index];
      return res.json({ success: true, user: userWithoutPass });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle wishlist item
// @route   POST /api/users/wishlist
const toggleWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID required' });
    }

    if (getDBStatus()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const idx = user.wishlist.indexOf(productId);
      if (idx > -1) {
        user.wishlist.splice(idx, 1);
      } else {
        user.wishlist.push(productId);
      }
      await user.save();
      return res.json({ success: true, wishlist: user.wishlist });
    } else {
      const user = memoryStore.users.find(u => u._id === userId || u.email === req.user.email);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (!user.wishlist) user.wishlist = [];
      const idx = user.wishlist.indexOf(productId);
      if (idx > -1) {
        user.wishlist.splice(idx, 1);
      } else {
        user.wishlist.push(productId);
      }
      return res.json({ success: true, wishlist: user.wishlist });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
const getAllUsers = async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, users });
    } else {
      const users = memoryStore.users.map(({ password, ...rest }) => rest);
      return res.json({ success: true, count: users.length, users });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  toggleWishlist,
  getAllUsers,
};
