import React from "react";

function IconLine({
    children,
    src,
}: Readonly<{ children: React.ReactNode; src: string }>) {
    return (
        <div className="flex items-center">
            <img src={src} className="w-9 h-9 object-contain" />
            {children}
        </div>
    );
}

export default IconLine;
