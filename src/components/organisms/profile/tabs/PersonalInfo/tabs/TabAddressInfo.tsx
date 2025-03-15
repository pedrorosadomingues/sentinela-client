// import { Button } from "@nextui-org/react";
// import { Input } from "@/components/shared/ui/Input";
// import { SearchOutlined } from "@mui/icons-material";
// import { useGlobalStore } from "@/stores/globalStore";
// import { useEffect, useState } from "react";
// import axiosClient from "@/lib/axiosClient";
// import { useFormContext } from "react-hook-form";
// import { useToast } from "@/hooks/useToast";
// import { useTranslations } from "next-intl";

// export default function TabAddressInfo({ isSubmitting }: { isSubmitting: boolean }) {
//   const t = useTranslations("profile.personal_info.personal_form.tab_address_info");
//   const [isSearching, setIsSearching] = useState<boolean>(false);
//   const { isEditMode, address, setAddress } = useGlobalStore();
//   const {
//     watch,
//     register,
//     setValue,
//     formState: { errors },
//   } = useFormContext<{
//     address: {
//       phone: string;
//       postalcode: string;
//       city: string;
//       country: string;
//     };
//   }>();
//   const [postalCode, city, country] = watch(["address.postalcode", "address.city", "address.country"]);
//   const toast = useToast();

//   const handleSearch = async () => {
//     setIsSearching(true);

//     const options = {
//       postalcode: postalCode,
//     };

//     await axiosClient
//       .post(`/api/profile/address`, options)
//       .then((res) => {
//         const result = res.data;

//         setAddress(result);
//       })
//       .catch((err) => {
//         if (err.response) {
//           toast.use("error", t("error.search_error"));
//         }
//       })
//       .finally(() => {
//         setIsSearching(false);
//       });
//   };

//   useEffect(() => {
//     if (address) {
//       if (address.country) {
//         setValue("address.country", address.country);
//       }
//       if (address.city) {
//         setValue("address.city", address.city);
//       }
//       if (address.postalcode) {
//         setValue("address.postalcode", address.postalcode);
//       }
//     }
//   }, [address, setValue]);

//   return (
//     <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-4 text-font-lighter">
//       <Input
//         label={t("phone_label")}
//         size="sm"
//         placeholder={t("phone_placeholder")}
//         {...register("address.phone")}
//         isDisabled={isSubmitting || !isEditMode}
//         isInvalid={!!errors.address?.phone}
//         errorMessage={errors.address?.phone?.message}
//       />
//       <div className="flex items-end gap-1 w-full">
//         <Input
//           label={t("postalcode_label")}
//           size="sm"
//           placeholder={t("postalcode_placeholder")}
//           {...register("address.postalcode")}
//           isDisabled={isSubmitting || !isEditMode}
//           isInvalid={!!errors.address?.postalcode}
//           errorMessage={errors.address?.postalcode?.message}
//           className="w-full"
//         />
//         {isEditMode && (
//           <Button
//             isIconOnly
//             size="md"
//             className="btn btn-tertiary w-fit"
//             onPress={handleSearch}
//             isLoading={isSearching}
//             isDisabled={isSubmitting}
//           >
//             {!isSearching && <SearchOutlined />}
//           </Button>
//         )}
//       </div>
//       <Input
//         label={t("city_label")}
//         placeholder={t("city_placeholder")}
//         size="sm"
//         {...register("address.city")}
//         isDisabled={isSubmitting || !isEditMode}
//         value={city}
//         isInvalid={!!errors.address?.city}
//         errorMessage={errors.address?.city?.message}
//       />
//       <Input
//         label={t("country_label")}
//         size="sm"
//         placeholder={t("country_placeholder")}
//         {...register("address.country")}
//         isDisabled={true}
//         value={country}
//         isInvalid={!!errors.address?.country}
//         errorMessage={errors.address?.country?.message}
//       />
//     </div>
//   );
// }
