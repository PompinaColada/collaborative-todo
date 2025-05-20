export async function consumeWithTimeout(iterator, timeoutSeconds, callback) {
    const end = Date.now() + timeoutSeconds * 1000;

    while (Date.now() < end) {
        const { value, done } = iterator.next();
        if (done) break;
        await callback(value);
        await new Promise(res => setTimeout(res, 300));
    }
}
