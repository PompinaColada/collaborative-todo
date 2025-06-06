export function asyncFilterCb(arr, predicate, cb, delay = 200) {
    let i = 0
    const filtered = []
    function next() {
        if (i >= arr.length) {
            cb(null, filtered)
            return
        }

        setTimeout(() => {
            const item = arr[i]
            if (predicate(item, i, arr)) {
                filtered.push(item)
            }
            i++
            next()
        }, delay)
    }
    next()
}

export function asyncFilter(arr, predicate, options = {}) {
    const delay = options.delay || 200
    const signal = options.signal

    return new Promise((resolve, reject) => {
        if (signal && signal.aborted) {
            return reject(new Error('aborted'))
        }
        let i = 0
        const filtered = []
        let timerId
        function step() {
            if (signal && signal.aborted) {
                clearTimeout(timerId)
                return reject(new Error('aborted'))
            }
            if (i >= arr.length) {
                return resolve(filtered)
            }
            const item = arr[i++]
            timerId = setTimeout(() => {
                if (predicate(item, i - 1, arr)) {
                    filtered.push(item)
                }
                step()
            }, delay)
        }
        step()
    })
}

export async function asyncFilterAwait(arr, predicate, options = {}) {
    return await asyncFilter(arr, predicate, options)
}
