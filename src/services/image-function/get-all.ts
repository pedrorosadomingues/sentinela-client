/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/server";
import httpStatus from "http-status";

export async function getAllImageFns(): Promise<any> {
  try {
    const response = await api.get("/image-function");
    return {
      status: httpStatus.OK,
      data: response.data,
    };
  } catch (error: any) {
    console.log("error", error);
    if (error.response) {
      return {
        status: error.status,
        message: error.response.data.error || "Unknown error",
      };
    } else {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Server connection error",
      };
    }
  }
}