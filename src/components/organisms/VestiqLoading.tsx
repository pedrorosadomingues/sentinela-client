import Image from "next/image";

export default function VestiqLoading() {
  return (
    <div className="flex items-center w-screen h-screen justify-center top-0 right-0 absolute bg-white z-50">
      <Image
        unoptimized
        src="/icons/logo-vestiq.ico"
        alt="Loading"
        className="animate-spin-bounce w-24 h-24"
        width={96}
        height={96}
      />
    </div>
  );
}
