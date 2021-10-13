const User = require("../models/Model.User");
const jwt = require("jsonwebtoken");

const controllerAuth = {
  register: async (req, res) => {
    console.log("register req.body", req.body);
    try {
      const { username, email, password } = req.body;

      /**
       * @desc
       * check if all input fields are provided
       */
      if (!username)
        return res
          .status(400)
          .json({ success: false, msg: "Username must be provided!" });
      if (!email)
        return res
          .status(400)
          .json({ success: false, msg: "Valid email must be provided!" });
      if (!password)
        return res.status(400).json({
          success: false,
          msg:
            "Password must be provided!\nIt needs to be at least 6 characters long!",
        });

      /**
       * @desc
       * check if user already exists
       */
      const userDB = await User.findOne({ email: email });

      if (userDB)
        return res
          .status(400)
          .json({ success: false, msg: "User already exists!" });

      /**
       * @desc
       * create new user
       */
      const user = await User.create({ username, email, password });

      /**
       * @desc
       * generate tokens
       */
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      /**
       * @desc
       * remove password from user that we will send to frontend
       */
      const newUser = { ...user._doc };
      newUser.password = undefined;

      /**
       * @desc
       * save refresh token to cookies header
       * on client side in 'fetch' method should be set option 'credentials: "include"'
       * on server side in cors options object should be set 'credentials: true'
       *
       * secure should be enabled when using 'https' protocol
       * when setting cookie-header from cross-origin 'sameSite' property should be 'none'
       * also in browser settings in my case 'Goggle Chrome' in 'security' section
       * should be enabled setting cookies from the third party
       */
      if (newUser && refreshToken.length > 50)
        res.cookie("refresh_token", refreshToken, {
          maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

      /**
       * @desc
       * if all ok send response
       */
      res
        .status(201)
        .json({ success: true, msg: "Success.", user: newUser, accessToken });
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      /**
       * @desc
       * check if input is provided
       */
      if (!email)
        return res
          .status(400)
          .json({ success: false, msg: "Email must be provided!" });
      if (!password || password.length < 6)
        return res.status(400).json({
          success: false,
          msg:
            "Password must be provided!\nIt needs to be at least 6 charaters long!",
        });

      /**
       * @desc
       * check if there is user in database and return it
       */
      const userDB = await User.findOne({ email }).select("+password");

      if (!userDB)
        return res
          .status(400)
          .json({ success: false, msg: "Invalid Credentials!" });

      /**
       * @desc
       * check if passwords matche
       */
      const isMatch = await userDB.matchPasswords(password);

      if (!isMatch)
        return res
          .status(400)
          .json({ success: false, msg: "Invalid Credentials!" });

      /**
       * @desc
       * generate tokens
       */
      let accessToken;
      let refreshToken;
      if (userDB && isMatch) {
        accessToken = userDB.generateAccessToken();
        refreshToken = userDB.generateRefreshToken();
      }

      /**
       * @desc
       * send refresh token via cookies
       */
      //if (userDB && isMatch && refreshToken)
      res.cookie("refresh_token", refreshToken, {
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      /**
       * @desc
       * remove password from 'user' that will be sent to frontend
       */
      const newUser = { ...userDB._doc };
      newUser.password = undefined;

      /**
       * @desc
       * send response
       */
      return res
        .status(200)
        .json({ success: true, msg: "Success.", user: newUser, accessToken });
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  },
  logout: (req, res) => {
    try {
      res.clearCookie("refresh_token");
      return res.status(200).json({ success: true, msg: "Logged Out!" });
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      /**
       * @desc
       * check if there is token on cookies header
       */

      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken)
        return res
          .status(400)
          .json({ success: false, msg: "Please Login or Register!" });

      /**
       * @desc
       * verify token
       */
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        null,
        async (err, user) => {
          if (err)
            return res
              .status(400)
              .json({ success: false, msg: "Please Login or Register!" });

          /**
           * @desc
           * retrive user from DB
           */
          const userDB = await User.findById({ _id: user._id });

          /**
           * @desc
           * generate access token
           */
          const accessToken = userDB.generateAccessToken();

          /**
           * @desc
           * send response
           */
          res.status(200).json({ success: true, msg: "Success.", accessToken });
        }
      );
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message });
    }
  },
};

module.exports = controllerAuth;
