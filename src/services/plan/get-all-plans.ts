/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { axiosClient } from "@/lib/axios/axiosClient";

export async function getAllPlans() {
  try {
    const response = await axiosClient.get("/plan");

    console.log("respons:", response);

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