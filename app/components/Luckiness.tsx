import React, { act, useState } from "react";
import InfoBlock from "./InfoBlock";
const { jStat } = require("jstat");

interface LuckinessData {
    targetProbability: number;
    targetSTD: number;
    zvalue: number;
    hit: number;
    miss: number;
}

function std(n: number, p: number) {
    return Math.sqrt(n * p * (1 - p));
}

const luckReducer = (
    state: LuckinessData,
    action: { type: string; value: number }
) => {
    switch (action.type) {
        case "setTargetProbability":
            return {
                ...state,
                targetProbability: action.value,
                targetSTD: 0,
                zvalue: 0,
                hit: 0,
                miss: 0,
            };
        case "reset":
            return {
                ...state,
                targetProbability: 30,
                hit: 0,
                miss: 0,
                targetSTD: 0,
                zvalue: 0,
            };
        case "hit":
            return {
                ...state,
                hit: state.hit + action.value,
                targetSTD: std(
                    state.hit + state.miss + action.value,
                    state.targetProbability * 0.01
                ),
                zvalue:
                    (state.hit +
                        action.value -
                        (state.hit + state.miss + action.value) *
                            (state.targetProbability * 0.01)) /
                    std(
                        state.hit + action.value + state.miss,
                        state.targetProbability * 0.01
                    ),
            };
        case "miss":
            return {
                ...state,
                miss: state.miss + action.value,
                targetSTD: std(
                    state.hit + state.miss + action.value,
                    state.targetProbability * 0.01
                ),
                zvalue:
                    (state.hit -
                        (state.hit + state.miss + action.value) *
                            (state.targetProbability * 0.01)) /
                    std(
                        state.hit + action.value + state.miss,
                        state.targetProbability * 0.01
                    ),
            };
        default:
            return state;
    }
};

function cdfz(z: number) {
    return jStat.normal.cdf(z, 0, 1);
}

function generateLuckString(z: number) {
    const cdf = cdfz(z);
    const p = cdf * 100;

    return `Top ${(100 - p).toFixed(7)}% / Bottom ${p.toFixed(
        7
    )}% (z: ${z}, cdfz: ${cdf})`;
}

function Luckiness() {
    const initialState: LuckinessData = {
        targetProbability: 30,
        targetSTD: 0,
        zvalue: 0,
        hit: 0,
        miss: 0,
    };

    const [luckState, dispatch] = React.useReducer(luckReducer, initialState);

    return (
        <InfoBlock title="luckiness calculator" src="/image/clover.png">
            <div className="mb-2">
                <span>Target probability</span>
                <input
                    type="number"
                    value={luckState.targetProbability}
                    className="text-gray-800 w-16 text-center mx-2"
                    onChange={(e) =>
                        dispatch({
                            type: "setTargetProbability",
                            value: Number(e.target.value),
                        })
                    }
                />
                %
            </div>
            <div className="flex">
                <button
                    className="btn btn-primary w-20 bg-cyan-600 mt-2 px-3 py-1 rounded-md hover:bg-cyan-700 active:bg-cyan-800 transition-colors"
                    onClick={() => dispatch({ type: "hit", value: 1 })}
                >
                    Hit
                </button>
                <button
                    className="btn btn-primary w-20 bg-orange-700 mt-2 px-3 py-1 rounded-md hover:bg-orange-800 active:bg-orange-900 transition-colors ml-2"
                    onClick={() => dispatch({ type: "miss", value: 1 })}
                >
                    Miss
                </button>
                <button
                    className="btn btn-primary w-20 bg-red-600 mt-2 px-3 py-1 rounded-md hover:bg-red-700 active:bg-red-800 transition-colors ml-auto"
                    onClick={() => dispatch({ type: "reset", value: 1 })}
                >
                    Reset
                </button>
            </div>
            <div className="text-primary text-xl font-bold mt-2">Target</div>
            <span className="text-cyan-300">
                {luckState.targetProbability}% x{luckState.hit + luckState.miss}{" "}
                (std: {luckState.targetSTD})
            </span>

            <div className="text-primary text-xl font-bold mt-2">Current</div>
            <span className="text-cyan-300">
                Hit: {luckState.hit}, Miss: {luckState.miss} (Total:{" "}
                {luckState.hit + luckState.miss},{" "}
                {(luckState.hit / (luckState.hit + luckState.miss)) * 100}%)
            </span>
            <div className="text-cyan-300">
                {generateLuckString(luckState.zvalue)}
            </div>
        </InfoBlock>
    );
}

export default Luckiness;
