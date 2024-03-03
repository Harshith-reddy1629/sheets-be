const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const template_schema = mongoose.Schema({
  template_name: {
    type: String,
    required: true,
  },
  No_of_screens_completed: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "Todo",
  },
  users: [
    {
      _id: false,
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "pc_users" },
      user_name: { type: String },
    },
  ],
});

module.exports = mongoose.model("template_data", template_schema);
