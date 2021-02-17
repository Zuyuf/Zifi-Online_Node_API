const express = require("express");
const { Category } = require("../models/category");

const router = express.Router();

router.get("/", async (req, res) => {
   const categories = await Category.find();

   res.send(categories);
});

router.post("/", async (req, res) => {
   let category = new Category({ name: req.body.name });
   category = await category.save();

   res.send(category);
});

module.exports = router;
