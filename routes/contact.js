const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const {contact} =require("../controllers/contact");
const {contactvalidator} =require("../validator/index");
const {
  userById,
  read,
  update,
  purchaseHistory,
} = require("../controllers/user");

router.post("/contactus",contactvalidator,contact);

router.param("userId", userById);

module.exports = router;
