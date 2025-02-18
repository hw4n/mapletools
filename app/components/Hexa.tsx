import React, { useEffect } from "react";
import InfoBlock from "./InfoBlock";
import IconLine from "./IconLine";

const hexacorePositions = {
    skill: [{ top: 33.3, left: 35.5 }],
    mastery: [
        { top: 33.3, left: 54.6 },
        { top: 21.5, left: 61.6 },
        { top: 21.5, left: 75.5 },
        { top: 9.5, left: 82.3 },
    ],
    boost: [
        { top: 61.5, left: 35.5 },
        { top: 73.5, left: 28.4 },
        { top: 73.5, left: 14.5 },
        { top: 85.4, left: 7.8 },
    ],
    common: [{ top: 61.5, left: 54.6 }],
};

const hexaCost = {
    skill: {
        erda: [
            5, 1, 1, 1, 2, 2, 2, 3, 3, 10, 3, 3, 4, 4, 4, 4, 4, 4, 5, 15, 5, 5,
            5, 5, 5, 6, 6, 6, 7, 20,
        ],
        fragment: [
            100, 30, 35, 40, 45, 50, 55, 60, 65, 200, 80, 90, 100, 110, 120,
            130, 140, 150, 160, 350, 170, 180, 190, 200, 210, 220, 230, 240,
            250, 500,
        ],
    },
    mastery: {
        erda: [
            3, 1, 1, 1, 1, 1, 1, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 3, 8, 3, 3, 3,
            3, 3, 3, 3, 3, 4, 10,
        ],
        fragment: [
            50, 15, 18, 20, 23, 25, 28, 30, 33, 100, 40, 45, 50, 55, 60, 65, 70,
            75, 80, 175, 85, 90, 95, 100, 105, 110, 115, 120, 125, 250,
        ],
    },
    boost: {
        erda: [
            4, 1, 1, 1, 2, 2, 2, 3, 3, 8, 3, 3, 3, 3, 3, 3, 3, 3, 4, 12, 4, 4,
            4, 4, 4, 5, 5, 5, 6, 15,
        ],
        fragment: [
            75, 23, 27, 30, 34, 38, 42, 45, 49, 150, 60, 68, 75, 83, 90, 98,
            105, 113, 120, 263, 128, 135, 143, 150, 158, 165, 173, 180, 188,
            375,
        ],
    },
    common: {
        erda: [
            7, 2, 2, 2, 3, 3, 3, 5, 5, 14, 5, 5, 6, 6, 6, 6, 6, 6, 7, 17, 7, 7,
            7, 7, 7, 9, 9, 9, 10, 20,
        ],
        fragment: [
            125, 38, 44, 50, 57, 63, 69, 75, 82, 300, 110, 124, 138, 152, 165,
            179, 193, 207, 220, 525, 234, 248, 262, 275, 289, 303, 317, 330,
            344, 750,
        ],
    },
};

const hexaColor = {
    skill: "text-purple-400",
    mastery: "text-pink-400",
    boost: "text-blue-300",
    common: "text-slate-400",
};

function calculateHexaCost(
    type: "skill" | "mastery" | "boost" | "common",
    currentLevel: number,
    targetLevel: number = 30
) {
    const cost = { erda: 0, fragment: 0 };
    for (let i = currentLevel; i < targetLevel; i++) {
        cost.erda += hexaCost[type].erda[i];
        cost.fragment += hexaCost[type].fragment[i];
    }

    return cost;
}

type hexacoreType = "skill" | "mastery" | "boost" | "common";

function Hexa() {
    const [hexacore, setHexacore] = React.useState<Record<string, number[]>>({
        skill: [0],
        mastery: [0, 0, 0, 0],
        boost: [0, 0, 0, 0],
        common: [0],
    });

    const [hexacostTarget, setHexacostTarget] = React.useState<
        Record<string, number[]>
    >({
        skill: [30],
        mastery: [30, 30, 30, 30],
        boost: [30, 30, 30, 30],
        common: [30],
    });

    const [totalCost, setTotalCost] = React.useState({ erda: 0, fragment: 0 });

    useEffect(() => {
        const lastCore = localStorage.getItem("hexacore");
        if (lastCore) {
            setHexacore(JSON.parse(lastCore));
        }

        const lastTarget = localStorage.getItem("hexacostTarget");
        if (lastTarget) {
            setHexacostTarget(JSON.parse(lastTarget));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("hexacore", JSON.stringify(hexacore));
        localStorage.setItem("hexacostTarget", JSON.stringify(hexacostTarget));

        const totalCost = { erda: 0, fragment: 0 };
        Object.entries(hexacore).forEach(([type, levels]) => {
            levels.forEach((level, i) => {
                const cost = calculateHexaCost(
                    type as hexacoreType,
                    level,
                    hexacostTarget[type][i]
                );
                totalCost.erda += cost.erda;
                totalCost.fragment += cost.fragment;
            });
        });
        setTotalCost(totalCost);
    }, [hexacore, hexacostTarget]);

    return (
        <InfoBlock title="hexa matrix" src="/image/hexa.png">
            <div className="flex items-center">
                <div className="relative min-w-[35rem] min-h-[35rem]">
                    <img src="/image/hexamatrix.webp" className="w-full" />

                    {Object.entries(hexacorePositions).map(
                        ([type, positions]) =>
                            positions.map((position, i) => (
                                <input
                                    type="number"
                                    className="w-12 text-white text-center absolute bg-transparent"
                                    style={{
                                        top: `${position.top}%`,
                                        left: `${position.left}%`,
                                    }}
                                    key={`${type}${i}`}
                                    id={`${type}${i}`}
                                    value={hexacore[type][i]}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        setHexacore((prev) => ({
                                            ...prev,
                                            [type]: prev[type].map((v, j) =>
                                                i === j ? value : v
                                            ),
                                        }));
                                    }}
                                    min={0}
                                    max={30}
                                />
                            ))
                    )}
                </div>

                <div>
                    {Object.entries(hexacore).map(([type, levels], index) => {
                        return (
                            <InfoBlock
                                title={`${type} node`}
                                className={hexaColor[type as hexacoreType]}
                                key={index}
                            >
                                <div className="flex">
                                    {levels.map((level, i) => (
                                        <div className="w-24 mr-4" key={i}>
                                            <div className="flex justify-center">
                                                Level
                                                <input
                                                    type="number"
                                                    className="w-12 text-white text-center bg-transparent"
                                                    defaultValue={
                                                        hexacostTarget[type][i]
                                                    }
                                                    min={hexacore[type][i]}
                                                    max={30}
                                                    onChange={(e) => {
                                                        const value = parseInt(
                                                            e.target.value
                                                        );
                                                        setHexacostTarget(
                                                            (prev) => ({
                                                                ...prev,
                                                                [type]: prev[
                                                                    type
                                                                ].map((v, j) =>
                                                                    i === j
                                                                        ? value
                                                                        : v
                                                                ),
                                                            })
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div className="bg-slate-400 h-24 p-3 rounded-lg">
                                                <IconLine src="/image/erda.png">
                                                    {
                                                        calculateHexaCost(
                                                            type as hexacoreType,
                                                            level,
                                                            hexacostTarget[
                                                                type
                                                            ][i]
                                                        ).erda
                                                    }
                                                </IconLine>
                                                <IconLine src="/image/frag.webp">
                                                    {
                                                        calculateHexaCost(
                                                            type as hexacoreType,
                                                            level,
                                                            hexacostTarget[
                                                                type
                                                            ][i]
                                                        ).fragment
                                                    }
                                                </IconLine>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </InfoBlock>
                        );
                    })}
                </div>
                <div className="self-start">
                    <InfoBlock title="total cost" className="text-yellow-400">
                        <IconLine src="/image/erda.png">
                            {totalCost.erda}
                        </IconLine>
                        <IconLine src="/image/frag.webp">
                            {totalCost.fragment}
                        </IconLine>
                    </InfoBlock>
                </div>
            </div>
        </InfoBlock>
    );
}

export default Hexa;
