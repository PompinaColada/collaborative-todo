import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [pass,  setPass]  = useState("");
    const [err,   setErr]   = useState("");
    const nav = useNavigate();
    const { login, loginGuest } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        const ok = await login(email, pass);
        ok ? nav("/boards") : setErr("Невірні дані");
    }

    function handleGuest() {
        loginGuest();
        nav("/boards");
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xs m-auto p-4">
            <h1 className="text-xl font-semibold">Вхід</h1>
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" placeholder="Пароль" value={pass} onChange={e=>setPass(e.target.value)} />
            {err && <p className="text-red-600">{err}</p>}
            <button type="submit" className="border p-2 rounded">Увійти</button>
            <button type="button" onClick={handleGuest} className="border p-2 rounded">
                Увійти як гість
            </button>
            <Link to="/register" className="text-blue-600 underline text-center">Реєстрація</Link>
        </form>
    );
}
