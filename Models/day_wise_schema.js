const mongoose = require("mongoose");

const day_wise_schema = mongoose.Schema({
  user_name: { type: String, required: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pc_users",
  },
  template_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "template_data",
  },
  completed_today: { type: Number, default: 0 },
  date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  template_name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("day_wise", day_wise_schema);
