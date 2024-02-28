const express = require("express");
const sheet1Schema = require("../Models/sheet1Schema");
const tokenValidator = require("../tokenValidators");

const {
  getData,
  PostData,
  updateData,
  Checkvalues,
} = require("../Controllers/DataControllers");
const {
  create_day_wise,
  isValidUser,
  checkDate,
  update_day_wise_count,
  get_Data,
} = require("../Controllers/day_wise");

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

Router.post(
  "/day-wise/",
  tokenValidator,
  isValidUser,
  checkDate,
  create_day_wise
)
  .put(
    "/day-wise/:dayId/:userId/:templateId",
    tokenValidator,
    update_day_wise_count
  )
  .get("/day-wise", tokenValidator, get_Data);

module.exports = Router;
