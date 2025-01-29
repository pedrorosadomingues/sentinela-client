/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/server";
import { ImageFunctionProps } from "@/interfaces/image-function";
import httpStatus from "http-status";

export async function getAllImageFns(locale: string): Promise<any> {
  try {
    const response = await api.get(`/image-function/${locale}`);

    const orderedFns = response.data.sort(
      (a: ImageFunctionProps, b: ImageFunctionProps) => {
        if (a.order == null) return 1;
        if (b.order == null) return -1;
        return (a.order as number) - (b.order as number);
      }
    );
    
    return {
      status: httpStatus.OK,
      data: orderedFns,
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