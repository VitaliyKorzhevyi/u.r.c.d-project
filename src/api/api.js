import axios from "./axios";
const $api = axios;

$api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
    return config;
});

$api.interceptors.response.use(response => {
    console.log("Received a successful response:", response);
    return response;
}, async error => {
    console.log("Received an error response:", error.response);

    const originalRequest = error.config;
    if (error.response.status === 401 &&
        error?.response?.data?.detail === "Could not validate credentials" && !originalRequest._retry) {

        console.log("Trying to refresh tokens...");
        originalRequest._retry = true;

        try {
            const refresh_token = localStorage.getItem('refresh_token');
            const instance = axios.create({
                headers: { Authorization: `Bearer ${refresh_token}` },
            });
            
            const response = await instance.get('/auth/refresh_token');
            const { access_token, refresh_token: new_refresh_token } = response.data;
            
            console.log("Successfully refreshed tokens:", { access_token, new_refresh_token });

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', new_refresh_token);

            originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
            return $api(originalRequest);
        } catch (refreshError) {
            console.error("Error while refreshing tokens:", refreshError);

            if (refreshError?.response?.status === 401) {
                console.log("Failed to refresh tokens, redirecting to root...");
                setTimeout(() => {
                    window.location.href = "/";
                }, 100);
            } else {
                console.error("Unknown error occurred:", refreshError);
                return Promise.reject(refreshError);
            }
        }
    }

    return Promise.reject(error);
});

export default $api;

