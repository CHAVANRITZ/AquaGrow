
const Device = require("../models/Device");
const PumpLog = require("../models/PumpLog");

// Change pump status
const controlPump = async (deviceId, action, mode, reason) => {
  const device = await Device.findOne({ deviceId });

  if (!device) {
    throw new Error("Device not found");
  }

  // Get the latest pump state
  const latestLog = await PumpLog.findOne({ deviceId })
    .sort({ createdAt: -1 });

  const currentStatus = latestLog ? latestLog.action : "OFF";

  // Avoid duplicate logs if status has not changed
  if (currentStatus === action) {
    return {
      changed: false,
      status: currentStatus
    };
  }

  // Save pump activity
  const pumpLog = await PumpLog.create({
    deviceId,
    action,
    mode,
    reason
  });

  return {
    changed: true,
    status: action,
    pumpLog
  };
};

// Get latest pump status
const getPumpStatus = async (deviceId) => {
  const device = await Device.findOne({ deviceId });

  if (!device) {
    throw new Error("Device not found");
  }

  const latestLog = await PumpLog.findOne({ deviceId })
    .sort({ createdAt: -1 });

  return latestLog ? latestLog.action : "OFF";
};

// Get pump activity history
const getPumpHistory = async (deviceId) => {
  return await PumpLog.find({ deviceId })
    .sort({ createdAt: -1 })
    .limit(50);
};

module.exports = {
  controlPump,
  getPumpStatus,
  getPumpHistory
};
