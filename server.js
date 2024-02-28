const express = require("express");

const cors = require("cors");

const Router = require("./Routes/DataRoutes");

const userRouter = require("./Routes/userRoutes");

const mongoConnection = require("./mongoConnection");
const create_template = require("./Controllers/template_controllers");
const { Await } = require("react-router-dom");
const create_user_template_data = require("./Controllers/user_template_controllers");
const create_day_wise = require("./Controllers/day_wise");

const dotenv = require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 8001;

mongoConnection();

app.listen(PORT, () => {
  console.log(`Server Running at http://localhost:${PORT}/`);
});

app.get("/", (req, res) => {
  res.status(200).send("Hello");
});

app.use("/validation", Router);
app.use("/user", userRouter);

app.all("*", (req, res) => {
  res.send("NOT FOUND");
});

// create_user_template_data();
// create_day_wise();
