import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: 'https://kvm3z0mr-5000.asse.devtunnels.ms',
});

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = (error && error.response && error.response.status) || 500;
    switch (status) {
      case 401: {
        toast.error('Unauthorized the user. Please login...');
        break;
      }
      case 403: {
        toast.error('You do not have the permission to access this resource.');
        break;
      }
      default: {
        break;
      }
    }
  }
);

export default instance;
