import React from "react";
import Image from "next/image";

function Title({
    src,
    title,
    className,
}: Readonly<{ src?: string; title: string; className?: string }>) {
    return (
        <div className="flex items-center mb-1">
            {src ? (
                <Image
                    src={src}
                    alt=""
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 object-contain"
                />
            ) : null}
            {className?.includes("text-") ? (
                <div
                    className={`text-xl font-bold ml-1 uppercase ${className}`}
                >
                    {title}
                </div>
            ) : (
                <div
                    className={`text-primary text-xl font-bold ml-1 uppercase`}
                >
                    {title}
                </div>
            )}
        </div>
    );
}

export default Title;
