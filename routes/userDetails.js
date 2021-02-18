const express = require("express");
const { UserDetail, validateUserDetail } = require("../models/userDetail");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", [auth], async (req, res) => {
   const userDetail = await UserDetail.find();
   res.send(userDetail);
});

router.get("/:id", [auth], async (req, res) => {
   const userDetail = await UserDetail.findById(req.params.id);

   if (!userDetail)
      return res
         .status(404)
         .send("The User Details with given ID was Not Found!!");

   res.send(userDetail);
});

router.post("/", [auth], async (req, res) => {
   const { error } = validateUserDetail(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   let userDetails = new UserDetail({ ...req.body });
   userDetails = await userDetails.save();

   res.send(userDetails);
});

router.put("/:id", [auth], async (req, res) => {
   const { error } = validateUserDetail(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   const userDetails = await UserDetail.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
   );

   if (!userDetails)
      return res
         .status(404)
         .send("The User Details with given ID was Not Found!!");

   res.send(userDetails);
});

router.delete("/:id", [auth], async (req, res) => {
   const userDetails = await UserDetail.findByIdAndDelete(req.params.id);

   if (!userDetails)
      return res
         .status(404)
         .send("The User Details with given ID was Not Found!!");

   res.send(userDetails);
});

module.exports = router;
