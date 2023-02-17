import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
export default axios.create({
  baseURL: "http://localhost:8080/api",
});
