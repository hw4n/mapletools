import React from "react";

function Title({
    src,
    title,
    className,
}: Readonly<{ src?: string; title: string; className?: string }>) {
    return (
        <div className="flex items-center mb-1">
            {src ? <img src={src} className="w-9 h-9 object-contain" /> : null}
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
