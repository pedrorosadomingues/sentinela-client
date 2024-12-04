/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/server";
import httpStatus from "http-status";
import { Generation } from "@/interfaces";

export async function getAllGenerations(): Promise<{ status: number; data?: [Generation]; message?: string }> {
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

    const response = await api.get("/generation/all", config);
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
