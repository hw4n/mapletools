import React, { useEffect, useReducer, useState } from "react";
import InfoBlock from "./InfoBlock";

interface Countdown {
    id: number;
    timezone: string;
    inputTime: Date;
    localTime: Date;
    memo: string;
}

type CountdownAction = {
    type: "add" | "remove" | "update";
    id?: number;
    payload?: Partial<Countdown>;
};

function countdownReducer(state: Countdown[], action: CountdownAction) {
    switch (action.type) {
        case "add":
            return [
                ...state,
                {
                    id: state.length ? state[state.length - 1].id + 1 : 0,
                    timezone: action.payload?.timezone || "local",
                    inputTime: action.payload?.inputTime || new Date(),
                    localTime: action.payload?.localTime || new Date(),
                    memo: action.payload?.memo || "",
                },
            ];
        case "remove":
            return state.filter((target) => target.id !== action.id);
        case "update":
            return state.map((target) =>
                target.id === action.id
                    ? { ...target, ...action.payload }
                    : target
            );
        default:
            return state;
    }
}

const initialCountdown: Countdown[] = [];

function Timezone() {
    const [currentTime, setCurrentTime] = useState(new Date(0));
    const [countdownStates, dispatch] = useReducer(
        countdownReducer,
        initialCountdown
    );

    useEffect(() => {
        setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        const lastStates = JSON.parse(
            localStorage.getItem("countdownStates") || "[]"
        ) as Countdown[];

        if (!lastStates.length) return;

        for (let i = 0; i < lastStates.length; i++) {
            lastStates[i].inputTime = new Date(lastStates[i].inputTime);
            lastStates[i].localTime = new Date(lastStates[i].localTime);
            dispatch({ type: "add", payload: lastStates[i] });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "countdownStates",
            JSON.stringify(countdownStates)
        );
    }, [countdownStates]);

    function convertToLocaltime(inputTime: Date, timezone: string) {
        if (!inputTime) return new Date();

        if (timezone === "local") {
            return inputTime;
        } else if (timezone === "utc") {
            return new Date(
                inputTime.getTime() - inputTime.getTimezoneOffset() * 60000
            );
        } else if (timezone === "pst") {
            return new Date(
                inputTime.getTime() -
                    inputTime.getTimezoneOffset() * 60000 +
                    8 * 60 * 60000
            );
        }
    }

    function generateCountdown(id: number) {
        const timeDiff =
            countdownStates[id].localTime.getTime() - currentTime.getTime();

        if (timeDiff < 0) {
            return <span className="text-orange-400">0d 0h 0m 0s</span>;
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    return (
        <InfoBlock title="timezone" src="/image/hourglass.png">
            Current time
            <div className="text-primary text-xl font-bold mb-2">
                <span className="text-gray-400 italic text-sm mr-3">
                    (local time)
                </span>
                {currentTime.toLocaleString("en-US")}
            </div>
            <div className="text-orange-400 text-xl font-bold mb-2">
                <span className="text-gray-400 italic text-sm mr-3">
                    (UTC / in-game)
                </span>
                {currentTime.toLocaleString("en-US", {
                    timeZone: "UTC",
                })}
            </div>
            <div className="text-red-400 text-xl font-bold mb-2">
                <span className="text-gray-400 italic text-sm mr-3">(PST)</span>
                {currentTime.toLocaleString("en-US", {
                    timeZone: "America/Los_Angeles",
                })}
            </div>
            <hr className="border-slate-500 my-3" />
            <div>Countdown local time to</div>
            {countdownStates.map((countdown, i) => (
                <div
                    key={i}
                    className={
                        `mt-4 p-3 rounded-lg ` +
                        (currentTime > countdownStates[i].localTime
                            ? "bg-red-900"
                            : "bg-slate-500")
                    }
                >
                    <button
                        className="btn btn-secondary bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 active:bg-red-700 transition-colors mr-1"
                        onClick={() => dispatch({ type: "remove", id: i })}
                    >
                        Remove
                    </button>
                    <select
                        className="text-gray-900 p-1 h-8 text-center"
                        onChange={(e) => {
                            dispatch({
                                type: "update",
                                id: i,
                                payload: {
                                    timezone: e.target.value,
                                    localTime: convertToLocaltime(
                                        countdownStates[i].inputTime,
                                        e.target.value
                                    ),
                                },
                            });
                        }}
                        value={countdown.timezone}
                    >
                        <option value="local">LOCAL</option>
                        <option value="utc">UTC</option>
                        <option value="pst">PST</option>
                    </select>
                    <input
                        type="datetime-local"
                        className="text-gray-900 h-8"
                        onChange={(e) => {
                            dispatch({
                                type: "update",
                                id: i,
                                payload: {
                                    inputTime: new Date(e.target.value),
                                    localTime: convertToLocaltime(
                                        new Date(e.target.value),
                                        countdownStates[i].timezone
                                    ),
                                },
                            });
                        }}
                        // value={}
                    />
                    <input
                        type="text"
                        className="text-gray-900 h-8 text-center bg-slate-300 ml-1"
                        placeholder="Memo here"
                        onChange={(e) => {
                            dispatch({
                                type: "update",
                                id: i,
                                payload: { memo: e.target.value },
                            });
                        }}
                        value={countdown.memo}
                    />
                    <div className="text-primary text-xl font-bold mt-2">
                        <span className="text-cyan-300 mr-1">
                            [
                            {countdown.memo !== ""
                                ? countdown.memo
                                : "No memo provided"}
                            ]
                        </span>
                        {generateCountdown(i)}
                    </div>
                </div>
            ))}
            <button
                className="btn btn-primary bg-cyan-600 mt-2 px-3 py-1 rounded-md hover:bg-cyan-700 active:bg-cyan-800 transition-colors"
                onClick={() => dispatch({ type: "add" })}
            >
                Add another countdown
            </button>
        </InfoBlock>
    );
}

export default Timezone;
