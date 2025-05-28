let store = [];

export function log(type, task = {}) {
    const { id, title = '', columnId = '' } = task;
    store.unshift({
        uid : Date.now().toString(36),
        ts  : Date.now(),
        type,
        id,
        title,
        columnId,
    });
    store = store.slice(0, 100);
}

export function getHistory() { return store; }
