/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { axiosClient } from "@/lib/axios/axiosClient";

export async function getAllPlans() {
  try {
    const plans = await axiosClient.get("/plan");
    const plans_for_sale = plans.data.filter(
      (plan: any) => plan.stripe_price_id !== null
    );
    return {
      status: httpStatus.OK,
      data: plans_for_sale,
    };
  } catch (error: any) {
    if (error.plans) {
      return {
        status: error.plans.status,
        message: error.plans.data || "Unknown error",
      };
    } else {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Server connection error",
      };
    }
  }
}
