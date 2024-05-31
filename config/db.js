import mongoose from "mongoose";
import  Color from "colors";
const connectDB=async()=>{
    const uri=process.env.MONGO_URL||"mongodb+srv://rishabh:rishabh@cluster0.9t5hnpx.mongodb.net/ecommerce"
    try {
       
        const conn= (await mongoose.connect(uri)).isObjectIdOrHexString(console.log("DB Connected"))

        
    } catch (error) {
           
    }
}
export default connectDB;