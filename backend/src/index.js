import express from "express";
import authRoutes from "./routes/auth.route.js";// since router is exported as default we can import it at any name we want
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // to use cookie
import cors from"cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import {app,server} from "./lib/socket.js";

dotenv.config();

//const app=express();


const port=process.env.PORT; 
const __dirname=path.resolve();

//app.use(express.json());
app.use(express.json({ limit: '1mb' }));// this prevent the error cased by large image files
app.use(cookieParser()); // using cookie
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

// app.listen(port,()=>{
//   console.log("Server is running on " + port);
//   connectDB()
// })

if(process.env.NODE_ENV==="production"){
 app.use(express.static(Path.join(__dirname,"../frontend/dist")));

 app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
 })
}

server.listen(port,()=>{
  console.log("Server is running on " + port);
  connectDB()
})
