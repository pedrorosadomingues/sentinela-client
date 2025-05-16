/* eslint-disable @typescript-eslint/no-explicit-any */
import PlansAndSubscriptions from "@/components/organisms/my-profile/plans/PlansAndSubscriptions";
import PersonalForm from "@/components/organisms/profile/tabs/PersonalInfo/PersonalForm";
import Profile from "@/components/organisms/profile/tabs/Profile";
import { getLocaleMessages } from "@/lib/i18n/utils";
import {
  AccountBalanceOutlined,
  AssignmentIndOutlined,
  PersonOutlined,
} from "@mui/icons-material";

export const getProfileTabs = (locale: string) => {
  const messages = getLocaleMessages(locale);
  const tabs = messages.profile.tabs;

  return [
    {
      key: "profile",
      title: tabs.profile,
      icon: <PersonOutlined />,
      content: <Profile />,
      show: true,
    },
    {
      key: "personal",
      title: tabs.personal,
      icon: <AssignmentIndOutlined />,
      content: <PersonalForm />,
      show: true,
    },
    // {
    //   key: "team",
    //   title: tabs.team,
    //   icon: <Groups3Outlined />,
    //   content: <Team />,
    //   show: process.env.NODE_ENV === "development",
    // },
    {
      key: "plans",
      title: tabs.plans,
      icon: <AccountBalanceOutlined />,
      content: <PlansAndSubscriptions />,
      show: true,
    },
    // {
    //   key: "achievements",
    //   title: tabs.achievements,
    //   icon: <EmojiEventsOutlined />,
    //   content: <Achievements />,
    //   show: process.env.NODE_ENV === "development",
    // },
    // {
    //   key: "notifications",
    //   title: tabs.notifications,
    //   icon: <MailOutlineOutlined />,
    //   show: process.env.NODE_ENV === "development",
    // },
  ];
};

export const profileTabsKeys = [
  "profile",
  "personal",
  "team",
  "plans",
  "achievements",
  "notifications",
]