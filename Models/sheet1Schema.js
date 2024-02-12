const mongoose = require("mongoose");

const AIsheetSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name of the person is required"],
    },
    packsAssigned: {
      type: Number,
      required: [true, "Required"],
    },
    componentsInPack: {
      type: Number,
      required: [true, "Required"],
    },
    componentsInProgress: {
      type: Number,
      default: 0,
    },
    componentsCompleted: {
      type: Number,
      required: [true, "Required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AiSheet", AIsheetSchema);
