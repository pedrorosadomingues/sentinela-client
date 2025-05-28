/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/server";
import httpStatus from "http-status";

interface SignUpParams {
  email: string;
  password: string;
  name: string;
}

interface SignUpResponse {
  status: number;
  data?: any;
  message?: any;
}

export async function signUp({
  email,
  password,
  name,
}: SignUpParams): Promise<SignUpResponse> {
  try {
    const response = await api.post("/user/sign-up", {
      email,
      password,
      name,
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
