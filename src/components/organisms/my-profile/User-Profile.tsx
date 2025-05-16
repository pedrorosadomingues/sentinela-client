import React from "react";
import { useUserStore } from "@/stores";
import CurrentPlan from "./plans/CurrentPlan";

export default function UserProfile(): JSX.Element {
  const { user } = useUserStore();

  const onUpgradeClick = () => {
    console.log("Upgrade clicked");
  };

  return (
    <div className="bg-white shadow-lg rounded-lg w-full p-6">
      <div className="bg-gradient-to-r from-red-500 to-orange-400 rounded-lg p-6 text-white flex items-center max765:flex-col">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex justify-center items-center text-gray-700 text-2xl font-bold">
            {user && "name" in user ? user.name[0] : ""}
          </div>
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold">
            {user && "name" in user ? user.name : ""}
          </h2>
          <p className="text-sm">{user && "email" in user ? user.email : ""}</p>
        </div>
        <button
          className="ml-auto bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md hover:opacity-90"
          onClick={onUpgradeClick}
        >
          Fazer upgrade
        </button>
      </div>
      <CurrentPlan />
    </div>
  );
}
