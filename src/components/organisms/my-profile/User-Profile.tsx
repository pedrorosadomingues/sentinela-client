import React from "react";
import { useUserStore } from "@/zustand-stores";

export default function UserProfile() {
  const {  user } = useUserStore();

  const onUpgradeClick = () => {
    console.log("Upgrade clicked");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-start items-start">
      <div className="bg-white shadow-lg rounded-lg w-full p-6">
        <div className="bg-gradient-to-r from-red-500 to-orange-400 rounded-lg p-6 text-white flex items-center">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex justify-center items-center text-gray-700 text-2xl font-bold">
            {user && "name" in user ? user.name[0] : ""}
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">{user && "name" in user ? user.name : ""}</h2>
            <p className="text-sm">{user && "email" in user ? user.email : ""}</p>
          </div>
          <button
            className="ml-auto bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md hover:opacity-90"
            onClick={onUpgradeClick}
          >
            Fazer upgrade
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800">Meu plano</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-gray-800 font-semibold">PLANO GRATUITO</h4>
                <p className="text-gray-600">
                  R$00,00/mes
                </p>
                <p className="text-gray-500 text-sm">
                  Próximo pagamento: ??/??/????
                </p>
              </div>
              <div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                 status do plano
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
