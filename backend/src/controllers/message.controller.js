import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/users.model.js";


export const getUsersForSidebar=async (req,res)=>{
  try {
    const loggedInUserId=req.user._id;  // we get the id by user._id b/c this function is protected and we assign user to the req there 
    const filteredUsers=await User.find({_id: {$ne:loggedInUserId}}).select("-password");// filtering out a user except the logged in or currently using user and send the data except the password
 
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar: ",error.message);
    res.status(500).json({error:"Internal server error"});
    
  }
}

export const getMessages=async (req,res)=>{
  try {
    const {id:userToChatId}=req.params// we say it id b/c we pass the value in the message.route by name id like  "/:id" but know we change the name to userToChatId
    const myId=req.user._id;// the currently authenticated user

    const messages= await Message.find({// find all the message where sender is me and receiver is the other user or sender is the other user and receiver is me
      $or:[
        {senderId:myId, receiverId:userToChatId},
        {senderId:userToChatId, receiverId:myId}
      ]
    })

    res.status(200).json(messages)
  } catch (error) {
    console.log("Error in getMessage controller: ",error.message);
    res.status(500).json({error:"Internal server error"});
  }
}

export const sendMessage= async (req,res)=>{
  try {
    const {text,image}=req.body;
    const {id:receiverId}=req.params;
    const senderId=req.user._id;

    let imageUrl;

    if(image){ // upload the image to cloudinary before sent
      const uploadResponse=await cloudinary.uploader.upload(image);
      imageUrl=uploadResponse.secure_url;
    } 
    
    const newMessage=new Message({
      senderId,
      receiverId,
      text,
      image:imageUrl,
    })

    await newMessage.save();



    // realtime functionality goes here => socket.io

    const receiverSocketId=getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage);// io.to().emit  make it secure. when we send message for a single user
    }


    res.status(201).json(newMessage);

  } catch (error) {
    console.log("Error in sendMessage controller: ",error.message);
    res.status(500).json({error:"Internal server error"});
  }
}