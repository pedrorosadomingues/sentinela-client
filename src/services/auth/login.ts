/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/server";

export default async function signIn(email: string, password: string) {
  try {
    console.log(email, password);
    const response = await api.post("/auth/sign-in", {
      email,
      password,
    });
    return {
      status: 200,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data || "Erro desconhecido",
      };
    } else {
      return {
        status: 500,
        message: "Erro de conexão com o servidor",
      };
    }
  }
}