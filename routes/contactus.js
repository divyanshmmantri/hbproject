const express = require("express");
const router = express.Router();

const {updateQueries, updateQueryStatus} = require("../controllers/user");
const {requireSignin, isAuth, isAdmin} = require("../controllers/auth");

//route to create query
router.put("/contactus/:userid", updateQueries); //have to integrate with authentication

//route to update query status
router.put("/contactus/:userid/:queryid", updateQueryStatus); //have to integrate with authentication

module.exports = router;