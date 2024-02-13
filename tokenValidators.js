const jwt = require("jsonwebtoken");

const tokenValidator = (req, res, next) => {
  let jwtToken;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    res.status(401);
    res.send("Invalid JWT Token");
  } else {
    jwt.verify(
      jwtToken,
      process.env.MY_SECRET_TOKEN,
      async (error, payload) => {
        if (error) {
          res.status(401);
          res.send({ errMsg: "Invalid JWT Token" });
        } else {
          req.user = payload;
          next();
        }
      }
    );
  }
};

module.exports = tokenValidator;
