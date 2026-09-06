const express = require('express');
const router = express.Router();
const {
  getPaymentKey,
  createPaymentOrder,
  verifyPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Optional protect middleware so both logged-in and guest customers can checkout
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.get('/key', getPaymentKey);
router.post('/create-order', optionalProtect, createPaymentOrder);
router.post('/verify', optionalProtect, verifyPayment);

module.exports = router;
