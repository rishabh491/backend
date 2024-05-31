import mongoose from "mongoose";
import  Color from "colors";
const connectDB=async()=>{
    try {
       
        const conn= (await mongoose.connect(process.env.MONGO_URL)).isObjectIdOrHexString(console.log("DB Connected"))

        
    } catch (error) {
           
    }
}
export default connectDB;