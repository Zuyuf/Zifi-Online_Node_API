const express = require("express");
const _ = require("lodash");

const {
   Order,
   validateOrder: vOdr,
   getProductsForPrepOrder,
} = require("../models/order");

const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const val = require("../middlewares/validate");
const valObjId = require("../middlewares/validateObjectId");

const router = express.Router();

//
//

router.get("/me", [auth], async (req, res) => {
   const orders = await Order.find({ user_id: req.user._id });

   res.send(orders);
});

//
router.get("/:id", [auth, valObjId], async (req, res) => {
   const order = await Order.findById(req.params.id);

   if (!order)
      return res
         .status(404)
         .send({ message: "The Order with given ID was Not Found!!" });

   res.send(order);
});

//
router.post("/", [auth, val(vOdr)], async (req, res) => {
   let order_data = await Order.prepOrder(req, res, req.body);

   const order = new Order(order_data);
   await order.save();

   res.send(order);
});

//
module.exports = router;
