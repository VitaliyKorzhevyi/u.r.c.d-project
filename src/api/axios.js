import axios from "axios";

export default axios.create({
    baseURL: "https://4ba8-176-124-234-156.ngrok-free.app/api",
    withCredentials: true,
})