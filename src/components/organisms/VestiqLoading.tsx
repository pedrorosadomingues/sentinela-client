import Image from "next/image";

export default function VestiqLoading() {
    return (
      <div className="flex items-center w-full h-[90%] justify-center absolute bg-white z-50">
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
  