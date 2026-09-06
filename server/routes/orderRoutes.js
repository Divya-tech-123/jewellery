const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Optional protect middleware for createOrder & getOrderById so guests can also checkout & view confirmation
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.route('/')
  .post(optionalProtect, createOrder)
  .get(protect, admin, getAllOrders);

router.route('/create')
  .post(optionalProtect, createOrder);

router.route('/my')
  .get(protect, getUserOrders);

router.route('/:id')
  .get(optionalProtect, getOrderById);

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

module.exports = router;
