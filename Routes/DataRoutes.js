const express = require("express");
const sheet1Schema = require("../Models/sheet1Schema");
const tokenValidator = require("../tokenValidators");

const Router = express.Router();

Router.get("/", async (req, res) => {
  //   res.send("Get Api");

  try {
    const getData = await sheet1Schema.find();
    res.status(200).send(getData);
  } catch (error) {
    res.status(500).send({ error: "Internal error" });
  }
})
  .post("/", tokenValidator, async (req, res) => {
    try {
      const { packname, totalComponents, inProgress, completed } = req.body;

      const { username } = req.user;

      if (!username || !packname || !totalComponents || !completed) {
        res.status(400).send({ error: "Invalid data" });
      } else {
        const PostData = await sheet1Schema.create({
          name: username,
          packName: packname,
          totalComponents: totalComponents,
          componentsInProgress: inProgress,
          componentsCompleted: completed,
        });

        res.status(201).send(PostData);
      }

      //   res.send("Post Api");
    } catch (error) {
      res.status(500).send({ error: "Internal error" });
    }
  })
  .put("/", async (req, res) => {
    res.send("Put Api");
  })
  .put("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      const UpdateStatus = await sheet1Schema.updateOne({ _id: id }, req.body);

      res.status(200).send(UpdateStatus);
    } catch (error) {
      res.status(500).send({ error: "Internal Error" });
    }
  })
  .get("/filter", async (req, res) => {
    res.send("Filter");
  });

module.exports = Router;
