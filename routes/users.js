const _ = require("lodash");
const express = require("express");
const config = require("config");
const bcrypt = require("bcrypt");

const { User, validateUser } = require("../models/user");
const { UserDetail } = require("../models/userDetail");

const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validate = require("../middlewares/validate");
const validateObjectId = require("../middlewares/validateObjectId");

const router = express.Router();

//

router.get("/me", [auth], async (req, res) => {
   const user = await User.findById(req.user._id).select("-password -__v");
   res.send(user);
});

//
router.get("/all", [auth, admin], async (req, res) => {
   const users = await User.find().select("-__v");

   res.send(users);
});

//
router.post("/", [validate(validateUser)], async (req, res) => {
   let user = await User.findOne({ email: req.body.email });
   if (user)
      return res.status(400).send({ message: "User already registered!" });

   req.body.userDetails = [];
   user = new User(
      _.pick(req.body, ["name", "email", "password", "isAdmin", "userDetails"])
   );

   const salt = await bcrypt.genSalt(config.get("bcryptSaltKey"));
   user.password = await bcrypt.hash(user.password, salt);
   await user.save();

   const token = user.generateAuthToken();
   res.header("x-auth-token", token).send(
      _.pick(user, ["_id", "name", "email", "isAdmin"])
   );
});

//
// router.put("/:id", async (req, res) => {
//    const { error } = validateUser(req.body);
//    if (error) return res.status(400).send(error.details[0].message);

//    const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body },
//       { new: true }
//    );

//    if (!user)
//       return res.status(404).send("The User with given ID was Not Found!!");

//    res.send(user);
// });

//
router.delete("/me", [auth], async (req, res) => {
   const user = await User.findByIdAndDelete(req.user._id);

   if (!user)
      return res
         .status(404)
         .send({ message: "The User with given ID was Not Found!!" });

   await UserDetail.deleteMany({
      _id: { $in: user.userDetails },
   });

   res.send(user);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
   const user = await User.findByIdAndDelete(req.params.id).select(
      "-password -__v"
   );

   if (!user)
      return res
         .status(404)
         .send({ message: "The User with given ID was Not Found!!" });

   await UserDetail.deleteMany({
      _id: { $in: user.userDetails },
   });

   res.send(user);
});

module.exports = router;
