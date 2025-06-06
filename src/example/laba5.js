import {asyncFilterCb, asyncFilter, asyncFilterAwait} from '../utils/asyncArray.js';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const isEven = n => n % 2 === 0;

async function runAll() {
    console.log('Callback-based:');
    //розкидуємо все по промісах, щоб правильно виводилося в консолі
    await new Promise(resolve => {
        asyncFilterCb(numbers, isEven, (err, evens) => {
            if (err) return console.error('CB Error', err);
            console.log('even numbers:', evens);
            resolve();
        });
    });

    console.log('Promise-based:');
    const ctrl = new AbortController();
    const abortTimer = setTimeout(() => {
        ctrl.abort();
    }, 250);
    try {
        const evens = await asyncFilter(numbers, isEven, {delay: 100, signal: ctrl.signal});
        console.log('evens:', evens);
    } catch (e) {
        console.log('promise aborted:', e.message);
    } finally {
        clearTimeout(abortTimer);
    }

    await new Promise(res => setTimeout(res, 250));
    ctrl.abort();

    console.log('Async/Await:');
    try {
        const evens = await asyncFilterAwait(numbers, isEven, {delay: 50});
        console.log('evens:', evens);
    } catch (e) {
        console.error('await error:', e);
    }
}

runAll();