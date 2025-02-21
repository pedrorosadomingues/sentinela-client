/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "@/lib/axios/axiosClient";
import httpStatus from "http-status";

export async function deleteGeneration(generationIds: number[]) {

  try {
    const response = await axiosClient.delete("/generation", {
      data: {
        generation_ids: generationIds
      }
    });

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
