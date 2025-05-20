import { incrementalCounter } from '../lib/generator.js';
import { consumeWithTimeout } from '../lib/iteratorTimeout.js';

const counter = incrementalCounter(1000);

console.log("Генератор ID:");
console.log(counter.next().value);
console.log(counter.next().value);
console.log(counter.next().value);
console.log(counter.next().value);
console.log(counter.next().value);
console.log(counter.next().value);

console.log("\nЛічильник 2 секунди:");

consumeWithTimeout(incrementalCounter(50), 2, async (val) => {
    console.log( val);
});
