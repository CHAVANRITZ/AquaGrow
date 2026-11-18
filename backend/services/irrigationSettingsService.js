
const IrrigationSettings = require("../models/IrrigationSettings");
const Device = require("../models/Device");

const getSettings = async (deviceId) => {
  const device = await Device.findOne({ deviceId });

  if (!device) {
    throw new Error("Device not found");
  }

  let settings = await IrrigationSettings.findOne({ deviceId });

  // Create default settings if they don't exist
  if (!settings) {
    settings = await IrrigationSettings.create({ deviceId });
  }

  return settings;
};

const updateSettings = async (deviceId, settingsData) => {
  const device = await Device.findOne({ deviceId });

  if (!device) {
    throw new Error("Device not found");
  }

  let settings = await IrrigationSettings.findOne({ deviceId });

  if (!settings) {
    settings = await IrrigationSettings.create({
      deviceId,
      ...settingsData
    });
  } else {
    Object.assign(settings, settingsData);
    await settings.save();
  }

  return settings;
};

module.exports = {
  getSettings,
  updateSettings
};
