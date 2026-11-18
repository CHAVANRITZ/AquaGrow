
const express = require("express");
const router = express.Router();

const {
  getDashboard
} = require("../controllers/dashboardController");

// Get complete dashboard data for a device
router.get("/:deviceId", getDashboard);

module.exports = router;
