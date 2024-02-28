const templateData = require("../Models/templates_schema");

exports.create_template = async (template_name, newUser) => {
  // const data_of = { creation_status:'', created_data:[] }

  try {
    if (!template_name) {
      return "ds";
    }
    let template_object = { template_name };

    if (newUser) {
      template_object.users = [newUser];
    }

    const add_template = await templateData.create(template_object);
    console.log(add_template, "hi");

    return { creationStatus: "Success", created_data: add_template };
  } catch (error) {
    return { creationStatus: "Failed", error: error.message };
  }
};

// module.exports = create_template;

// create_template("Comunity");

exports.update_users_in_template = async (template_id, user_id, user_name) => {
  try {
    const UpdatedData = await templateData.updateOne(
      { _id: template_id, "users.user_id": { $ne: user_id } },
      {
        $addToSet: { users: { user_id, user_name } },
      }
    );
    console.log(UpdatedData);
  } catch (error) {
    console.log(error.message);
  }
};

exports.inc_of_screens_template = async (template_id, to_be_increased) => {
  try {
    const increment_the_screens = await templateData.findOneAndUpdate(
      { _id: template_id },
      {
        $inc: {
          No_of_screens_completed: to_be_increased,
        },
      },
      {
        new: true,
      }
    );
    console.log(increment_the_screens);
  } catch (error) {
    console.log(error.message);
  }
};

// update_user_template("65cb0f4144d287683f18b557");
// inc_of_screens_template(5);
