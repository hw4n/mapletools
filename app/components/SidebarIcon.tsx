import React from "react";
import Image from "next/image";

function SidebarIcon({ href, src }: Readonly<{ href: string; src: string }>) {
    return (
        <li className="mt-2 w-12 h-12 flex items-center justify-center rounded-xl bg-slate-300 hover:bg-slate-400 transition-colors">
            <a href={href}>
                <Image
                    src={src}
                    alt=""
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 object-contain transition-transform hover:scale-110"
                />
            </a>
        </li>
    );
}

export default SidebarIcon;
