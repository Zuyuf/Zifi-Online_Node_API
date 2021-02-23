const express = require("express");
const _ = require("lodash");

const { Product, validateProduct: vProd } = require("../models/product");
const { User } = require("../models/user");

const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const val = require("../middlewares/validate");
const valObjId = require("../middlewares/validateObjectId");

const router = express.Router();

//
//

router.get("/", async (req, res) => {
   const products = await Product.find();

   res.send(products);
});

//
router.get("/:id", [valObjId], async (req, res) => {
   const product = await Product.findById(req.params.id);

   if (!product)
      return res
         .status(404)
         .send({ message: "The Product with given ID was Not Found!!" });

   res.send(product);
});

//
router.post("/", [auth, admin, val(vProd)], async (req, res) => {
   const product_data = Product.pickReqiuredParams(req.body);

   const product = new Product(product_data);
   await product.save();

   res.send(product);
});

//
router.put("/:id", [auth, admin, valObjId, val(vProd)], async (req, res) => {
   const product_data = Product.pickReqiuredParams(req.body);

   const product = await Product.findByIdAndUpdate(
      req.params.id,
      product_data,
      { new: true }
   );

   if (!product)
      return res.status(404).send({
         message: "The Product with given ID was Not Found!!",
      });

   res.send(product);
});

//
router.delete("/:id", [auth, admin, valObjId], async (req, res) => {
   const product = await Product.findByIdAndDelete(req.params.id);

   if (!product)
      return res.status(404).send({
         message: "The Product with given ID was Not Found!!",
      });

   res.send(product);
});

//
module.exports = router;
