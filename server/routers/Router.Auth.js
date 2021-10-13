const express = require("express");
const router = express.Router();

const controllersAuth = require("../controllers/Controllers.Auth");

router.route("/register").post(controllersAuth.register);
router.route("/login").post(controllersAuth.login);
router.route("/logout").get(controllersAuth.logout);
router.route("/refresh_token").get(controllersAuth.refreshToken);

module.exports = router;
