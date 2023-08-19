const jwt = require("jsonwebtoken");
const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY

module.exports = function (req, res, next) {

  try {
    const token = req.headers.token
    if (!token) return res.status(401).json({ message: "Auth Error: Please Sign In" });

    const decoded = jwt.verify(token, PRIVATE_KEY);
    req.user = decoded;
    console.log(decoded)
    if (decoded == null) {
      console.log('here')
      res.status(500).send({message: "Please Sign In"})
      return;
    }
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Please Sign In" }); //Message originally said Invalid Token, but this is more readable for the user.
  }
};
