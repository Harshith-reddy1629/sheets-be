const mongoose = require("mongoose");

const user_schema = mongoose.Schema(
  {
    // name: {
    //   type: String,
    //   required: [true, "required"],
    // },
    username: {
      type: String,
      required: [true, "required"],
    },
    email: {
      type: String,
      required: [true, "required"],
    },
    password: {
      type: String,
      required: [true, "required"],
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("pc_users", user_schema);
