const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    description: {
      type: Object,
      required: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      //required: true,
    },
    size: [
      {
        type: String,
        trim: true,
      },
    ],
    nano_coating: {
      type: Boolean,
      default: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: [
      {
        data: Buffer,
        contentType: String,
      },
    ],
    shipping: {
      required: false,
      type: Boolean,
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
