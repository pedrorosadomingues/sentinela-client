import { usePlanStore } from "@/stores";
//import VestiqLoading from "../organisms/VestiqLoading";
import { useEffect } from "react";

export default function PlansModal(): JSX.Element {
  const { plans, getPlans,  selectedPlan, setSelectedPlan } =
    usePlanStore();

  useEffect(() => {
    getPlans();
  }, [getPlans]);

//   if (isFetching) {
//     return <VestiqLoading />;
//   }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-white p-4 w-full md:w-96 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Select a plan</h1>
          <button
            onClick={() => setSelectedPlan(null)}
            className="text-red-500"
          >
            Close
          </button>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          {plans &&
            plans.map((plan) => (
              <div
                key={plan.stripe_price_id}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  selectedPlan === plan.stripe_price_id ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedPlan(plan.stripe_price_id)}
              >
                <p>{plan.name}</p>
                <p>{plan.price}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
