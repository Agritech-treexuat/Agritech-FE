import axios from 'axios';
import { baseUrl } from './baseUrl';
import token from '../../utils/token'

console.log("Base: ", baseUrl)

const privateHttp = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

privateHttp.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log("token: ", token)
    if (token) {
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

privateHttp.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response.status === 401 &&
      error.response.statusText === 'Unauthorized'
    ) {
        token.removeAccessToken();
        alert('Need to login');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    return Promise.reject(error);
  },
);

export default privateHttp;
