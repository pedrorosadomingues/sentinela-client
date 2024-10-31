import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-[#3C4854] text-white fixed w-full border z-[2]">
      <Image
        src={"/img/logo-vestiq.png"}
        alt="Logo"
        width={100}
        height={50}
        priority={true}
      />
      <h1 className="text-2xl">STUDIO</h1>
      <div className="flex items-center gap-4">
        <button className="hover:cursor-pointer">Login</button>
        <button className="hover:cursor-pointer">Sign Up</button>
      </div>
    </header>
  );
}
