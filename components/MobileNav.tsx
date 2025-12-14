'use client'

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Wallet, Plus, PieChart, Calendar } from "lucide-react";
import { TransactionDialog } from "./TransactionDialog";
import { cn } from "@/lib/utils";

export function MobileNav({ spaceId }: { spaceId: string }) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-zinc-950/90 backdrop-blur-lg border-t border-white/10 pb-safe pt-2 px-2">
            <div className="flex items-end justify-between max-w-md mx-auto h-16 relative">

                {/* 1. DASHBOARD */}
                <Link href="/dashboard" className="flex-1 flex flex-col items-center justify-end pb-2 gap-1 h-full touch-manipulation">
                    <div className={cn("transition-colors duration-300", isActive('/dashboard') && !pathname.includes('transactions') ? 'text-primary' : 'text-zinc-500')}>
                        <LayoutDashboard className="w-6 h-6" strokeWidth={isActive('/dashboard') && !pathname.includes('transactions') ? 2.5 : 2} />
                    </div>
                    <span className={cn("text-[10px] font-medium transition-colors", isActive('/dashboard') && !pathname.includes('transactions') ? 'text-primary' : 'text-zinc-500')}>Início</span>
                </Link>

                {/* 2. CARTEIRA */}
                <Link href="/dashboard/transactions" className="flex-1 flex flex-col items-center justify-end pb-2 gap-1 h-full touch-manipulation">
                    <div className={cn("transition-colors duration-300", isActive('/dashboard/transactions') ? 'text-primary' : 'text-zinc-500')}>
                        <Wallet className="w-6 h-6" strokeWidth={isActive('/dashboard/transactions') ? 2.5 : 2} />
                    </div>
                    <span className={cn("text-[10px] font-medium transition-colors", isActive('/dashboard/transactions') ? 'text-primary' : 'text-zinc-500')}>Carteira</span>
                </Link>

                {/* 3. AÇÃO CENTRAL (ADICIONAR) */}
                <div className="flex-1 flex flex-col items-center justify-end h-full relative -top-4 pointer-events-none">
                    <div className="pointer-events-auto">
                        <div className="w-14 h-14 rounded-full bg-primary text-black shadow-[0_0_20px_rgba(199,243,60,0.4)] flex items-center justify-center transform active:scale-90 transition-all cursor-pointer hover:scale-105 border-4 border-zinc-950 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {/* Dialog Trigger Overlay */}
                            <div className="absolute inset-0 opacity-0 z-20">
                                <TransactionDialog spaceId={spaceId} />
                            </div>
                            <Plus className="w-7 h-7 relative z-10" strokeWidth={2.5} />
                        </div>
                    </div>
                    <span className="text-[10px] font-medium text-zinc-500 mt-1">Novo</span>
                </div>

                {/* 4. RELATÓRIOS (METAS) */}
                <Link href="/metas" className="flex-1 flex flex-col items-center justify-end pb-2 gap-1 h-full touch-manipulation">
                    <div className={cn("transition-colors duration-300", isActive('/metas') ? 'text-primary' : 'text-zinc-500')}>
                        <PieChart className="w-6 h-6" strokeWidth={isActive('/metas') ? 2.5 : 2} />
                    </div>
                    <span className={cn("text-[10px] font-medium transition-colors", isActive('/metas') ? 'text-primary' : 'text-zinc-500')}>Metas</span>
                </Link>

                {/* 5. CALENDÁRIO */}
                <Link href="/calendario" className="flex-1 flex flex-col items-center justify-end pb-2 gap-1 h-full touch-manipulation">
                    <div className={cn("transition-colors duration-300", isActive('/calendario') ? 'text-primary' : 'text-zinc-500')}>
                        <Calendar className="w-6 h-6" strokeWidth={isActive('/calendario') ? 2.5 : 2} />
                    </div>
                    <span className={cn("text-[10px] font-medium transition-colors", isActive('/calendario') ? 'text-primary' : 'text-zinc-500')}>Agenda</span>
                </Link>

            </div>
        </div>
    );
}