// 1) callback-based asyncFilter
export function asyncFilterCb(arr, predicate, callback, delay = 200) {
    const result = [];
    let idx = 0;

    function next() {
        if (idx >= arr.length) {
            callback(null, result);
            return;
        }
        const item = arr[idx++];
        // симулюємо асинхронність
        setTimeout(() => {
            if (predicate(item, idx - 1, arr)) {
                result.push(item);
            }
            next();
        }, delay);
    }

    next();
}

// 2) promise-based asyncFilter with cancellation
export function asyncFilter(arr, predicate, options = {}) {
    const { delay = 200, signal } = options;
    return new Promise((res, rej) => {
        if (signal?.aborted) return rej(new Error('aborted'));
        const out = [];
        let idx = 0;
        let timer;

        function step() {
            if (signal?.aborted) {
                clearTimeout(timer);
                return rej(new Error('aborted'));
            }
            if (idx >= arr.length) {
                return res(out);
            }
            const item = arr[idx++];
            timer = setTimeout(() => {
                try {
                    if (predicate(item, idx - 1, arr)) {
                        out.push(item);
                    }
                    step();
                } catch (e) {
                    rej(e);
                }
            }, delay);
        }

        step();
    });
}

// 3) async/await wrapper (приклад)
export async function asyncFilterAwait(arr, predicate, options = {}) {
    return await asyncFilter(arr, predicate, options);
}
