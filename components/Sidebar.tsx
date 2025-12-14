"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Target,
    Calendar,
    Settings,
    LogOut,
    Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Target, label: "Metas", href: "/metas" },
    { icon: Calendar, label: "Calendário", href: "/calendario" },
];

const bottomItems = [
    { icon: Settings, label: "Configurações", href: "/settings" },
];

interface SidebarProps {
    profile?: any;
}

export function Sidebar({ profile }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const avatarUrl = profile?.avatar_url;
    const initials = profile?.full_name
        ? profile.full_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
        : "U";

    return (
        <aside className="fixed left-4 top-4 bottom-4 w-20 flex flex-col items-center py-8 glass-panel rounded-[2.5rem] z-50 hidden md:flex">
            {/* Logo */}
            <div className="mb-10">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* Main Menu */}
            <nav className="flex-1 flex flex-col gap-6 w-full px-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 group relative",
                                isActive
                                    ? "bg-black text-primary shadow-lg scale-110"
                                    : "text-muted-foreground hover:bg-white/50 hover:text-black"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {isActive && (
                                <div className="absolute left-14 bg-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Menu */}
            <div className="flex flex-col gap-6 w-full px-4 mt-auto">
                {/* Profile Avatar Link */}
                <Link
                    href="/settings"
                    className="w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary"
                    title="Meu Perfil"
                >
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Me" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs">
                            {initials}
                        </div>
                    )}
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </aside>
    );
}
