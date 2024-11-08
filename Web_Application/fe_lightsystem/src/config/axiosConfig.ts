import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "http://localhost:3000",
});

export default axiosConfig;
