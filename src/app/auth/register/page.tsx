"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/server/api";

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await register(username, password);
            router.push("/auth/login");
        } catch (err) {
            setError("Erro ao registrar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <h1 className="text-2xl font-bold mb-6">Registrar</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                        className="p-2 border rounded"
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="p-2 border rounded"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`py-2 rounded text-white transition ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Registrando..." : "Registrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}


