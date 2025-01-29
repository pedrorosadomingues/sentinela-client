import Image from "next/image";

export default function VestiqLoading() {
    return (
      <div className="flex items-center justify-center h-screen w-screen absolute top-0 left-0 bg-white z-50">
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
  