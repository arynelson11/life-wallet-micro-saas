"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, PieChart, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomTabBar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-900 z-50 px-6 pb-2 pt-2">
            <div className="flex items-center justify-between max-w-md mx-auto h-full">

                {/* Home / Dashboard */}
                <Link href="/dashboard" className={cn(
                    "flex flex-col items-center justify-center gap-1 w-12 h-full transition-colors",
                    isActive("/dashboard") && !pathname.includes("transactions") ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
                )}>
                    <LayoutDashboard className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Início</span>
                </Link>

                {/* Wallet / Transactions */}
                <Link href="/dashboard/transactions" className={cn(
                    "flex flex-col items-center justify-center gap-1 w-12 h-full transition-colors",
                    isActive("/dashboard/transactions") ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
                )}>
                    <Wallet className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Carteira</span>
                </Link>

                {/* FAB (Floating Action Button) - Central */}
                <div className="relative -top-5">
                    <button className="flex items-center justify-center w-14 h-14 bg-primary text-black rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        <Plus className="w-8 h-8" />
                    </button>
                    {/* TODO: Add Sheet/Dialog trigger here for Quick Actions (New Transaction/Goal) */}
                </div>

                {/* Reports / Metas (using PieChart as icon for Goals/Reports) */}
                <Link href="/metas" className={cn(
                    "flex flex-col items-center justify-center gap-1 w-12 h-full transition-colors",
                    isActive("/metas") ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
                )}>
                    <PieChart className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Metas</span>
                </Link>

                {/* Settings */}
                <Link href="/settings" className={cn(
                    "flex flex-col items-center justify-center gap-1 w-12 h-full transition-colors",
                    isActive("/settings") ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
                )}>
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Config</span>
                </Link>

            </div>
        </div>
    );
}
