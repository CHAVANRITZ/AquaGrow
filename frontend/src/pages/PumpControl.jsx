
import { useEffect, useState } from "react";
import {
  WaterDropRounded,
  PowerSettingsNewRounded,
  RefreshRounded
} from "@mui/icons-material";

import api from "../services/api";

function PumpControl() {
  const [pumpStatus, setPumpStatus] = useState("OFF");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const deviceId = "AG-001";

  const fetchPumpData = async () => {
    try {
      setError("");

      const [statusResponse, historyResponse] = await Promise.all([
        api.get(`/devices/${deviceId}/pump`),
        api.get(`/devices/${deviceId}/pump/history`)
      ]);

      setPumpStatus(statusResponse.data.pumpStatus);
      setHistory(historyResponse.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to fetch pump information"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPumpData();

    const interval = setInterval(fetchPumpData, 10000);

    return () => clearInterval(interval);
  }, []);

  const handlePumpAction = async (action) => {
    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response = await api.post(
        `/devices/${deviceId}/pump`,
        {
          action,
          mode: "MANUAL",
          reason: `Pump switched ${action} from dashboard`
        }
      );

      setMessage(response.data.message);

      await fetchPumpData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to control pump"
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="page-content">Loading pump control...</div>;
  }

  return (
    <div className="page-content">

      <div className="page-heading">
        <div>
          <h1>Pump Control</h1>
          <p>Monitor and manage your irrigation pump.</p>
        </div>

        <div className="date-label">
          DEVICE: {deviceId}
        </div>
      </div>

      {error && (
        <div className="pump-alert error-alert">
          {error}
        </div>
      )}

      {message && (
        <div className="pump-alert success-alert">
          {message}
        </div>
      )}

      <div className="pump-control-grid">

        <div className="pump-main-card">
          <div className="pump-icon">
            <WaterDropRounded />
          </div>

          <p className="pump-label">CURRENT PUMP STATUS</p>

          <h2 className={pumpStatus === "ON" ? "pump-on" : "pump-off"}>
            {pumpStatus}
          </h2>

          <div className="pump-status-indicator">
            <span
              className={
                pumpStatus === "ON"
                  ? "status-dot active-dot"
                  : "status-dot"
              }
            />
            {pumpStatus === "ON" ? "Pump Running (Simulated)" : "Pump Stopped"}
          </div>

          <div className="pump-actions">
            <button
              className="pump-on-button"
              disabled={actionLoading || pumpStatus === "ON"}
              onClick={() => handlePumpAction("ON")}
            >
              <PowerSettingsNewRounded />
              Turn ON
            </button>

            <button
              className="pump-off-button"
              disabled={actionLoading || pumpStatus === "OFF"}
              onClick={() => handlePumpAction("OFF")}
            >
              <PowerSettingsNewRounded />
              Turn OFF
            </button>
          </div>

          {actionLoading && <p>Updating pump status...</p>}
        </div>

        <div className="pump-info-card">
          <h3>Device Information</h3>

          <div className="pump-info-row">
            <span>Device ID</span>
            <strong>{deviceId}</strong>
          </div>

          <div className="pump-info-row">
            <span>Control Mode</span>
            <strong>Manual</strong>
          </div>

          <div className="pump-info-row">
            <span>Pump Status</span>
            <strong>{pumpStatus}</strong>
          </div>

          <button
            className="refresh-button"
            onClick={fetchPumpData}
          >
            <RefreshRounded />
            Refresh Status
          </button>
        </div>

      </div>

      <div className="pump-history-card">
        <h2>Recent Pump Activity</h2>
        <p>Latest recorded pump commands</p>

        {history.length === 0 ? (
          <p>No pump activity recorded yet.</p>
        ) : (
          <div className="pump-history-list">
            {history.map((item) => (
              <div className="pump-history-item" key={item._id}>
                <div>
                  <strong>Pump {item.action}</strong>
                  <span>{item.reason || "No reason provided"}</span>
                </div>

                <div className="pump-history-meta">
                  <strong>{item.mode}</strong>
                  <span>
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default PumpControl;
