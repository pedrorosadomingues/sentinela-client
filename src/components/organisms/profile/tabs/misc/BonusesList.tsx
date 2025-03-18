// import { Tables } from "@/types/supabase";
// import { formatLocaleDate } from "@/utils/date";
// import { AddPhotoAlternateOutlined } from "@mui/icons-material";
// import { Progress, ScrollShadow } from "@nextui-org/react";
// import { useLocale, useTranslations } from "next-intl";
// import React from "react";

// export default function BonusesList({
//   data,
// }: {
//   data: Tables<"subscriptions_bonus">[];
// }) {
//   const t = useTranslations("profile.bonuses");

//   const checkIsAvailable = (item: Tables<"subscriptions_bonus">) => {
//     if (item.used && item.limit && item.used >= item.limit) {
//       return "inactive";
//     }

//     if (item.ending_date && new Date(item.ending_date) < new Date()) {
//       return "inactive";
//     }

//     return "active";
//   };

//   const sortedBonuses = data.sort((a, b) => {
//     if (a.ending_date && b.ending_date) {
//       return new Date(a.ending_date) < new Date(b.ending_date) ? 1 : -1;
//     }
//     return 0;
//   });

//   return (
//     <section className="flex flex-col gap-5">
//       <h3 className="text-xl font-bold">{t("title")}</h3>
//       <ScrollShadow className="h-80 pr-2 scrollbar">
//         <ul className="flex flex-col gap-2">
//           {sortedBonuses.map((item) => (
//             <BonusItem
//               key={item.id}
//               title={item.notes as string}
//               used={item.used as number}
//               limit={item.limit as number}
//               end={item.ending_date as string}
//               status={checkIsAvailable(item)}
//             />
//           ))}
//         </ul>
//       </ScrollShadow>
//     </section>
//   );
// }

// const BonusItem = ({
//   title,
//   used,
//   limit,
//   end,
//   status,
// }: {
//   title: string;
//   used: number;
//   limit: number;
//   end: string;
//   status?: "active" | "inactive";
// }) => {
//   const locale = useLocale();
//   const itemColorMap = () => {
//     if (status === "active") {
//       return "";
//     }
//     return "opacity-50 filter grayscale";
//   };

//   return (
//     <li
//       className={`group flex flex-col md:flex-row items-center p-4 rounded-md border 
//     ${itemColorMap()}`}
//     >
//       <div className="flex flex-col gap-2 w-full md:w-2/3">
//         <p className="text-sm xl:text-base flex items-center gap-1 truncate text-ellipsis">
//           <AddPhotoAlternateOutlined className="text-primary-light" />
//           {title}
//         </p>
//         <p className="text-xs whitespace-nowrap truncate text-ellipsis">
//           Disponível até {formatLocaleDate(end as string, locale)}
//         </p>
//       </div>

//       <div className="flex items-center justify-between gap-2 w-full md:w-1/3">
//         <Progress
//           value={used}
//           maxValue={limit}
//           size="sm"
//           className="w-full md:flex md:w-2/3  md:ml-4"
//           classNames={{
//             indicator: "bg-primary-light",
//           }}
//         />
//         <p className="text-sm md:text-base 3xl:text-lg font-semibold">
//           {used}/{limit}
//         </p>
//       </div>
//     </li>
//   );
// };
