import { getAccessToken, refreshToken, logout } from "./authService.js";

export async function apiFetch(url, opts = {}) {
    const token = getAccessToken();
    const headers = {
        ...(opts.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
    };

    const res = await fetch(url, { ...opts, headers });

    if (res.status === 401 && token) {
        const ok = await refreshToken();
        if (ok) return apiFetch(url, opts);
        logout();
    }
    return res;
}
