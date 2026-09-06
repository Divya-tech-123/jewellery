const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

const server = app.listen(PORT, () => {
  console.log(`[LUMIÈRE ATELIER] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[LUMIÈRE ATELIER] API Endpoints ready at http://localhost:${PORT}/api/products`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[LUMIÈRE ATELIER] Error: ${err.message}`);
});
