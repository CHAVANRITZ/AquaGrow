
const mongoose = require("mongoose");

const sensorReadingSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      ref: "Device"
    },

    soilMoisture: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    temperature: {
      type: Number,
      required: true
    },

    humidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    waterLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true
  }
);

const SensorReading = mongoose.model(
  "SensorReading",
  sensorReadingSchema
);

module.exports = SensorReading;
