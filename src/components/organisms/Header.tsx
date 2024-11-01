'use client';

import Image from "next/image";
import { logout } from "@/utils";
import { useRouter } from "next/navigation";

export default function Header(): JSX.Element {
  const router = useRouter();

  function handleLogout(): void {
    logout();
    router.push("/pages/sign-in");
  }

  return (
    <header className="flex items-center justify-between p-4 bg-transparent text-white fixed w-full z-[2]">
      <Image
        src={"/img/logo-vestiq.png"}
        alt="Logo"
        width={100}
        height={50}
        priority={true}
      />
      <h1 className="text-2xl text-black">STUDIO</h1>
      <div className="flex items-center gap-4">
        <button className="hover:cursor-pointer text-black" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
