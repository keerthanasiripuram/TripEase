import axios from 'axios';
import globalRouter from '../globalRouter';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 10000, 
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {

        let token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request Interceptor Error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        if ([1002, 1004].includes(response.data?.code)) {
            globalRouter.navigate('/')
            return Promise.reject(response.data);
        }
        return response;
    },
    (error) => {
        console.error('Response Interceptor Error:', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;