/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import { SignUpBody, SignUpResponse } from "@/interfaces";
import { axiosClient } from "@/lib/axios/axiosClient";

export async function signUp({
  email,
  password,
  name,
  locale,
}: SignUpBody & { locale: string }): Promise<SignUpResponse> {
  try {
    const response = await axiosClient.post(
      "/user/sign-up",
      {
        email,
        password,
        name,
      },
      {
        headers: {
          "Accept-Language": locale,
        },
      }
    );
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
