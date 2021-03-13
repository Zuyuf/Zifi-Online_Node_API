const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const mongoose = require("mongoose");
const _ = require("lodash");

const { UserDetail, addressSchema } = require("./userDetail");
const { Product } = require("./product");

//
//

const joiOrderProductSchema = Joi.object({
   productId: Joi.objectId().required(),
   quantity: Joi.number().integer().min(1).required(),
});

const joiOrderSchema = Joi.object({
   products: Joi.array().min(1).items(joiOrderProductSchema),
   address_id: Joi.objectId().required(),
});

//

const orderProductSchema = new mongoose.Schema({
   productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
   },

   productName: {
      type: String,
      required: true,
   },

   price: {
      type: Number,
      required: true,
   },

   quantity: {
      type: Number,
      default: 1,
      required: true,
   },

   subTotal: {
      type: Number,
      required: true,
   },
});

const orderSchema = new mongoose.Schema({
   user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
   },

   products: {
      type: [orderProductSchema],
      required: true,
      ref: "Product",
   },

   purchaseDate: {
      type: Date,
      default: Date.now,
   },

   deliveryDetails: {
      type: addressSchema,
      required: true,
   },

   gradTotal: {
      type: Number,
      required: true,
   },
});

//

orderSchema.statics.pickRequiredParams = function (order) {
   return _.pick(order, ["user_id", "productIds", "purchaseDate", "gradTotal"]);
};

orderSchema.statics.prepOrder = async function (req, res, order_data) {
   let data = order_data;
   data.user_id = req.user._id;

   const address = await UserDetail.findOne(
      { user_id: req.user._id },
      {
         addresses: { $elemMatch: { _id: data.address_id } },
      }
   );

   if (!address)
      return res
         .status(404)
         .send({ message: "Address with given Id was Not Found!!" });

   data.deliveryDetails = address.addresses[0];
   data.products = await getProductsForPrepOrder(data.products, res);
   data.gradTotal = _.sum(data.products.map((prod) => prod.subTotal));

   return data;
};

const Order = mongoose.model("Order", orderSchema);

//
//

function validateOrder(order) {
   return joiOrderSchema.validate(order);
}

function getProductsForPrepOrder(products, res) {
   return Promise.all(products.map(async (prod) => getProduct(prod, res)));
}

async function getProduct(prod, res) {
   const product = await Product.findById(prod.productId);
   if (!product) {
      return res
         .status(404)
         .send({ message: "Product with given Id was Not Found!!" });
   }

   return {
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity: prod.quantity,
      subTotal: product.price * prod.quantity,
   };
}

//
//

exports.Order = Order;

exports.orderSchema = orderSchema;
exports.validateOrder = validateOrder;
exports.getProductsForPrepOrder = getProductsForPrepOrder;
