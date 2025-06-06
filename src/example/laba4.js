import { BiPriorityQueue } from "../utils/BiPriorityQueue.js";

const queue = new BiPriorityQueue();

const printQueue = (label) => {
    console.log(`\n${label}:`);
    if (queue.isEmpty()) {
        console.log("  (черга порожня)\n");
        return;
    }
    queue.list.forEach((entry, i) => {
        console.log(`  [${i}] item="${entry.item}", priority=${entry.priority}, idx=${entry.idx}`);
    });
    console.log("");
};

queue.enqueue("Task A", 5);
queue.enqueue("Task B", 2);
queue.enqueue("Task C", 8);
queue.enqueue("Task D", 5);
queue.enqueue("Task E", 1);

printQueue("Після enqueue 5 задач");

const peekHigh = queue.peek("highest");
console.log(`peek('highest') → "${peekHigh}" (не вилучаємо)\n`);

const peekLow = queue.peek("lowest");
console.log(`peek('lowest') → "${peekLow}" (не вилучаємо)\n`);

const deqHigh = queue.dequeue("highest");
console.log(`dequeue('highest') → "${deqHigh}"`);
printQueue("Черга після dequeue('highest')");

const deqLow = queue.dequeue("lowest");
console.log(`dequeue('lowest') → "${deqLow}"`);
printQueue("Черга після dequeue('lowest')");

queue.enqueue("Task F", 3);
console.log('enqueue("Task F", 3)');
printQueue("Черга після додавання Task F");

const peekOldest = queue.peek("oldest");
console.log(`peek('oldest') → "${peekOldest}" (не вилучаємо)\n`);

const peekNewest = queue.peek("newest");
console.log(`peek('newest') → "${peekNewest}" (не вилучаємо)\n`);

const deqOldest = queue.dequeue("oldest");
console.log(`dequeue('oldest') → "${deqOldest}"`);
printQueue("Черга після dequeue('oldest')");

const deqNewest = queue.dequeue("newest");
console.log(`dequeue('newest') → "${deqNewest}"`);
printQueue("Черга після dequeue('newest')");

queue.clear();
console.log("queue.clear()");
printQueue("Черга після clear()");
