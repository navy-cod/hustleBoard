import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:30000/api/v1',
});

//request interceptor 
api.interceptors.request.use(config => {
    const token = localStorage.getItem('hb_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


//response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('hb_token');
            localStorage.removeItem('hb_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
