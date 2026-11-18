
const {
  getDashboardData
} = require("../services/dashboardService");

const getDashboard = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const dashboardData = await getDashboardData(deviceId);

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: dashboardData
    });
  } catch (error) {
    const statusCode =
      error.message === "Device not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDashboard
};
