import Image from "next/image";

interface VestiqCoinsProps {
  width?: number;
  height?: number;
  isAnimated?: boolean;
}

export const VestiqCoins = ({
  width = 20,
  height = 20,
  isAnimated,
}: VestiqCoinsProps) => {
  return (
    <div className="group rounded-full">
      <Image
        src="/icons/vestiq-coin.png"
        alt="Vestiq coins icon"
        aria-label="Vestiq coins icon"
        className={`select-none ${
          isAnimated ? "group-hover:animate-coin-spin" : ""
        }`}
        width={width}
        height={height}
        unoptimized
        priority={true}
      />
    </div>
  );
};
