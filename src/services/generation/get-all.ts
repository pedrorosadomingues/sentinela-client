/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { Generation } from "@/interfaces";
import { axiosClient } from "@/lib/axios/axiosClient";

export async function getAllGenerations(): Promise<{ status: number; data?: [Generation]; message?: string }> {
  try {
    const response = await axiosClient.get("/generation/all");
    
    return {
      status: httpStatus.OK,
      data: response.data,
    };
  } catch (error: any) {
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
