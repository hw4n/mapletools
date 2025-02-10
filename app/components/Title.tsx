import React from "react";

function Title({ src, title }: Readonly<{ src?: string; title: string }>) {
    return (
        <div className="flex items-center mb-1">
            {src ? <img src={src} className="w-9 h-9 object-contain" /> : null}
            <h1 className="text-primary text-xl font-bold ml-1">{title}</h1>
        </div>
    );
}

export default Title;
