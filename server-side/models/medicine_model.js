const mongoose = require("mongoose");

const medicineSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

medicineSchema.pre('remove', async function(next){
  try{
   
    await this.model('Cart').updateMany({$pull:{'medicines':{medicineId:this._id}}});
  }catch(e){
    console.log(e);
  }
});

const medicineModel = mongoose.model("medicine", medicineSchema);

module.exports = medicineModel;