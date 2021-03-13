const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const mongoose = require("mongoose");
const _ = require("lodash");

const { User } = require("./user");

//

const joiAddressSchema = Joi.object({
   name: Joi.string().trim().min(5).max(50).required(),
   line1: Joi.string().trim().min(10).max(100).required(),
   line2: Joi.string().trim().min(10).max(100).required(),
   pincode: Joi.string().trim().min(4).max(10).required(),
   phoneNumber: Joi.number()
      .integer()
      .min(10 ** 4)
      .max(10 ** 19)
      .required(),
   landMark: Joi.string().trim().min(5).max(50).required(),
});

const joiCardsSchema = Joi.object({
   name: Joi.string().trim().min(5).max(50).required(),
   cardNumber: Joi.string().trim().min(8).max(30).required(),
});

const joiUserDetailSchema = Joi.object({
   firstName: Joi.string().trim().min(5).max(50).required(),
   lastName: Joi.string().trim().min(5).max(50).required(),
   addresses: Joi.array().min(0).max(5).items(joiAddressSchema),
   homePhone: Joi.number()
      .integer()
      .min(10 ** 4)
      .max(10 ** 19)
      .required(),
   workPhone: Joi.number()
      .integer()
      .min(10 ** 4)
      .max(10 ** 19)
      .required(),
   cards: Joi.array().min(0).max(5).items(joiCardsSchema),
});

//

const addressSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
   },

   line1: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 100,
   },

   line2: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 100,
   },

   pincode: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 10,
   },

   phoneNumber: {
      type: Number,
      required: true,
      minlength: 5,
      maxlength: 20,
   },

   landMark: {
      type: String,
      minlength: 5,
      maxlngth: 50,
   },
});

const cardSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
   },

   cardNumber: {
      type: String,
      minlength: 8,
      maxlength: 30,
   },
});

const userDetailSchema = new mongoose.Schema({
   user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
   },

   firstName: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
   },

   lastName: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
   },

   addresses: [addressSchema],

   homePhone: {
      type: Number,
      required: true,
      minlength: 5,
      maxlength: 20,
   },

   workPhone: {
      type: Number,
      minlength: 5,
      maxlength: 20,
   },

   cards: [cardSchema],
});

//

userDetailSchema.statics.pickReqiuredParams = function (data) {
   return _.pick(data, [
      "user_id",
      "firstName",
      "lastName",
      "addresses",
      "homePhone",
      "workPhone",
      "cards",
   ]);
};

userDetailSchema.statics.pickAddressParams = function (data) {
   return _.pick(data, [
      "name",
      "line1",
      "line2",
      "pincode",
      "phoneNumber",
      "landMark",
   ]);
};

userDetailSchema.statics.pickCardParams = function (data) {
   return _.pick(data, ["name", "cardNumber"]);
};

//

const UserDetail = mongoose.model("UserDetail", userDetailSchema);

//
//
function validateUserDetail(usr) {
   return joiUserDetailSchema.validate(usr);
}

function validateAddress(adrs) {
   return joiAddressSchema.validate(adrs);
}

function validateCard(card) {
   return joiCardsSchema.validate(card);
}

//

async function validatIfUserExits(req) {
   const user = await User.findById(req.user._id);

   if (!user) {
      return { status: 404, message: "User was Not Found" };
   }

   return false;
}

async function validateIfUserDetailsExits(req) {
   const userDetails = await UserDetail.findOne({ user_id: req.user._id });

   if (!userDetails) {
      return {
         status: 404,
         message:
            "The User Details with given User ID was Not Found!!, Fill in Yours Personal Details first",
      };
   }

   req.userDetails = userDetails.toObject();

   return false;
}

async function validateIfAddressIdExits(req) {
   const userDetails = await UserDetail.findOne({
      "addresses._id": req.params.id,
   });

   if (!userDetails) {
      return { status: 404, message: "Address with given Id was Not Found!!" };
   }

   req.userDetails = userDetails.toObject();
   return false;
}

async function checkIfAddressIdExits(id) {
   const userDetails = await UserDetail.findOne({
      "addresses._id": id,
   });

   if (!userDetails) {
      return { status: 404, message: "Address with given Id was Not Found!!" };
   }

   return userDetails.toObject();
}

async function validateIfCardIdExits(req) {
   const userDetails = await UserDetail.findOne({
      "cards._id": req.params.id,
   });

   if (!userDetails) {
      return { status: 404, message: "Card with given Id was Not Found!!" };
   }

   req.userDetails = userDetails.toObject();
   return false;
}

//

function updateAddress(addressData, addressId) {
   addressData._id = addressId;
   const query = { "addresses._id": addressId };

   return UserDetail.findOne(query).then((doc) => {
      const addressIndex = doc.addresses
         .map((obj) => obj._id)
         .indexOf(addressId);

      doc.addresses[addressIndex] = addressData;
      doc.save();

      return { updatedDoc: doc, updatedAddressIndex: addressIndex };
   });
}

function deleteAddress(addressId) {
   const query = { "addresses._id": addressId };

   return UserDetail.findOne(query).then((doc) => {
      const addressIndex = doc.addresses
         .map((obj) => obj._id)
         .indexOf(addressId);

      let deletedAddress = doc.addresses.splice(addressIndex, 1);

      doc.save();

      return { updatedDoc: doc, deletedAddress: deletedAddress };
   });
}

//

function updateCard(cardData, cardId) {
   cardData._id = cardId;
   const query = { "cards._id": cardId };

   return UserDetail.findOne(query).then((doc) => {
      const cardIndex = doc.cards.map((obj) => obj._id).indexOf(cardId);

      doc.cards[cardIndex] = cardData;
      doc.save();

      return { updatedDoc: doc, updatedCardIndex: cardIndex };
   });
}

function deleteCard(cardId) {
   const query = { "cards._id": cardId };

   return UserDetail.findOne(query).then((doc) => {
      const cardIndex = doc.cards.map((obj) => obj._id).indexOf(cardId);

      let deletedCard = doc.cards.splice(cardIndex, 1);
      doc.save();

      return { updatedDoc: doc, deletedCard: deletedCard };
   });
}

//
//

exports.UserDetail = UserDetail;

exports.addressSchema = addressSchema;
exports.joiUserDetailSchema = joiUserDetailSchema;

exports.validateUserDetail = validateUserDetail;
exports.validateAddress = validateAddress;
exports.validateCard = validateCard;

exports.validatIfUserExits = validatIfUserExits;
exports.validateIfUserDetailsExits = validateIfUserDetailsExits;
exports.validateIfAddressIdExits = validateIfAddressIdExits;
exports.validateIfCardIdExits = validateIfCardIdExits;

exports.updateAddress = updateAddress;
exports.deleteAddress = deleteAddress;

exports.updateCard = updateCard;
exports.deleteCard = deleteCard;
