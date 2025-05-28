// example/asyncFilterDemo.js
import {
    asyncFilterCb,
    asyncFilter,
    asyncFilterAwait
} from '../utils/asyncArray.js';

// дані для фільтра
const numbers = [1,2,3,4,5,6,7,8,9,10];
const isEven = n => n % 2 === 0;

// 1) callback-based
console.log('Callback-based:');
asyncFilterCb(numbers, isEven, (err, evens) => {
    if (err) return console.error('CB Error', err);
    console.log('  even numbers:', evens);
});

// 2) promise-based + AbortController
console.log('Promise-based:');
const ctrl = new AbortController();
asyncFilter(numbers, isEven, { delay: 100, signal: ctrl.signal })
    .then(evens => console.log('  evens:', evens))
    .catch(e => console.log('  promise aborted:', e.message));

// приклад скасування через 250ms
setTimeout(() => {
    ctrl.abort();
}, 250);

// 3) async/await
(async () => {
    console.log('Async/Await:');
    try {
        const evens = await asyncFilterAwait(numbers, isEven, { delay: 50 });
        console.log('  evens:', evens);
    } catch (e) {
        console.error('  await error:', e);
    }
})();
