export function memoize(fn, options) {
    const config = {
        maxSize: Infinity,
        strategy: 'LRU',
        ttl: 0,
        evict: null,
        ...options
    };

    const mem = new Map(); // Кеш

    function clearOldest() {
        if (mem.size <= config.maxSize) return;

        let targetKey;

        if (config.strategy === 'custom' && typeof config.evict === 'function') {
            config.evict(mem);
            return;
        }

        if (config.strategy === 'LFU') {
            let min = Infinity;
            for (const [k, v] of mem) {
                if (v.hits < min) {
                    min = v.hits;
                    targetKey = k;
                }
            }
        } else if (config.strategy === 'LRU') {
            let oldest = Infinity;
            for (const [k, v] of mem) {
                if (v.time < oldest) {
                    oldest = v.time;
                    targetKey = k;
                }
            }
        } else if (config.strategy === 'TTL') {
            const now = Date.now();
            for (const [k, v] of mem) {
                if (now - v.time > config.ttl) {
                    targetKey = k;
                    break;
                }
            }
        }

        if (targetKey) mem.delete(targetKey);
    }

    function removeExpired() {
        if (config.strategy !== 'TTL' || config.ttl <= 0) return;
        const now = Date.now();
        for (const [k, v] of mem) {
            if (now - v.time > config.ttl) mem.delete(k);
        }
    }

    return function (...args) {
        removeExpired();

        const key = JSON.stringify(args);
        if (mem.has(key)) {
            const data = mem.get(key);
            data.time = Date.now();
            data.hits++;
            return data.value;
        }

        const val = fn(...args);
        mem.set(key, { value: val, time: Date.now(), hits: 1 });

        clearOldest();

        return val;
    };
}
