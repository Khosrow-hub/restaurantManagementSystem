const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const errorMiddleware = require("./middlewares/errors");

// Middlewares
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true, limit: "30kb" }));
app.use(cookieParser());
app.use(fileUpload());

// Routes
if (process.env.DEMO_MODE === "true") {
  const demoRouter = require("./demoRouter");
  app.use("/api/v1", demoRouter);
} else {
  const foodRouter = require("./routes/foodItem");
  const restaurant = require("./routes/restaurant");
  const menuRouter = require("./routes/menu");
  const order = require("./routes/order");
  const auth = require("./routes/auth");
  const payment = require("./routes/payment");
  const cart = require("./routes/cart");

  app.use("/api/v1/eats", foodRouter);
  app.use("/api/v1/eats/menus", menuRouter);
  app.use("/api/v1/eats/stores", restaurant);
  app.use("/api/v1/eats/orders", order);
  app.use("/api/v1/users", auth);
  app.use("/api/v1", payment);
  app.use("/api/v1/eats/cart", cart);
}

// 404 handler
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Error middleware
app.use(errorMiddleware);

module.exports = app;