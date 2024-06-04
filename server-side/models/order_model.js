const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    medicines: [
      {
        medicineId: {
          ref: "medicine",
          type: mongoose.Schema.Types.ObjectId,
        },
        medicineTitle:{
          type:String,
          required:true,
        },
        medicineImage:{
          type:String,
          required:true,
        },
        medicinePrice:{
          type:Number,
          required:true,
        },
        medicineCount:{
          type:Number,
          default:0
        }
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
    dateCreated:{
      type:String,
      required:true
    },
    delivered:{
      type:Boolean,
      default:false
    }
  }
);

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
