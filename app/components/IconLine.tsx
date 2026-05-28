import React from "react";
import Image from "next/image";

function IconLine({
    children,
    src,
}: Readonly<{ children: React.ReactNode; src: string }>) {
    return (
        <div className="flex items-center">
            <Image
                src={src}
                alt=""
                width={36}
                height={36}
                unoptimized
                className="h-9 w-9 object-contain"
            />
            {children}
        </div>
    );
}

export default IconLine;
