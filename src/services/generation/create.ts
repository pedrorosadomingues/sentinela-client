/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/server";
import httpStatus from "http-status";
import { CreateGenerationParams, CreateGenerationResponse } from "@/interfaces";

export async function createGeneration({
  category,
  model_image,
  garment_image,
  fn,
}: CreateGenerationParams): Promise<CreateGenerationResponse> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        status: httpStatus.UNAUTHORIZED,
        message: "Unauthorized",
      };
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await api.post(
      "/generation",
      {
        category,
        model_image,
        garment_image,
        fn,
      },
      config
    );
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
