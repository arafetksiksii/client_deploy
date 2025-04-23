import axios from "axios";

const API = axios.create({
  baseURL: "https://server-deploy-aq8t.onrender.com/api", // your backend base URL
});

export default API;
