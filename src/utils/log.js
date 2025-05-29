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
                            const duration = Date.now() - start;
                            const tsOk = new Date().toISOString();
                            console.log(
                                `[${tsOk}] [${level}] ${func.name} resolved with:`,
                                res,
                                `(${duration}ms)`
                            );
                            return res;
                        })
                        .catch((err) => {
                            const duration = Date.now() - start;
                            const tsErr = new Date().toISOString();
                            console.error(
                                `[${tsErr}] [ERROR] ${func.name} rejected:`,
                                err,
                                `(${duration}ms)`
                            );
                            throw err;
                        });
                }

                const duration = Date.now() - start;
                const tsOk = new Date().toISOString();
                console.log(
                    `[${tsOk}] [${level}] ${func.name} returned:`,
                    result,
                    `(${duration}ms)`
                );
                return result;
            } catch (err) {
                const duration = Date.now() - start;
                const tsErr = new Date().toISOString();
                console.error(
                    `[${tsErr}] [ERROR] ${func.name} threw error:`,
                    err,
                    `(${duration}ms)`
                );
                throw err;
            }
        };
    };
}
