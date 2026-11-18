
const SensorReading = require("../models/SensorReading");
const Device = require("../models/Device");

// Save sensor readings
const saveSensorReading = async (deviceId, readingData) => {
  // Check whether the device exists
  const device = await Device.findOne({ deviceId });

  if (!device) {
    throw new Error("Device not found");
  }

  // Save reading in MongoDB
  const reading = await SensorReading.create({
    deviceId,
    ...readingData
  });

  // Update device's last communication time
  device.lastSeen = new Date();
  device.status = "online";
  await device.save();

  return reading;
};

// Get latest sensor reading
const getLatestReading = async (deviceId) => {
  return await SensorReading.findOne({ deviceId })
    .sort({ createdAt: -1 });
};

// Get sensor reading history
const getReadingHistory = async (deviceId) => {
  return await SensorReading.find({ deviceId })
    .sort({ createdAt: -1 })
    .limit(50);
};

module.exports = {
  saveSensorReading,
  getLatestReading,
  getReadingHistory
};
