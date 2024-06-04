const express = require("express");
const medicineRouter = express.Router();
const medicineController = require("../controllers/medicine_controller");
const upload = require("../middlewares/uploadFile_middleware");
const NotFound = require("../controllers/error");
const { isAuth, authRoles } = require("../middlewares/auth_middleware");

//admin and user
medicineRouter.get("/", medicineController.allmedicines);
medicineRouter.get("/single/:medicineId", medicineController.singlemedicine);
//admin
medicineRouter.post("/add", isAuth, authRoles("admin"),upload.single("medicineImg"),
medicineController.addmedicine);

medicineRouter.put("/update/:medicineId",isAuth,authRoles("admin"),upload.single("medicineImg"),
medicineController.updatemedicine);

medicineRouter.delete("/delete/:medicineId",isAuth,authRoles("admin"),medicineController.deletemedicine);

medicineRouter.all("*", NotFound.notFoundPage);

module.exports = medicineRouter;
