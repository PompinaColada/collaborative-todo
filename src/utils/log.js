function doTimeStamp(start) {
    return {
        ts: new Date().toISOString(),
        duration: Date.now() - start,
    };
}

export function logDecorator(level = "INFO") {
    return function (func) {
        return function (...args) {
            const start = Date.now();
            const tsCall = new Date().toISOString();

            console.log(
                `[${tsCall}] [${level}] ${func.name} called with:`,
                args
            );

            try {
                const result = func.apply(this, args);

                if (result instanceof Promise) {
                    return result
                        .then((res) => {
                            const { ts, duration } = doTimeStamp(start);
                            console.log(
                                `[${ts}] [${level}] ${func.name} resolved with:`,
                                res,
                                `(${duration}ms)`
                            );
                            return res;
                        })
                        .catch((err) => {
                            const { ts, duration } = doTimeStamp(start);
                            console.error(
                                `[${ts}] [ERROR] ${func.name} rejected:`,
                                err,
                                `(${duration}ms)`
                            );
                            throw err;
                        });
                }

                const { ts, duration } = doTimeStamp(start);
                console.log(
                    `[${ts}] [${level}] ${func.name} returned:`,
                    result,
                    `(${duration}ms)`
                );
                return result;
            } catch (err) {
                const { ts, duration } = doTimeStamp(start);
                console.error(
                    `[${ts}] [ERROR] ${func.name} threw error:`,
                    err,
                    `(${duration}ms)`
                );
                throw err;
            }
        };
    };
}
