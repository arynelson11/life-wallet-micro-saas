"use client";

import { Home, LayoutDashboard, Target, User, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomTabBar() {
    const pathname = usePathname();

    const tabs = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Metas", href: "/metas", icon: Target },
        { name: "Calendário", href: "/calendario", icon: Calendar },
        { name: "Perfil", href: "/perfil", icon: User },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-zinc-200 safe-area-inset-bottom">
            <div className="flex items-center justify-around px-2 py-3">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all active:scale-95 ${isActive ? "text-ios-blue" : "text-zinc-400"
                                }`}
                        >
                            <Icon
                                className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : "stroke-2"}`}
                            />
                            <span
                                className={`text-xs ${isActive ? "font-semibold" : "font-medium"
                                    }`}
                            >
                                {tab.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
