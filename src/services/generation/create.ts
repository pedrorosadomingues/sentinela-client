/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { CreateGenerationBody, CreateGenerationResponse } from "@/interfaces";
import { axiosClient } from "@/lib/axios/axiosClient";

export async function createGeneration(
  createGenerationBody: CreateGenerationBody
): Promise<CreateGenerationResponse> {
  try {
    const response = await axiosClient.post("/generation", createGenerationBody);

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
