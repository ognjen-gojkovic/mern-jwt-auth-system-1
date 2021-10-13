const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    let token;

    /**
     * @desc
     * check if there is token
     */
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return res
        .status(401)
        .json({ success: false, msg: "You are not authenticated!" });

    /**
     * @desc
     * if there is token and token is valid
     * pull user from DB and attach it to 'req' object
     * and forward it to next middleware
     */
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ success: false, msg: "Invalid Authorization!" });

      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

module.exports = auth;
