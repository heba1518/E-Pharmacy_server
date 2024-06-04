const orderModel = require('../models/order_model');

class Order{
    static getUserOrders = async(req,res)=>{
        const userId = req.user._id;
        try{
            const orders = await orderModel.find({userId});
            res.status(200).send({success:true, data:orders});
        }catch(err){
            res.status(500).send({status:false, msg:err.message})
        }
    }
    static getSingleUserOrder = async (req,res)=>{
        const orderId = req.params.orderId;
        const userId = req.user._id;
        try{
            const order = await orderModel.findOne({userId,_id:orderId});
            res.status(200).send({success:true, data:order});
        }catch(err){
            res.status(500).send({success:false, msg:err.message});
        }
    }
    static cancelOrder = async (req,res)=>{
        const orderId = req.params.orderId;
        const userId = req.user._id;
        try{
            const orderCancelled = await orderModel.deleteOne({_id: orderId,userId});
            if(!orderCancelled) res.status(404).send({success: false, msg: 'Order not found'});
            res.status(200).send({success:true, msg: 'Order cancelled successfully'});
        }catch(err){
            res.status(500).send({success:false, msg:err.message})
        }
    }
}

module.exports = Order;