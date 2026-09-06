const Order = require('../models/Order');
const { getDBStatus } = require('../config/db');
const { memoryStore } = require('../seed/seedData');

// Helper to generate luxury order reference
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  return `LUM-${dateStr}-${randSuffix}`;
};

// @desc    Create new order
// @route   POST /api/orders or POST /api/orders/create
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      subtotal,
      discountAmount,
      couponCode,
      shippingFee,
      tax,
      total,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentStatus,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    const userId = req.user ? (req.user._id || req.user.id) : null;
    const guestEmail = req.body.guestEmail || (req.user ? req.user.email : 'guest@lumiere.com');
    const orderNumber = generateOrderNumber();

    const orderPayload = {
      orderNumber,
      user: userId,
      guestEmail,
      items,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        street: shippingAddress.street,
        landmark: shippingAddress.landmark || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'India',
        phone: shippingAddress.phone,
      },
      subtotal: Number(subtotal),
      discountAmount: Number(discountAmount) || 0,
      couponCode: couponCode || '',
      shippingFee: Number(shippingFee) || 0,
      tax: Number(tax) || 0,
      total: Number(total),
      paymentMethod: paymentMethod || 'Razorpay (UPI / Card / NetBanking)',
      razorpayOrderId: razorpayOrderId || '',
      razorpayPaymentId: razorpayPaymentId || '',
      razorpaySignature: razorpaySignature || '',
      paymentStatus: paymentStatus || 'Paid',
      orderStatus: 'Confirmed',
      createdAt: new Date(),
    };

    if (getDBStatus()) {
      const order = await Order.create(orderPayload);
      return res.status(201).json({ success: true, order });
    } else {
      const newOrder = {
        _id: 'ord_' + Date.now(),
        ...orderPayload,
      };
      memoryStore.orders.unshift(newOrder);
      return res.status(201).json({ success: true, order: newOrder });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const userEmail = req.user.email;

    if (getDBStatus()) {
      const orders = await Order.find({
        $or: [{ user: userId }, { guestEmail: userEmail }]
      }).sort({ createdAt: -1 });

      return res.json({ success: true, count: orders.length, orders });
    } else {
      const orders = memoryStore.orders.filter(
        o => (o.user && String(o.user) === String(userId)) || (o.guestEmail && o.guestEmail.toLowerCase() === userEmail.toLowerCase())
      );
      return res.json({ success: true, count: orders.length, orders });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID or orderNumber
// @route   GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      let order = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id).populate('user', 'name email');
      }
      if (!order) {
        order = await Order.findOne({ orderNumber: id }).populate('user', 'name email');
      }
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, order });
    } else {
      const order = memoryStore.orders.find(o => o._id === id || o.orderNumber === id);
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, order });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
const getAllOrders = async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    } else {
      return res.json({ success: true, count: memoryStore.orders.length, orders: memoryStore.orders });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    if (getDBStatus()) {
      let order = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id);
      }
      if (!order) {
        order = await Order.findOne({ orderNumber: id });
      }
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      if (orderStatus) order.orderStatus = orderStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      await order.save();

      return res.json({ success: true, order });
    } else {
      const index = memoryStore.orders.findIndex(o => o._id === id || o.orderNumber === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Order not found' });

      if (orderStatus) memoryStore.orders[index].orderStatus = orderStatus;
      if (paymentStatus) memoryStore.orders[index].paymentStatus = paymentStatus;

      return res.json({ success: true, order: memoryStore.orders[index] });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
