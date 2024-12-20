import MenuProfile from "../organisms/my-profile/Menu-Profile";
import PersonalData from "../organisms/my-profile/Personal-Data";
import UserProfile from "../organisms/my-profile/User-Profile";
import PlanBilling from "../organisms/my-profile/Plan-Billing";

export default function MyProfile(): JSX.Element {
  return (
    <div className="bg-primary min-h-screen flex justify-start w-full items-start mt-[80px] ml-[80px]">
      <MenuProfile />
      <PersonalData />
      <UserProfile />
      <PlanBilling />
    </div>
  );
}
