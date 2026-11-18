
const Device = require("../models/Device");

// Register a new ESP32 device
const registerDevice = async (deviceData) => {
  const deviceCount = await Device.countDocuments();

  // Generate simple device ID: AG-001, AG-002, etc.
  const deviceId = `AG-${String(deviceCount + 1).padStart(3, "0")}`;

  const device = await Device.create({
    deviceId,
    name: deviceData.name,
    location: deviceData.location,
    firmwareVersion: deviceData.firmwareVersion
  });

  return device;
};

// Get all registered devices
const getAllDevices = async () => {
  return await Device.find().sort({ createdAt: -1 });
};

// Get device by ID
const getDeviceById = async (deviceId) => {
  return await Device.findOne({ deviceId });
};

module.exports = {
  registerDevice,
  getAllDevices,
  getDeviceById
};
