/* components/templates/Studio.tsx */
"use client";
import Header from "../organisms/Header";
import Sidebar from "../organisms/Sidebar";
import DressModel from "@/components/organisms/functions/DressModel";
import MyGenerations from "../organisms/My-Generations";
import Home from "@/components/organisms/Home";
import { useMainStore } from "@/zustand-stores/mainStore";

export default function Main(): JSX.Element {
  const { mainControl } = useMainStore();
  
  return (
    <div className="bg-primary min-h-screen flex justify-center w-full">
      <Header />
      <Sidebar />
      {mainControl === "Home" ||
      mainControl === "Início" ||
      mainControl === "Inicio" ? (
        <Home />
      ) : 
        mainControl === "Dress Model" ||
        mainControl === "Vestir Modelo" ||
        mainControl === "Vestir Modelo" ? (
          <DressModel />
        ) : 
          mainControl === "My Generations" ||
          mainControl === "Minhas Gerações" ||
          mainControl === "Mis generaciones" ? (
            <MyGenerations />
          ) : (
            <div>My Generations</div>
          )
      }
    </div>
  );
}
