const express = require("express");
const sheet1Schema = require("../Models/sheet1Schema");

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
  .post("/", async (req, res) => {
    try {
      const { name, pack, totalComponents, inProgress, completed } = req.body;

      if (!name || !pack || !totalComponents || !completed) {
        res.status(400).send({ error: "Invalid data" });
      } else {
        const PostData = await sheet1Schema.create({
          name,
          packsAssigned: pack,
          componentsInPack: totalComponents,
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
  .put("/", (req, res) => {
    res.send("Put Api");
  });

module.exports = Router;
