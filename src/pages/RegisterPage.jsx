import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [pass,  setPass]  = useState("");
    const [confirm, setConfirm] = useState("");
    const [err, setErr] = useState("");
    const nav = useNavigate();
    const { register } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        if (pass !== confirm) { setErr("Паролі не збігаються"); return; }
        const ok = await register(email, pass);
        if (ok) nav("/boards");
        else setErr("Помилка реєстрації");
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xs m-auto p-4">
            <h1 className="text-xl font-semibold">Реєстрація</h1>
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" placeholder="Пароль" value={pass} onChange={e=>setPass(e.target.value)} />
            <input type="password" placeholder="Підтвердження" value={confirm} onChange={e=>setConfirm(e.target.value)} />
            {err && <p className="text-red-600">{err}</p>}
            <button type="submit" className="border p-2 rounded">Зареєструватися</button>
        </form>
    );
}
