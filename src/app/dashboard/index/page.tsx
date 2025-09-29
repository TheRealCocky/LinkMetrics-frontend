"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Dashboard() {
    // Dados fictícios
    const linksData = [
        { name: "Amazon", clicks: 240 },
        { name: "eBay", clicks: 180 },
        { name: "AliExpress", clicks: 320 },
        { name: "Walmart", clicks: 150 },
    ];

    const trafficData = [
        { name: "Google", value: 400 },
        { name: "Facebook", value: 300 },
        { name: "Instagram", value: 200 },
        { name: "Outros", value: 100 },
    ];

    const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-4 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">
                Bem-vindo ao <span className="font-semibold text-blue-600">LinkMetrics</span> —
                sua central de análise inteligente de links. Aqui você pode criar, gerenciar e acompanhar
                o desempenho dos seus links em tempo real, monitorando cliques, origens de tráfego
                e descobrindo quais canais trazem os melhores resultados.
            </p>


            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl shadow p-4 bg-white">
                    <h2 className="text-lg font-semibold dark:text-black">Links Criados</h2>
                    <p className="text-3xl font-bold text-blue-600">128</p>
                </div>
                <div className="rounded-2xl shadow p-4 bg-white">
                    <h2 className="text-lg font-semibold dark:text-black">Cliques Totais</h2>
                    <p className="text-3xl font-bold text-green-600">2.430</p>
                </div>
                <div className="rounded-2xl shadow p-4 bg-white">
                    <h2 className="text-lg font-semibold dark:text-black">Top Link</h2>
                    <p className="text-xl font-bold text-yellow-600 dark:text-blue-600">AliExpress</p>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de barras */}
                <div className="rounded-2xl shadow p-4 bg-white">
                    <h2 className="text-lg font-semibold mb-4 dark:text-black">Cliques por Link</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={linksData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="clicks" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Gráfico de pizza */}
                <div className="rounded-2xl shadow p-4 bg-white">
                    <h2 className="text-lg font-semibold mb-4 dark:text-black">Origem do Tráfego</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={trafficData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label
                            >
                                {trafficData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}



