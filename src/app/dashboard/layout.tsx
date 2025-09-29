"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart2, Home, PlusCircle, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { href: "/dashboard/index", label: "Home", icon: <Home size={16} /> },
        { href: "/dashboard/ceatelinks", label: "Criar Link", icon: <PlusCircle size={16} /> },
        { href: "/dashboard/manager", label: "Métricas", icon: <BarChart2 size={16} /> },
    ];

    const handleLogout = () => {
        // remove o token (ajusta conforme onde você guarda)
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        // redireciona para a tela de login
        router.push("/auth/login");
    };

    return (
        <html lang="en">
        <body
            suppressHydrationWarning
            className="antialiased bg-gray-50"
        >
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
                <h2 className="text-lg font-bold mb-8 dark:text-black">Dashboard</h2>
                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                pathname === item.href
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            {item.icon} {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Botão de Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <LogOut size={16} /> Logout
                </button>
            </aside>

            {/* Conteúdo principal */}
            <main className="flex-1 p-8">{children}</main>
        </div>
        </body>
        </html>
    );
}


