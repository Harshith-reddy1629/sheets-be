const mongoose = require("mongoose");

const AIsheetSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name of the person is required"],
    },

    packName: {
      type: String,
      required: [true, "required"],
    },

    totalComponents: {
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
    status: {
      type: String,
      default: "Todo",
    },

    date: {
      type: String,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AiSheet", AIsheetSchema);
