
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const deviceRoutes = require("./routes/deviceRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const pumpRoutes = require("./routes/pumpRoutes");
const irrigationSettingsRoutes = require("./routes/irrigationSettingsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Security and request parsing
app.use(helmet());
app.use(cors());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// API rate limiter

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  // Higher limit during local development
  limit: process.env.NODE_ENV === "development" ? 1000 : 100,

  standardHeaders: "draft-8",
  legacyHeaders: false
});


app.use("/api", apiLimiter);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to AquaGrow IoT API"
  });
});

// API routes - register each only once
app.use("/api/v1/devices", deviceRoutes);
app.use("/api/v1/devices", sensorRoutes);
app.use("/api/v1/devices", pumpRoutes);
app.use("/api/v1/devices", irrigationSettingsRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AquaGrow API is running",
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
