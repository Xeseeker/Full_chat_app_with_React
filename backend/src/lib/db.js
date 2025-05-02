import mongoose from "mongoose";

//for mongo Atlas

// export const connectDB=async()=>{
//   try {
//    const conn= await mongoose.connect(process.env.MONGODB_URL);
//    console.log(`mongodb connected: ${conn.connection.host}`);
   
//   } catch (error) {
//     console.log("mongodb connection error:",error);
//   }
// };

export const connectDB = async () => {
  try {
      await mongoose.connect("mongodb://127.0.0.1:27017/chat_app");
      console.log("Connected to MongoDB!");
  } catch (err) {
      console.error("Error connecting to MongoDB:", err);
  }
};

// export default connectDB;