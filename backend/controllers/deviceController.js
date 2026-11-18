
const deviceService = require("../services/deviceService");

// Register a new device
const registerDevice = async (req, res) => {
  try {
    const { name, location, firmwareVersion } = req.body;

    // Basic validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Device name is required"
      });
    }

    const device = await deviceService.registerDevice({
      name,
      location,
      firmwareVersion
    });

    return res.status(201).json({
      success: true,
      message: "Device registered successfully",
      data: device
    });

  } catch (error) {
    console.error("Register Device Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to register device"
    });
  }
};

// Get all registered devices
const getAllDevices = async (req, res) => {
  try {
    const devices = await deviceService.getAllDevices();

    return res.status(200).json({
      success: true,
      count: devices.length,
      data: devices
    });

  } catch (error) {
    console.error("Get Devices Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch devices"
    });
  }
};

// Get device by ID
const getDeviceById = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const device = await deviceService.getDeviceById(deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: device
    });

  } catch (error) {
    console.error("Get Device Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch device"
    });
  }
};

module.exports = {
  registerDevice,
  getAllDevices,
  getDeviceById
};
