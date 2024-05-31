import express from "express";
import { forgotPasswordController, loginController, registerController, testController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { getAllOrdersController, getAlluser, getOrdersController, orderStatusController } from "../controllers/productController.js";

//router object
const router=express.Router()
//routing
//Register

router.post("/register",registerController);
router.post("/login",loginController);
router.get("/test",requireSignIn,isAdmin,testController);
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
  });
  router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);
  router.get("/all-users", requireSignIn, isAdmin, getAlluser);
  router.put("/order-status/:orderId",orderStatusController)

export default router;