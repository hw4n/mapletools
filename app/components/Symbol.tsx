"use client";

import React, { useEffect, useState } from "react";

function Symbol({
    name: symbolName,
    shortName: symbolShortName,
    maxLevel: symbolMaxLevel,
    maxEquip: symbolMaxEquip,
    comment,
    dailyDefault: symbolDailyDefault,
    weeklyDefault: symbolWeeklyDefault,
    calculateGrowth,
    calculateMesoCost,
}: {
    name: string;
    shortName: string;
    maxLevel: number;
    maxEquip: number;
    dailyDefault: number;
    weeklyDefault: number;
    comment: string;
    calculateGrowth: (level: number) => number;
    calculateMesoCost: (
        level: number,
        constant: number,
        growth: number
    ) => number;
}) {
    const [symbolDaily, setSymbolDaily] = useState(true);
    const [symbolPerDay, setSymbolPerDay] = useState(symbolDailyDefault);
    const [symbolDailyToday, setSymbolDailyToday] = useState(true);
    const [symbolWeekly, setSymbolWeekly] = useState(symbolWeeklyDefault > 0);
    const [symbolWeeklyThisWeek, setSymbolWeeklyThisWeek] = useState(true);
    // const [symbolExtra, setSymbolExtra] = useState(false);
    // const [symbolExtraAmount, setSymbolExtraAmount] = useState(50);
    const [symbolInput, setSymbolInput] = useState([
        [-1],
        [1, 0],
        [1, 0],
        [1, 0],
        [1, 0],
        [1, 0],
        [1, 0],
    ]);
    const [symbolRemaining, setSymbolRemaining] = useState([
        [-1],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
    ]);
    const [symbolMaxCost, setSymbolMaxCost] = useState([-1, 0]);

    function setSymbolLevel(i: number, level: number) {
        const newSymbolInput = [...symbolInput];
        newSymbolInput[i][0] = level;
        setSymbolInput(newSymbolInput);
    }

    function setSymbolEquip(i: number, equip: number) {
        const newSymbolInput = [...symbolInput];
        newSymbolInput[i][1] = equip;
        setSymbolInput(newSymbolInput);
    }

    function calculateSymbolRemainingUntilMax() {
        const newRemaining = [...symbolRemaining];
        for (let i = 1; i <= 6; i++) {
            newRemaining[i][0] = 0;
            newRemaining[i][1] = 0;
            for (
                let symbolLevel = symbolInput[i][0];
                symbolLevel < symbolMaxLevel;
                symbolLevel++
            ) {
                const growth = calculateGrowth(symbolLevel);
                newRemaining[i][0] += growth;
                newRemaining[i][1] += calculateMesoCost(symbolLevel, i, growth);
            }
            newRemaining[i][0] -= symbolInput[i][1];
        }
        setSymbolRemaining(newRemaining);
    }

    function calculateDaysToMax(remaining: number, additionalPerDay?: number) {
        const termination1 = !symbolDaily && !symbolWeekly;
        const termination2 = symbolDaily && symbolPerDay === 0;
        if (termination1 || termination2) {
            return -1;
        }

        if (!symbolDailyToday) {
            remaining -= symbolPerDay + (additionalPerDay || 0);
        }
        if (!symbolWeeklyThisWeek) {
            remaining -= symbolWeeklyDefault;
        }

        let days = 0;

        while (remaining > 0) {
            days++;
            if (symbolDaily)
                remaining -= symbolPerDay + (additionalPerDay || 0);
            if (symbolWeekly && days % 7 === 0)
                remaining -= symbolWeeklyDefault;
        }

        return days;
    }

    useEffect(() => {
        calculateSymbolRemainingUntilMax();
    }, [symbolInput]);

    useEffect(() => {
        console.log("test");
        const newSymbolMaxCost = [-1, 0];

        // Find maximum days to max and total cost
        for (let i = 1; i <= 6; i++) {
            if (symbolRemaining[i][0] > newSymbolMaxCost[0]) {
                newSymbolMaxCost[0] = Math.max(
                    i === 1 && symbolShortName === "sac"
                        ? calculateDaysToMax(symbolRemaining[i][0], 10)
                        : calculateDaysToMax(symbolRemaining[i][0]),
                    newSymbolMaxCost[0]
                );
            }
            newSymbolMaxCost[1] += symbolRemaining[i][1];
        }
        setSymbolMaxCost(newSymbolMaxCost);
    }, [
        symbolRemaining,
        symbolDaily,
        symbolPerDay,
        symbolDailyToday,
        symbolWeekly,
        symbolWeeklyThisWeek,
    ]);

    return (
        <div className="p-3">
            <div className="flex items-center mb-1">
                <img
                    src={`/image/${symbolShortName}0.webp`}
                    className="w-9 h-9"
                />
                <h1 className="text-primary text-xl font-bold ml-1">
                    {symbolName} Symbol
                </h1>
            </div>
            <div className="bg-primaryGray rounded-xl p-3">
                <div>
                    <input
                        type="checkbox"
                        defaultChecked
                        onChange={() => {
                            setSymbolDaily(!symbolDaily);
                        }}
                    />
                    <span className="mx-2">{symbolName} daily</span>
                    <input
                        type="number"
                        min={symbolDailyDefault}
                        defaultValue={symbolDailyDefault}
                        className="text-gray-800 w-11 text-center"
                        onChange={(e) => {
                            setSymbolPerDay(parseInt(e.target.value));
                        }}
                    />
                    <span className="mx-2">per day</span>
                    <input
                        type="checkbox"
                        defaultChecked
                        onChange={() => {
                            setSymbolDailyToday(!symbolDailyToday);
                        }}
                    />
                    <span className="mx-2">completed today</span>
                </div>
                {symbolWeeklyDefault > 0 ? (
                    <div>
                        <input
                            type="checkbox"
                            defaultChecked
                            onChange={() => {
                                setSymbolWeekly(!symbolWeekly);
                            }}
                        />
                        <span className="mx-2">{symbolName} weekly</span>
                        <input
                            type="checkbox"
                            defaultChecked
                            onChange={() => {
                                setSymbolWeeklyThisWeek(!symbolWeeklyThisWeek);
                            }}
                        />
                        <span className="mx-2">completed this week</span>
                    </div>
                ) : null}
                <div className="mt-4">
                    <input type="checkbox" disabled />
                    <span className="mx-2">Normalize with</span>
                    <input
                        type="number"
                        defaultValue={50}
                        className="text-gray-800 w-11 text-center"
                        disabled
                    />
                    <span className="mx-2">extra symbol(s)</span>
                </div>
                <div className="flex mt-4">
                    <div className="flex flex-col items-center">
                        <img
                            src={`/image/${symbolShortName}0.webp`}
                            className="opacity-0"
                        />
                        <div>Level</div>
                        <div>Equip</div>
                    </div>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            className="flex flex-col items-center ml-3"
                            key={i}
                        >
                            <img
                                src={`/image/${symbolShortName}${i}.webp`}
                                className="w-9 h-9"
                            />
                            <input
                                type="number"
                                min={1}
                                max={symbolMaxLevel}
                                defaultValue="1"
                                className="text-gray-800 w-14 text-center"
                                onChange={(e) => {
                                    setSymbolLevel(i, parseInt(e.target.value));
                                }}
                            />
                            <input
                                type="number"
                                min={0}
                                max={symbolMaxEquip}
                                defaultValue={0}
                                className="text-gray-800 w-14 text-center"
                                onChange={(e) => {
                                    setSymbolEquip(i, parseInt(e.target.value));
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <span className="text-gray-400 italic text-sm">
                        {comment}
                    </span>
                    {symbolMaxCost[0] !== -1
                        ? symbolRemaining.slice(1).map((cost, i) =>
                              cost[0] > 0 ? (
                                  <div key={i}>
                                      <img
                                          src={`/image/${symbolShortName}${
                                              i + 1
                                          }.webp`}
                                          className="w-9 h-9 inline-block mr-1"
                                      />
                                      will finish in
                                      <span className="text-primary">
                                          {" "}
                                          {i === 0 && symbolShortName === "sac"
                                              ? calculateDaysToMax(cost[0], 10)
                                              : calculateDaysToMax(
                                                    cost[0]
                                                )}{" "}
                                      </span>
                                      days and cost
                                      <span className="text-primary">
                                          {" "}
                                          {cost[1].toLocaleString("en-US")}{" "}
                                      </span>
                                      mesos
                                  </div>
                              ) : null
                          )
                        : null}
                    {symbolMaxCost[1] === 0 ? (
                        <div className="text-primary">Upgrade complete!</div>
                    ) : symbolMaxCost[0] === -1 ? (
                        <div>Cannot upgrade any symbol</div>
                    ) : (
                        <div>
                            The max upgrade will finish in
                            <span className="text-primary">
                                {" "}
                                {symbolMaxCost[0]}{" "}
                            </span>
                            days and cost
                            <span className="text-primary">
                                {" "}
                                {symbolMaxCost[1].toLocaleString("en-US")}
                            </span>{" "}
                            mesos
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Symbol;
