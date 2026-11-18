
const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, "Device ID is required"],
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: [true, "Device name is required"],
      trim: true,
      maxlength: 100
    },

    location: {
      type: String,
      trim: true,
      default: ""
    },

    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline"
    },

    firmwareVersion: {
      type: String,
      default: "1.0.0",
      trim: true
    },

    lastSeen: {
      type: Date,
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
