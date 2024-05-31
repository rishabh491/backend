import productModel from "../models/productModel.js";
import fs from "fs";

import braintree from "braintree";
import dotenv from "dotenv";
import orderMOdel from "../models/orderMOdel.js";
import userModel from "../models/userModel.js";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  
});


export const createProductController = async (req, res) => {
    try {
      const { name, description, price, category,photo, quantity, shipping } =
        req.fields;
      
      //validation
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        // case !category:
        //   return res.status(500).send({ error: "Category is Required" });
        case !quantity:
          return res.status(500).send({ error: "Quantity is Required" });
        case !photo :
          return res
            .status(500)
            .send({ error: "photo is Required and should be less then 1mb" });
      }
  //, slug: slugify(name)
      const products = new productModel({ ...req.fields });
    //   if (photo) {
    //     products.photo.data = fs.readFileSync(photo.path);
    //     products.photo.contentType = photo.type;
    //   }
      await products.save();
      res.status(201).send({
        success: true,
        message: "Product Created Successfully",
        products,
      });
    } catch (error) {
      
      res.status(500).send({
        success: false,
        error,
        message: "Error in crearing product",
      });
    }
  };
  //get All product
  export const getProductController = async (req, res) => {
  try {
    const products = await productModel.find({})
    //   .populate("category")
    //   .select("-photo")
    //   .limit(12)
    //   .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};
//get single product
export const getSingleProductController = async (req, res) => {
  try {
    const _id=req.params.id
    const product = await productModel.findById({ _id:_id})
    //   .select("-photo")
    //   .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};
//delete controller
export const deleteProductController = async (req, res) => {
    try {
      await productModel.findByIdAndDelete(req.params.id)
      res.status(200).send({
        success: true,
        message: "Product Deleted successfully",
      });
    } catch (error) {
      
      res.status(500).send({
        success: false,
        message: "Error while deleting product",
        error,
      });
    }
  };
  
  //upate producta
export const updateProductController = async (req, res) => {
    try {
      const { name, description, price, category,photo, quantity, shipping } =
        req.fields;
      //alidation
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !quantity:
          return res.status(500).send({ error: "Quantity is Required" });
        case !photo :
          return res
            .status(500)
            .send({ error: "photo is Required and should be less then 1mb" });
      }
  
      const products = await productModel.findByIdAndUpdate(
        req.params.id,
      );
     
      await products.save();
      res.status(201).send({
        success: true,
        message: "Product Updated Successfully",
        products,
      });
    } catch (error) {
      
      res.status(500).send({
        success: false,
        error,
        message: "Error in Updte product",
      });
    }
  };
  

  // filters
export const productFiltersController = async (req, res) => {
    try {

      const { checked, radio } = req.body;
      
      let args = {};
      if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
      console.log(args)
      const products = await productModel.find(args);
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      
      res.status(400).send({
        success: false,
        message: "Error WHile Filtering Products",
        error,
      });
    }
  };
  export const productListController = async (req, res) => {
    try {
      const perPage = 6;
      const page = req.params.page ? req.params.page : 1;
      const products = await productModel
        .find({})
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      
      res.status(400).send({
        success: false,
        message: "error in per page ctrl",
        error,
      });
    }
  };
// search product
export const searchProductController = async (req, res) => {
    try {
      const { keyword } = req.params;
      const resutls = await productModel
        .find({
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        })
      res.json(resutls);
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error In Search Product API",
        error,
      });
    }
  };

  //payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderMOdel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    
  }
};

//orders
export const getOrdersController = async (req,res)=>{
  try {
   
    const orders = await orderMOdel
    .find({ buyer: req.user._id })
    .populate("products")
    .populate("buyer", "name");
   
  res.json(orders);
  } catch (error) {
    console.log(error)
    res.status(500).send({
      succes:false,
      message:"Error in getting orders",
      error
    })
    
  }
}




//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderMOdel
      .find({})
      .populate("products")
      .populate("buyer", "name")
      // .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderMOdel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};
export const getAlluser=async(req,res)=>{
  const users = await userModel
  .find({})
  res.json(users)
}



    
  