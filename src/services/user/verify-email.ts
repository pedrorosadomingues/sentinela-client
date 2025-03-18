/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/lib/axios/axiosClient";
import httpStatus from "http-status";

export async function verifyEmail({
  email,
  verification_code,
}: {
  email: string;
  verification_code: number;
}): Promise<unknown> {
  try {
    const response = await axiosClient.patch("/user/verify-email", {
      email,
      verification_code,
    });

    return {
      status: response.status,
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
