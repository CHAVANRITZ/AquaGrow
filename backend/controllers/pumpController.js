
const pumpService = require("../services/pumpService");

// Turn pump ON or OFF
const controlPump = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { action, mode, reason } = req.body;

    // Validate action
    if (!action || !["ON", "OFF"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be ON or OFF"
      });
    }

    // Validate mode
    if (!mode || !["MANUAL", "AUTOMATIC"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Mode must be MANUAL or AUTOMATIC"
      });
    }

    const result = await pumpService.controlPump(
      deviceId,
      action,
      mode,
      reason || ""
    );

    return res.status(200).json({
      success: true,
      message: result.changed
        ? `Pump turned ${action}`
        : `Pump is already ${action}`,
      data: result
    });

  } catch (error) {
    console.error("Pump Control Error:", error.message);

    if (error.message === "Device not found") {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to control pump"
    });
  }
};

// Get current pump status
const getPumpStatus = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const status = await pumpService.getPumpStatus(deviceId);

    return res.status(200).json({
      success: true,
      data: {
        deviceId,
        pumpStatus: status
      }
    });

  } catch (error) {
    if (error.message === "Device not found") {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pump status"
    });
  }
};

// Get pump activity history
const getPumpHistory = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const history = await pumpService.getPumpHistory(deviceId);

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });

  } catch (error) {
    if (error.message === "Device not found") {
      return res.status(404).json({
        success: false,
        message: "Device not found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pump history"
    });
  }
};

module.exports = {
  controlPump,
  getPumpStatus,
  getPumpHistory
};
