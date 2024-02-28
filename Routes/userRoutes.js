const express = require("express");

const userSchema = require("../Models/UserSchema");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const Router = express.Router();

const nodemailer = require("nodemailer");
const create_template = require("../Controllers/template_controllers");

const inputValidation = (request, response, next) => {
  const { username, password, email } = request.body;

  if (!username || !password || !email) {
    response.status(400).send({ errMsg: "All Fields are mandatory" });
  } else {
    next();
  }
};
const generateEmail = async (request, response) => {
  try {
    const { email, username } = request.body;

    const getId = await userSchema.findOne({ email });

    const transporter = nodemailer.createTransport({
      host: "SMTPConnection.gmail.com",
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASS,
      },
    });

    if (!getId) {
      response.status(404).send({ error: "invalid" });
    } else {
      const { _id, username } = getId;

      await transporter.sendMail({
        from: process.env.MY_EMAIL,
        to: email,
        subject: "Verify email",
        text: `Hi ${username},\nWe just need to verify your email address before you can access Purecode Validation.\nVerify your email address https://sheets-njt7.onrender.com/user/verify/${_id}`,
      });
    }

    response.status(201).send({ msg: "email sent," });
  } catch (error) {
    response.status(500).send({ error: "Intenal Error" });
  }
};
const checkMail = async (req, res, next) => {
  const { username, email, password, isAdmin = true } = req.body;

  // console.log("Email:", email);

  const reqExpression1 = /.+@purecodemarketplace\.io$/;
  const reqExpression2 = /.+@purecodesoftware\.com$/;

  // console.log("Test result for reqExpression1:", reqExpression1.test(email));
  // console.log("Test result for reqExpression2:", reqExpression2.test(email));
  if (reqExpression1.test(email) || reqExpression2.test(email)) {
    next();
  } else {
    res.status(400).send({ error: "Use mail that associated with purecode" });
  }
};

Router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const usercheck = await userSchema.findOne({ username });
    if (!usercheck) {
      res.status(401).send({ error: "Invalid user" });
    } else {
      const { username, isAdmin, email, _id, isVerified } = usercheck;
      //   console.log(usercheck);

      const isPasswordMatched = await bcrypt.compare(
        password,
        usercheck.password
      );
      //   console.log(isPasswordMatched);
      if (isPasswordMatched) {
        if (isVerified) {
          const payload = { username, isAdmin, email, _id };
          console.log(_id);
          const jwtToken = jwt.sign(payload, process.env.MY_SECRET_TOKEN);

          res.status(200).send({ jwtToken });
        } else {
          res.status(403).send({ error: "Please verify your email" });
        }
      } else {
        res.status(400).send({ error: "Invalid password" });
      }
    }
  } catch (error) {
    res.status(500).send({ error: "Internal Error" });
  }
})
  .post(
    "/register",
    inputValidation,
    checkMail,
    async (req, res, next) => {
      const { username, email, password } = req.body;
      const reqExpression2 = /.+@purecodesoftware\.com$/;
      const isAdmin = reqExpression2.test(email);
      try {
        const usercheck = await userSchema.findOne({ username });
        const emailcheck = await userSchema.findOne({ email });

        if (!usercheck && !emailcheck) {
          const hashedPassword = await bcrypt.hash(password, 10);
          //   console.log(username);
          const InsertUser = await userSchema.create({
            username,
            email,
            password: hashedPassword,
            isAdmin,
          });
          next();
        } else {
          const errors = {};
          if (!!usercheck) {
            errors.usererror = "User already exists";
          }
          if (!!emailcheck) {
            errors.emailError = "Email already exists";
          }
          res.status(400).send(errors);
        }
      } catch (error) {
        res.status(500).send({ error: "Internal Error" });
      }
    },
    generateEmail
  )
  .get("/:id", async (req, res) => res.status(200).send("GET "));

const emailVerification = async (request, response) => {
  const { id } = request.params;

  try {
    const UserwithId = await userSchema.findOne({ _id: id });

    if (!UserwithId) {
      response.status(404).send({ errMsg: "Invalid Url" });
    } else {
      const { isVerified } = UserwithId;

      if (isVerified) {
        response.status(400).send({ errMsg: "Email already verified" });
      } else {
        const verifyUser = await userSchema.updateOne(
          { _id: id },
          { isVerified: true }
        );

        response.status(200).send(verifyUser);
      }
    }
  } catch (error) {
    response.status(500).send("failed");
  }
};

Router.get("/verify/:id", emailVerification);

module.exports = Router;
