import axios, { AxiosInstance } from "axios";

const API_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL as string;

if (!API_URL) {
  throw new Error("API base URL is not defined in environment variables.");
}

const instance: AxiosInstance = axios.create({
  baseURL: API_URL,
});

export default instance;

