// create N instance that we can use throughout our application

import axios from "axios";

export const axiosInstance=axios.create({
  baseURL:import.meta.env.MODE==="development"?"http://localhost:3000/api":"/api",
  withCredentials:true,
})