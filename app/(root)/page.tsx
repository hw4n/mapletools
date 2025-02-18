"use client";

import Wap from "../components/Wap";
import Symbol from "../components/Symbol";
import Timezone from "../components/Timezone";
import Hexa from "../components/Hexa";

export default function Home() {
    return (
        <div className="flex-1 ml-16">
            {/* here put more components */}
            {/* <Date /> */}
            <Symbol
                name="arcane"
                shortName="arc"
                maxLevel={20}
                maxEquip={2679}
                dailyDefault={20}
                weeklyDefault={45}
                comment="The following calculation assumes Reverse City and Yum Yum Island are open"
                calculateGrowth={(level) => {
                    return level ** 2 + 11;
                }}
                calculateMesoCost={(level, constant, growth) => {
                    return (
                        Math.floor(growth * 2 * (constant + 3 + level * 0.05)) *
                        10000
                    );
                }}
            />
            <Symbol
                name="sacred"
                shortName="sac"
                maxLevel={11}
                maxEquip={4565}
                dailyDefault={10}
                weeklyDefault={0}
                comment="Regardless of the daily amount, 10 Cernium symbols are included in the calculation."
                calculateGrowth={(level) => {
                    return 9 * level ** 2 + 20 * level;
                }}
                calculateMesoCost={(level, constant, growth) => {
                    return (
                        Math.floor(
                            growth * 1.8 * (constant + 6 - (level - 1) / 3)
                        ) * 100000
                    );
                }}
            />
            <Wap />
            <Timezone />
            <Hexa />
        </div>
    );
}
