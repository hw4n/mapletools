import React, { useEffect, useReducer, useState } from "react";
import InfoBlock from "./InfoBlock";
import IconLine from "./IconLine";

interface GrindInfo {
    itemDropRate: number;
    wap: number;
    swap: number;
    enemiesPer6Minutes: number;
    expPer6Minutes: number;
    mesoPer6Minutes: number;
    enemiesPerHour: number;
    expPerHour: number;
    mesoPerHour: number;
}

const grindReducer = (
    state: GrindInfo,
    action: { type: string; value: number }
) => {
    switch (action.type) {
        case "itemDropRate":
            return { ...state, itemDropRate: action.value };
        case "wap":
            return { ...state, wap: action.value, swap: action.value * 4 };
        case "swap":
            return {
                ...state,
                wap: action.value / 4,
                swap: action.value,
            };
        case "enemiesPer6Minutes":
            return {
                ...state,
                enemiesPer6Minutes: action.value,
                enemiesPerHour: action.value * 10,
            };
        case "expPer6Minutes":
            return {
                ...state,
                expPer6Minutes: action.value,
                expPerHour: action.value * 10,
            };
        case "mesoPer6Minutes":
            return {
                ...state,
                mesoPer6Minutes: action.value,
                mesoPerHour: action.value * 10,
            };
        case "enemiesPerHour":
            return {
                ...state,
                enemiesPer6Minutes: action.value / 10,
                enemiesPerHour: action.value,
            };
        case "expPerHour":
            return {
                ...state,
                expPer6Minutes: action.value / 10,
                expPerHour: action.value,
            };
        case "mesoPerHour":
            return {
                ...state,
                mesoPer6Minutes: action.value / 10,
                mesoPerHour: action.value,
            };
        default:
            return state;
    }
};

const Grind = () => {
    const initialState: GrindInfo = {
        itemDropRate: 0,
        wap: 0,
        swap: 0,
        enemiesPer6Minutes: 0,
        expPer6Minutes: 0,
        mesoPer6Minutes: 0,
        enemiesPerHour: 0,
        expPerHour: 0,
        mesoPerHour: 0,
    };

    const [grindInfo, dispatch] = useReducer(grindReducer, initialState);

    const [expBefore, setExpBefore] = useState(0);
    const [expAfter, setExpAfter] = useState(0);

    useEffect(() => {
        const lastGrindInfo = JSON.parse(
            localStorage.getItem("grindInfo") || "{}"
        );

        dispatch({
            type: "itemDropRate",
            value: lastGrindInfo.itemDropRate || 0,
        });
        dispatch({ type: "swap", value: lastGrindInfo.swap || 0 });
        dispatch({
            type: "enemiesPer6Minutes",
            value: lastGrindInfo.enemiesPer6Minutes || 0,
        });
        dispatch({
            type: "expPer6Minutes",
            value: lastGrindInfo.expPer6Minutes || 0,
        });
        dispatch({
            type: "mesoPer6Minutes",
            value: lastGrindInfo.mesoPer6Minutes || 0,
        });
    }, []);

    useEffect(() => {
        localStorage.setItem("grindInfo", JSON.stringify(grindInfo));
    }, [grindInfo]);

    function calculateFragment(ed: number, idr: number) {
        return Math.floor(ed * 0.000425 * (1 + Math.log(1 + idr / 100)));
    }

    function generateFragmentResultString(ed: number, idr: number) {
        const result = calculateFragment(ed, idr);
        return `${result} ± 5% (${Math.floor(result * 0.95)} ~ ${Math.ceil(
            result * 1.05
        )})`;
    }

    return (
        <InfoBlock src="/image/exp.png" title="grinding">
            <div className="mb-2">
                <span>Item drop rate </span>
                <input
                    type="number"
                    value={grindInfo.itemDropRate}
                    className="text-gray-800 w-16 text-center mr-1"
                    onChange={(e) => {
                        dispatch({
                            type: "itemDropRate",
                            value: Number(e.target.value),
                        });
                    }}
                />
                %
            </div>
            <div className="mb-2 flex items-center">
                <img
                    src="/image/wap.png"
                    className="w-8 h-8 object-contain inline-block mr-1"
                />
                <span>WAP</span>
                <input
                    type="number"
                    value={grindInfo.wap}
                    className="text-gray-800 w-16 text-center mx-1"
                    onChange={(e) => {
                        dispatch({
                            type: "wap",
                            value: Number(e.target.value),
                        });
                    }}
                />
                <span className="text-orange-400 mx-2"> or </span>
                <img
                    src="/image/swap.png"
                    className="w-8 h-8 object-contain inline-block mr-1"
                />
                <span>SWAP </span>
                <input
                    type="number"
                    value={grindInfo.swap}
                    className="text-gray-800 w-16 text-center mx-1"
                    onChange={(e) => {
                        dispatch({
                            type: "swap",
                            value: Number(e.target.value),
                        });
                    }}
                />
            </div>
            <div className="mb-1">
                <span className="text-gray-400 italic text-sm mr-3">
                    (battle analysis)
                </span>
                <input
                    type="number"
                    value={grindInfo.enemiesPer6Minutes}
                    className="text-gray-800 w-20 text-center"
                    onChange={(e) => {
                        dispatch({
                            type: "enemiesPer6Minutes",
                            value: Number(e.target.value),
                        });
                    }}
                />
                <span> enemies defeated, </span>
                <input
                    type="number"
                    value={grindInfo.expPer6Minutes}
                    className="text-gray-800 w-20 text-center"
                    onChange={(e) => {
                        dispatch({
                            type: "expPer6Minutes",
                            value: Number(e.target.value),
                        });
                    }}
                />
                <span> % EXP, </span>
                <input
                    type="number"
                    value={grindInfo.mesoPer6Minutes}
                    className="text-gray-800 w-24 text-center"
                    onChange={(e) => {
                        dispatch({
                            type: "mesoPer6Minutes",
                            value: Number(e.target.value),
                        });
                    }}
                />
                <span> mesos acquired per 6 minutes</span>
            </div>
            <div className="mb-2">
                <span className="text-gray-400 italic text-sm mr-3">
                    or assume
                </span>
                <input
                    type="number"
                    value={grindInfo.enemiesPerHour}
                    className="text-gray-800 w-20 text-center"
                    onChange={(e) => {
                        dispatch({
                            type: "enemiesPerHour",
                            value: Number(e.target.value),
                        });
                    }}
                />
                <span> enemies defeated, </span>
                <input
                    type="number"
                    value={grindInfo.expPerHour}
                    className="text-gray-800 w-20 text-center"
                    onChange={(e) => {
                        dispatch({
                            type: "expPerHour",
                            value: Number(e.target.value),
                        });
                    }}
                />
                <span> % EXP, </span>
                <input
                    type="number"
                    value={grindInfo.mesoPerHour}
                    className="text-gray-800 w-28 text-center"
                    onChange={(e) => {
                        dispatch({
                            type: "mesoPerHour",
                            value: Number(e.target.value),
                        });
                    }}
                />
                <span> mesos acquired per hour</span>
            </div>
            <div className="mt-8 mb-2">
                <span className="text-gray-400 italic text-sm mr-3">
                    (EXP% difference calculator)
                </span>
                <div>
                    EXP before BA
                    <input
                        type="number"
                        defaultValue={0}
                        className="text-gray-800 w-20 text-center ml-2 mr-1"
                        onChange={(e) => {
                            setExpBefore(Number(e.target.value));
                        }}
                    />
                    %<span className="text-orange-400"> to </span>
                    EXP after BA
                    <input
                        type="number"
                        defaultValue={0}
                        className="text-gray-800 w-20 text-center ml-2 mr-1"
                        onChange={(e) => {
                            setExpAfter(Number(e.target.value));
                        }}
                    />
                    %<span className="text-orange-400 ml-1"> is </span>
                    <span className="text-primary">
                        {(expAfter - expBefore).toFixed(3)}%
                    </span>
                    <button
                        className="ml-2 bg-lime-600 hover:bg-lime-700 text-white px-2 py-1 rounded-md transition-colors"
                        onClick={() => {
                            dispatch({
                                type: "expPer6Minutes",
                                value: Number(
                                    (expAfter - expBefore).toFixed(3)
                                ),
                            });
                        }}
                    >
                        Use {(expAfter - expBefore).toFixed(3)}% for EXP% per 6
                        minutes
                    </button>
                </div>
            </div>
            <hr className="border-slate-500 my-3" />
            You will grind for{" "}
            <span className="text-primary">{grindInfo.swap / 2}</span> hours and
            get around the following:
            <IconLine src="/image/exp.png">
                <span className="text-primary ml-1">
                    {((grindInfo.swap / 2) * grindInfo.expPerHour).toFixed(3)}%
                </span>
            </IconLine>
            <IconLine src="/image/frag.webp">
                <span className="text-primary ml-1">
                    {grindInfo.itemDropRate > 0
                        ? generateFragmentResultString(
                              (grindInfo.swap / 2) * grindInfo.enemiesPerHour,
                              grindInfo.itemDropRate
                          )
                        : "Item drop rate not set"}
                </span>
            </IconLine>
            <IconLine src="/image/meso.png">
                <span className="text-primary ml-1">
                    {(
                        (grindInfo.swap / 2) *
                        grindInfo.mesoPerHour
                    ).toLocaleString()}
                </span>
            </IconLine>
        </InfoBlock>
    );
};

export default Grind;
