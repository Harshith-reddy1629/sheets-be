const mongoose = require("mongoose");

const user_template_schema = mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pc_users",
  },
  No_of_packs_completed: {
    type: Number,
    default: 0,
  },
  No_of_screens_completed: {
    type: Number,
    default: 0,
  },
  packs: [
    {
      _id: false,
      pack_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "template_datas",
      },
      pack_name: {
        type: String,
      },
    },
  ],
});
user_template_schema.index({ "packs.pack_id": 1 }, { unique: true });
module.exports = mongoose.model("user_template_data", user_template_schema);
