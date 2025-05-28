function asyncToggleDone(list, id, signal) {
    return new Promise((res, rej) => {
        if (signal.aborted) return rej('canceled');

        const timer = setTimeout(() => {
            const out = list.map(t => (t.id === id ? { ...t, done: !t.done } : t));
            res(out);
        }, 400);

        signal.addEventListener('abort', () => {
            clearTimeout(timer);
            rej('canceled');
        });
    });
}

function asyncRemoveTask(list, id, signal) {
    return new Promise((res, rej) => {
        if (signal.aborted) return rej('canceled');

        const timer = setTimeout(() => {
            const out = list.filter(t => t.id !== id);
            res(out);
        }, 400);

        signal.addEventListener('abort', () => {
            clearTimeout(timer);
            rej('canceled');
        });
    });
}

export{asyncToggleDone, asyncRemoveTask }