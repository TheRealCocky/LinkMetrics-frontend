"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    getLinks,
    getMetrics,
    getHistory,
    deleteLink,
} from "@/server/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
    LabelList,
} from "recharts";
import { Copy, RefreshCw, Link2, ArrowLeft, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

// 🚀 força client-side rendering no Vercel
export const dynamic = "force-dynamic";

interface Link {
    id: string;
    originalUrl: string;
    accessCount: number;
}

interface LinkMetrics {
    id: string;
    originalUrl: string;
    alternativeUrls: string[];
    weights: number[];
    accessCount: number;
    clicksPerUrl: number[];
}

interface HistoryItem {
    date: string;
    url: string;
    clicks: number;
}

interface ChartItem {
    url: string;
    cliques: number;
    peso: number;
}

export default function Manager() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");

    const [links, setLinks] = useState<Link[]>([]);
    const [metrics, setMetrics] = useState<LinkMetrics | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(false); // carregamento geral
    const [loadingMetrics, setLoadingMetrics] = useState(false); // carregamento de métricas

    // carregar lista de links
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        setLoading(true);
        getLinks(token)
            .then(setLinks)
            .catch(() => toast.error("❌ Erro ao carregar links"))
            .finally(() => setLoading(false));
    }, []);

    // carregar métricas de um link específico
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || !id) {
            setMetrics(null);
            setHistory([]);
            return;
        }

        setLoadingMetrics(true);
        Promise.all([getMetrics(token, id), getHistory(token, id)])
            .then(([metricsData, historyData]) => {
                setMetrics(metricsData);
                setHistory(historyData);
            })
            .catch(() => toast.error("❌ Erro ao carregar métricas"))
            .finally(() => setLoadingMetrics(false));
    }, [id]);

    const chartData: ChartItem[] =
        metrics?.alternativeUrls?.map((url, i) => ({
            url,
            cliques: metrics.clicksPerUrl[i] || 0,
            peso: metrics.weights[i] || 1,
        })) || [];

    const handleCopy = async (id: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const rotateUrl = `${apiUrl}/links/${id}/rotate`;

        try {
            await navigator.clipboard.writeText(rotateUrl);
            toast.success("✅ Link de rotação copiado!");
        } catch {
            toast.error("❌ Erro ao copiar o link.");
        }
    };

    const handleRotate = (id: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ;
        const rotateUrl = `${apiUrl}/links/${id}/rotate`;

        window.open(rotateUrl, "_blank");
        toast.info("🔄 Link aberto em modo rotação.");
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja deletar este link?")) return;
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoading(true);
        try {
            await deleteLink(token, id);
            setLinks((prev) => prev.filter((l) => l.id !== id));
            toast.success("🗑️ Link deletado com sucesso!");
            if (id === metrics?.id) {
                router.push("/dashboard/manager");
            }
        } catch {
            toast.error("❌ Erro ao deletar link.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-10">
            <h1 className="text-2xl font-bold">Gerenciar Links</h1>

            {/* Carregando lista de links */}
            {loading && !id && (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            )}

            {/* Lista de links */}
            {!id && !loading && (
                <div className="grid md:grid-cols-2 gap-6">
                    {links.map((link) => (
                        <div
                            key={link.id}
                            className="border rounded-xl p-4 shadow-sm bg-white flex flex-col justify-between"
                        >
                            <div className="space-y-2">
                                <p className="flex items-center gap-2 text-gray-700">
                                    <Link2 size={16} /> <strong>Original:</strong>{" "}
                                    {link.originalUrl}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Cliques:</strong> {link.accessCount}
                                </p>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => handleCopy(link.id)}
                                    className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm dark:text-black"
                                >
                                    <Copy size={16} /> Copiar
                                </button>

                                <button
                                    onClick={() => handleRotate(link.id)}
                                    className="flex items-center gap-2 px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
                                >
                                    <RefreshCw size={16} /> Rotacionar
                                </button>

                                <button
                                    onClick={() => handleDelete(link.id)}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
                                >
                                    <Trash2 size={16} /> Deletar
                                </button>

                                <a
                                    href={`/dashboard/manager?id=${link.id}`}
                                    className="ml-auto text-blue-600 text-sm hover:underline"
                                >
                                    Ver métricas →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Métricas */}
            {id && (
                <div className="mt-12 bg-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold dark:text-black">
                            Métricas do Link
                        </h2>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push("/dashboard/manager")}
                                className="flex items-center gap-2 px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm dark:text-black"
                            >
                                <ArrowLeft size={16} /> Voltar
                            </button>
                            {metrics && (
                                <>
                                    <button
                                        onClick={() => handleCopy(metrics.id)}
                                        className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm dark:text-black"
                                    >
                                        <Copy size={16} /> Copiar
                                    </button>

                                    <button
                                        onClick={() => handleRotate(metrics.id)}
                                        className="flex items-center gap-2 px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm dark:text-black"
                                    >
                                        <RefreshCw size={16} /> Rotacionar
                                    </button>

                                    <button
                                        onClick={() => handleDelete(metrics.id)}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm dark:text-black"
                                    >
                                        <Trash2 size={16} /> Deletar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Carregando métricas */}
                    {loadingMetrics && (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-blue-600" size={32} />
                        </div>
                    )}

                    {!loadingMetrics && !metrics && <p>Carregando métricas...</p>}

                    {!loadingMetrics && metrics && (
                        <div className="space-y-8">
                            <div className="space-y-2 dark:text-black">
                                <p>
                                    <strong>URL Original:</strong> {metrics.originalUrl}
                                </p>
                                <p>
                                    <strong>Total de Cliques:</strong> {metrics.accessCount}
                                </p>
                            </div>

                            {/* gráfico */}
                            <div>
                                <h3 className="font-semibold mb-3 dark:text-black">
                                    Distribuição de Cliques por URL
                                </h3>
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="url" tick={{ fontSize: 12 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="cliques" fill="#3b82f6">
                                            <LabelList dataKey="cliques" position="top" />
                                        </Bar>
                                        <Bar dataKey="peso" fill="#10b981">
                                            <LabelList dataKey="peso" position="top" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* tabela de histórico */}
                            {history.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-3">Histórico de Acessos</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-200 text-sm">
                                            <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-3 py-2 text-left border-b">Data</th>
                                                <th className="px-3 py-2 text-left border-b">URL</th>
                                                <th className="px-3 py-2 text-left border-b">
                                                    Cliques
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {history.map((h, i) => (
                                                <tr
                                                    key={i}
                                                    className="odd:bg-white even:bg-gray-50"
                                                >
                                                    <td className="px-3 py-2 border-b">{h.date}</td>
                                                    <td className="px-3 py-2 border-b">{h.url}</td>
                                                    <td className="px-3 py-2 border-b">{h.clicks}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}