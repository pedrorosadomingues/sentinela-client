/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { axiosClient } from "@/lib/axios/axiosClient";

export async function getFolderById(id: string): Promise<{
  status: number;
  data?: any;
  message?: string;
}> {
  try {
    const response = await axiosClient.get(`/paste/${id}`);

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
