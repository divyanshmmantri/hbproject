const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

const userwallet = new mongoose.Schema(
  {
    walletpoints: { 
    type: Number,
    default:0
    },
    balance:{
        type:Number
    }
   
  },
 
);
const  userWallet= mongoose.model("userwallet", userwallet);

const querySchema = new mongoose.Schema({
  query: {
    type: String,
    trim: true,
    required: true,
  },
  orderId: { type: ObjectId, ref: "Order" }, 
  status: {
    type: String,
    default: "Pending",
    enum: [
      "Pending",
      "Processing",
      "Closed",
    ]
  }
});

const Query = mongoose.model("Query", querySchema);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
    wallet:{
      type:Number,
      default:0,
    },
    queries: [querySchema],
    profilePic: {
      type: Buffer
    }
  },
  { timestamps: true }
);

//virtual field
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1(); //gives random string
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

//methods
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};
const User = mongoose.model("User", userSchema);
module.exports = {userWallet, User};
