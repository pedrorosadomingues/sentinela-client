/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/server";
import httpStatus from "http-status";
import { useUserStore } from "@/zustand-stores";

export async function verifyEmail({
  verification_code,
}: {
  verification_code: number;
}): Promise<unknown> {
  const { user } = useUserStore.getState();
  try {
    const response = await api.patch("/user/verify-email", {
      email: user?.email,
      verification_code,
    });

    return {
      status: response.status,
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
