import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_REACT_APP_API_BASE_URL;

const instance = axios.create({
  baseURL: API_URL,
});

export default instance;