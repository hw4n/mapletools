import React from "react";
import Title from "./Title";

function InfoBlock({
    children,
    src,
    title,
    className,
}: Readonly<{
    children: React.ReactNode;
    src?: string;
    title: string;
    className?: string;
}>) {
    return (
        <div className="p-3" id={title.toLowerCase().replaceAll(" ", "")}>
            <Title src={src} title={title} className={className} />
            <div className="bg-primaryGray rounded-xl p-3">{children}</div>
        </div>
    );
}

export default InfoBlock;
