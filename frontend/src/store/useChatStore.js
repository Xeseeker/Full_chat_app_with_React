import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore= create((set,get)=>({
  messages:[],
  users:[],
  selectedUser:null,
  isUsersLoading:false,
  isMessagesLoading:false,

  getUsers:async()=>{
    set({isUsersLoading:true});
    try {
      const res=await axiosInstance.get("/messages/user");
      set({users:res.data});
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }finally{
      set({isUsersLoading:false});
    }
  },

  getMessages:async (userId)=>{
    set({isMessagesLoading:true});
    try {
      const res=await axiosInstance.get(`/messages/${userId}`);
      set({messages:res.data});
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }finally{
      set({isMessagesLoading:false});
    }
  },

  sendMessage:async(messageData)=>{
    const {selectedUser,messages}=get();// we can access the selectedUser,... states by the getter(get)

    try {
      const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
      set({messages:[...messages,res.data]})
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  },

  subscribeToMessages:()=>{// we call this in chatContainer
    const {selectedUser}=get();

    if(!selectedUser) return;

    const socket=useAuthStore.getState().socket;

    socket.on("newMessage",(newMessage)=>{
      const isMessageSentFromSelectedUser=newMessage.senderId===selectedUser._id;
      if(!isMessageSentFromSelectedUser) return;

      set({
        messages:[...get().messages,newMessage],
      });
    });
  },

  // when we logout or close window
  unsubscribeFromMessages:()=>{
    const socket=useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  
  setSelectedUser: (user)=>set({selectedUser:user}),
}))