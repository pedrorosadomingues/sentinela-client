// import { useUserStore } from "@/stores/userStore";
// import { Avatar } from "@nextui-org/react";

// export default function UserCard() {
//   const { user, currentPlan } = useUserStore();

//   const plansColorMap = (title: string): string => {
//     // Mapa de palavras-chave para as cores
//     if (!title) return "bg-grayscale-gradient";

//     const normalizedTitle = title.toLowerCase();

//     if (
//       normalizedTitle.includes("básico") ||
//       normalizedTitle.includes("basic")
//     ) {
//       return "profile-card-background";
//     }

//     if (normalizedTitle.includes("expert")) {
//       return "bg-vivid-blue-gradient";
//     }

//     if (
//       normalizedTitle.includes("empresarial") ||
//       normalizedTitle.includes("business")
//     ) {
//       return "bg-amethyst-blue-gradient";
//     }

//     return "bg-grayscale-gradient";
//   };

//   return (
//     <div className="relative flex items-center justify-center w-full">
//       <CardBackground />
//       <div
//         className={`w-full ${plansColorMap(
//           currentPlan?.title as string
//         )} text-white rounded-3xl`}
//       >
//         <div className="flex flex-col text-center sm:text-left sm:flex-row items-center gap-2 sm:gap-6 p-2 xs:p-4 overflow-hidden relative z-[2]">
//           <Avatar
//             className="h-24 w-24 sm:ml-4 lg:h-28 lg:w-28 rounded-full text-7xl font-medium uppercase text-background-white"
//             src={user?.profile_image_64 ?? ""}
//             name={(user?.base_name ?? user?.name ?? user?.email ?? "").charAt(
//               0
//             )}
//             alt="user profile avatar"
//           />
//           <div className="flex flex-col gap-1">
//             <h2 className="text-sm xs:text-lg lg:text-3xl xl:text-4xl font-medium">
//               {user?.base_name ?? user?.name ?? user?.email ?? ""}
//             </h2>
//             <p className="text-xs xs:text-base lg:text-lg font-light">
//               {user?.email ?? ""}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const CardBackground = () => {
//   return (
//     <div
//       className={`hidden lg:flex items-center absolute z-[1] w-full h-full overflow-hidden`}
//     >
//       <span className="absolute right-0 triangle-right"></span>
//       <span className="absolute figure-middle-right "></span>
//       <span className="absolute figure-middle-left"></span>
//       <span className="absolute figure-start-right"></span>
//       <span className="absolute figure-start-left"></span>
//     </div>
//   );
// };
