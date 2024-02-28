const user_template_schema = require("../Models/user_template_schema");

exports.update_user_template_details = async (user_id, pack_id) => {
  try {
    const updateData = await user_template_schema.findOneAndUpdate(
      {
        user_id,
        "packs.pack_id": { $ne: pack_id },
      },
      {
        // $inc: {
        //   No_of_screens_completed: 6,
        // },
        $addToSet: {
          packs: {
            pack_id,
            pack_name: "pack 1",
          },
        },
      },
      {
        new: true,
      }
    );

    console.log(updateData);
  } catch (error) {
    console.log(error);
  }
};
exports.increment_user_template_details = async (user_id, to_be_inc) => {
  try {
    const updateData = await user_template_schema.findOneAndUpdate(
      {
        user_id,
      },
      {
        $inc: {
          No_of_screens_completed: to_be_inc,
        },
      },
      {
        new: true,
      }
    );

    console.log(updateData);
  } catch (error) {
    console.log(error);
  }
};

exports.create_user_template_data = async (user_id, name) => {
  try {
    const newData = await user_template_schema.create({
      user_id,
      name,
    });

    console.log(newData);
  } catch (error) {
    console.log(error);
    console.log(error.message);
  }
};

// create_user_template_data();

// update_user_template_details(
//   "65cb0f4144d287683f18b557",
//   "65d7aff58c3e95b9df275ccd"
// );

// module.exports = create_user_template_data;
