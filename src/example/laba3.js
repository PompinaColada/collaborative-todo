import { memoize } from '../lib/memoize.js';

function prime(n) {
    if (n < 2) return false;
    for (let i = 2; i < n; i++) {
        if (n % i === 0) return false;
    }
    return true;
}

const fastPrime = memoize(prime, { maxSize: 50, strategy: 'LRU' });

console.time('time');
console.log('isPrime(104729)?', fastPrime(104729));
console.timeEnd('time');

console.time('time2');
console.log('isPrime(104729)?', fastPrime(104729));
console.timeEnd('time2');