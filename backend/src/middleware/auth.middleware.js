import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

export const protectRoute=async (req,res,next)=>{

try {
    const token=req.cookies.jwt; // we use jwt b/c we give a name jwt when we create

    if(!token){
      return res.status(401).json({message:"Unauthorized"})
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET);

    if(!decoded){
      return res.status(401).json({message:"Unauthorized"})
    }

    const user =await User.findById(decoded.userId).select("-password"); //extract all the data from user except the password      we get user id from  decoded.userId  when we give _id when we create a token 

    if(!user){
      return res.status(404).json({message:"User not found"})
    }

    req.user=user;  //add the user to the request field
    next();

} catch (error) {
  console.log("Error in a protectRout middleware: ", error.message);
  res.status(500).json({message:"Internal server error"});
  
}

}