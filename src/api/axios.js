import axios from "axios";

export default axios.create({
    baseURL: "https://ip-91-227-40-30-92919.vps.hosted-by-mvps.net/api",
    withCredentials: true,
})