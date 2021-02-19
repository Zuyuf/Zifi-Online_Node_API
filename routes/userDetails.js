const express = require("express");
const _ = require("lodash");

const { UserDetail, validateUserDetail } = require("../models/userDetail");

const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const validateObjectId = require("../middlewares/validateObjectId");

const router = express.Router();

//

router.get("/", [auth], async (req, res) => {
   const userDetail = await UserDetail.find();
   res.send(userDetail);
});

//
router.get("/:id", [auth, validateObjectId], async (req, res) => {
   const userDetail = await UserDetail.findById(req.params.id);

   if (!userDetail)
      return res
         .status(404)
         .send("The User Details with given ID was Not Found!!");

   res.send(userDetail);
});

//
router.post("/", [auth, validate(validateUserDetail)], async (req, res) => {
   let userDetails = new UserDetail(UserDetail.pickReqiuredParams(req.body));
   userDetails = await userDetails.save();

   res.send(userDetails);
});

//
router.put(
   "/:id",
   [auth, validateObjectId, validate(validateUserDetail)],
   async (req, res) => {
      const userDetails = await UserDetail.findByIdAndUpdate(
         req.params.id,
         UserDetail.pickReqiuredParams(req.body),
         { new: true }
      );

      if (!userDetails)
         return res
            .status(404)
            .send("The User Details with given ID was Not Found!!");

      res.send(userDetails);
   }
);

//
router.delete("/:id", [auth, validateObjectId], async (req, res) => {
   const userDetails = await UserDetail.findByIdAndDelete(req.params.id);

   if (!userDetails)
      return res
         .status(404)
         .send("The User Details with given ID was Not Found!!");

   res.send(userDetails);
});

module.exports = router;
