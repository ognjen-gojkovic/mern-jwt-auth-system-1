const express = require("express");
const router = express.Router();

const auth = require("../middlewares/Middleware.Auth");
const controllerUser = require("../controllers/Controllers.User");

router.route("/:_id").get(auth, controllerUser.getUser);
//router.route("/:_id").patch(auth, controllerUser);
router.route("/:_id").delete(auth, controllerUser.deleteUser);

module.exports = router;
