import { createContext, useContext, useState, useEffect } from "react";
import {
    login   as apiLogin,
    register as apiRegister,
    logout  as apiLogout,
    getAccessToken,
    loginGuest as apiLoginGuest
} from "../api/authService";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
    const [authed, setAuthed] = useState(!!getAccessToken());

    async function login(email, pass) {
        const ok = await apiLogin(email, pass);
        if (ok) setAuthed(true);
        return ok;
    }

    async function register(email, pass) {
        const ok = await apiRegister(email, pass);
        if (ok) setAuthed(true);
        return ok;
    }

    function loginGuest() {
        apiLoginGuest();
        setAuthed(true);
    }

    function logout() {
        apiLogout();
        setAuthed(false);
    }

    useEffect(() => {
        if (getAccessToken()) setAuthed(true);
    }, []);

    return (
        <AuthCtx.Provider value={{ authed, login, loginGuest, register, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}
