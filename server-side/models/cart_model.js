const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;
