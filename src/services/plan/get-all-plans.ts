/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { axiosClient } from "@/lib/axios/axiosClient";

export async function getAllPlans() {
  try {
    const plans = await axiosClient.get("/plan");
    const plans_for_sale = plans.data.filter(
      (plan: any) => plan.stripe_price_id !== null
    );
    const ordered_plans = plans_for_sale.sort((a: any, b: any) => {
      return a.id - b.id;
    });
    return {
      status: httpStatus.OK,
      data: ordered_plans,
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
