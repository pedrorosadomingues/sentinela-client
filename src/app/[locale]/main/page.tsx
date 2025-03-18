import WelcomeTourProvider from "@/components/organisms/tours/providers/WelcomeTourProvider";
import HomeComponent from "@/components/organisms/home/Home";

export default function Home() {
  return (
    <WelcomeTourProvider>
      <HomeComponent />
    </WelcomeTourProvider>
  );
}
