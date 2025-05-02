import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL=import.meta.env.MODE==="development"?"http://localhost:3000":"/"

export const useAuthStore=create((set,get)=>({
  authUser:null,
  isSigningUp:false,
  isLoggingIn:false,
  isUpdatingProfile:false,
  isCheckingAuth:true,
  onlineUsers:[],
  socket:null,

  checkAuth:async ()=>{
    try {
      const res=await axiosInstance.get("/auth/check");
      set({authUser:res.data});
      get().connectSocket();
    } catch (error) {
      console.log("error in checkAuth: ",error);
      set({authUser:null})
    }finally{
      set({isCheckingAuth:false});
    }
  },

  signup:async (data)=>{
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout:async ()=>{
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  login:async (data)=>{
    set({isLoggingIn:true});
    try {
      const res=await axiosInstance.post("/auth/login",data);
      set({authUser:res.data});
      toast.success("Logged in successfully");
      get().connectSocket();//we create connectSocket() and get this function by get method
    } catch (error) {
      toast.error(error.response.data.message);
    }finally{
      set({isLoggingIn:false});
    }
  },

  updateProfile:async (data)=>{
    set({isUpdatingProfile:true});
    try {
      const res=await axiosInstance.put("/auth/update-profile",data);
      set({authUser:res.data});
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile");
      toast.error(error.response.data.message)
    }finally{
      set({isUpdatingProfile:false});
    }
  },

  connectSocket:()=>{ 
    const {authUser}=get();
    if(!authUser || get().socket?.connected) return;// if user is not authorize or if the user is connected before  return nothing
    const socket=io(BASE_URL,{
      query:{
        userId:authUser._id,
      },
      /* query: { userId: authUser._id } — you're sending the user's ID to the server when connecting. The server can use this for things like:
Tracking who connected
Authenticating users
Sending user-specific data/events  */
    });
    socket.connect();

    set({socket:socket}); //we give the socket state with this socket  socket.connect(); 

    //listening online user
    socket.on("getOnlineUsers",(userIds)=>{// getOnlineUsers  must be the same with io.emit
      set({onlineUsers:userIds})//userIds  are the object send from io.emit   and this part  Object.keys(userSocketMap)
    })
  },

  disconnectSocket:()=>{
    if(get().socket?.connected) get().socket.disconnect();
  },

}))