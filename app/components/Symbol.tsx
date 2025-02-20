"use client";

import React, { useEffect } from "react";
import InfoBlock from "./InfoBlock";
import IconLine from "./IconLine";

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
        case "setSymbolExtra":
            return { ...state, symbolExtra: action.payload };
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
        symbolExtra: true,
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

    function generateNormalizingPath() {
        const symbolRemaining = symbolInfo.symbolRemaining.map((x) => x[0]);
        if (symbolName === "sacred") {
            symbolRemaining[1] /= 2;
            symbolRemaining[1] = Math.floor(symbolRemaining[1]);
        }

        const resultArray: [number, number][] = [];

        let maxRemaining = Math.max(...symbolRemaining);
        let tempRemaining = [...symbolRemaining];
        const visited: number[] = [];
        for (let i = 1; i <= 5; i++) {
            for (let j = 1; j <= 6; j++) {
                // Skipping non equipped symbols
                if (!symbolInfo.symbolInput[j][0]) continue;
                if (visited.includes(j)) continue;

                if (symbolRemaining[j] === maxRemaining) {
                    visited.push(j);
                }
            }

            tempRemaining = tempRemaining.filter((x) => x !== maxRemaining);
            let secondMax = Math.max(...tempRemaining);
            if (secondMax === -1) {
                resultArray.push([-1, maxRemaining]);
                break;
            }

            for (let j = 0; j < visited.length; j++) {
                resultArray.push([
                    visited[j],
                    symbolRemaining[visited[j]] - secondMax,
                ]);
                symbolRemaining[visited[j]] = secondMax;
            }

            maxRemaining = secondMax;
        }

        return resultArray;
    }

    function squeezeNormalizingPath() {
        const path = generateNormalizingPath();
        const result: [number, number][] = [];

        for (let i = 0; i < path.length; i++) {
            if (
                result.length === 0 ||
                result[result.length - 1][0] !== path[i][0]
            ) {
                result.push(path[i]);
            } else {
                result[result.length - 1][1] += path[i][1];
            }
        }
        return result;
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
    }, [symbolInfo.symbolInput]);

    useEffect(() => {
        localStorage.setItem(
            `symbolInfo${symbolName}`,
            JSON.stringify(symbolInfo)
        );
    }, [symbolInfo]);

    return (
        <InfoBlock
            src={`/image/${symbolShortName}0.webp`}
            title={`${symbolName} symbol`}
        >
            <div className="flex">
                <div>
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
                                        payload:
                                            !symbolInfo.symbolWeeklyThisWeek,
                                    });
                                }}
                            />
                            <span className="mx-2">completed this week</span>
                        </div>
                    ) : null}
                    <div className="mt-4">
                        <input
                            type="checkbox"
                            checked={symbolInfo.symbolExtra}
                            onChange={(e) => {
                                dispatch({
                                    type: "setSymbolExtra",
                                    payload: e.target.checked,
                                });
                            }}
                        />
                        <span className="mx-2">normalize</span>
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
                                    min={0}
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
                                    defaultValue={symbolInfo.symbolInput[i][1]}
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
                            ? symbolInfo.symbolRemaining
                                  .slice(1)
                                  .map((cost, i) =>
                                      cost[0] > 0 ? (
                                          <IconLine
                                              key={i}
                                              src={`/image/${symbolShortName}${
                                                  i + 1
                                              }.webp`}
                                          >
                                              <span className="mx-1">
                                                  will finish in
                                              </span>
                                              <span className="text-primary">
                                                  {" "}
                                                  {i === 0 &&
                                                  symbolShortName === "sac"
                                                      ? calculateDaysToMax(
                                                            cost[0],
                                                            10
                                                        )
                                                      : calculateDaysToMax(
                                                            cost[0]
                                                        )}{" "}
                                              </span>
                                              <span className="mx-1">
                                                  days and cost
                                              </span>
                                              <span className="text-primary">
                                                  {" "}
                                                  {cost[1].toLocaleString(
                                                      "en-US"
                                                  )}{" "}
                                              </span>
                                              <span className="mx-1">
                                                  mesos
                                              </span>
                                          </IconLine>
                                      ) : null
                                  )
                            : null}
                        {symbolInfo.symbolMaxCost[1] === 0 ? (
                            <div className="text-primary">
                                Upgrade complete!
                            </div>
                        ) : !symbolInfo.symbolDaily &&
                          !symbolInfo.symbolWeekly ? (
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
                {symbolInfo.symbolExtra ? (
                    <InfoBlock title="normalizing" className="text-yellow-400">
                        <div className="text-gray-400 italic text-sm mb-2">
                            The following calculation ignores daily acquisition
                            and equalizes the number of symbols equal.
                        </div>
                        {squeezeNormalizingPath().map((x, i) =>
                            x[0] !== -1 ? (
                                <IconLine
                                    key={i}
                                    src={`/image/${symbolShortName}${x[0]}.webp`}
                                >
                                    <span className="mx-1">Equip extra</span>
                                    <span className="text-primary">{x[1]}</span>
                                </IconLine>
                            ) : null
                        )}
                        Equally distribute the remaining symbols
                    </InfoBlock>
                ) : null}
            </div>
        </InfoBlock>
    );
}

export default Symbol;
