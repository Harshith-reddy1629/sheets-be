const mongoose = require("mongoose");

const templateSchema = mongoose.Schema(
  {
    template_name: {
      type: String,
      required: [true, "required"],
    },
    completed: {
      type: Number,
      required: [true, "required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("templates", templateSchema);
