
const express = require("express");
const router = express.Router();

const {
  registerDevice,
  getAllDevices,
  getDeviceById
} = require("../controllers/deviceController");

// Register a new device
router.post("/", registerDevice);

// Get all registered devices
router.get("/", getAllDevices);

// Get a specific device
router.get("/:deviceId", getDeviceById);

module.exports = router;
