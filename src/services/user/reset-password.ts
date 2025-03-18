/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/lib/axios/axiosClient";
import httpStatus from "http-status";

export async function requestResetPassword({
  email,
  locale,
}: {
  email: string;
  locale: string;
}): Promise<any> {
  try {
    const response = await axiosClient.post(
      "/reset-password",
      {
        email,
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


export async function resetPassword({
  code,
  new_password,
}: {
  code: string;
  new_password: string;
}): Promise<any> {
  try {
    const response = await axiosClient.patch("/user/reset-password", {
      token: code,
      new_password,
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