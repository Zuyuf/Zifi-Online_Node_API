const express = require("express");
const _ = require("lodash");

const {
   UserDetail,
   validateCard,
   updateCard,
   deleteCard,
   validatIfUserExits: vUserE,
   validateIfUserDetailsExits: vUsrDetlsE,
   validateIfCardIdExits: vCardE,
} = require("../../models/userDetail");

const auth = require("../../middlewares/auth");
const val = require("../../middlewares/validate");
const valW = require("../../middlewares/validateWrapper");
const valObjId = require("../../middlewares/validateObjectId");

const router = express.Router();

//
//

router.get("/me", [auth, valW(vUsrDetlsE)], async (req, res) => {
   res.send(req.userDetails.cards);
});

//
router.get("/:id", [auth, valObjId, valW(vCardE)], async (req, res) => {
   const card = _.find(req.userDetails.cards, "_id", req.params.id);

   res.send(card);
});

//
router.post(
   "/",
   [auth, val(validateCard), valW(vUserE), valW(vUsrDetlsE)],
   async (req, res) => {
      const cards_data = UserDetail.pickCardParams(req.body);

      const updatedDoc = await UserDetail.findByIdAndUpdate(
         req.userDetails._id,
         { $push: { cards: cards_data } },
         { new: true }
      );

      res.send(updatedDoc.cards);
   }
);

//
router.put(
   "/:id",
   [
      auth,
      valObjId,
      val(validateCard),
      valW(vUserE),
      valW(vUsrDetlsE),
      valW(vCardE),
   ],
   async (req, res) => {
      const cards_data = UserDetail.pickCardParams(req.body);

      const { updatedDoc, updatedCardIndex } = await updateCard(
         cards_data,
         req.params.id
      );

      res.send(updatedDoc.cards[updatedCardIndex]);
   }
);

//
router.delete("/:id", [auth, valObjId, valW(vCardE)], async (req, res) => {
   const { updatedDoc, deletedCard } = await deleteCard(req.params.id);

   res.send(deletedCard);
});

//
module.exports = router;
