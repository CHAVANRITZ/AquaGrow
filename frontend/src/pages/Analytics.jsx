
import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import {
  WaterDropRounded,
  ThermostatRounded,
  CloudRounded,
  WavesRounded,
  RefreshRounded
} from "@mui/icons-material";

import api from "../services/api";

function Analytics() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const deviceId = "AG-001";

  const fetchReadings = async () => {
    try {
      setError("");

      const response = await api.get(
        `/devices/${deviceId}/readings`
      );

      const formatted = (response.data.data || [])
        .slice()
        .reverse()
        .map((item) => ({
          ...item,
          time: new Date(item.createdAt).toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit"
            }
          )
        }));

      setReadings(formatted);
    } catch (err) {
      setError("Unable to load sensor analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const latest = readings.length
    ? readings[readings.length - 1]
    : null;

  const chartConfigs = [
    {
      title: "Soil Moisture",
      key: "soilMoisture",
      unit: "%",
      color: "#287B50",
      icon: <WaterDropRounded />
    },
    {
      title: "Temperature",
      key: "temperature",
      unit: "°C",
      color: "#D47B37",
      icon: <ThermostatRounded />
    },
    {
      title: "Humidity",
      key: "humidity",
      unit: "%",
      color: "#397CB8",
      icon: <CloudRounded />
    },
    {
      title: "Water Level",
      key: "waterLevel",
      unit: "%",
      color: "#3187A5",
      icon: <WavesRounded />
    }
  ];

  if (loading) {
    return <div className="page-content">Loading analytics...</div>;
  }

  return (
    <div className="page-content">

      <div className="page-heading">
        <div>
          <h1>Sensor Analytics</h1>
          <p>Historical environmental data from your AquaGrow device.</p>
        </div>

        <div className="date-label">
          DEVICE: {deviceId}
        </div>
      </div>

      {error && (
        <div className="pump-alert error-alert">{error}</div>
      )}

      <div className="section-heading">
        <div>
          <h2>Latest Sensor Readings</h2>
          <p>Most recent recorded sensor values</p>
        </div>

        <button className="refresh-button" onClick={fetchReadings}>
          <RefreshRounded />
          Refresh
        </button>
      </div>

      {!latest ? (
        <div className="dashboard-placeholder">
          No sensor readings available.
        </div>
      ) : (
        <div className="sensor-grid">
          {chartConfigs.map((config) => (
            <div className="analytics-summary-card" key={config.key}>
              <div style={{ color: config.color }}>
                {config.icon}
              </div>

              <p>{config.title}</p>

              <h2>
                {latest[config.key]} {config.unit}
              </h2>
            </div>
          ))}
        </div>
      )}

      <div className="analytics-grid">
        {chartConfigs.map((config) => (
          <div className="analytics-section" key={config.key}>
            <h2>{config.title} Trend</h2>
            <p>Historical readings over time</p>

            {readings.length < 2 ? (
              <div className="chart-empty">
                Not enough readings to display a trend.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={readings}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis dataKey="time" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey={config.key}
                    name={config.title}
                    stroke={config.color}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default Analytics;
