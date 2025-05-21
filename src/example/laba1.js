import { incrementalCounter } from '../lib/generator.js';
import { iteratorWithTimeout } from '../lib/iteratorTimeout.js';

const counter = incrementalCounter(101);

console.log("Генератор ID:");
console.log(counter.next().value);
console.log(counter.next().value);
console.log(counter.next().value);
console.log(counter.next().value);
console.log(counter.next().value);
console.log(counter.next().value);

console.log("\nЛічильник 2 секунди:");

iteratorWithTimeout(incrementalCounter(50), 2, async (val) => {
    console.log( val);
});
