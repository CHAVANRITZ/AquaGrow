
const sensorService = require("../services/sensorService");

// Save sensor readings
const saveSensorReading = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const {
      soilMoisture,
      temperature,
      humidity,
      waterLevel
    } = req.body;

    // Basic validation
    if (
      soilMoisture === undefined ||
      temperature === undefined ||
      humidity === undefined ||
      waterLevel === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All sensor readings are required"
      });
    }

    const reading = await sensorService.saveSensorReading(
      deviceId,
      {
        soilMoisture,
        temperature,
        humidity,
        waterLevel
      }
    );

    return res.status(201).json({
      success: true,
      message: "Sensor readings saved successfully",
      data: reading
    });

  } catch (error) {
    console.error("Save Sensor Reading Error:", error.message);

    if (error.message === "Device not found") {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to save sensor readings"
    });
  }
};

// Get latest sensor reading
const getLatestReading = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const reading = await sensorService.getLatestReading(deviceId);

    if (!reading) {
      return res.status(404).json({
        success: false,
        message: "No sensor readings found"
      });
    }

    return res.status(200).json({
      success: true,
      data: reading
    });

  } catch (error) {
    console.error("Get Latest Reading Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch latest reading"
    });
  }
};

// Get sensor reading history
const getReadingHistory = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const readings = await sensorService.getReadingHistory(deviceId);

    return res.status(200).json({
      success: true,
      count: readings.length,
      data: readings
    });

  } catch (error) {
    console.error("Get Reading History Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sensor history"
    });
  }
};

module.exports = {
  saveSensorReading,
  getLatestReading,
  getReadingHistory
};
