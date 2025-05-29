import { logDecorator } from "./log.js";

const STORAGE_KEY = "todo-board-state";

function loadStateRaw() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}

function saveStateRaw(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {

    }
}

export const loadState = logDecorator("INFO")(loadStateRaw);
export const saveState = logDecorator("DEBUG")(saveStateRaw);
