"use client";
import { useState } from "react";
import { login } from "@/server/api";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            alert("Preencha usuário e senha!");
            return;
        }

        setLoading(true);

        try {
            const data = await login(username, password);
            if (data.access_token) {
                localStorage.setItem("token", data.access_token);
                window.location.href = "/dashboard/index";
            } else {
                alert("Login falhou!");
            }
        } catch (error) {
            console.error(error);
            alert("Erro no servidor!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-6 max-w-sm mx-auto">
            <h1 className="text-xl font-bold">Login</h1>

            <input
                className="border p-2 rounded"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
            />

            <input
                type="password"
                className="border p-2 rounded"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
            />

            <button
                onClick={handleLogin}
                disabled={loading}
                className={`p-2 rounded text-white ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
                {loading ? "Entrando..." : "Entrar"}
            </button>

            {/* Link para registro */}
            <p className="text-sm text-center text-gray-600">
                Não tem conta?{" "}
                <a
                    href="/auth/register"
                    className="text-blue-500 hover:underline"
                >
                    Cadastre-se
                </a>
            </p>
        </div>
    );
}
