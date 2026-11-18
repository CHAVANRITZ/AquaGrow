
import { useEffect, useState } from "react";
import {
  SettingsRounded,
  WaterDropRounded,
  TimerRounded,
  ScheduleRounded,
  SaveRounded
} from "@mui/icons-material";

import api from "../services/api";

function IrrigationSettings() {
  const deviceId = "AG-001";

  const [settings, setSettings] = useState({
    autoMode: true,
    soilMoistureThreshold: 35,
    pumpDurationSeconds: 15,
    wateringIntervalMinutes: 10
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get(
          `/devices/${deviceId}/settings`
        );

        setSettings(response.data.data);
      } catch (err) {
        setError("Unable to load irrigation settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.put(
        `/devices/${deviceId}/settings`,
        {
          autoMode: settings.autoMode,
          soilMoistureThreshold: Number(settings.soilMoistureThreshold),
          pumpDurationSeconds: Number(settings.pumpDurationSeconds),
          wateringIntervalMinutes: Number(settings.wateringIntervalMinutes)
        }
      );

      setSettings(response.data.data);
      setMessage("Irrigation settings saved successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save settings"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page-content">Loading settings...</div>;
  }

  return (
    <div className="page-content">

      <div className="page-heading">
        <div>
          <h1>Irrigation Settings</h1>
          <p>Configure your smart irrigation system.</p>
        </div>

        <div className="date-label">
          DEVICE: {deviceId}
        </div>
      </div>

      {error && <div className="pump-alert error-alert">{error}</div>}
      {message && <div className="pump-alert success-alert">{message}</div>}

      <div className="settings-card">

        <div className="settings-title">
          <SettingsRounded />
          <div>
            <h2>Automation Configuration</h2>
            <p>Manage your irrigation preferences.</p>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <strong>Automatic Irrigation</strong>
            <p>Enable or disable automatic irrigation mode.</p>
          </div>

          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.autoMode}
              onChange={(e) =>
                handleChange("autoMode", e.target.checked)
              }
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-control">
          <div className="setting-label">
            <WaterDropRounded />
            <div>
              <strong>Soil Moisture Threshold</strong>
              <p>Start irrigation when moisture drops below this level.</p>
            </div>
            <strong>{settings.soilMoistureThreshold}%</strong>
          </div>

          <input
            type="range"
            min="5"
            max="80"
            value={settings.soilMoistureThreshold}
            onChange={(e) =>
              handleChange("soilMoistureThreshold", e.target.value)
            }
          />
        </div>

        <div className="setting-control">
          <div className="setting-label">
            <TimerRounded />
            <div>
              <strong>Pump Duration</strong>
              <p>Maximum pump running time per watering cycle.</p>
            </div>
            <strong>{settings.pumpDurationSeconds} sec</strong>
          </div>

          <input
            type="range"
            min="1"
            max="60"
            value={settings.pumpDurationSeconds}
            onChange={(e) =>
              handleChange("pumpDurationSeconds", e.target.value)
            }
          />
        </div>

        <div className="setting-control">
          <div className="setting-label">
            <ScheduleRounded />
            <div>
              <strong>Watering Interval</strong>
              <p>Minimum waiting time between watering cycles.</p>
            </div>
            <strong>{settings.wateringIntervalMinutes} min</strong>
          </div>

          <input
            type="range"
            min="1"
            max="60"
            value={settings.wateringIntervalMinutes}
            onChange={(e) =>
              handleChange("wateringIntervalMinutes", e.target.value)
            }
          />
        </div>

        <div className="settings-footer">
          <button
            className="save-settings-button"
            onClick={handleSave}
            disabled={saving}
          >
            <SaveRounded />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default IrrigationSettings;
