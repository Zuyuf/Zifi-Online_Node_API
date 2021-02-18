const express = require("express");
const { Category, validateCategory } = require("../models/category");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

const router = express.Router();

router.get("/", async (req, res) => {
   const categories = await Category.find();
   res.send(categories);
});

router.get("/:id", async (req, res) => {
   const category = await Category.findById(req.params.id);

   if (!category)
      return res.status(404).send("The category with given ID was not Found!!");

   res.send(category);
});

router.post("/", [auth, admin], async (req, res) => {
   const { error } = validateCategory(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   let category = new Category({ name: req.body.name });
   category = await category.save();

   res.send(category);
});

router.put("/:id", [auth, admin], async (req, res) => {
   const { error } = validateCategory(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
   );

   if (!category)
      return res.status(404).send("The category with given ID was not Found!!");

   res.send(category);
});

router.delete("/:id", [auth, admin], async (req, res) => {
   const category = await Category.findByIdAndDelete(req.params.id);

   if (!category)
      return res.status(404).send("The category with given ID was not Found!!");

   res.send(category);
});

module.exports = router;
