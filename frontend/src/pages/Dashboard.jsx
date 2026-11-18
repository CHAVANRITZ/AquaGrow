
import { useEffect, useState } from "react";

import {
  WaterDropRounded,
  ThermostatRounded,
  CloudRounded,
  WavesRounded,
  RefreshRounded
} from "@mui/icons-material";

import api from "../services/api";
import SensorCard from "../components/SensorCard";
import MoistureChart from "../components/MoistureChart";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setError("");

      const response = await api.get("/dashboard/AG-001");

      setDashboard(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to connect to backend"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(fetchDashboard, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="page-content">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="page-content">
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>
        <button onClick={fetchDashboard}>Retry</button>
      </div>
    );
  }

  const reading = dashboard.latestReading;
  const pumpStatus = dashboard.pumpStatus;

  return (
    <div className="page-content">

      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <h1>Good morning, Admin 👋</h1>
          <p>
            Here's what's happening with your AquaGrow system today.
          </p>
        </div>

        <div className="date-label">
          DEVICE: {dashboard.device.deviceId}
        </div>
      </div>

      {/* Sensor Overview */}
      <div className="section-heading">
        <div>
          <h2>Sensor Overview</h2>
          <p>Live monitoring of your agricultural environment</p>
        </div>

        <button className="refresh-button" onClick={fetchDashboard}>
          <RefreshRounded />
          Refresh
        </button>
      </div>

      {!reading ? (
        <div className="dashboard-placeholder">
          No sensor readings available yet.
        </div>
      ) : (
        <div className="sensor-grid">

          <SensorCard
            title="Soil Moisture"
            value={reading.soilMoisture}
            unit="%"
            icon={<WaterDropRounded />}
            color="#287B50"
            status={
              reading.soilMoisture <
              dashboard.settings?.soilMoistureThreshold
                ? "Low"
                : "Normal"
            }
          />

          <SensorCard
            title="Temperature"
            value={reading.temperature}
            unit="°C"
            icon={<ThermostatRounded />}
            color="#D47B37"
          />

          <SensorCard
            title="Humidity"
            value={reading.humidity}
            unit="%"
            icon={<CloudRounded />}
            color="#397CB8"
          />

          <SensorCard
            title="Water Level"
            value={reading.waterLevel}
            unit="%"
            icon={<WavesRounded />}
            color="#3187A5"
          />

        </div>
      )}

      {/* Soil Moisture Analytics */}
      <div className="analytics-section">
        <div className="analytics-header">
          <div>
            <h2>Soil Moisture Analytics</h2>
            <p>Historical soil moisture readings</p>
          </div>
        </div>

        <div className="analytics-chart">
          <MoistureChart />
        </div>
      </div>

      {/* Irrigation Status */}
      <div className="section-heading pump-heading">
        <div>
          <h2>Irrigation Status</h2>
          <p>Current pump and automation status</p>
        </div>
      </div>

      <div className="dashboard-placeholder">
        <h3>Pump Status: {pumpStatus}</h3>

        <p>
          Automatic Mode:{" "}
          {dashboard.settings?.autoMode ? "Enabled" : "Disabled"}
        </p>
      </div>

    </div>
  );
}

export default Dashboard;
