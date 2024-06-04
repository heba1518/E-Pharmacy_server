const medicineModel = require("../models/medicine_model");
const userModel = require("../models/user_model");
const fs = require("fs");
const path = require("path");

class medicine {
  static allmedicines = async (req, res) => {
    try {
      const medicines = await medicineModel.find();
      res.status(200).send({ success: true, data: medicines });
    } catch (e) {
      res.status(500).send({ success: false, msg: e.message, data: e });
    }
  };
  static singlemedicine = async (req, res) => {
    try {
      const medicine = await medicineModel.findById(req.params.medicineId);
      res.status(200).send({ success: true, data: medicine });
    } catch (e) {
      res.status(500).send({ success: false, msg: e.message, data: e });
    }
  };
  static addmedicine = async (req, res) => {
    try {
      const data = JSON.parse(req.body.data);
      const medicine = new medicineModel({ image: req.file.filename, ...data });
      await medicine.save();
      res.status(200).send({ success: true, data: medicine });
    } catch (e) {
      if (req.feile)
        fs.unlinkSync(path.join(__dirname, "../images/" + req.file.filename));
      res.status(500).send({ success: false, msg: e.message, data: e });
    }
  };

  static updatemedicine = async (req, res) => {
    const medicineId = req.params.medicineId;
    try {
      let imageChanged = false;
      const data = JSON.parse(req.body.data);
      const medicine = await medicineModel.findById(medicineId);
      const prevImg = medicine.image;
      for (let prop in data) {
        medicine[prop] = data[prop];
      }
      if (req.file) {
        imageChanged = true;
        medicine.image = req.file.filename;
      }
      await medicine.save();
      if (imageChanged)
        fs.unlinkSync(path.join(__dirname, "../images/" + prevImg));
      res.status(200).send({ success: true, data: medicine });
    } catch (e) {
      res.status(500).send({ success: false, msg: e.message, data: e });
    }
  };
  static deletemedicine = async (req, res) => {
    const medicineId = req.params.medicineId;
    try {
      const medicine = await medicineModel.findById(medicineId);
      const prevImg = medicine.image;
      await medicine.remove();
      fs.unlinkSync(path.join(__dirname, "../images/" + prevImg));
      res.status(200).send({ success: true, msg: "deleted successfully" });
    } catch (e) {
      res.status(500).send({ success: false, msg: e.message, data: e });
    }
  };

  static addmedicineToFavourtie = async (req,res)=>{
    const medicine = req.body.medicine;
    const userId = req.user._id;
    try{
      const medicineAdded = await userModel.findOneAndUpdate({_id: userId},
        {$push:{'favoritemedicines':{medicineId: medicine._id,medicineImage: medicine.image,medicineTitle: medicine.title,
        medicinePrice: medicine.price}}},{runValidators:true});

      if(!medicineAdded) res.status(404).send({success:false, msg:'Failed to add to favourite'});

      res.status(200).send({success: true, msg: 'medicine added to favourtie'});  

    }catch(err){
      res.status(500).send({success: false, msg:err.message})
    }
  }

  static getUserFavmedicines = async (req,res)=>{
    const userId = req.user._id;
    try{
      const user = await userModel.findOne({_id:userId});

      if(!user)
        res.status(404).send({success:false, msg: 'Failed to find user'});
      
      const favmedicinesIDs = [];
      
      user.favoritemedicines.forEach((medicine)=>{
        favmedicinesIDs.push(medicine.medicineId);
      });

      res.status(200).send({success:true, data: user.favoritemedicines, dataIds: favmedicinesIDs});  
    }catch(e){
      res.status(500).send({success:false, msg: e.message});
    }
  }

  static deletemedicineFromFav = async (req,res)=>{
    const userId = req.user._id;
    const medicineId = req.params.medicineId;
    try{
      const medicineDeleted = await userModel.findOneAndUpdate({_id:userId},
        {$pull:{'favoritemedicines':{medicineId}}},{runValidators:true});
      if(!medicineDeleted)
        res.status(404).send({success:false, msg: 'Failed to remove from favourite'});
      res.status(200).send({success:true, msg: 'medicine removed from favourite'});    
    }catch(e){
      res.status(500).send({success:false, msg:e.message});
    }
  }
}

module.exports = medicine;
