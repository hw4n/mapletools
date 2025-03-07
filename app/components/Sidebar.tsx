import React from "react";
import SidebarIcon from "./SidebarIcon";

const Sidebar = () => {
    return (
        <aside className="w-16 bg-slate-500 fixed h-full">
            <ul className="flex flex-col items-center h-full">
                <SidebarIcon href="#arcanesymbol" src="/image/arc0.webp" />
                <SidebarIcon href="#sacredsymbol" src="/image/sac0.webp" />
                <SidebarIcon href="#grinding" src="/image/exp.png" />
                <SidebarIcon href="#timezone" src="/image/hourglass.png" />
                <SidebarIcon href="#hexamatrix" src="/image/hexa.png" />
                <SidebarIcon
                    href="#luckinesscalculator"
                    src="/image/clover.png"
                />
            </ul>
        </aside>
    );
};

export default Sidebar;
