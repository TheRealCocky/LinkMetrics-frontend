"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart2, Home, PlusCircle, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navItems = [
        { href: "/dashboard/index", label: "Home", icon: <Home size={16} /> },
        { href: "/dashboard/ceatelinks", label: "Criar Link", icon: <PlusCircle size={16} /> },
        { href: "/dashboard/manager", label: "Métricas", icon: <BarChart2 size={16} /> },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setIsAuthenticated(false);
        router.push("/auth/login");
    };

    const handleLogin = () => {
        router.push("/auth/login");
    };

    return (
        <html lang="en">
        <body className="antialiased bg-gray-50">
        <div className="flex min-h-screen">
            {/* Sidebar fixa */}
            <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-6 flex flex-col">
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

                {/* Condicional Login/Logout */}
                {isAuthenticated ? (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <LogOut size={16} /> Login
                    </button>
                )}
            </aside>

            {/* Conteúdo principal (com margem para a sidebar) */}
            <main className="flex-1 p-8 ml-64">{children}</main>
        </div>
        </body>
        </html>
    );
}



