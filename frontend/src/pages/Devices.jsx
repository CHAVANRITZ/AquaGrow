
import { useEffect, useState } from "react";
import {
  DevicesRounded,
  AddRounded,
  RefreshRounded
} from "@mui/icons-material";

import api from "../services/api";

function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    firmwareVersion: "1.0.0"
  });

  const fetchDevices = async () => {
    try {
      setError("");

      const response = await api.get("/devices");
      setDevices(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to fetch devices"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.post("/devices", formData);

      setMessage(
        response.data.message || "Device registered successfully"
      );

      setFormData({
        name: "",
        location: "",
        firmwareVersion: "1.0.0"
      });

      setShowForm(false);
      await fetchDevices();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to register device"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-content">

      <div className="page-heading">
        <div>
          <h1>Device Management</h1>
          <p>Manage and monitor your AquaGrow devices.</p>
        </div>

        <button
          className="save-settings-button"
          onClick={() => setShowForm(!showForm)}
        >
          <AddRounded />
          Register Device
        </button>
      </div>

      {error && (
        <div className="pump-alert error-alert">{error}</div>
      )}

      {message && (
        <div className="pump-alert success-alert">{message}</div>
      )}

      {showForm && (
        <div className="settings-card device-form-card">
          <h2>Register New Device</h2>
          <p>Add a device to your AquaGrow system.</p>

          <form onSubmit={handleRegister}>
            <div className="device-form-grid">
              <div className="device-form-field">
                <label>Device Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. AquaGrow Device 2"
                  required
                />
              </div>

              <div className="device-form-field">
                <label>Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Greenhouse"
                />
              </div>

              <div className="device-form-field">
                <label>Firmware Version</label>
                <input
                  name="firmwareVersion"
                  value={formData.firmwareVersion}
                  onChange={handleChange}
                  placeholder="1.0.0"
                />
              </div>
            </div>

            <div className="device-form-actions">
              <button
                type="button"
                className="device-cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-settings-button"
                disabled={saving}
              >
                {saving ? "Registering..." : "Register Device"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="section-heading">
        <div>
          <h2>Registered Devices</h2>
          <p>{devices.length} device(s) registered</p>
        </div>

        <button
          className="refresh-button"
          onClick={fetchDevices}
        >
          <RefreshRounded />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="dashboard-placeholder">
          Loading devices...
        </div>
      ) : devices.length === 0 ? (
        <div className="dashboard-placeholder">
          No devices registered yet.
        </div>
      ) : (
        <div className="devices-grid">
          {devices.map((device) => (
            <div className="device-card" key={device._id}>
              <div className="device-card-header">
                <div className="device-icon">
                  <DevicesRounded />
                </div>

                <span
                  className={`device-status ${
                    device.status === "online"
                      ? "device-online"
                      : "device-offline"
                  }`}
                >
                  {device.status || "offline"}
                </span>
              </div>

              <h3>{device.name}</h3>
              <p className="device-id">{device.deviceId}</p>

              <div className="device-details">
                <div>
                  <span>Location</span>
                  <strong>{device.location || "Not specified"}</strong>
                </div>

                <div>
                  <span>Firmware</span>
                  <strong>{device.firmwareVersion || "Unknown"}</strong>
                </div>

                <div>
                  <span>Last Seen</span>
                  <strong>
                    {device.lastSeen
                      ? new Date(device.lastSeen).toLocaleString()
                      : "Never"}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Devices;
