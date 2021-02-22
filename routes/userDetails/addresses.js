const express = require("express");
const _ = require("lodash");

const {
   UserDetail,
   validateAddress,
   updateAddress,
   deleteAddress,
   validatIfUserExits: vUserE,
   validateIfUserDetailsExits: vUsrDetlsE,
   validateIfAddressIdExits: vAdrsE,
} = require("../../models/userDetail");

const auth = require("../../middlewares/auth");
const valW = require("../../middlewares/validateWrapper");
const val = require("../../middlewares/validate");
const validateObjectId = require("../../middlewares/validateObjectId");

const router = express.Router();

//

router.get("/me", [auth, valW(vUsrDetlsE)], async (req, res) => {
   res.send(req.userDetails.addresses);
});

//
router.get("/:id", [auth, validateObjectId, valW(vAdrsE)], async (req, res) => {
   const address = _.find(req.userDetails.addresses, "_id", req.params.id);

   res.send(address);
});

//
router.post(
   "/",
   [auth, val(validateAddress), valW(vUserE), valW(vUsrDetlsE)],
   async (req, res) => {
      const address_data = UserDetail.pickAddressParams(req.body);

      const updatedDoc = await UserDetail.findByIdAndUpdate(
         req.userDetails._id,
         { $push: { addresses: address_data } },
         { new: true }
      );

      res.send(updatedDoc.addresses);
   }
);

//
router.put(
   "/:id",
   [
      auth,
      validateObjectId,
      val(validateAddress),
      valW(vUserE),
      valW(vUsrDetlsE),
      valW(vAdrsE),
   ],
   async (req, res) => {
      const address_data = UserDetail.pickAddressParams(req.body);

      const { updatedDoc, updatedAddressIndex } = await updateAddress(
         address_data,
         req.params.id
      );

      res.send(updatedDoc.addresses[updatedAddressIndex]);
   }
);

//
router.delete(
   "/:id",
   [auth, validateObjectId, valW(vAdrsE)],
   async (req, res) => {
      const { updatedDoc, deletedAddress } = await deleteAddress(req.params.id);

      res.send(deletedAddress);
   }
);

module.exports = router;
