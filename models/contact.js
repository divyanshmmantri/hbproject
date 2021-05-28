const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const contactSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            trim: true,
            required: true,
            maxlength: 32,
        },
        email:{
            type:String,
            trim: true,
            required: true,
            maxlength: 100,
        },
        phone:{
            type:Number,
            required:true,
            maxlength:10
        },
        message:{
            type:String,
            trim:true,
            required:true,
            maxlength:2000
        }
        
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("contact", contactSchema);