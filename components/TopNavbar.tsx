"use client";

import { Home, LayoutDashboard, Target, User, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TopNavbar() {
    const pathname = usePathname();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Metas", href: "/metas" },
        { name: "Calendário", href: "/calendario" }, // O botão já está aqui
    ];

    return (
        <nav className="hidden md:block glass-header sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-ios-blue rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">L</span>
                        </div>
                        <span className="text-xl font-bold text-zinc-900">LifeWallet</span>
                    </Link>

                    {/* Center Navigation Links */}
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`font-semibold transition-colors ${isActive
                                        ? "text-ios-blue"
                                        : "text-zinc-600 hover:text-zinc-900"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Profile */}
                    <Link
                        href="/perfil"
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-all active:scale-95"
                    >
                        <User className="w-5 h-5 text-zinc-700" />
                        <span className="font-semibold text-zinc-900">Perfil</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}