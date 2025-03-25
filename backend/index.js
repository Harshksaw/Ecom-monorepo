require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const connectDB = require("./config/db");
const { secret } = require("./config/secret");
const PORT = secret.port || 7003;
const morgan = require('morgan')
// error handler
const globalErrorHandler = require("./middleware/global-error-handler");
// routes

const categoryRoutes = require("./routes/category.routes");

const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");

const adminRoutes = require("./routes/admin.routes");
// const uploadRouter = require('./routes/uploadFile.route');
const userRoutes = require("./routes/auth.routes");

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// connect database
connectDB();

app.use('/api/auth', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use("/api/admin", adminRoutes);

// root route
app.get("/", (req, res) => res.send("Apps worked successfully"));

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

// global error handler
app.use(globalErrorHandler);
//* handle not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

module.exports = app;
