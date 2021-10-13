require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/ConnectDB");

const app = express();

/**
 * @desc
 * connct database
 */

connectDB();

/**
 * @desc
 * apply middlewares
 */
app.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));
app.use(express.json());
app.use(cookieParser());

/**
 * @desc
 * routes
 */
app.use("/api/auth", require("./routers/Router.Auth"));
app.use("/api/users", require("./routers/Router.User"));

/**
 * @desc
 * connect to the internet
 */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  if (err) console.log(err);

  server.close(() => process.exit(1));
});
