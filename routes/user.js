const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const {
  userById,
  read,
  update,
  purchaseHistory,
  userwallet,
  update_wallet,
  upload, //middleware
  uploadProfilePic
} = require("../controllers/user");

router.get("/secret", requireSignin, (req, res) => {
  res.json({
    user: "got here yay",
  });
});

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);
router.get("/orders/by/user/:userId", requireSignin, isAuth, purchaseHistory);
router.get("/wallet/user/:userId", requireSignin, isAuth, userwallet);
router.put("/user/:userId", requireSignin, isAuth, update_wallet);
//upload profile pic, have to put behind authentication
router.post("/user/upload/:userid",upload.single('upload'),uploadProfilePic); 
router.param("userId", userById);

module.exports = router;
