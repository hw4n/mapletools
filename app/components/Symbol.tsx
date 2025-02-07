"use client";

import React, { useEffect, useState } from "react";

function Symbol() {
    const [arcDaily, setArcDaily] = useState(true);
    const [arcPerDay, setArcPerDay] = useState(20);
    const [arcDailyToday, setArcDailyToday] = useState(true);
    const [arcWeekly, setArcWeekly] = useState(true);
    const [arcWeeklyThisWeek, setArcWeeklyThisWeek] = useState(true);
    // const [arcExtra, setArcExtra] = useState(false);
    // const [arcExtraAmount, setArcExtraAmount] = useState(50);
    const [arcInput, setArcInput] = useState([
        [-1],
        [1, 0],
        [1, 0],
        [1, 0],
        [1, 0],
        [1, 0],
        [1, 0],
    ]);
    const [arcRemaining, setArcRemaining] = useState([
        [-1],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
    ]);
    const [arcMaxCost, setArcMaxCost] = useState([-1, 0]);

    function setArcLevel(i: number, level: number) {
        const newArcInput = [...arcInput];
        newArcInput[i][0] = level;
        setArcInput(newArcInput);
    }

    function setArcEquip(i: number, equip: number) {
        const newArcInput = [...arcInput];
        newArcInput[i][1] = equip;
        setArcInput(newArcInput);
    }

    function calculateArcRemainingUntilMax() {
        const newRemaining = [...arcRemaining];
        for (let i = 1; i <= 6; i++) {
            newRemaining[i][0] = 0;
            newRemaining[i][1] = 0;
            for (let arclevel = arcInput[i][0]; arclevel < 20; arclevel++) {
                const growth = arclevel ** 2 + 11;
                newRemaining[i][0] += growth;
                newRemaining[i][1] +=
                    Math.floor(growth * 2 * (i + 3 + arclevel * 0.05)) * 10000;
            }
            newRemaining[i][0] -= arcInput[i][1];
        }
        setArcRemaining(newRemaining);
    }

    function calculateDaysToMax(remaining: number) {
        if (!arcDaily && !arcWeekly) {
            return -1;
        }

        if (!arcDailyToday) {
            remaining -= arcPerDay;
        }
        if (!arcWeeklyThisWeek) {
            remaining -= 45;
        }

        let days = 0;

        while (remaining > 0) {
            days++;
            if (arcDaily) remaining -= arcPerDay;
            if (arcWeekly && days % 7 === 0) remaining -= 45;
        }

        return days;
    }

    useEffect(() => {
        calculateArcRemainingUntilMax();
    }, [arcInput]);

    useEffect(() => {
        const newArcMaxCost = [-1, 0];

        // Find maximum days to max and total cost
        for (let i = 1; i <= 6; i++) {
            if (arcRemaining[i][0] > newArcMaxCost[0]) {
                newArcMaxCost[0] = Math.max(
                    calculateDaysToMax(arcRemaining[i][0]),
                    newArcMaxCost[0]
                );
            }
            newArcMaxCost[1] += arcRemaining[i][1];
        }
        setArcMaxCost(newArcMaxCost);
    }, [
        arcRemaining,
        arcDaily,
        arcPerDay,
        arcDailyToday,
        arcWeekly,
        arcWeeklyThisWeek,
    ]);

    return (
        <div className="p-3">
            <h1 className="text-primary text-xl font-bold mb-2">
                Arcane Symbol
            </h1>
            <div className="bg-primaryGray rounded-xl p-3">
                <div>
                    <input
                        type="checkbox"
                        id="arcdaily"
                        defaultChecked
                        onChange={() => {
                            setArcDaily(!arcDaily);
                        }}
                    />
                    <span className="mx-2">Arcane daily</span>
                    <input
                        type="number"
                        defaultValue={20}
                        className="text-gray-800 w-11 text-center"
                        id="arcperday"
                        onChange={(e) => {
                            setArcPerDay(parseInt(e.target.value));
                        }}
                    />
                    <span className="mx-2">per day</span>
                    <input
                        type="checkbox"
                        id="arcdailytoday"
                        defaultChecked
                        onChange={() => {
                            setArcDailyToday(!arcDailyToday);
                        }}
                    />
                    <span className="mx-2">completed today</span>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="arcweekly"
                        defaultChecked
                        onChange={() => {
                            setArcWeekly(!arcWeekly);
                        }}
                    />
                    <span className="mx-2">Arcane weekly</span>
                    <input
                        type="checkbox"
                        id="arcweeklythisweek"
                        defaultChecked
                        onChange={() => {
                            setArcWeeklyThisWeek(!arcWeeklyThisWeek);
                        }}
                    />
                    <span className="mx-2">completed this week</span>
                </div>
                <div className="mt-4">
                    <input type="checkbox" id="arcextra" disabled />
                    <span className="mx-2">Normalize with</span>
                    <input
                        type="number"
                        defaultValue={50}
                        className="text-gray-800 w-11 text-center"
                        id="arcextraamount"
                        disabled
                    />
                    <span className="mx-2">extra symbol(s)</span>
                </div>
                <div className="flex mt-4">
                    <div className="flex flex-col items-center">
                        <img src="/image/arc1.webp" className="opacity-0" />
                        <div>Level</div>
                        <div>Equip</div>
                    </div>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            className="flex flex-col items-center ml-3"
                            key={i}
                        >
                            <img
                                src={`/image/arc${i}.webp`}
                                className="w-9 h-9"
                            />
                            <input
                                type="number"
                                min={1}
                                max={20}
                                defaultValue="1"
                                className="text-gray-800 w-14 text-center"
                                id={`arc${i}level`}
                                onChange={(e) => {
                                    setArcLevel(i, parseInt(e.target.value));
                                }}
                            />
                            <input
                                type="number"
                                min={0}
                                max={2679}
                                defaultValue={0}
                                className="text-gray-800 w-14 text-center"
                                id={`arc${i}equip`}
                                onChange={(e) => {
                                    setArcEquip(i, parseInt(e.target.value));
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <span className="text-gray-400 italic text-sm">
                        The following calculation assumes Reverse City and Yum
                        Yum Island are open
                    </span>
                    {arcRemaining.slice(1).map((arc, i) => (
                        <div key={i}>
                            <img
                                src={`/image/arc${i + 1}.webp`}
                                className="w-9 h-9 inline-block mr-1"
                            />
                            will finish in
                            <span className="text-primary">
                                {" "}
                                {calculateDaysToMax(arc[0])}{" "}
                            </span>
                            days and cost
                            <span className="text-primary">
                                {" "}
                                {arc[1].toLocaleString("en-US")}{" "}
                            </span>
                            mesos
                        </div>
                    ))}
                    {arcMaxCost[0] === -1 ? (
                        <div>Cannot upgrade any symbol</div>
                    ) : (
                        <div>
                            The max upgrade will finish in
                            <span className="text-primary">
                                {" "}
                                {arcMaxCost[0]}{" "}
                            </span>
                            days and cost
                            <span className="text-primary">
                                {" "}
                                {arcMaxCost[1].toLocaleString("en-US")}
                            </span>{" "}
                            mesos
                        </div>
                    )}
                </div>
            </div>

            <h1 className="text-primary text-xl font-bold mt-2 mb-2">
                Sacred Symbol
            </h1>
            <div className="bg-primaryGray rounded-xl p-3">
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>6</div>
            </div>
        </div>
    );
}

export default Symbol;
