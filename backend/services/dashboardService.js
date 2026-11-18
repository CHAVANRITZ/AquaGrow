
const Device = require("../models/Device");
const SensorReading = require("../models/SensorReading");
const PumpLog = require("../models/PumpLog");
const IrrigationSettings = require("../models/IrrigationSettings");

const getDashboardData = async (deviceId) => {
  // Fetch device
  const device = await Device.findOne({ deviceId });

  if (!device) {
    throw new Error("Device not found");
  }

  // Fetch latest sensor reading
  const latestReading = await SensorReading.findOne({ deviceId })
    .sort({ createdAt: -1 });

  // Fetch current pump status
  const latestPumpLog = await PumpLog.findOne({ deviceId })
    .sort({ createdAt: -1 });

  const pumpStatus = latestPumpLog
    ? latestPumpLog.action
    : "OFF";

  // Fetch irrigation settings
  const settings = await IrrigationSettings.findOne({ deviceId });

  // Fetch recent pump activity
  const recentPumpActivity = await PumpLog.find({ deviceId })
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    device,
    latestReading,
    pumpStatus,
    settings,
    recentPumpActivity
  };
};

module.exports = {
  getDashboardData
};
