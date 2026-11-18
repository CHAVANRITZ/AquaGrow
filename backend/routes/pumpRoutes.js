
const express = require("express");
const router = express.Router();

const {
  controlPump,
  getPumpStatus,
  getPumpHistory
} = require("../controllers/pumpController");

// Turn pump ON or OFF
router.post("/:deviceId/pump", controlPump);

// Get current pump status
router.get("/:deviceId/pump", getPumpStatus);

// Get pump activity history
router.get("/:deviceId/pump/history", getPumpHistory);

module.exports = router;
