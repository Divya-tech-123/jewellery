const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  toggleWishlist,
  getAllUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/wishlist')
  .post(protect, toggleWishlist);

router.route('/')
  .get(protect, admin, getAllUsers);

module.exports = router;
