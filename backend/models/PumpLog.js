
const mongoose = require("mongoose");

const pumpLogSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      ref: "Device"
    },

    action: {
      type: String,
      enum: ["ON", "OFF"],
      required: true
    },

    mode: {
      type: String,
      enum: ["MANUAL", "AUTOMATIC"],
      required: true
    },

    reason: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const PumpLog = mongoose.model("PumpLog", pumpLogSchema);

module.exports = PumpLog;
