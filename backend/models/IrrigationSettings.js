
const mongoose = require("mongoose");

const irrigationSettingsSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      ref: "Device"
    },
    autoMode: {
      type: Boolean,
      default: true
    },
    soilMoistureThreshold: {
      type: Number,
      default: 30,
      min: 0,
      max: 100
    },
    pumpDurationSeconds: {
      type: Number,
      default: 10,
      min: 1,
      max: 60
    },
    wateringIntervalMinutes: {
      type: Number,
      default: 5,
      min: 1
    }
  },
  { timestamps: true }
);

const IrrigationSettings = mongoose.model(
  "IrrigationSettings",
  irrigationSettingsSchema
);

module.exports = IrrigationSettings;
