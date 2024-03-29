const day_wise_schema = require("../Models/day_wise_schema");
const templates_schema = require("../Models/templates_schema");
const user_template_schema = require("../Models/user_template_schema");
const users_Schema = require("../Models/users_Schema");

const mongoose = require("mongoose");

const { inc_of_screens_template } = require("./template_controllers");
const {
  increment_user_template_details,
} = require("./user_template_controllers");
const { ObjectId } = require("mongodb");

exports.isValidUser = async (req, res, next) => {
  const { is_admin, username } = req.user;

  const { name } = req.body;
  try {
    const is_valid_user = await users_Schema.findOne({
      username: is_admin ? name : username,
    });
    if (!is_valid_user) {
      res.status(400).send({ error: "Invalid Username" });
      // if not valid user throw error
      // throw new Error("Invalid user");
    } else {
      req.is_valid_user = is_valid_user;
      next();
    }
  } catch (error) {
    res.status(500).send({ error: "Internal Error" });
  }
};

exports.checkDate = async (req, res, next) => {
  const { is_valid_user } = req;
  const { name, template_name } = req.body;
  try {
    const d = new Date().toISOString().slice(0, 10);

    let is_day = await day_wise_schema.findOne({
      user_name: is_valid_user.username,
      template_name,
      date: d,
    }); // check data with same pack on the day

    if (is_day) {
      //if data with same pack on the day throw err
      //   throw new Error("Cant update data twice a  day ");
      res.status(400).send({ error: "Cant update data twice a  day" });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send({ error: "internal error" });
  }
};

exports.create_day_wise = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, template_name, completed_today } = req.body;
    const { is_valid_user } = req;
    const { is_admin } = req.user;

    // Find or create user template
    let is_template_user = await user_template_schema
      .findOne({ user_name: is_valid_user.username })
      .session(session);
    if (!is_template_user) {
      is_template_user = await user_template_schema.create(
        [{ user_id: is_valid_user._id, user_name: is_valid_user.username }],
        { session }
      );
    }

    // Find or create template
    let is_template =
      (await templates_schema.findOne({ template_name }).session(session)) ??
      (
        await templates_schema.create([{ template_name }], {
          session,
        })
      )[0];

    // Update user template
    // console.log(is_template);
    // Create day wise data
    const created_data_array = await day_wise_schema.create(
      [
        {
          user_name: is_valid_user.username,
          user_id: is_valid_user._id,
          completed_today,
          template_name: is_template.template_name,
          template_id: is_template._id,
        },
      ],
      { session }
    );

    console.log(created_data_array);

    // Update template users
    await templates_schema.updateOne(
      { _id: is_template._id, "users.user_id": { $ne: is_valid_user._id } },
      {
        $addToSet: {
          users: {
            user_id: is_valid_user._id,
            user_name: is_valid_user.username,
          },
        },
      },
      { session }
    );

    // Update user template packs

    await user_template_schema.updateOne(
      {
        user_id: is_valid_user._id,
        "packs.pack_id": { $ne: is_template._id },
      },
      {
        $addToSet: {
          packs: {
            pack_id: is_template._id,
            pack_name: is_template.template_name,
          },
        },
      },
      { new: true, session }
    );

    // Update template data
    const template_data = await templates_schema.findOneAndUpdate(
      { _id: is_template._id },
      { $inc: { No_of_screens_completed: completed_today } },
      { new: true, session }
    );
    const user_data = await user_template_schema.findOneAndUpdate(
      { user_id: is_valid_user._id },
      { $inc: { No_of_screens_completed: completed_today } },
      { new: true, session }
    );
    // const created_data = created_data_array[0];
    // console.log(created_data_array[0]);
    // const userObjectId = mongoose.Types.ObjectId(_id);

    const DoneScreens = is_admin
      ? await templates_schema.countDocuments({ status: "Done" })
      : await templates_schema.countDocuments({
          "users.user_id": is_valid_user._id,
          status: "Done",
        });

    // let d = created_data[0];

    await session.commitTransaction();
    session.endSession();
    res.status(200).send({
      data: {
        created_data: created_data_array[0],
        template_data,
        user_data,
      },
      DoneScreens,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({ error: "Internal error", message: error.message });
  }
};

exports.update_day_wise_count = async (req, res, next) => {
  const { is_valid_user } = req;
  const { is_admin, _id } = req.user;
  const { userId, dayId, templateId } = req.params;
  const { newValue, newStat } = req.body;
  try {
    const foundData = await day_wise_schema.findOne({
      user_id: userId,
      _id: dayId,
    });
    if (is_admin) {
      // const session = await mongoose.startSession();
      // session.startTransaction();

      let updatedCount = newValue ? newValue - foundData.completed_today : 0;

      const UpdatedData = await day_wise_schema.findOneAndUpdate(
        { user_id: userId, _id: dayId },
        {
          completed_today: newValue ? newValue : foundData.completed_today,
        },
        { new: true }
      );
      // .session(session);

      const user_data = await user_template_schema.findOneAndUpdate(
        { user_id: userId },
        { $inc: { No_of_screens_completed: updatedCount } },
        { new: true }
      );

      const template_data = await templates_schema.findOneAndUpdate(
        { _id: templateId },
        { $inc: { No_of_screens_completed: updatedCount }, status: newStat },
        { new: true }
      );

      const DoneScreens = await templates_schema.countDocuments({
        status: "Done",
      });

      res.status(200).send({
        data: { ...UpdatedData._doc, user_data, template_data },
        DoneScreens,
      });
    } else {
      if (_id === userId) {
        const UpdatedData = await day_wise_schema.findOne({
          user_id: userId,
          _id: dayId,
        });

        const user_data = await user_template_schema.findOne({
          user_id: userId,
        });

        const template_data = await templates_schema.findOneAndUpdate(
          { _id: templateId },
          { status: newStat },
          { new: true }
        );

        const DoneScreens = await templates_schema.countDocuments({
          "users.user_id": userId,
          status: "Done",
        });

        res.status(200).send({
          data: { ...UpdatedData._doc, user_data, template_data },
          DoneScreens,
        });
      } else {
        res.status(400).send({ error: "Only creator/Admin can Update" });
      }
    }
  } catch (error) {
    res.status(500).send({ error: "error", message: error.message });
  }
};

exports.delete_day_wise_count = async (req, res, next) => {
  try {
  } catch (error) {}
};

exports.get_Data = async (req, res, next) => {
  const { _id, is_admin } = req.user;
  var userId = new ObjectId(_id);
  try {
    // const getData = await day_wise_schema.find({ user_id: _id });
    const getData = is_admin
      ? await day_wise_schema.aggregate([
          {
            $lookup: {
              from: "user_template_datas",
              localField: "user_id", // Field from the day_wise_schema collection
              foreignField: "user_id", // Field from the user_template_schema collection
              as: "user_data", // Field to store joined data
            },
          },
          {
            $unwind: "$user_data",
          },
          {
            $lookup: {
              from: "template_datas",
              localField: "template_id", // Field from the day_wise_schema collection
              foreignField: "_id", // Field from the user_template_schema collection
              as: "template_data", // Field to store joined data
            },
          },
          {
            $unwind: "$template_data",
          },
        ])
      : await day_wise_schema.aggregate([
          {
            $match: { user_id: userId }, // Match documents based on user_id
          },
          {
            $lookup: {
              from: "user_template_datas",
              localField: "user_id", // Field from the day_wise_schema collection
              foreignField: "user_id", // Field from the user_template_schema collection
              as: "user_data", // Field to store joined data
            },
          },
          {
            $unwind: "$user_data",
          },
          {
            $lookup: {
              from: "template_datas",
              localField: "template_id", // Field from the day_wise_schema collection
              foreignField: "_id", // Field from the user_template_schema collection
              as: "template_data", // Field to store joined data
            },
          },
          {
            $unwind: "$template_data",
          },
        ]);

    const DoneScreens = is_admin
      ? await templates_schema.countDocuments({ status: "Done" })
      : await templates_schema.countDocuments({
          "users.user_id": _id,
          status: "Done",
        });
    res.status(200).send({ data: getData, DoneScreens });
  } catch (error) {
    res.status(500).send({ error: "Error" });
  }
};
