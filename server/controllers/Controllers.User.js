const User = require("../models/Model.User");

const controllerUser = {
  getUser: async (req, res) => {},
  deleteUser: async (req, res) => {
    try {
      /**
       * @desc
       * check if there is id in params
       * and is equal to id from req.user from auth middleware
       */
      if (req.user._id === req.params._id) {
        /**
         * @desc
         * check if there is user with this '_id'
         * that is because when we perform delete user request
         * in most cases that user is linked to other DB from which
         * content is attached to that user i.e. Posts, Cart, Todos...
         * so we wanna delete them also before we delete user
         * something like this:
         *      await Posts.deleteMany({username: user.username})
         *      await Todos.deleteMany({userID: user._id})
         */
        // const user = await User.findById(req.params._id);

        try {
          /**
           * @desc
           * here we would handle deleting linked content
           * and deletion of user
           */

          /**
           * @desc
           * delete user
           */
          await User.findByIdAndDelete(req.params._id);

          /**
           * @desc
           * send response
           */
          return res.status(200).json({ success: true, msg: "User Deleted!" });
        } catch (error) {
          return res.status(500).json({ success: false, msg: error.message });
        }
      } else {
        return res.status(400).json({
          success: false,
          msg: "Invalid Credentials!\nAccess Denied!",
        });
      }
    } catch (error) {
      return res.status(404).json({ success: false, msg: "User not Found." });
    }
  },
};

module.exports = controllerUser;
