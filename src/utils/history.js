import {logDecorator} from "./log.js";
import {on} from "./emitter.js";

let store = [];

function logRaw(type, task = {}) {
    const {id, title = "", columnId = ""} = task;
    store.unshift({
        uid: Date.now().toString(36),
        ts: Date.now(),
        type,
        id,
        title,
        columnId,
    });
    store = store.slice(0, 100);
}

function getHistoryRaw() {
    return store;
}

export const log = logDecorator("DEBUG")(logRaw);
export const getHistory = logDecorator("INFO")(getHistoryRaw);

on("task:*", (payload) => {
    console.debug("[EventBus] task-event", payload);
});