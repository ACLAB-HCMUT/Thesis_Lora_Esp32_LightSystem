import axios from "axios";
export const configAxios = axios.create({
  baseURL: "http://localhost:3333",
});
