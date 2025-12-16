"use client";

import { LayoutDashboard, TrendingUp, ArrowRightLeft, Target, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab');

    const tabs = [
        {
            name: "Início",
            href: "/dashboard",
            icon: LayoutDashboard,
            isActive: (p: string, t: string | null) => p === "/dashboard" && (!t || t === "overview")
        },
        {
            name: "Investir",
            href: "/dashboard?tab=savings",
            icon: TrendingUp,
            isActive: (p: string, t: string | null) => p === "/dashboard" && t === "savings"
        },
        {
            name: "Transações",
            href: "/dashboard?tab=monthly",
            icon: ArrowRightLeft,
            isActive: (p: string, t: string | null) => p === "/dashboard" && t === "monthly"
        },
        {
            name: "Metas",
            href: "/metas",
            icon: Target,
            isActive: (p: string, t: string | null) => p === "/metas"
        },
        {
            name: "Perfil",
            href: "/perfil",
            icon: User,
            isActive: (p: string, t: string | null) => p === "/perfil" || p === "/configuracoes"
        },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 pb-safe pt-2 px-2 z-50 h-[80px]">
            <div className="flex items-center justify-around h-full pb-2">
                {tabs.map((tab) => {
                    const active = tab.isActive(pathname, currentTab);
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 w-16 transition-all active:scale-95",
                                active ? "text-[#CCF381]" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-6 h-6 mb-1",
                                    active && "fill-current/10"
                                )}
                                strokeWidth={active ? 2.5 : 2}
                            />
                            <span className="text-[10px] font-medium">{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
