// import React from "react";
// import PlansSection from "../PlansSection";

// export default function BillingPlans() {
//   const handleCancelSubscription = () => {
//     alert("Assinatura cancelada.");
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6 mx-auto">
//       {/* Título */}
//       <h1 className="text-2xl font-bold text-gray-800 mb-2">
//         Plano e faturamento
//       </h1>
//       <p className="text-gray-600 mb-6">
//         Informações sobre o seu plano atual e opções de upgrade.
//       </p>

//       {/* Plano Atual */}
//       <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-lg font-bold text-gray-800">Plano Básico</h2>
//             <p className="text-gray-600">R$67/Mensal</p>
//             <p className="text-gray-500 text-sm">
//               Próximo ffdpagamento: 20 de outubro de 2024
//             </p>
//           </div>
//           <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
//             Plano Ativo
//           </span>
//         </div>
//       </div>

//       <PlansSection />

//       {/* Suporte e Cancelamento */}
//       <div className="text-center space-y-4">
//         <p className="text-gray-600 text-sm">
//           Se você tiver alguma dúvida sobre seu plano ou precisar de ajuda,
//           entre em contato com nossa equipe de suporte.
//         </p>
//         {/* <button className="text-blue-500 font-medium hover:underline">
//           Chamar o suporte
//         </button> */}
//         <button
//           onClick={handleCancelSubscription}
//           className="text-red-500 font-medium hover:underline"
//         >
//           Cancelar assinatura
//         </button>
//       </div>
//     </div>
//   );
// }
