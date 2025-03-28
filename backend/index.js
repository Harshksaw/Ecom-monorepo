require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const connectDB = require("./config/db");
const { secret } = require("./config/secret");
const PORT = process.env.PORT || secret.port || 7003; // Added process.env.PORT first
const morgan = require('morgan');

// error handler
const globalErrorHandler = require("./middleware/global-error-handler");

// routes
const {
  getAllImages,
  getImageById,
  uploadCarouselImages
} = require("./controller/image.controller");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/auth.routes");
const { upload } = require('./utils/cloudinary');

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(globalErrorHandler);
// connect database
connectDB();

// root route
app.get('/get', (req, res) => {
  res.send({ success: true, message: "Welcome to Ecom API 🚀" });
});

// API routes
app.use('/api/auth', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/admin", adminRoutes);

app.post("/api/upload-carousel", upload, uploadCarouselImages);

app.get("/api/images", getAllImages);
app.get("/api/images/:id", getImageById); // Changed from /images/:id to /api/images/:id for consistency


// Global error handler


// Server startup
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;