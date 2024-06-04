const cartModel = require("../models/cart_model");
const medicineModel = require("../models/medicine_model");
const orderModel = require("../models/order_model");
const userModel = require("../models/user_model");

class Cart {
  static showCart = async (req, res) => {
    try {
      const userId = req.user._id;
      const cart = await cartModel
        .findOne({ userId: userId })
        .populate("medicines");
      if (!cart) {
        return res.status(404).send({ success: false, msg: "This user has no carts" });
      }
      res.status(200).send({
        success: true,
        medicines: cart.medicines,
        totalPrice: cart.totalPrice,
      });
    } catch (error) {
      res.status(500).send({ success: false, err: error.message });
    }
  };
  static addToCart = async (req, res) => {
    try {
      const { medicineId, medicineTitle, medicineImage, medicinePrice } = req.body;
      let cart = null;
      cart = await cartModel.findOne({ userId: req.user._id });
      if (!cart) {
        cart = new cartModel();
        cart.userId = req.user._id;
        cart.medicines.push({medicineId,medicineTitle,medicineImage,medicinePrice,medicineCount:1});
        cart.totalPrice += medicinePrice;
      } else {
        const cartmedicineIndex = cart.medicines.findIndex((medicine)=> medicine.medicineId == medicineId);
        if(cartmedicineIndex!=-1) cart.medicines[cartmedicineIndex].medicineCount += 1;
        else  
          cart.medicines.push({medicineId,medicineTitle,medicineImage,medicinePrice,medicineCount:1});
        cart.totalPrice += medicinePrice;
      }
      await cart.save();

      res.status(200).json({
        success: true,
        msg: "medicine added to cart!",
        data: cart,
      });
    } catch (error) {
      res.status(500).send({ success: false, err: error.message });
    }
  };
  static deletemedicineFromCart = async (req, res) => {
    try {
      const userId = req.user._id;
      const medicineId = req.params.medicineId;
      const {medicinePrice,medicineCount} = req.query;
      const cart = await cartModel.findOne({ userId });
      cart.medicines = cart.medicines.filter((b) => b.medicineId != medicineId);
      cart.totalPrice -= (medicinePrice*medicineCount);
      await cart.save();
      res.status(200).json({
        success: true,
        msg: "medicine removed from cart!",
        data: cart,
      });
    } catch (error) {
      res.status(500).send({ success: false, msg: error.message });
    }
  };
  static checkout = async (req, res) => {
    try {
      const userId = req.user._id;
      let medicines = [];
      const cart = await cartModel.findOne({ user: userId }).populate("medicines");
      for (let medicine of cart.medicines) {
        medicines.push({medicineId:medicine.medicineId,medicineTitle:medicine.medicineTitle,medicinePrice:medicine.medicinePrice,
        medicineCount:medicine.medicineCount,medicineImage:medicine.medicineImage});
      }
      const order = await orderModel.create({
        userId,
        medicines,
        totalPrice: req.body.totalPrice,
        dateCreated: req.body.dateCreated,
      });
      cart.medicines = [];
      cart.totalPrice = 0;
      await cart.save();
      return res.status(200).json({
        success: true,
        msg: "Thank you for your order! You can check it at the My Orders tab",
        data: order,
      });
    } catch (error) {
      res.status(500).send({ success: false, msg: error.message });
    }
  };

  static changemedicineCount = async (req,res)=>{
    const medicineId = req.params.medicineId;
    const userId = req.user._id;
    try{
      const cart = await cartModel.findOne({userId}).populate('medicines');
      const medicineIndex = cart.medicines.findIndex((b)=> b.medicineId == medicineId);
      //remove all the count of this medicine from price untill we get the new count
      let newTotalPrice = cart.totalPrice - (cart.medicines[medicineIndex].medicinePrice*cart.medicines[medicineIndex].medicineCount);
      cart.medicines[medicineIndex].medicineCount = req.body.medicineCount;
      //add the price of the medicines after updating the count
      cart.totalPrice = newTotalPrice + (cart.medicines[medicineIndex].medicineCount*cart.medicines[medicineIndex].medicinePrice);
      await cart.save();
      res.status(200).send({success:true, msg:'medicine count updated', medicines:cart.medicines , totalPrice:cart.totalPrice});
    }catch(err){
      res.status(500).send({success:false, msg:err.message});
    }
  }
}

module.exports = Cart;
