
const express = require("express");
const router = express.Router();

const {
  getIrrigationSettings,
  updateIrrigationSettings
} = require("../controllers/irrigationSettingsController");

// Get irrigation settings
router.get("/:deviceId/settings", getIrrigationSettings);

// Update irrigation settings
router.put("/:deviceId/settings", updateIrrigationSettings);

module.exports = router;
