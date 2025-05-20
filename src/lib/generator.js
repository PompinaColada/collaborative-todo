export function* incrementalCounter(start = 0) {
    let count = start;
    while (true) {
        yield count++;
    }
}
