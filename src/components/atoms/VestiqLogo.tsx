import React from "react";
import Image, { ImageProps } from "next/image";

type VestiqLogoProps = Omit<ImageProps, "alt" | "src" | "height" | "width"> & {
    width?: number;
    height?: number;
};

const VestiqLogo = React.forwardRef<HTMLImageElement, VestiqLogoProps>(
    (props, ref) => {
        return (
            <Image
                ref={ref}
                priority
                height={props.height ?? 250}
                width={props.width ?? 150}
                {...props}
                alt="Vestiq logo"
                src="/images/logo-vestiq.png"
            />
        );
    }
);

VestiqLogo.displayName = "VestiqLogo";

export default VestiqLogo;
