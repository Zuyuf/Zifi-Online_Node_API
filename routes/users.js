const _ = require("lodash");
const express = require("express");
const { User, validateUser } = require("../models/user");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/me", [auth], async (req, res) => {
   const users = await User.findById(req.user._id).isSelected(
      "-password -userDetails"
   );
   res.send(users);
});

// router.get("/:id", async (req, res) => {
//    const user = await User.findById(req.params.id);

//    if (!user)
//       return res.status(404).send("The User with given ID was Not Found!!");

//    res.send(user);
// });

router.post("/", async (req, res) => {
   const { error } = validateUser(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   let user = await User.findOne({ email: req.body.email });
   if (user) return res.status(400).send("User already registered!");

   user = new User(_.pick(user, ["name", "email", "password"]));
   await user.save();

   const token = user.genereateAuthToken();
   res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
});

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

router.delete("/me", [auth], async (req, res) => {
   const user = await User.findByIdAndDelete(req.user._id);

   if (!user)
      return res.status(404).send("The User with given ID was Not Found!!");

   res.send(user);
});

module.exports = router;
