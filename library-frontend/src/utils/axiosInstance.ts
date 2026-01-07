import axios from 'axios';

// Backend adresimiz (NestJS varsayılan portu)
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

// HER İSTEKTEN ÖNCE ÇALIŞACAK AYAR (INTERCEPTOR)
// Eğer cebimizde (localStorage) token varsa, onu isteğin içine koyar.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;