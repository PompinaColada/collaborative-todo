const ACCESS_KEY   = "todo-access";
const REFRESH_KEY  = "todo-refresh";
const GUEST_TOKEN  = "GUEST_ACCESS_TOKEN";

export function getAccessToken()  { return localStorage.getItem(ACCESS_KEY); }
export function getRefreshToken() { return localStorage.getItem(REFRESH_KEY); }

export function setTokens(a, r)   {
    localStorage.setItem(ACCESS_KEY, a);
    localStorage.setItem(REFRESH_KEY, r);
}
export function clearTokens()     {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
}

export async function login(email, password) {
    //
    setTokens("MOCK_ACCESS", "MOCK_REFRESH");
    return true;
}

export async function register(email, password) {
    //
    setTokens("MOCK_ACCESS", "MOCK_REFRESH");
    return true;
}

export async function refreshToken() {
    return false;
}

export function logout() {
    clearTokens();
}

export function loginGuest() {
    localStorage.setItem(ACCESS_KEY, GUEST_TOKEN);
}
