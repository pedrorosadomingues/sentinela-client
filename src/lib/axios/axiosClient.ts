import axios, { AxiosInstance } from "axios";

let API_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// 🔹 Garante que a URL tenha "https://" ou "http://"
if (!API_URL.startsWith("http")) {
  API_URL = `https://${API_URL}`;
}

if (!API_URL) {
  throw new Error("API base URL is not defined in environment variables.");
}

/**
 * Criamos duas instâncias do Axios:
 * - `axiosClient` (Padrão: API Externa)
 * - `axiosInternalClient` (Para requisições internas)
 */

// 🟢 Cliente Padrão: API Externa
const axiosClient: AxiosInstance = axios.create({
  baseURL: API_URL, // 🔹 Agora sempre será absoluta!
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptador para incluir o token automaticamente
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("vq-access-token="))
      ?.split("=")[1];

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🟢 Cliente Interno: API Next.js
// const axiosInternalClient: AxiosInstance = axios.create({
//   baseURL: "/api", // Usamos a API interna do Next.js
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

export { axiosClient };
