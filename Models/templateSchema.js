const mongoose = require("mongoose");

const templateSchema = mongoose.Schema(
  {
    template_name: {
      type: String,
      required: [true, "required"],
    },
    completed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("templates", templateSchema);
