//Todo {"detail": "Invalid refresh token"} прописати в умові що зацшов з іншого пристрою

import axios from "./api/axios";

export const updateTokens = async () => {
    try {
        const refresh_token = localStorage.getItem('refresh_token');
        const instance = axios.create({
          headers: { Authorization: `Bearer ${refresh_token}` },
        });
      
        const response = await instance.get('/auth/refresh_token');
        const { access_token, refresh_token: new_refresh_token } = response.data;
      
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', new_refresh_token);
      } catch (error) {
 
        if (error?.response?.status === 401 && error?.response?.data?.detail === "Could not validate credentials") {
          try {
            setTimeout(() => {
              window.location.href = "/"; 
            }, 600);
           
            return true; 
          } catch (error) {
            console.log(error);
          }
        } else {
            console.log(error);
            return false;
        }
      }
  };

