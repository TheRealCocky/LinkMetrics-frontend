"use client";
import { useState } from "react";
import { createLink } from "@/server/api";

export default function CreateLinks() {
    const [originalUrl, setOriginalUrl] = useState("");
    const [alternatives, setAlternatives] = useState<string[]>([""]);
    const [weights, setWeights] = useState<number[]>([1]);

    const handleAddAlternative = () => {
        setAlternatives([...alternatives, ""]);
        setWeights([...weights, 1]);
    };

    const handleChangeAlternative = (index: number, value: string) => {
        const updated = [...alternatives];
        updated[index] = value;
        setAlternatives(updated);
    };

    const handleChangeWeight = (index: number, value: number) => {
        const updated = [...weights];
        updated[index] = value;
        setWeights(updated);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Você precisa estar logado!");
            return;
        }

        const data = await createLink(token, originalUrl, alternatives, weights);
        if (data.id) {
            alert("Link criado com sucesso!");
            window.location.href = "/dashboard/manager";
        } else {
            alert("Erro ao criar link!");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 flex flex-col gap-4">
            <h1 className="text-xl font-bold">Criar Novo Link</h1>

            <input
                className="border p-2 rounded"
                placeholder="URL Original"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
            />

            <div className="space-y-3">
                {alternatives.map((alt, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            className="border p-2 rounded flex-1"
                            placeholder="URL Alternativa"
                            value={alt}
                            onChange={(e) => handleChangeAlternative(index, e.target.value)}
                        />
                        <input
                            type="number"
                            min={1}
                            className="border p-2 rounded w-20"
                            value={weights[index]}
                            onChange={(e) => handleChangeWeight(index, Number(e.target.value))}
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={handleAddAlternative}
                className="bg-gray-500 text-white px-3 py-2 rounded"
            >
                + Adicionar Alternativa
            </button>

            <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-3 py-2 rounded"
            >
                Salvar
            </button>
        </div>
    );
}
