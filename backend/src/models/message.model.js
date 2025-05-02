import mongoose from "mongoose";

const messageSchema=new mongoose.Schema(
  {
  senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    
  },
  receiverId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  text:{
    type:String,
   
  },
  image:{
    type:String,
  
  },
},
{timestamps:true}  /* Mongoose automatically adds the following fields to our schema:

createdAt: the time the document was created

updatedAt: the time the document was last updated  */
);
const Message=mongoose.model("Message",messageSchema);

export default Message;