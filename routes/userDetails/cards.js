const express = require("express");
const _ = require("lodash");

const { UserDetail, validateAddress } = require("../../models/userDetail");
const { User } = require("../../models/user");

const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const validate = require("../../middlewares/validate");
const validateObjectId = require("../../middlewares/validateObjectId");

const router = express.Router();

//

//
module.exports = router;
