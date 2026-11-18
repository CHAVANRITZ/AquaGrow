
const {
  getSettings,
  updateSettings
} = require("../services/irrigationSettingsService");

const getIrrigationSettings = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const settings = await getSettings(deviceId);

    return res.status(200).json({
      success: true,
      message: "Irrigation settings fetched successfully",
      data: settings
    });
  } catch (error) {
    return res.status(error.message === "Device not found" ? 404 : 500).json({
      success: false,
      message: error.message
    });
  }
};

const updateIrrigationSettings = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const allowedFields = [
      "autoMode",
      "soilMoistureThreshold",
      "pumpDurationSeconds",
      "wateringIntervalMinutes"
    ];

    const settingsData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        settingsData[field] = req.body[field];
      }
    }

    if (Object.keys(settingsData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one valid setting to update"
      });
    }

    const settings = await updateSettings(deviceId, settingsData);

    return res.status(200).json({
      success: true,
      message: "Irrigation settings updated successfully",
      data: settings
    });
  } catch (error) {
    const statusCode =
      error.message === "Device not found" ? 404 :
      error.name === "ValidationError" ? 400 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getIrrigationSettings,
  updateIrrigationSettings
};
