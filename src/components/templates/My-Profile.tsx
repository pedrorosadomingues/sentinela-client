import MenuProfile from "../organisms/my-profile/MenuLeft";
import PersonalData from "../organisms/my-profile/Personal-Data";
import UserProfile from "../organisms/my-profile/User-Profile";
import PlanBilling from "../organisms/my-profile/Plan-Billing";
import MenuUp from "../organisms/my-profile/MenuUp";
import { useMyProfileStore } from "@/zustand-stores";
import { useTranslations } from "next-intl";

export default function MyProfile(): JSX.Element {
  const { profileControl } = useMyProfileStore();
  const text = useTranslations("menu_profile");

  return (
    <div className="bg-primary min-h-screen flex justify-start w-[90%] items-start mt-[80px] ml-[80px] p-5 max765:ml-0">
      <MenuProfile />
      <div className="flex flex-col w-full">
        <MenuUp />
        {profileControl === text("user_profile") && <UserProfile />}
        {profileControl === text("personal_data") && <PersonalData />}
        {profileControl === text("plan_billing") && <PlanBilling />}
      </div>
    </div>
  );
}
