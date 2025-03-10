/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/lib/axios/axiosClient";
import httpStatus from "http-status";

export interface SignInParams {
  email: string;
  password: string;
}

interface SignInResponse {
  status: number;
  data?: any;
  message?: any;
}

export async function login({
  email,
  password,
}: SignInParams): Promise<SignInResponse> {
  try {
    const response = await axiosClient.post("auth/sign-in", { email, password });

    if (response.data && response.data.token) {
      // 🔹 Armazena o token nos cookies
      document.cookie = `vq-access-token=${response.data.token}; path=/; Secure; SameSite=Strict`;
    }

    return {
      status: httpStatus.OK,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || httpStatus.INTERNAL_SERVER_ERROR,
      message: error.response?.data || "Erro ao conectar com o servidor",
    };
  }
}
