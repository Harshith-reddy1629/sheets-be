const express = require("express");

const userSchema = require("../Models/UserSchema");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const Router = express.Router();

Router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const usercheck = await userSchema.findOne({ username });
    if (!usercheck) {
      res.status(401).send({ error: "Invalid user" });
    } else {
      const { username, isAdmin, email } = usercheck;
      //   console.log(usercheck);

      const isPasswordMatched = await bcrypt.compare(
        password,
        usercheck.password
      );
      //   console.log(isPasswordMatched);
      if (isPasswordMatched) {
        const payload = { username, isAdmin, email };
        const jwtToken = jwt.sign(payload, process.env.MY_SECRET_TOKEN);

        res.status(200).send({ jwtToken });
      } else {
        res.status(400).send({ error: "Invalid user" });
      }
    }
  } catch (error) {
    res.status(500).send({ error: "Internal Error" });
  }
}).post("/register", async (req, res) => {
  const { username, email, password, isAdmin = true } = req.body;

  try {
    const usercheck = await userSchema.findOne({ username });

    if (!usercheck) {
      const hashedPassword = await bcrypt.hash(password, 10);
      //   console.log(username);
      const InsertUser = await userSchema.create({
        username,
        email,
        password: hashedPassword,
        isAdmin,
      });
      res.status(201).send(InsertUser);
    } else {
      res.status(400).send({ error: "User already exists" });
    }
  } catch (error) {
    res.status(500).send({ error: "Internal Error" });
  }
});

module.exports = Router;
