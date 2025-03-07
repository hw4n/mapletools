import React from "react";
import InfoBlock from "./InfoBlock";
// @ts-ignore ez
import { jStat } from "jstat";

interface LuckinessData {
    targetProbability: number;
    targetSTD: number;
    zvalue: number;
    hit: number;
    miss: number;
    accZvalue: number;
    accHit: number;
    accmiss: number;
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
        case "resetCurrent":
            return {
                ...state,
                targetProbability: 30,
                hit: 0,
                miss: 0,
                targetSTD: 0,
                zvalue: 0,
            };
        case "resetAll":
            return {
                ...state,
                targetProbability: 30,
                hit: 0,
                miss: 0,
                targetSTD: 0,
                zvalue: 0,
                accHit: 0,
                accmiss: 0,
                accZvalue: 0,
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
                accHit: state.accHit + action.value,
                accZvalue:
                    (state.accHit +
                        action.value -
                        (state.accHit + state.accmiss + action.value) *
                            (state.targetProbability * 0.01)) /
                    std(
                        state.accHit + action.value + state.accmiss,
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
                accmiss: state.accmiss + action.value,
                accZvalue:
                    (state.accHit -
                        (state.accHit + state.accmiss + action.value) *
                            (state.targetProbability * 0.01)) /
                    std(
                        state.accHit + state.accmiss + action.value,
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

function generateSTDString(n: number, p: number) {
    const sd = std(n, p);

    return `${p * 100}% with ${n} tries (normally ${(n * p - sd).toFixed(
        2
    )} ~ ${(n * p + sd).toFixed(2)})`;
}

function generateStatString(hit: number, miss: number) {
    return `${((hit / (hit + miss)) * 100).toFixed(3)}%, ${
        hit + miss
    } tries (hit: ${hit}, miss: ${miss})`;
}

function generateLuckString(z: number) {
    const cdf = cdfz(z);
    const p = cdf * 100;

    return `Top ${(100 - p).toFixed(7)}%, Bottom ${p.toFixed(7)}%`;
}

function Luckiness() {
    const initialState: LuckinessData = {
        targetProbability: 30,
        targetSTD: 0,
        zvalue: 0,
        hit: 0,
        miss: 0,
        accZvalue: 0,
        accHit: 0,
        accmiss: 0,
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
                    className="btn btn-primary w-32 bg-red-600 mt-2 px-3 py-1 rounded-md hover:bg-red-700 active:bg-red-800 transition-colors ml-24"
                    onClick={() => dispatch({ type: "resetCurrent", value: 1 })}
                >
                    Reset Current
                </button>
                <button
                    className="btn btn-primary w-32 bg-red-600 mt-2 px-3 py-1 rounded-md hover:bg-red-700 active:bg-red-800 transition-colors ml-2"
                    onClick={() => dispatch({ type: "resetAll", value: 1 })}
                >
                    Reset All
                </button>
            </div>
            <div className="text-primary text-xl font-bold mt-2">Target</div>
            <div>
                {generateSTDString(
                    luckState.hit + luckState.miss,
                    luckState.targetProbability * 0.01
                )}
            </div>

            <div className="text-primary text-xl font-bold mt-2">Current</div>
            <div>{generateStatString(luckState.hit, luckState.miss)}</div>
            <div>{generateLuckString(luckState.zvalue)}</div>

            <div className="text-primary text-xl font-bold mt-2">Overall</div>
            <div>{generateStatString(luckState.accHit, luckState.accmiss)}</div>
            <div>{generateLuckString(luckState.accZvalue)}</div>
        </InfoBlock>
    );
}

export default Luckiness;
