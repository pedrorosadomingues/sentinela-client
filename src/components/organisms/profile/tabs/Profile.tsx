"use client";
import React from "react";
import { useUserStore } from "@/stores";
import CurrentPlan from "../../my-profile/plans/CurrentPlan";

export default function Profile() {
  const { user } = useUserStore();

  return (
    <div className="bg-white shadow-lg rounded-lg w-full p-6">
      <div className="bg-secondary rounded-lg p-6 text-white flex items-center max765:flex-col mb-[35px]">
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
      </div>
      <CurrentPlan />
    </div>
  );
}
