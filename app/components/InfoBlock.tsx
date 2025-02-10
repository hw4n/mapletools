import React from "react";
import Title from "./Title";

function InfoBlock({
    children,
    src,
    title,
}: Readonly<{ children: React.ReactNode; src?: string; title: string }>) {
    return (
        <div className="p-3" id={title.replaceAll(" ", "")}>
            <Title src={src} title={title} />
            <div className="bg-primaryGray rounded-xl p-3">{children}</div>
        </div>
    );
}

export default InfoBlock;
