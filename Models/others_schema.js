const mongoose = require("mongoose");

const others_schema = mongoose.Schema(
  {
    task_name: {
      type: String,
      required: true,
    },
    editor_name: {
      type: String,
      required: true,
    },
    completed_tasks: {
      type: Number,
      required: true,
    },
    task_description: {
      type: String,
      required: true,
    },
    task_date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("other_tasks", others_schema);
