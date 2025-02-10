"use client";

import React, { useEffect } from "react";

interface SymbolProps {
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
}

interface SymbolInfo {
    symbolDaily: boolean;
    symbolPerDay: number;
    symbolDailyToday: boolean;
    symbolWeekly: boolean;
    symbolWeeklyThisWeek: boolean;
    symbolExtra: boolean;
    symbolExtraInput: number;
    symbolInput: number[][]; // [level, equip]
    symbolRemaining: number[][]; // [growth, cost]
    symbolMaxCost: number[]; // [days, cost]
}

type SymbolAction =
    | {
          type:
              | "setSymbolDaily"
              | "setSymbolDailyToday"
              | "setSymbolWeekly"
              | "setSymbolWeeklyThisWeek"
              | "setSymbolExtra";
          payload: boolean;
      }
    | { type: "setSymbolPerDay" | "setSymbolExtraInput"; payload: number }
    | { type: "setSymbolLevel"; payload: { i: number; level: number } }
    | { type: "setSymbolEquip"; payload: { i: number; equip: number } }
    | { type: "setSymbolRemaining"; payload: number[][] }
    | { type: "setSymbolMaxCost"; payload: number[] }
    | { type: "readFromLocalStorage"; payload: SymbolInfo };

const symbolReducer = (state: SymbolInfo, action: SymbolAction) => {
    switch (action.type) {
        case "setSymbolDaily":
            return { ...state, symbolDaily: action.payload };
        case "setSymbolPerDay":
            return { ...state, symbolPerDay: action.payload };
        case "setSymbolDailyToday":
            return { ...state, symbolDailyToday: action.payload };
        case "setSymbolWeekly":
            return { ...state, symbolWeekly: action.payload };
        case "setSymbolWeeklyThisWeek":
            return { ...state, symbolWeeklyThisWeek: action.payload };
        case "setSymbolMaxCost":
            return { ...state, symbolMaxCost: action.payload };
        case "setSymbolLevel":
            const newStateWithLevel = [...state.symbolInput];
            newStateWithLevel[action.payload.i][0] = action.payload.level;
            return { ...state, symbolInput: newStateWithLevel };
        case "setSymbolEquip":
            const newStateWithEquip = [...state.symbolInput];
            newStateWithEquip[action.payload.i][1] = action.payload.equip;
            return { ...state, symbolInput: newStateWithEquip };
        case "readFromLocalStorage":
            return action.payload;
        default:
            return state;
    }
};

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
}: SymbolProps) {
    const initialState: SymbolInfo = {
        symbolDaily: true,
        symbolPerDay: symbolDailyDefault,
        symbolDailyToday: true,
        symbolWeekly: symbolWeeklyDefault > 0,
        symbolWeeklyThisWeek: true,
        symbolExtra: false,
        symbolExtraInput: 50,
        symbolInput: [[-1], [1, 0], [1, 0], [1, 0], [1, 0], [1, 0], [1, 0]],
        symbolRemaining: [[-1], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        symbolMaxCost: [-1, 0],
    };

    const [symbolInfo, dispatch] = React.useReducer(
        symbolReducer,
        initialState
    );

    function calculateSymbolRemainingUntilMax() {
        const { symbolRemaining, symbolInput } = symbolInfo;

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

        const newSymbolMaxCost = [-1, 0];

        // Find maximum days to max and total cost
        for (let i = 1; i <= 6; i++) {
            if (newRemaining[i][0] > newSymbolMaxCost[0]) {
                newSymbolMaxCost[0] = Math.max(
                    i === 1 && symbolShortName === "sac"
                        ? calculateDaysToMax(newRemaining[i][0], 10)
                        : calculateDaysToMax(newRemaining[i][0]),
                    newSymbolMaxCost[0]
                );
            }
            newSymbolMaxCost[1] += newRemaining[i][1];
        }

        dispatch({ type: "setSymbolRemaining", payload: newRemaining });
        dispatch({ type: "setSymbolMaxCost", payload: newSymbolMaxCost });
    }

    function calculateDaysToMax(remaining: number, additionalPerDay?: number) {
        const {
            symbolDaily,
            symbolPerDay,
            symbolDailyToday,
            symbolWeekly,
            symbolWeeklyThisWeek,
        } = symbolInfo;

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
        const symbolInfoFromLocalStorage = JSON.parse(
            localStorage.getItem(`symbolInfo${symbolName}`) || "{}"
        );
        dispatch({
            type: "readFromLocalStorage",
            payload: { ...initialState, ...symbolInfoFromLocalStorage },
        });
    }, []);

    useEffect(() => {
        calculateSymbolRemainingUntilMax();
        localStorage.setItem(
            `symbolInfo${symbolName}`,
            JSON.stringify(symbolInfo)
        );
    }, [symbolInfo.symbolInput]);

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
                        checked={symbolInfo.symbolDaily}
                        onChange={() => {
                            dispatch({
                                type: "setSymbolDaily",
                                payload: !symbolInfo.symbolDaily,
                            });
                        }}
                    />
                    <span className="mx-2">{symbolName} daily</span>
                    <input
                        type="number"
                        min={symbolDailyDefault}
                        value={symbolInfo.symbolPerDay}
                        className="text-gray-800 w-11 text-center"
                        onChange={(e) => {
                            dispatch({
                                type: "setSymbolPerDay",
                                payload: parseInt(e.target.value),
                            });
                        }}
                    />
                    <span className="mx-2">per day</span>
                    <input
                        type="checkbox"
                        checked={symbolInfo.symbolDailyToday}
                        onChange={() => {
                            dispatch({
                                type: "setSymbolDailyToday",
                                payload: !symbolInfo.symbolDailyToday,
                            });
                        }}
                    />
                    <span className="mx-2">completed today</span>
                </div>
                {symbolWeeklyDefault > 0 ? (
                    <div>
                        <input
                            type="checkbox"
                            checked={symbolInfo.symbolWeekly}
                            onChange={() => {
                                dispatch({
                                    type: "setSymbolWeekly",
                                    payload: !symbolInfo.symbolWeekly,
                                });
                            }}
                        />
                        <span className="mx-2">{symbolName} weekly</span>
                        <input
                            type="checkbox"
                            checked={symbolInfo.symbolWeeklyThisWeek}
                            onChange={() => {
                                dispatch({
                                    type: "setSymbolWeeklyThisWeek",
                                    payload: !symbolInfo.symbolWeeklyThisWeek,
                                });
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
                        value={symbolInfo.symbolExtraInput}
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
                                value={symbolInfo.symbolInput[i][0]}
                                className="text-gray-800 w-14 text-center"
                                onChange={(e) => {
                                    dispatch({
                                        type: "setSymbolLevel",
                                        payload: {
                                            i,
                                            level: parseInt(e.target.value),
                                        },
                                    });
                                }}
                            />
                            <input
                                type="number"
                                min={0}
                                max={symbolMaxEquip}
                                defaultValue={0}
                                className="text-gray-800 w-14 text-center"
                                onChange={(e) => {
                                    dispatch({
                                        type: "setSymbolEquip",
                                        payload: {
                                            i,
                                            equip: parseInt(e.target.value),
                                        },
                                    });
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <span className="text-gray-400 italic text-sm">
                        {comment}
                    </span>
                    {symbolInfo.symbolMaxCost[0] !== -1
                        ? symbolInfo.symbolRemaining.slice(1).map((cost, i) =>
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
                    {symbolInfo.symbolMaxCost[1] === 0 ? (
                        <div className="text-primary">Upgrade complete!</div>
                    ) : !symbolInfo.symbolDaily && !symbolInfo.symbolWeekly ? (
                        <div>Cannot upgrade any symbol</div>
                    ) : (
                        <div>
                            The max upgrade will finish in
                            <span className="text-primary">
                                {" "}
                                {symbolInfo.symbolMaxCost[0]}{" "}
                            </span>
                            days and cost
                            <span className="text-primary">
                                {" "}
                                {symbolInfo.symbolMaxCost[1].toLocaleString(
                                    "en-US"
                                )}
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
