import axios from "axios";
import { getToken } from "../auth";
require('dotenv').config();

const api = axios.create({
  baseURL: `${process.env.REACT_APP_HOST}`,
});

api.interceptors.request.use(async config => {
  const token = getToken();
  config.headers.Authorization = process.env.REACT_APP_AUTH_HASH;
  if (token) {
    config.headers["X-ACCESS-TOKEN"] = token
  }
  return config;
});

api.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default api;
