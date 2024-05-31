import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors"
const corsConfig={
  origin:"*",
  credential:true,
  method:["GET","PUT","POST","DELETE"]
}
import productRoute from "./routes/productRoute.js";

//configure env
dotenv.config();

//databse config
connectDB();

//rest object
const app = express();
app.oprions("",cors(corsConfig));
app.use(cors())

//middelwares
app.use(express.json());
app.use(morgan("dev"));


//routes
app.use("/api/v1/auth", authRoutes);
 app.use("/api/v1/product", productRoute);
 

//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});


//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on  port ${PORT}`
      .white
  );
});