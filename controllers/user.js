const multer = require('multer');
const {User,userWallet} = require("../models/user");
const { Order } = require("../models/order");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

// exports.update = (req, res) => {
//     console.log('user update', req.body);
//     req.body.role = 0; // role will always be 0
//     User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }, (err, user) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'You are not authorized to perform this action'
//             });
//         }
//         user.hashed_password = undefined;
//         user.salt = undefined;
//         res.json(user);
//     });
// };

exports.update = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const { name, password } = req.body;


  User.findOne({ _id: req.profile._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    if (!name) {
      return res.status(400).json({
        error: "Name is required",
      });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: "Password should be min 6 characters long",
        });
      } else {
        user.password = password;
      }
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log("USER UPDATE ERROR", err);
        return res.status(400).json({
          error: "User update failed",
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};
exports.update_wallet = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const { userwallet } = req.body;


  User.findOne({ _id: req.profile._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    else {
      userWallet.userwallet = userwallet;
    }
  })
  }


exports.addOrderToUserHistory = (req, res, next) => {
  let history = [];

  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount,
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { history: history } },
    { new: true },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: "Could not update user purchase history",
        });
      }
      next();
    }
  );
};

exports.purchaseHistory = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(orders);
    });
};

exports.userwallet=(req,res,next)=>{
  var Total_payable_amount=0
  User.findOne({ _id: req.profile._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    else
    {
        req.body.order.forEach((item)=>{
          ({
            _id: item._id,
            Total_payable_amount:Total_payable_amount+req.body.order.amount
          })
        })
        res.send(Total_payable_amount)
    }
  });
};

//update queries 
exports.updateQueries = (req, res, next) => {
  let queries = [];

  queries.push({
    status: req.body.status,
    orderId: req.body.orderId,
    query: req.body.query
  });

  User.findOneAndUpdate(
    { _id: req.params.userid }, //change when auth works
    { $push: { queries } },
    { new: true },
    (error, query) => {
      if (error) {
        return res.status(400).json({
          error: "Could not update user queries",
        });
      }
      res.send({ msg: "Query sent" });
    }
  );
};

exports.updateQueryStatus = (req, res) => {
  User.update(
    { 'queries._id': req.params.queryid }, 
    { $set: { 'queries.$.status': req.body.status } },
    (err, query) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.send({ msg: "Query status updated" });
    }
  );
};

exports.purchaseHistory = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(orders);
    });
};

exports.upload = multer({ //file upload middleware
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb){
    if(!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)){
      return cb(new Error('Please upload an image'));
    }
    cb(undefined,true);
  }
});

exports.uploadProfilePic = (req, res) => {
  User.update(
    { _id: req.params.userid},
    { $set: { profilePic: req.file.buffer }},
    (err, binaryImg) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.send({ msg: "Image uploaded" });
    }
  );
};
