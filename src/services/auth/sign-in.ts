/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/server";
import httpStatus from "http-status";

interface SignInParams {
  email: string;
  password: string;
}

interface SignInResponse {
  status: number;
  data?: any;
  message?: any;
}

export default async function signIn({
  email,
  password,
}: SignInParams): Promise<SignInResponse> {
  try {
    console.log(email, password);
    const response = await api.post("/auth/sign-in", {
      email,
      password,
    });
    return {
      status: httpStatus.OK,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data || "Unknown error",
      };
    } else {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Server connection error",
      };
    }
  }
}
