const express = require("express");
const sheet1Schema = require("../Models/sheet1Schema");
const tokenValidator = require("../tokenValidators");
const {
  getData,
  PostData,
  updateData,
  Checkvalues,
} = require("../Controllers/DataControllers");

// const

const Router = express.Router();

Router.get("/", tokenValidator, getData)
  .post("/", tokenValidator, PostData)
  .put("/:id", tokenValidator, updateData)
  .get("/filter", async (req, res) => {
    res.send("Filter");
  })
  .put("/", async (req, res) => {
    res.send("Put Api");
  });

module.exports = Router;
