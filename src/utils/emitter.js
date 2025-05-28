const listeners = {};

function on(event, fn) {
    (listeners[event] = listeners[event] || []).push(fn);
}

function off(event, fn) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(h => h !== fn);
}

function emit(event, payload) {
    (listeners[event] || []).forEach(h => h(payload));
}

export {on, off, emit}