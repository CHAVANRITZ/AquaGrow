
const express = require("express");
const router = express.Router();

const {
  saveSensorReading,
  getLatestReading,
  getReadingHistory
} = require("../controllers/sensorController");

// Save sensor readings
router.post("/:deviceId/readings", saveSensorReading);

// Get latest sensor reading
router.get("/:deviceId/readings/latest", getLatestReading);

// Get sensor reading history
router.get("/:deviceId/readings", getReadingHistory);

module.exports = router;
