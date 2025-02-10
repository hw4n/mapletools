import React from "react";

function SidebarIcon({ href, src }: Readonly<{ href: string; src: string }>) {
    return (
        <li className="mt-2 w-12 h-12 flex items-center justify-center rounded-xl bg-slate-300 hover:bg-slate-400 transition-colors">
            <a href={href}>
                <img
                    src={src}
                    className="w-9 h-9 object-contain hover:scale-110 transition-transform"
                />
            </a>
        </li>
    );
}

export default SidebarIcon;
