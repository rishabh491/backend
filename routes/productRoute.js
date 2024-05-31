import express from "express";


import formidable from "express-formidable";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { brainTreePaymentController, braintreeTokenController, createProductController, deleteProductController, getAllOrdersController, getOrdersController, getProductController, getSingleProductController, orderStatusController, productFiltersController, productListController, searchProductController, updateProductController } from "../controllers/productController.js";

const router = express.Router();


router.post(
    "/create-product",
    requireSignIn,
    // isAdmin,
    formidable(),
    createProductController
  );
  router.put(
    "/update-product/:id",
    requireSignIn,
    formidable(),
    updateProductController
  );
  router.get("/get-product", getProductController);
  router.get(`/get-product/:id`, getSingleProductController);
  router.delete("/delete-product/:id",deleteProductController);
  router.post("/product-filters", productFiltersController);
  router.get("/search/:keyword", searchProductController);
//payments routes
//token
router.get("/braintree/token", braintreeTokenController);


//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);


  //orders
  router.get("/user-orders",requireSignIn,getOrdersController)





export default router;