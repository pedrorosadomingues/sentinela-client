/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { axiosClient } from "@/lib/axios/axiosClient";

export async function cancelSubscription(subscription_id: string, feedback: string) {
  try {
    const response = await axiosClient.patch("/subscription/cancel", {
      subscription_id,
      feedback,
    });

    return {
      status: httpStatus.OK,
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      return error.response.data.message || "Unknown error";
    } else {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Server connection error",
      };
    }
  }
}