import axios from "axios";

export default axios.create({
    baseURL: "http://192.168.71.26/api",
    withCredentials: true,
})