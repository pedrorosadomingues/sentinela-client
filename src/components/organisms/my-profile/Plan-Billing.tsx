import React, { useState } from "react";

type Plan = {
  name: string;
  price: number;
  billingCycle: string;
  features: string[];
  isCurrentPlan: boolean;
};

type BillingCycle = "Mensal" | "Anual";

const plans: Plan[] = [
  {
    name: "Plano Básico",
    price: 67,
    billingCycle: "Mensal",
    features: [
      "7 dias de garantia",
      "8 funcionalidades",
      "Até 1 usuários",
      "300 renderizações",
      "Render em 40seg",
      "Resolução em 2K",
      "Acesso antecipado às funções beta",
    ],
    isCurrentPlan: true,
  },
  {
    name: "Plano Expert",
    price: 147,
    billingCycle: "Mensal",
    features: [
      "7 dias de garantia",
      "8 funcionalidades",
      "Até 1 usuários",
      "1000 renderizações",
      "Render em 40seg",
      "Resolução em 4K",
      "Acesso antecipado às funções beta",
    ],
    isCurrentPlan: false,
  },
  {
    name: "Plano Empresarial",
    price: 427,
    billingCycle: "Mensal",
    features: [
      "7 dias de garantia",
      "8 funcionalidades",
      "Até 3 usuários",
      "6000 renderizações",
      "Render em 15seg",
      "Resolução em 4K",
      "Acesso antecipado às funções beta",
    ],
    isCurrentPlan: false,
  },
];

export default function BillingPlans() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("Mensal");

  const handleUpgrade = (planName: string) => {
    alert(`Você escolheu o plano: ${planName}`);
  };

  const handleCancelSubscription = () => {
    alert("Assinatura cancelada.");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mx-auto">
      {/* Título */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Plano e faturamento
      </h1>
      <p className="text-gray-600 mb-6">
        Informações sobre o seu plano atual e opções de upgrade.
      </p>

      {/* Plano Atual */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Plano Básico</h2>
            <p className="text-gray-600">R$67/Mensal</p>
            <p className="text-gray-500 text-sm">
              Próximo pagamento: 20 de outubro de 2024
            </p>
          </div>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            Plano Ativo
          </span>
        </div>
      </div>

      {/* Ciclo de Faturamento */}
      <div className="flex justify-center items-center space-x-4 mb-6">
        <button
          onClick={() => setBillingCycle("Mensal")}
          className={`px-4 py-2 rounded-md font-medium ${
            billingCycle === "Mensal"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Mensal
        </button>
        <button
          onClick={() => setBillingCycle("Anual")}
          className={`px-4 py-2 rounded-md font-medium ${
            billingCycle === "Anual"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Anual | 2 meses grátis 🎁
        </button>
      </div>

      {/* Planos Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`border rounded-lg p-4 ${
              plan.isCurrentPlan ? "border-gray-300" : "border-blue-500"
            }`}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {plan.name}
            </h3>
            <p className="text-gray-600 font-medium">
              R${plan.price}/{billingCycle}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✔️</span>
                  {feature}
                </li>
              ))}
            </ul>
            {plan.isCurrentPlan ? (
              <button
                disabled
                className="mt-4 w-full bg-gray-200 text-gray-500 py-2 rounded-md font-medium cursor-not-allowed"
              >
                Plano atual
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade(plan.name)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600"
              >
                Fazer upgrade
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Suporte e Cancelamento */}
      <div className="text-center space-y-4">
        <p className="text-gray-600 text-sm">
          Se você tiver alguma dúvida sobre seu plano ou precisar de ajuda,
          entre em contato com nossa equipe de suporte.
        </p>
        <button className="text-blue-500 font-medium hover:underline">
          Chamar o suporte
        </button>
        <button
          onClick={handleCancelSubscription}
          className="text-red-500 font-medium hover:underline"
        >
          Cancelar assinatura
        </button>
      </div>
    </div>
  );
}
