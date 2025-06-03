class EventEmitter {
    #listeners = Object.create(null);

    /** Підписка
     *  @param {string} event   — ім’я (можна 'task:*')
     *  @param {Function} fn    — колбек-обробник
     *  @param {Object} [opt]
     *  @param {boolean} [opt.once=false] — виконати один раз
     *  @param {number}  [opt.priority=0]— більший pr  ⇒ раніше
     *  @returns {Function} unsubscribe
     */
    on(event, fn, opt = {}) {
        const { once = false, priority = 0 } = opt;
        (this.#listeners[event] = this.#listeners[event] || []).push({ fn, once, priority });
        this.#listeners[event].sort((a, b) => b.priority - a.priority);
        return () => this.off(event, fn);
    }

    once(event, fn, opt = {}) {
        return this.on(event, fn, { ...opt, once: true });
    }

    off(event, fn) {
        const arr = this.#listeners[event];
        if (!arr) return;
        this.#listeners[event] = arr.filter(l => l.fn !== fn);
        if (this.#listeners[event].length === 0) delete this.#listeners[event];
    }

    /** emit
     *  @param {string} event
     *  @param {any} payload
     *  @param {Object} [opt]
     *  @param {boolean} [opt.async=false] — викликати колбеки в мікротасці
     */
    emit(event, payload, opt = {}) {
        const { async = false } = opt;
        const exec = (l) => {
            try { l.fn(payload); }
            catch (err) { console.error(`[Emitter][${event}] listener error:`, err); }
        };

        const callList = [
            ...(this.#listeners[event] || []),
            ...Object.keys(this.#listeners)
                .filter(k => k.endsWith('*') && this.#matchWildcard(k, event))
                .flatMap(k => this.#listeners[k])
        ];

        callList.forEach(l => {
            if (async) Promise.resolve().then(() => exec(l));
            else       exec(l);
            if (l.once) this.off(event, l.fn);
        });
    }

    clearAll() {
        this.#listeners = Object.create(null);
    }

    #matchWildcard(pattern, event) {
        if (!pattern.includes('*')) return pattern === event;
        const base = pattern.slice(0, pattern.indexOf('*'));
        return event.startsWith(base);
    }
}

export const emitter = new EventEmitter();
export const on   = emitter.on.bind(emitter);
export const once = emitter.once.bind(emitter);
export const off  = emitter.off.bind(emitter);
export const emit = emitter.emit.bind(emitter);
export { EventEmitter };