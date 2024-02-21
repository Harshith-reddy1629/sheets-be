const sheet1Schema = require("../Models/sheet1Schema");

exports.getData = async (req, res) => {
  //   res.send("Get Api");
  try {
    const { isAdmin, username } = req.user;
    if (isAdmin) {
      const getData = await sheet1Schema.find();
      const sortedData = getData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      res.status(200).send(sortedData);
    } else {
      const getData = await sheet1Schema.find({ name: username });

      const sortedData = getData.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      res.status(200).send(sortedData);
    }
  } catch (error) {
    res.status(500).send({ error: "Internal error" });
  }
};

exports.getUserData = () => {};

exports.PostData = async (req, res) => {
  try {
    const { packname, totalComponents, inProgress, completed } = req.body;

    const { username, isAdmin, _id } = req.user;

    const D = new Date().toISOString().slice(0, 10);
    // console.log(D);

    if (!username || !packname || !totalComponents || !completed) {
      res.status(400).send({ error: "Invalid data" });
    } else if (isAdmin && !req.body.username) {
      res.status(400).send({ error: "enter name of Editor" });
    } else {
      const checkReq = await sheet1Schema.findOne({
        // _id,
        name: isAdmin ? req.body.username : username,
        packName: packname,
        date: D,
      });

      console.log(checkReq);
      console.log(!checkReq);

      if (!checkReq) {
        const PostData = await sheet1Schema.create({
          name: isAdmin ? req.body.username : username,
          packName: packname,
          totalComponents: totalComponents,
          componentsInProgress: inProgress,
          componentsCompleted: completed,
          date: D,
        });
        res.status(201).send(PostData);
      } else {
        res.status(400).send({
          error: "cannot create data on same date with same component",
        });
      }
    }

    //   res.send("Post Api");
  } catch (error) {
    res.status(500).send({ error: "Internal error" });
  }
};

exports.updateData = async (req, res) => {
  try {
    const { isAdmin } = req.user;

    const { id } = req.params;

    if (isAdmin) {
      const UpdateStatus = await sheet1Schema.updateOne({ _id: id }, req.body);
      res.status(200).send(UpdateStatus);
    } else {
      res.status(400).send({ error: "Only admin can update " });
    }
  } catch (error) {
    res.status(500).send({ error: "Internal Error", issues: error });
  }
};
const deleteData = () => {};

// exports.Checkvalues = async (req, res, next) => {
//   res.status(400).send({ error: "Invalid Data" });
//   res.status(500).send({ error: "Internal Error" });
// };
